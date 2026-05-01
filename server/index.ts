import { Hono } from 'hono';
import { sign, verify } from 'hono/jwt';
import { GoogleGenAI } from '@google/genai';

export interface Env {
  DB: D1Database;
  JWT_SECRET?: string;
  GOOGLE_API_KEY?: string;
  OPENAI_API_KEY?: string;
  OPENAI_BASE_URL?: string;
  OPENAI_MODEL?: string;
}

const app = new Hono<{ Bindings: Env; Variables: { user_id: string } }>().basePath('/api');

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const jwtMiddleware = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = await verify(token, c.env.JWT_SECRET || 'fallback_secret_must_change', 'HS256');
    c.set('user_id', payload.user_id);
    await next();
  } catch (e) {
    return c.json({ error: 'Invalid token' }, 401);
  }
};

app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

app.post('/auth/register', async (c) => {
  try {
    if (!c.env.DB) {
      return c.json({ error: 'Database binding (DB) is not configured or requires a redeployment to take effect.' }, 500);
    }
    
    const { email, password } = await c.req.json();
    if (!email || !password) return c.json({ error: 'Email and password required' }, 400);

    const { results } = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).all();
    if (results && results.length > 0) {
      return c.json({ error: 'User already exists' }, 400);
    }

    const userId = crypto.randomUUID();
    const passwordHash = await hashPassword(password);

    await c.env.DB.prepare(
      'INSERT INTO users (id, email, password_hash) VALUES (?1, ?2, ?3)'
    ).bind(userId, email, passwordHash).run();

    const token = await sign({ user_id: userId, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }, c.env.JWT_SECRET || 'fallback_secret_must_change', 'HS256');
    return c.json({ token, user: { id: userId, email } });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.post('/auth/login', async (c) => {
  try {
    if (!c.env.DB) {
      return c.json({ error: 'Database binding (DB) is not configured or requires a redeployment.' }, 500);
    }
    const { email, password } = await c.req.json();
    const { results } = await c.env.DB.prepare('SELECT id, email, password_hash FROM users WHERE email = ?').bind(email).all();
    
    if (!results || results.length === 0) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    const user = results[0] as any;
    const reqHash = await hashPassword(password);
    
    if (user.password_hash !== reqHash) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    const token = await sign({ user_id: user.id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }, c.env.JWT_SECRET || 'fallback_secret_must_change', 'HS256');
    return c.json({ token, user: { id: user.id, email: user.email } });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.post('/analyze', jwtMiddleware, async (c) => {
  try {
    const { image_b64 } = await c.req.json();
    if (!image_b64) return c.json({ error: 'Missing image data' }, 400);

    const openAiKey = c.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY;
    const useOpenAI = !!openAiKey;
    const baseUrl = c.env.OPENAI_BASE_URL || process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
    const model = c.env.OPENAI_MODEL || process.env.OPENAI_MODEL || 'gpt-4o';

    const prompt = "Analyze this image. Identify the food or object. Return ONLY a valid JSON object with the following keys: 'name' (string, name of the item, in Chinese), 'calories' (number, estimated calories, use 0 if not food), 'healthScore' (number 1-10, 10 being healthiest), 'description' (string, brief description or health advice, in Chinese).";
    
    let parsedData;
    console.log('Using OpenAI:', useOpenAI, 'BaseUrl:', baseUrl, 'Model:', model);

    if (useOpenAI) {
      
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${image_b64}`
                  }
                }
              ]
            }
          ],
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
      }

      const responseData: any = await response.json();
      let content = responseData.choices?.[0]?.message?.content || '{}';
      
      if (content.startsWith('```json')) {
        content = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (content.startsWith('```')) {
        content = content.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      parsedData = JSON.parse(content);
    } else if (c.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY) {
      const googleApiKey = c.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY;
      const ai = new GoogleGenAI({ apiKey: googleApiKey as string });
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  data: image_b64,
                  mimeType: 'image/jpeg'
                }
              },
              {
                text: prompt
              }
            ]
          }
        ],
        config: {
          responseMimeType: 'application/json',
        }
      });

      const resultText = response.text || '{}';
      parsedData = JSON.parse(resultText);
    } else {
      return c.json({ error: 'LLM API keys (OPENAI_API_KEY or GOOGLE_API_KEY) are not configured' }, 500);
    }

    return c.json(parsedData);
  } catch (err: any) {
    console.error('Analysis error:', err);
    return c.json({ error: err.message }, 500);
  }
});

app.get('/scans', jwtMiddleware, async (c) => {
  try {
    if (!c.env.DB) return c.json({ data: [], error: 'Database binding missing' }, 500);
    const userId = c.get('user_id');
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM scanned_items WHERE user_id = ? ORDER BY created_at DESC LIMIT 10'
    ).bind(userId).all();
    return c.json({ data: results });
  } catch (err: any) {
    console.error('Error fetching scans:', err);
    return c.json({ data: [], error: err.message }, 500);
  }
});

app.post('/scans', jwtMiddleware, async (c) => {
  try {
    if (!c.env.DB) return c.json({ success: false, error: 'Database binding missing' }, 500);
    const userId = c.get('user_id');

    const body = await c.req.json();
    
    await c.env.DB.prepare(
      'INSERT INTO scanned_items (id, user_id, name, calories, health_score, description, image_b64) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)'
    )
      .bind(
        crypto.randomUUID(),
        userId,
        body.name,
        body.calories,
        body.health_score,
        body.description,
        body.image_b64 || ''
      )
      .run();
      
    return c.json({ success: true });
  } catch (err: any) {
    console.error('Error inserting scan:', err);
    return c.json({ success: false, error: err.message }, 500);
  }
});

export default app;
