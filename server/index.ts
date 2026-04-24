import { Hono } from 'hono';

export interface Env {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Env }>();

app.get('/api/health', (c) => {
  return c.json({ status: 'ok' });
});

app.get('/api/scans', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM scanned_items ORDER BY created_at DESC LIMIT 5'
    ).all();
    return c.json({ data: results });
  } catch (err: any) {
    console.error('Error fetching scans:', err);
    return c.json({ data: [], error: err.message }, 500);
  }
});

app.post('/api/scans', async (c) => {
  try {
    const body = await c.req.json();
    
    await c.env.DB.prepare(
      'INSERT INTO scanned_items (id, name, calories, health_score, description, image_b64) VALUES (?1, ?2, ?3, ?4, ?5, ?6)'
    )
      .bind(
        crypto.randomUUID(),
        body.name,
        body.calories,
        body.health_score,
        body.description,
        body.image_b64 || ''
      )
      .run();
      
    // Fetch the newly inserted record to broadcast back or just return success
    return c.json({ success: true });
  } catch (err: any) {
    console.error('Error inserting scan:', err);
    return c.json({ success: false, error: err.message }, 500);
  }
});

export default app;
