import { Context } from 'hono';
import { db } from '../db';
import { poems } from '../schema';
import { desc, eq } from 'drizzle-orm';
import { syncFiles } from '../sync';

export const getAllPoems = async (c: Context) => {
  try {
    const allPoems = await db.select().from(poems).orderBy(desc(poems.updated_at));
    return c.json(allPoems);
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
  // ИСПРАВЛЕНИЕ: Явно указываем тип string, чтобы Drizzle и TypeScript были довольны
  const slug = c.req.param('slug') as string;

  try {
    const body = await c.req.json<{ published: boolean }>();

    await db.update(poems)
      .set({ published: body.published })
      .where(eq(poems.slug, slug));

    return c.json({ success: true });
  } catch (e) {
    console.error('Error updating publish status:', e);
    return c.json({ error: String(e) }, 500);
  }
};