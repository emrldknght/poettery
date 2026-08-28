import { apiClient } from '@/shared/api';

export const tagApi = {
  add: (slug: string, tagName: string) =>
    apiClient.post(`/api/tags/${encodeURIComponent(slug)}/tags`, { tagName }),

  remove: (slug: string, tagName: string) =>
    apiClient.delete(`/api/tags/${encodeURIComponent(slug)}/tags/${encodeURIComponent(tagName)}`),

  // Глобальное управление тегами (Tag Editor)
  getAll: () =>
    apiClient.get<{ id: number; name: string; poemsCount: number }[]>('/api/tags/list'),

  create: (name: string) =>
    apiClient.post<{ id: number; name: string }>('/api/tags', { name }),

  rename: (id: number, name: string) =>
    apiClient.patch(`/api/tags/${id}`, { name }),

  delete: (id: number) =>
    apiClient.delete(`/api/tags/${id}`),
};