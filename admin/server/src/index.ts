import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { db } from './db';
import { poems } from './schema';
import { syncFiles } from './sync';
import { eq, desc } from 'drizzle-orm';

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

const PORT = 3001;
const CONTENT_DIR = path.join(__dirname, '..', '..', '..', 'content');

// 1. Получить все стихи
app.get('/api/poems', async (req, res) => {
  try {
    const allPoems = await db.select().from(poems).orderBy(desc(poems.updated_at));
    res.json(allPoems);
  } catch (e) {
    console.error('Error fetching poems:', e);
    res.status(500).json({ error: String(e) });
  }
});

// 2. Полный синк
app.post('/api/sync', async (req, res) => {
  try {
    await syncFiles();
    res.json({ message: 'Синхронизация успешна' });
  } catch (e) {
    console.error('Error syncing:', e);
    res.status(500).json({ error: String(e) });
  }
});

// 3. Переключение published
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

// 5. Получить дерево файлов из папки content (НОВЫЙ РОУТ)
app.get('/api/files/tree', async (req, res) => {
  try {
    // Получаем все slug из БД для быстрой проверки
    const syncedPoems = await db.select({ slug: poems.slug }).from(poems);
    const syncedSlugs = new Set(syncedPoems.map(p => p.slug));

    function buildTree(dirPath: string, relativePath: string = ''): any[] {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      const nodes: any[] = [];

      for (const entry of entries) {
        const entryRelativePath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          nodes.push({
            name: entry.name,
            type: 'folder',
            path: entryRelativePath,
            children: buildTree(fullPath, entryRelativePath)
          });
        } else if (entry.name.endsWith('.md')) {
          const slug = entryRelativePath.replace(/\.md$/, '').replace(/\\/g, '/');
          nodes.push({
            name: entry.name,
            type: 'file',
            path: entryRelativePath,
            slug: slug,
            inDb: syncedSlugs.has(slug)
          });
        }
      }

      // Сортировка: папки сверху, затем файлы, по алфавиту
      nodes.sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === 'folder' ? -1 : 1;
      });

      return nodes;
    }

    const tree = buildTree(CONTENT_DIR);
    res.json(tree);
  } catch (e) {
    console.error('Error building tree:', e);
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

    const fullPath = path.join(CONTENT_DIR, poem.file_path);
    const content = fs.readFileSync(fullPath, 'utf-8');
    res.json({ content, path: poem.file_path });
  } catch (e) {
    console.error('Error reading file:', e);
    res.status(500).json({ error: String(e) });
  }
});

// 6. Синхронизировать один файл по кнопке "+" (НОВЫЙ РОУТ)
app.post('/api/sync/single', async (req, res) => {
  try {
    const { path: relativePath } = req.body;
    const fullPath = path.join(CONTENT_DIR, relativePath);

    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    const parsed = matter(fileContent);

    const slug = relativePath.replace(/\.md$/, '').replace(/\\/g, '/');
    const dirName = path.dirname(relativePath).replace(/\\/g, '/');
    const folderName = dirName === '.' ? 'main' : path.basename(dirName);
    const finalSection = parsed.data.section ? String(parsed.data.section) : folderName;

    await db.insert(poems).values({
      slug,
      file_path: relativePath.replace(/\\/g, '/'),
      layout: parsed.data.layout || 'poem',
      title: parsed.data.title || null,
      date: parsed.data.date || null,
      section: finalSection,
    }).onConflictDoUpdate({
      target: poems.slug,
      set: {
        layout: parsed.data.layout || 'poem',
        title: parsed.data.title || null,
        date: parsed.data.date || null,
        section: finalSection,
        updated_at: new Date(),
      },
    });

    res.json({ message: 'File synced' });
  } catch (e) {
    console.error('Error syncing single file:', e);
    res.status(500).json({ error: String(e) });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Admin server running on http://localhost:${PORT}`);
});