import { create } from 'zustand';
import { api, type Poem } from '../api/api';

type View = 'by-sections' | 'by-folders';

interface PoemsState {
  // Данные
  poems: Poem[];
  selectedSlug: string | null;
  previewContent: string | null;

  // UI состояние
  view: View;
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;

  // Actions
  loadPoems: () => Promise<void>;
  sync: () => Promise<void>;
  togglePublish: (slug: string) => Promise<void>;
  selectPoem: (slug: string | null) => Promise<void>;
  setView: (view: View) => void;
  clearError: () => void;
}

export const usePoemsStore = create<PoemsState>((set, get) => ({
  // Начальное состояние
  poems: [],
  selectedSlug: null,
  previewContent: null,
  view: 'by-sections',
  isLoading: false,
  isSyncing: false,
  error: null,

  loadPoems: async () => {
    set({ isLoading: true, error: null });
    try {
      const poems = await api.fetchPoems();
      set({ poems, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  sync: async () => {
    set({ isSyncing: true, error: null });
    try {
      await api.sync();
      await get().loadPoems();
      set({ isSyncing: false });
    } catch (e) {
      set({ error: (e as Error).message, isSyncing: false });
    }
  },

  togglePublish: async (slug: string) => {
    const poem = get().poems.find(p => p.slug === slug);
    if (!poem) return;

    const newStatus = !poem.published;
    // Оптимистичное обновление UI
    set(state => ({
      poems: state.poems.map(p =>
        p.slug === slug ? { ...p, published: newStatus } : p
      ),
    }));

    try {
      await api.togglePublish(slug, newStatus);
    } catch (e) {
      // Откат при ошибке
      set(state => ({
        poems: state.poems.map(p =>
          p.slug === slug ? { ...p, published: !newStatus } : p
        ),
        error: (e as Error).message,
      }));
    }
  },

  selectPoem: async (slug) => {
    set({ selectedSlug: slug, previewContent: null });
    if (slug) {
      try {
        const data = await api.fetchFileContent(slug);
        set({ previewContent: data.content });
      } catch (e) {
        set({ error: (e as Error).message });
      }
    }
  },

  setView: (view) => set({ view }),
  clearError: () => set({ error: null }),
}));