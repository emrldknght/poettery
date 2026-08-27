import express from 'express';
import cors from 'cors';
import poemsRoutes from './routes/poems.routes';
import filesRoutes from './routes/files.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Отключаем кэш для API
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Подключаем роуты с префиксами
app.use('/api/poems', poemsRoutes);
app.use('/api/files', filesRoutes);

export default app;