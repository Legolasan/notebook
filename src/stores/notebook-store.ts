import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Notebook, Page, NotebookWithPages } from '@/types';

interface NotebookState {
  notebooks: NotebookWithPages[];
  currentNotebook: NotebookWithPages | null;
  currentPageIndex: number;
  isLoading: boolean;
  isSyncing: boolean;
  pendingChanges: Map<string, Partial<Page>>;

  // Actions
  setNotebooks: (notebooks: NotebookWithPages[]) => void;
  setCurrentNotebook: (notebook: NotebookWithPages | null) => void;
  setCurrentPageIndex: (index: number) => void;
  updatePage: (pageId: string, content: string) => void;
  addPendingChange: (pageId: string, changes: Partial<Page>) => void;
  clearPendingChanges: () => void;
  setLoading: (loading: boolean) => void;
  setSyncing: (syncing: boolean) => void;
  flipPage: (direction: 'next' | 'prev') => void;
}

export const useNotebookStore = create<NotebookState>()(
  persist(
    (set, get) => ({
      notebooks: [],
      currentNotebook: null,
      currentPageIndex: 0,
      isLoading: false,
      isSyncing: false,
      pendingChanges: new Map(),

      setNotebooks: (notebooks) => set({ notebooks }),

      setCurrentNotebook: (notebook) =>
        set({ currentNotebook: notebook, currentPageIndex: 0 }),

      setCurrentPageIndex: (index) => set({ currentPageIndex: index }),

      updatePage: (pageId, content) => {
        const { currentNotebook } = get();
        if (!currentNotebook) return;

        const updatedPages = currentNotebook.pages.map((page) =>
          page.id === pageId ? { ...page, content } : page
        );

        set({
          currentNotebook: { ...currentNotebook, pages: updatedPages },
        });
      },

      addPendingChange: (pageId, changes) => {
        const { pendingChanges } = get();
        const newPendingChanges = new Map(pendingChanges);
        const existing = newPendingChanges.get(pageId) || {};
        newPendingChanges.set(pageId, { ...existing, ...changes });
        set({ pendingChanges: newPendingChanges });
      },

      clearPendingChanges: () => set({ pendingChanges: new Map() }),

      setLoading: (isLoading) => set({ isLoading }),

      setSyncing: (isSyncing) => set({ isSyncing }),

      flipPage: (direction) => {
        const { currentNotebook, currentPageIndex } = get();
        if (!currentNotebook) return;

        const maxPages = currentNotebook.pages.length;
        let newIndex = currentPageIndex;

        if (direction === 'next' && currentPageIndex < maxPages - 1) {
          newIndex = currentPageIndex + 1;
        } else if (direction === 'prev' && currentPageIndex > 0) {
          newIndex = currentPageIndex - 1;
        }

        set({ currentPageIndex: newIndex });
      },
    }),
    {
      name: 'notebook-storage',
      partialize: (state) => ({
        notebooks: state.notebooks,
        pendingChanges: Array.from(state.pendingChanges.entries()),
      }),
    }
  )
);
