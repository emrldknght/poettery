import { Context } from 'hono';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { db } from '../db';
import { poems } from '../schema';
import { eq } from 'drizzle-orm';
import { CONTENT_DIR } from '../config';

export const getFileTree = async (c: Context) => {
  try {
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

      nodes.sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === 'folder' ? -1 : 1;
      });

      return nodes;
    }

    const tree = buildTree(CONTENT_DIR);
    return c.json(tree);
  } catch (e) {
    console.error('Error building tree:', e);
    return c.json({ error: String(e) }, 500);
  }
};

export const getFileContent = async (c: Context) => {
  // Явно указываем тип string, чтобы TypeScript и IDE успокоились
  const slug = c.req.param('slug') as string;

  try {
    // findFirst — это правильный и типобезопасный способ получить одну запись в Drizzle
    const poem = await db.query.poems.findFirst({
      where: eq(poems.slug, slug),
    });

    if (!poem) {
      return c.json({ error: 'Not found' }, 404);
    }

    const fullPath = path.join(CONTENT_DIR, poem.file_path);
    const content = fs.readFileSync(fullPath, 'utf-8');

    return c.json({ content, path: poem.file_path });
  } catch (e) {
    console.error('Error reading file:', e);
    return c.json({ error: String(e) }, 500);
  }
};

export const syncSingleFile = async (c: Context) => {
  try {
    const { path: relativePath } = await c.req.json<{ path: string }>();
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
      // ИСПРАВЛЕНО: НЕ перезаписываем метаданные, только обновляем timestamp
      set: {
        updated_at: new Date(),
      },
    });

    return c.json({ message: 'File synced' });
  } catch (e) {
    console.error('Error syncing single file:', e);
    return c.json({ error: String(e) }, 500);
  }
};