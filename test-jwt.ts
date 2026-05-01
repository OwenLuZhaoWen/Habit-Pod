import { sign, verify } from 'hono/jwt';

async function run() {
  const secret = 'fallback_secret_must_change';
  const token = await sign({ user_id: 'test', exp: Math.floor(Date.now() / 1000) + 3600 }, secret);
  console.log('Token:', token);
  try {
    const payload = await verify(token, secret);
    console.log('Valid:', payload);
  } catch (e: any) {
    console.error('Verify error:', e.message);
  }
}
run();
