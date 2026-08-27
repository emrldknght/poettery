export interface Poem {
  slug: string;
  file_path: string;
  layout: string;
  title: string | null;
  date: string | null;
  section: string;
  published: boolean;
}

export const api = {
  async fetchPoems(): Promise<Poem[]> {
    const res = await fetch('/api/poems');
    if (!res.ok) throw new Error('Failed to fetch poems');
    return res.json();
  },

  async sync(): Promise<void> {
    const res = await fetch('/api/sync', { method: 'POST' });
    if (!res.ok) throw new Error('Sync failed');
  },

  async togglePublish(slug: string, published: boolean): Promise<void> {
    const res = await fetch(`/api/poems/${slug}/publish`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published }),
    });
    if (!res.ok) throw new Error('Update failed');
  },

  async fetchFileContent(slug: string): Promise<{ content: string; path: string }> {
    const res = await fetch(`/api/files/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch file');
    return res.json();
  },
};