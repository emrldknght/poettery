import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import poemsRoutes from './routes/poems.routes';
import filesRoutes from './routes/files.routes';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors());

// Отключаем кэш для всех API-запросов
app.use('/api/*', async (c, next) => {
  await next();
  c.res.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  c.res.headers.set('Pragma', 'no-cache');
  c.res.headers.set('Expires', '0');
});

// Подключаем роуты
app.route('/api/poems', poemsRoutes);
app.route('/api/files', filesRoutes);

// Базовый health-check
app.get('/', (c) => c.json({ status: 'ok', name: 'poettery-admin' }));

export default app;