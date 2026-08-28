import { Context } from 'hono';
import { db } from '../db';
import { tags, poemTags } from '../schema';
import { eq, and, sql } from 'drizzle-orm';

// --- Работа с тегами у конкретного стиха ---

export const addTagToPoem = async (c: Context) => {
  const slug = c.req.param('slug') as string;
  const { tagName } = await c.req.json<{ tagName: string }>();
  const normalizedName = tagName.trim().toLowerCase();

  if (!normalizedName) return c.json({ error: 'Tag name is required' }, 400);

  try {
    let tag = await db.query.tags.findFirst({ where: eq(tags.name, normalizedName) });
    if (!tag) {
      const [newTag] = await db.insert(tags).values({ name: normalizedName }).returning();
      tag = newTag;
    }
    await db.insert(poemTags).values({ slug, tagId: tag.id }).onConflictDoNothing();
    return c.json({ success: true });
  } catch (e) {
    console.error('Error adding tag:', e);
    return c.json({ error: String(e) }, 500);
  }
};

export const removeTagFromPoem = async (c: Context) => {
  const slug = c.req.param('slug') as string;
  // Явное приведение типа, чтобы IDE не ругалась
  const tagName = c.req.param('tagName') as string;

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

// --- Глобальное управление тегами (Tag Editor) ---

export const getAllTags = async (c: Context) => {
  try {
    const result = await db
      .select({
        id: tags.id,
        name: tags.name,
        poemsCount: sql<number>`count(${poemTags.slug})`.mapWith(Number).as('poemsCount'),
      })
      .from(tags)
      .leftJoin(poemTags, eq(tags.id, poemTags.tagId))
      .groupBy(tags.id)
      .orderBy(tags.name);

    return c.json(result);
  } catch (e) {
    console.error('Error fetching tags:', e);
    return c.json({ error: String(e) }, 500);
  }
};

export const renameTag = async (c: Context) => {
  const id = Number(c.req.param('id'));
  const { name } = await c.req.json<{ name: string }>();
  const normalizedName = name.trim().toLowerCase();

  if (!normalizedName) return c.json({ error: 'Tag name is required' }, 400);
  if (!Number.isFinite(id)) return c.json({ error: 'Invalid tag id' }, 400);

  try {
    const existing = await db.query.tags.findFirst({ where: eq(tags.name, normalizedName) });
    if (existing && existing.id !== id) {
      return c.json({ error: `Tag "${normalizedName}" already exists` }, 409);
    }

    await db.update(tags).set({ name: normalizedName }).where(eq(tags.id, id));
    return c.json({ success: true });
  } catch (e) {
    console.error('Error renaming tag:', e);
    return c.json({ error: String(e) }, 500);
  }
};

export const deleteTag = async (c: Context) => {
  const id = Number(c.req.param('id'));
  if (!Number.isFinite(id)) return c.json({ error: 'Invalid tag id' }, 400);

  try {
    await db.delete(poemTags).where(eq(poemTags.tagId, id));
    await db.delete(tags).where(eq(tags.id, id));
    return c.json({ success: true });
  } catch (e) {
    console.error('Error deleting tag:', e);
    return c.json({ error: String(e) }, 500);
  }
};

// Создание нового тега (или возврат существующего)
export const createTag = async (c: Context) => {
  const { name } = await c.req.json<{ name: string }>();
  const normalizedName = name.trim().toLowerCase();

  if (!normalizedName) return c.json({ error: 'Tag name is required' }, 400);

  try {
    // Проверяем, не существует ли уже. Если существует — просто возвращаем его.
    const existing = await db.query.tags.findFirst({ where: eq(tags.name, normalizedName) });
    if (existing) {
      return c.json(existing); // <-- ИСПРАВЛЕНО: возвращаем существующий тег вместо 409
    }

    const [newTag] = await db.insert(tags).values({ name: normalizedName }).returning();
    return c.json(newTag);
  } catch (e) {
    console.error('Error creating tag:', e);
    return c.json({ error: String(e) }, 500);
  }
};
