import { Hono } from 'hono';
import { db } from '../db';
import { poems } from '../schema';
import { eq } from 'drizzle-orm';
import { CONTENT_DIR } from '../config';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const app = new Hono();

app.get('/poems/:slug/analyze', async (c) => {
  const slug = c.req.param('slug');

  const poem = await db.query.poems.findFirst({
    where: eq(poems.slug, slug),
  });

  if (!poem) {
    return c.json({ error: 'Poem not found' }, 404);
  }

  const fullPath = path.join(CONTENT_DIR, poem.file_path);
  const rawContent = fs.readFileSync(fullPath, 'utf-8');

  // Убираем frontmatter через gray-matter
  const { content } = matter(rawContent);

  return c.json({
    slug,
    title: poem.title || 'Без названия',
    text: content.trim(),
    lines: content.split('\n').filter(l => l.trim()).length,
  });
});

export default app;