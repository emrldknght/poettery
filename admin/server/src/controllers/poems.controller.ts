import { Context } from 'hono';
import { db } from '../db';
import { poems, tags, poemTags } from '../schema';
import { desc, eq, and } from 'drizzle-orm';
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

// --- НОВЫЕ МЕТОДЫ ДЛЯ ТЕГОВ ---

export const addTag = async (c: Context) => {
  const slug = c.req.param('slug') as string;
  const { tagName } = await c.req.json<{ tagName: string }>();
  const normalizedName = tagName.trim().toLowerCase();

  if (!normalizedName) return c.json({ error: 'Tag name is required' }, 400);

  try {
    // 1. Ищем тег, если нет — создаем
    let tag = await db.query.tags.findFirst({ where: eq(tags.name, normalizedName) });
    if (!tag) {
      const [newTag] = await db.insert(tags).values({ name: normalizedName }).returning();
      tag = newTag;
    }

    // 2. Связываем стих и тег (игнорируем, если связь уже есть)
    await db.insert(poemTags).values({ slug, tagId: tag.id }).onConflictDoNothing();

    return c.json({ success: true });
  } catch (e) {
    console.error('Error adding tag:', e);
    return c.json({ error: String(e) }, 500);
  }
};

export const removeTag = async (c: Context) => {
  const slug = c.req.param('slug') as string;
  const tagName = c.req.param('tagName'); // из URL: /api/poems/:slug/tags/:tagName

  try {
    const tag = await db.query.tags.findFirst({ where: eq(tags.name, tagName) });
    if (tag) {
      await db.delete(poemTags).where(and(eq(poemTags.slug, slug), eq(poemTags.tagId, tag.id)));
    }
    return c.json({ success: true });
  } catch (e) {
    console.error('Error removing tag:', e);
    return c.json({ error: String(e) }, 500);
  }
};
