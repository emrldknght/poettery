import { Context } from 'hono';
import { db } from '../db';
import { poems } from '../schema';
import {eq } from 'drizzle-orm';
import { syncFiles } from '../sync';

export const getAllPoems = async (c: Context) => {
  try {
    // Используем query API Drizzle для получения связей
    const allPoems = await db.query.poems.findMany({
      orderBy: (poems, { desc }) => [desc(poems.updated_at)],
      with: {
        tags: {
          with: {
            tag: true,
          },
        },
      },
    });

    // Форматируем ответ для удобства фронтенда: превращаем массив объектов в массив строк
    const formatted = allPoems.map((p) => ({
      ...p,
      tags: p.tags.map((pt) => pt.tag.name),
    }));

    return c.json(formatted);
  } catch (e) {
    console.error('Error fetching poems:', e);
    return c.json({ error: String(e) }, 500);
  }
};

export const syncAll = async (c: Context) => {
  try {
    await syncFiles();
    return c.json({ message: 'Синхронизация успешна' });
  } catch (e) {
    console.error('Error syncing:', e);
    return c.json({ error: String(e) }, 500);
  }
};

export const togglePublish = async (c: Context) => {
  const slug = c.req.param('slug') as string;
  try {
    const body = await c.req.json<{ published: boolean }>();
    await db.update(poems).set({ published: body.published }).where(eq(poems.slug, slug));
    return c.json({ success: true });
  } catch (e) {
    console.error('Error updating publish status:', e);
    return c.json({ error: String(e) }, 500);
  }
};

