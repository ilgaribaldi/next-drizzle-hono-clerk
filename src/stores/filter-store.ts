import { create } from "zustand";

interface Facets {
  category?: Record<string, number>;
}

interface FilterState {
  search: string | undefined;
  facets: Facets;
  setSearch: (search: string | undefined) => void;
  setFacets: (facets: Facets) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  search: undefined,
  facets: { category: {} },
  setSearch: (search) => set({ search }),
  setFacets: (facets) => set({ facets }),
}));
