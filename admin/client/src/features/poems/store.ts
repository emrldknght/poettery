import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { type Poem } from '@/shared/api'; // Проверь путь, если у тебя иначе

import { poemApi } from "@/features/poems/api.ts";
import { tagApi } from "@/features/tags/api";

type View = 'by-sections' | 'by-folders';

interface PoemsState {
  poems: Poem[];
  selectedSlug: string | null;
  previewContent: string | null;
  view: View;
  isLoading: boolean;
  error: string | null;

  loadPoems: () => Promise<void>;
  togglePublish: (slug: string) => Promise<void>;
  selectPoem: (slug: string | null) => Promise<void>;
  setView: (view: View) => void;
  clearError: () => void;
  addTag: (slug: string, tagName: string) => Promise<void>;
  removeTag: (slug: string, tagName: string) => Promise<void>;

  updateMetadata: (slug: string, data: { title?: string | null; date?: string | null; section?: string }) => Promise<void>;

}

export const usePoemsStore = create<PoemsState>()(
  devtools(
    (set, get) => ({
      poems: [],
      selectedSlug: null,
      previewContent: null,
      view: 'by-sections',
      isLoading: false,
      error: null,

      loadPoems: async () => {
        set({ isLoading: true, error: null }, false, 'poems/load/start');
        try {
          const poems = await poemApi.getAll();
          set({ poems, isLoading: false }, false, 'poems/load/success');
        } catch (e) {
          set({ error: (e as Error).message, isLoading: false }, false, 'poems/load/error');
        }
      },

      togglePublish: async (slug: string) => {
        const poem = get().poems.find(p => p.slug === slug);
        if (!poem) return;
        const newStatus = !poem.published;

        set(state => ({
          poems: state.poems.map(p => p.slug === slug ? { ...p, published: newStatus } : p)
        }), false, `poems/togglePublish/${newStatus}`);

        try {
          await poemApi.togglePublish(slug, newStatus);
        } catch (e) {
          set(state => ({
            poems: state.poems.map(p => p.slug === slug ? { ...p, published: !newStatus } : p),
            error: (e as Error).message,
          }), false, 'poems/togglePublish/rollback');
        }
      },

      selectPoem: async (slug: string | null) => {
        set({ selectedSlug: slug, previewContent: null }, false, `poems/select/${slug}`);
        if (slug) {
          try {
            const data = await poemApi.getContent(slug);
            set({ previewContent: data.content }, false, 'poems/select/loaded');
          } catch (e) {
            set({ error: (e as Error).message }, false, 'poems/select/error');
          }
        }
      },

      setView: (view) => set({ view }, false, `poems/setView/${view}`),
      clearError: () => set({ error: null }, false, 'poems/clearError'),

      addTag: async (slug: string, tagName: string) => {
        const poem = get().poems.find(p => p.slug === slug);
        if (!poem || poem.tags.includes(tagName)) return;

        const newTags = [...poem.tags, tagName];
        set(state => ({
          poems: state.poems.map(p => p.slug === slug ? { ...p, tags: newTags } : p)
        }), false, `tags/addTag/${tagName}`);

        try {
          await tagApi.add(slug, tagName);
        } catch (e) {
          set(state => ({
            poems: state.poems.map(p => p.slug === slug ? { ...p, tags: poem.tags } : p),
            error: (e as Error).message,
          }), false, 'tags/addTag/rollback');
        }
      },

      removeTag: async (slug: string, tagName: string) => {
        const poem = get().poems.find(p => p.slug === slug);
        if (!poem) return;

        const newTags = poem.tags.filter(t => t !== tagName);
        set(state => ({
          poems: state.poems.map(p => p.slug === slug ? { ...p, tags: newTags } : p)
        }), false, `tags/removeTag/${tagName}`);

        try {
          await tagApi.remove(slug, tagName);
        } catch (e) {
          set(state => ({
            poems: state.poems.map(p => p.slug === slug ? { ...p, tags: poem.tags } : p),
            error: (e as Error).message,
          }), false, 'tags/removeTag/rollback');
        }
      },

      updateMetadata: async (slug, data) => {
        try {
          await poemApi.updateMetadata(slug, data);
          // Обновляем локальное состояние
          set(
            (state) => ({
              poems: state.poems.map((p) =>
                p.slug === slug ? { ...p, ...data } : p
              ),
            }),
            false,
            'poems/updateMetadata/success'
          );
        } catch (e) {
          set({ error: (e as Error).message }, false, 'poems/updateMetadata/error');
        }
      },


    }),
    { name: 'PoemsStore', enabled: true }
  )
);