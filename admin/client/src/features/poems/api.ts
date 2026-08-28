import { apiClient, type Poem } from '@/shared/api';

export const poemApi = {
  getAll: () => apiClient.get<Poem[]>('/api/poems'),

  togglePublish: (slug: string, published: boolean) =>
    apiClient.patch(`/api/poems/${encodeURIComponent(slug)}/publish`, { published }),

  getContent: (slug: string) =>
    apiClient.get<{ content: string; path: string }>(`/api/files/${encodeURIComponent(slug)}`),

  updateMetadata: (slug: string, data: { title?: string | null; date?: string | null; section?: string }) =>
    apiClient.patch(`/api/poems/${encodeURIComponent(slug)}`, data),
};