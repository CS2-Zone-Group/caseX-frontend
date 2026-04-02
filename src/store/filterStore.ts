import { create } from 'zustand';

interface FilterState {
  searchQuery: string;
  sortBy: string;
  rarity: string | null;
  weaponType: string | null;
  subCategory: string | null;
  collection: string | null;
  condition: string | null;
  priceRange: { min: number; max: number };
  paintSeed: string | null;
  sticker: string | null;

  setSearchQuery: (query: string) => void;
  setSortBy: (sort: string) => void;
  setFilter: (key: 'rarity' | 'weaponType' | 'subCategory' | 'collection' | 'condition' | 'paintSeed' | 'sticker', value: string | null) => void;
  setPriceRange: (min: number, max: number) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: '',
  sortBy: 'default',
  rarity: null,
  weaponType: null,
  subCategory: null,
  collection: null,
  condition: null,
  priceRange: { min: 0, max: 0 }, // 0 means no filter
  paintSeed: null,
  sticker: null,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortBy: (sort) => set({ sortBy: sort }),

  setFilter: (key, value) => set((state) => {
    // When weaponType changes, clear subCategory
    if (key === 'weaponType') {
      return { ...state, [key]: value, subCategory: null };
    }
    return { ...state, [key]: value };
  }),

  setPriceRange: (min, max) => set({ priceRange: { min, max } }),

  resetFilters: () => set({
    searchQuery: '',
    sortBy: 'default',
    rarity: null,
    weaponType: null,
    subCategory: null,
    collection: null,
    condition: null,
    priceRange: { min: 0, max: 0 }, // 0 means no filter
    paintSeed: null,
    sticker: null,
  }),
}));
