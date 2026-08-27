import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { db } from '../db';
import { poems } from '../schema';
import { eq } from 'drizzle-orm';
import { CONTENT_DIR } from '../config';

export const getFileTree = async (req: Request, res: Response) => {
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
    res.json(tree);
  } catch (e) {
    console.error('Error building tree:', e);
    res.status(500).json({ error: String(e) });
  }
};

export const getFileContent = async (req: Request, res: Response) => {
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
};

export const syncSingleFile = async (req: Request, res: Response) => {
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
};