import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { type Poem, type FileNode } from '@/shared/api/api.ts';
import {poemApi} from "@/features/poems";
import {fileApi} from "@/features/files";

type View = 'by-sections' | 'by-folders';

interface PoemsState {
  poems: Poem[];
  fileTree: FileNode[];
  selectedSlug: string | null;
  previewContent: string | null;
  view: View;
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;

  loadPoems: () => Promise<void>;
  fetchFileTree: () => Promise<void>;
  sync: () => Promise<void>;
  syncSingleFile: (path: string) => Promise<void>;
  togglePublish: (slug: string) => Promise<void>;
  selectPoem: (slug: string | null) => Promise<void>;
  setView: (view: View) => void;
  clearError: () => void;

  addTag: (slug: string, tagName: string) => Promise<void>;
  removeTag: (slug: string, tagName: string) => Promise<void>;
}

export const _usePoemsStore = create<PoemsState>()(
  devtools(
    (set, get) => ({
      poems: [],
      fileTree: [],
      selectedSlug: null,
      previewContent: null,
      view: 'by-sections',
      isLoading: false,
      isSyncing: false,
      error: null,

      loadPoems: async () => {
        set({ isLoading: true, error: null }, false, 'loadPoems/start');
        try {
          const poems = await poemApi.getAll();
          set({ poems, isLoading: false }, false, 'loadPoems/success');
        } catch (e) {
          set({ error: (e as Error).message, isLoading: false }, false, 'loadPoems/error');
        }
      },

      fetchFileTree: async () => {
        try {
          const fileTree = await fileApi.getTree();
          set({ fileTree }, false, 'fetchFileTree/success');
        } catch (e) {
          set({ error: (e as Error).message }, false, 'fetchFileTree/error');
        }
      },

      sync: async () => {
        set({ isSyncing: true, error: null }, false, 'sync/start');
        try {
          await fileApi.syncAll();
          await get().loadPoems();
          await get().fetchFileTree(); // Обновляем дерево после полного синка
          set({ isSyncing: false }, false, 'sync/success');
        } catch (e) {
          set({ error: (e as Error).message, isSyncing: false }, false, 'sync/error');
        }
      },

      syncSingleFile: async (path: string) => {
        set({ isSyncing: true, error: null }, false, `syncSingleFile/start/${path}`);
        try {
          await fileApi.syncSingle(path);
          await get().loadPoems();
          await get().fetchFileTree(); // Обновляем дерево, чтобы показать галочку
          set({ isSyncing: false }, false, 'syncSingleFile/success');
        } catch (e) {
          set({ error: (e as Error).message, isSyncing: false }, false, 'syncSingleFile/error');
        }
      },

      togglePublish: async (slug: string) => {
        const poem = get().poems.find(p => p.slug === slug);
        if (!poem) return;

        const newStatus = !poem.published;
        set(
          state => ({
            poems: state.poems.map(p =>
              p.slug === slug ? { ...p, published: newStatus } : p
            ),
          }),
          false,
          `togglePublish/${slug}/${newStatus}`
        );

        try {
          await api.togglePublish(slug, newStatus);
        } catch (e) {
          set(
            state => ({
              poems: state.poems.map(p =>
                p.slug === slug ? { ...p, published: !newStatus } : p
              ),
              error: (e as Error).message,
            }),
            false,
            'togglePublish/rollback'
          );
        }
      },

      selectPoem: async (slug) => {
        set({ selectedSlug: slug, previewContent: null }, false, `selectPoem/${slug}`);
        if (slug) {
          try {
            const data = await api.fetchFileContent(slug);
            set({ previewContent: data.content }, false, 'selectPoem/loaded');
          } catch (e) {
            set({ error: (e as Error).message }, false, 'selectPoem/error');
          }
        }
      },

      setView: (view) => set({ view }, false, `setView/${view}`),
      clearError: () => set({ error: null }, false, 'clearError'),

      addTag: async (slug: string, tagName: string) => {
        const poem = get().poems.find(p => p.slug === slug);
        if (!poem || poem.tags.includes(tagName)) return;

        const newTags = [...poem.tags, tagName];
        // Оптимистичное обновление
        set(state => ({
          poems: state.poems.map(p => p.slug === slug ? { ...p, tags: newTags } : p),
        }), false, `addTag/${slug}/${tagName}`);

        try {
          await api.addTag(slug, tagName);
        } catch (e) {
          // Откат при ошибке
          set(state => ({
            poems: state.poems.map(p => p.slug === slug ? { ...p, tags: poem.tags } : p),
            error: (e as Error).message,
          }), false, 'addTag/rollback');
        }
      },

      removeTag: async (slug: string, tagName: string) => {
        const poem = get().poems.find(p => p.slug === slug);
        if (!poem) return;

        const newTags = poem.tags.filter(t => t !== tagName);
        // Оптимистичное обновление
        set(state => ({
          poems: state.poems.map(p => p.slug === slug ? { ...p, tags: newTags } : p),
        }), false, `removeTag/${slug}/${tagName}`);

        try {
          await api.removeTag(slug, tagName);
        } catch (e) {
          // Откат при ошибке
          set(state => ({
            poems: state.poems.map(p => p.slug === slug ? { ...p, tags: poem.tags } : p),
            error: (e as Error).message,
          }), false, 'removeTag/rollback');
        }
      },
    }),
    { name: 'PoemsStore', enabled: true }
  )
);
