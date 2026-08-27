import { apiClient } from '@/shared/api';

export const tagApi = {
  add: (slug: string, tagName: string) =>
    apiClient.post(`/api/poems/${encodeURIComponent(slug)}/tags`, { tagName }),

  remove: (slug: string, tagName: string) =>
    apiClient.delete(`/api/poems/${encodeURIComponent(slug)}/tags/${encodeURIComponent(tagName)}`),
};