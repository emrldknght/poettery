import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  sidebarView: 'files' | 'sections';
  poemsView: 'by-sections' | 'by-folders';
  expandedFolders: string[];
  collapsedSections: string[];

  setSidebarView: (view: 'files' | 'sections') => void;
  setPoemsView: (view: 'by-sections' | 'by-folders') => void;
  toggleFolder: (path: string) => void;
  toggleSection: (section: string) => void;
  isFolderExpanded: (path: string) => boolean;
  isSectionCollapsed: (section: string) => boolean;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarView: 'files',
      poemsView: 'by-sections',
      expandedFolders: [''],
      collapsedSections: [],

      setSidebarView: (view) => set({ sidebarView: view }),
      setPoemsView: (view) => set({ poemsView: view }),

      toggleFolder: (path) => {
        const expanded = new Set(get().expandedFolders);
        if (expanded.has(path)) expanded.delete(path);
        else expanded.add(path);
        set({ expandedFolders: Array.from(expanded) });
      },

      toggleSection: (section) => {
        const collapsed = new Set(get().collapsedSections);
        if (collapsed.has(section)) collapsed.delete(section);
        else collapsed.add(section);
        set({ collapsedSections: Array.from(collapsed) });
      },

      isFolderExpanded: (path) => get().expandedFolders.includes(path),
      isSectionCollapsed: (section) => get().collapsedSections.includes(section),
    }),
    {
      name: 'admin-ui-state',
    }
  )
);