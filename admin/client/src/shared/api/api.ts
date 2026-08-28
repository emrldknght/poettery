import type {FileNode} from "@/features/files";

export interface Poem {
  slug: string;
  file_path: string;
  layout: string;
  title: string | null;
  date: string | null;
  section: string;
  published: boolean;
  tags: string[];
}

export const _api = {
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

  async fetchFileTree(): Promise<FileNode[]> {
    const res = await fetch('/api/files/tree');
    if (!res.ok) throw new Error('Failed to fetch file tree');
    return res.json();
  },

  async syncSingleFile(relativePath: string): Promise<void> {
    const res = await fetch('/api/sync/single', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: relativePath }),
    });
    if (!res.ok) throw new Error('Failed to sync single file');
  },

  async addTag(slug: string, tagName: string): Promise<void> {
      const res = await fetch(`/api/poems/${encodeURIComponent(slug)}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tagName }),
      });
      if (!res.ok) throw new Error('Failed to add tag');
    },

    async removeTag(slug: string, tagName: string): Promise<void> {
      const res = await fetch(`/api/poems/${encodeURIComponent(slug)}/tags/${encodeURIComponent(tagName)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to remove tag');
    },
};
