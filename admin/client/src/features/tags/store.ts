import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { tagApi as tagsApi } from './api';

export interface Tag {
  id: number;
  name: string;
  poemsCount: number;
}

interface TagsState {
  tags: Tag[];
  isLoading: boolean;
  fetchTags: () => Promise<void>;
  createTag: (name: string) => Promise<void>;
  renameTag: (id: number, name: string) => Promise<void>;
  deleteTag: (id: number) => Promise<void>;
}

export const useTagsStore = create<TagsState>()(
  devtools(
    (set, get) => ({
      tags: [],
      isLoading: false,

      fetchTags: async () => {
        set({ isLoading: true }, false, 'tags/fetch/start');
        try {
          const tags = await tagsApi.getAll();
          set({ tags, isLoading: false }, false, 'tags/fetch/success');
        } catch (e) {
          set({ isLoading: false }, false, 'tags/fetch/error');
          console.error('Failed to fetch tags:', e);
        }
      },

      createTag: async (name: string) => {
        try {
          await tagsApi.create(name);
          await get().fetchTags(); // Обновляем список после создания
        } catch (e) {
          console.error('Failed to create tag:', e);
        }
      },

      renameTag: async (id: number, name: string) => {
        try {
          await tagsApi.rename(id, name);
          await get().fetchTags();
        } catch (e) {
          console.error('Failed to rename tag:', e);
        }
      },

      deleteTag: async (id: number) => {
        try {
          await tagsApi.delete(id);
          await get().fetchTags();
        } catch (e) {
          console.error('Failed to delete tag:', e);
        }
      },
    }),
    { name: 'TagsStore', enabled: true }
  )
);