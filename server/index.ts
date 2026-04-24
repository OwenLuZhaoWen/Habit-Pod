import { Hono } from 'hono';
import { sign, verify } from 'hono/jwt';

export interface Env {
  DB: D1Database;
  JWT_SECRET?: string;
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
    const payload = await verify(token, c.env.JWT_SECRET || 'fallback_secret_must_change');
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

    const token = await sign({ user_id: userId, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }, c.env.JWT_SECRET || 'fallback_secret_must_change');
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

    const token = await sign({ user_id: user.id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }, c.env.JWT_SECRET || 'fallback_secret_must_change');
    return c.json({ token, user: { id: user.id, email: user.email } });
  } catch (err: any) {
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
