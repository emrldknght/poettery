import { apiClient } from '@/shared/api';

export const tagApi = {
  add: (slug: string, tagName: string) =>
    apiClient.post(`/api/tags/${encodeURIComponent(slug)}/tags`, { tagName }),

  remove: (slug: string, tagName: string) =>
    apiClient.delete(`/api/tags/${encodeURIComponent(slug)}/tags/${encodeURIComponent(tagName)}`),
};