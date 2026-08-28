import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { type FileNode } from '@/features/files';
import { usePoemsStore } from '@/features/poems/store';
import { fileApi } from "@/features/files/api.ts";

interface FilesState {
  fileTree: FileNode[];
  isSyncing: boolean;

  fetchFileTree: () => Promise<void>;
  sync: () => Promise<void>;
  syncSingleFile: (path: string) => Promise<void>;
}

export const useFilesStore = create<FilesState>()(
  devtools(
    (set, get) => ({
      fileTree: [],
      isSyncing: false,

      fetchFileTree: async () => {
        try {
          const fileTree = await fileApi.getTree();
          set({ fileTree }, false, 'files/fetchTree/success');
        } catch (e) {
          // Ошибку дерева можно показать в UI или записать в poemsStore.error
          console.error('Failed to fetch file tree:', e);
        }
      },

      sync: async () => {
        set({ isSyncing: true }, false, 'files/sync/start');
        try {
          await fileApi.syncAll();
          // После полного синка обновляем и стихи, и дерево
          await usePoemsStore.getState().loadPoems();
          await get().fetchFileTree();
          set({ isSyncing: false }, false, 'files/sync/success');
        } catch (e) {
          usePoemsStore.getState().clearError(); // Сброс старой ошибки
          usePoemsStore.setState({ error: (e as Error).message }, false, 'files/sync/error');
          set({ isSyncing: false }, false, 'files/sync/error');
        }
      },

      syncSingleFile: async (path: string) => {
        set({ isSyncing: true }, false, `files/syncSingle/start/${path}`);
        try {
          await fileApi.syncSingle(path);
          await usePoemsStore.getState().loadPoems();
          await get().fetchFileTree();
          set({ isSyncing: false }, false, 'files/syncSingle/success');
        } catch (e) {
          usePoemsStore.setState({ error: (e as Error).message }, false, 'files/syncSingle/error');
          set({ isSyncing: false }, false, 'files/syncSingle/error');
        }
      },
    }),
    { name: 'FilesStore', enabled: true }
  )
);