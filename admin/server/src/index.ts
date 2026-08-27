import express from 'express';
import cors from 'cors';
import { db } from './db';
import { poems } from './schema';
import { syncFiles } from './sync';
import { eq, desc } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// 1. Получить все стихи (простой и надежный запрос)
app.get('/api/poems', async (req, res) => {
  try {
    const allPoems = await db.select().from(poems).orderBy(desc(poems.updated_at));
    res.json(allPoems);
  } catch (e) {
    console.error('Error fetching poems:', e);
    res.status(500).json({ error: String(e) });
  }
});

// 2. Синхронизация по кнопке
app.post('/api/sync', async (req, res) => {
  try {
    await syncFiles();
    res.json({ message: 'Синхронизация успешна' });
  } catch (e) {
    console.error('Error syncing:', e);
    res.status(500).json({ error: String(e) });
  }
});

// 3. Переключение published (оверлоад)
app.patch('/api/poems/:slug/publish', async (req, res) => {
  const { slug } = req.params;
  const { published } = req.body;

  try {
    await db.update(poems)
      .set({ published: !!published })
      .where(eq(poems.slug, slug));
    res.json({ success: true });
  } catch (e) {
    console.error('Error updating publish status:', e);
    res.status(500).json({ error: String(e) });
  }
});

// 4. Чтение сырого файла для превью
app.get('/api/files/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const poemList = await db.select().from(poems).where(eq(poems.slug, slug));
    const poem = poemList[0];

    if (!poem) return res.status(404).json({ error: 'Not found' });

    // Путь относительно admin/server/src -> ../../../../content
    const fullPath = path.join(__dirname, '..', '..', '..', 'content', poem.file_path);
    const content = fs.readFileSync(fullPath, 'utf-8');
    res.json({ content, path: poem.file_path });
  } catch (e) {
    console.error('Error reading file:', e);
    res.status(500).json({ error: String(e) });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Admin server running on http://localhost:${PORT}`);
});