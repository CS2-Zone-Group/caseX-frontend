import { create } from 'zustand';

interface FilterState {
  searchQuery: string;
  sortBy: string;
  rarity: string | null;
  weaponType: string | null;
  condition: string | null;
  priceRange: { min: number; max: number };
  
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: string) => void;
  setFilter: (key: 'rarity' | 'weaponType' | 'condition', value: string | null) => void;
  setPriceRange: (min: number, max: number) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: '',
  sortBy: 'default',
  rarity: null,
  weaponType: null,
  condition: null,
  priceRange: { min: 0, max: 10000 }, 

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortBy: (sort) => set({ sortBy: sort }),
  
  setFilter: (key, value) => set((state) => ({ 
    ...state, 
    [key]: value 
  })),

  setPriceRange: (min, max) => set({ priceRange: { min, max } }),

  resetFilters: () => set({
    searchQuery: '',
    sortBy: 'default',
    rarity: null,
    weaponType: null,
    condition: null,
    priceRange: { min: 0, max: 10000 }
  }),
}));