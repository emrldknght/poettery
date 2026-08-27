import { serve } from '@hono/node-server';
import app from './app';
import { PORT } from './config';

serve(
  {
    fetch: app.fetch,
    port: Number(PORT),
  },
  (info) => {
    console.log(`🚀 Admin server running on http://localhost:${info.port}`);
  }
);