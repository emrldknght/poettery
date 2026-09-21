// src/routes/feto.ts
import { Hono } from 'hono';
import { analyzePoemWithFetoFull } from '../lib/fetoAdapterFull.js';

const app = new Hono();

app.post('/api/feto/analyze', async (c) => {
  const body = await c.req.json<{ text?: string }>();

  if (!body.text || !body.text.trim()) {
    return c.json({ error: 'Поле text обязательно' }, 400);
  }

  try {
    const result = analyzePoemWithFetoFull(body.text);
    return c.json(result);
  } catch (error) {
    console.error('[FETO] Ошибка анализа:', error);
    return c.json({ error: 'Ошибка при анализе стиха' }, 500);
  }
});

export default app;