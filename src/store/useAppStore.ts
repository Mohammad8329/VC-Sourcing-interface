import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SavedSearch {
    id: string;
    name: string;
    filters: any; // We'll refine this later
    savedAt: string;
}

export interface List {
    id: string;
    name: string;
    companyIds: string[];
    createdAt: string;
}

interface AppState {
    savedSearches: SavedSearch[];
    lists: List[];
    addSavedSearch: (search: Omit<SavedSearch, 'id' | 'savedAt'>) => void;
    removeSavedSearch: (id: string) => void;
    createList: (name: string) => void;
    deleteList: (id: string) => void;
    addToList: (listId: string, companyId: string) => void;
    removeFromList: (listId: string, companyId: string) => void;

    // Filters State
    globalSearch: string;
    setGlobalSearch: (search: string) => void;
    filterSectors: string[];
    setFilterSectors: (sectors: string[]) => void;
    filterStages: string[];
    setFilterStages: (stages: string[]) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            savedSearches: [],
            lists: [],
            globalSearch: '',
            filterSectors: [],
            filterStages: [],
            setGlobalSearch: (search) => set({ globalSearch: search }),
            setFilterSectors: (sectors) => set({ filterSectors: sectors }),
            setFilterStages: (stages) => set({ filterStages: stages }),
            addSavedSearch: (search) =>
                set((state) => ({
                    savedSearches: [
                        ...state.savedSearches,
                        { ...search, id: crypto.randomUUID(), savedAt: new Date().toISOString() },
                    ],
                })),
            removeSavedSearch: (id) =>
                set((state) => ({
                    savedSearches: state.savedSearches.filter((s) => s.id !== id),
                })),
            createList: (name) =>
                set((state) => ({
                    lists: [
                        ...state.lists,
                        { id: crypto.randomUUID(), name, companyIds: [], createdAt: new Date().toISOString() },
                    ],
                })),
            deleteList: (id) =>
                set((state) => ({
                    lists: state.lists.filter((l) => l.id !== id),
                })),
            addToList: (listId, companyId) =>
                set((state) => ({
                    lists: state.lists.map((l) =>
                        l.id === listId && !l.companyIds.includes(companyId)
                            ? { ...l, companyIds: [...l.companyIds, companyId] }
                            : l
                    ),
                })),
            removeFromList: (listId, companyId) =>
                set((state) => ({
                    lists: state.lists.map((l) =>
                        l.id === listId
                            ? { ...l, companyIds: l.companyIds.filter((id) => id !== companyId) }
                            : l
                    ),
                })),
        }),
        {
            name: 'vc-intelligence-storage',
        }
    )
);
