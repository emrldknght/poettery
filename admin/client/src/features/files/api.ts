import { apiClient } from '@/shared/api';
import type { FileNode } from './types.ts';

export const fileApi = {
  getTree: () => apiClient.get<FileNode[]>('/api/files/tree'),
  syncSingle: (relativePath: string, mode: 'full' | 'partial' = 'full') =>
    apiClient.post('/api/files/sync/single', { path: relativePath, mode }),
  syncAll: () => apiClient.post('/api/poems/sync'),
};