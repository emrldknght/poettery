import { apiClient } from '@/shared/api';
import type { FileNode } from './types.ts';

export const fileApi = {
  getTree: () => apiClient.get<FileNode[]>('/api/files/tree'),

  syncSingle: (relativePath: string) =>
    apiClient.post('/api/files/sync/single', { path: relativePath }),

  // TODO - redefine sync to files
  syncAll: () => apiClient.post('/api/poems/sync'),
};