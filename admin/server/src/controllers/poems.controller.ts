import { Request, Response } from 'express';
import { db } from '../db';
import { poems } from '../schema';
import { eq, desc } from 'drizzle-orm';
import { syncFiles } from '../sync';

export const getAllPoems = async (req: Request, res: Response) => {
  try {
    const allPoems = await db.select().from(poems).orderBy(desc(poems.updated_at));
    res.json(allPoems);
  } catch (e) {
    console.error('Error fetching poems:', e);
    res.status(500).json({ error: String(e) });
  }
};

export const syncAll = async (req: Request, res: Response) => {
  try {
    await syncFiles();
    res.json({ message: 'Синхронизация успешна' });
  } catch (e) {
    console.error('Error syncing:', e);
    res.status(500).json({ error: String(e) });
  }
};

export const togglePublish = async (req: Request, res: Response) => {
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
};