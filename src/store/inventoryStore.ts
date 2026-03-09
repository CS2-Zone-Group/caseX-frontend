import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '@/lib/api';

interface InventoryItemType {
  id: string;
  isListed: boolean;
  listPrice: number | null;
  isSteamItem?: boolean;
  steamAssetId?: string;
  skin: {
    id: string;
    name: string;
    imageUrl: string;
    rarity: string;
    exterior: string;
    weaponType?: string;
    price?: number;
  };
  purchasedAt?: string;
}

interface InventoryStore {
  items: InventoryItemType[];
  loading: boolean;
  error: string | null;
  fetchInventory: (userId: string) => Promise<void>;
  listItem: (itemId: string, price: number) => Promise<void>;
  unlistItem: (itemId: string) => Promise<void>;
  clearInventory: () => void;
}

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      error: null,

      fetchInventory: async (userId: string) => {
        set({ loading: true, error: null });
        try {
          const { data } = await api.get('/inventory', { params: { userId } });
          let rawItems: InventoryItemType[] = [];

          if (Array.isArray(data)) {
            rawItems = data;
          } else if (data.items && Array.isArray(data.items)) {
            rawItems = data.items;
          } else if (data.data && Array.isArray(data.data)) {
            rawItems = data.data;
          }

          set({ items: rawItems, loading: false });
        } catch (error: any) {
          console.error('Inventory fetch error:', error);
          set({ items: [], loading: false, error: error.message || 'Failed to fetch inventory' });
        }
      },

      listItem: async (itemId: string, price: number) => {
        try {
          await api.patch(`/inventory/${itemId}/list`, { price });
          set((state) => ({
            items: state.items.map((item) =>
              item.id === itemId ? { ...item, isListed: true, listPrice: price } : item
            ),
          }));
        } catch (error: any) {
          console.error('List item error:', error);
          throw error;
        }
      },

      unlistItem: async (itemId: string) => {
        try {
          await api.patch(`/inventory/${itemId}/unlist`);
          set((state) => ({
            items: state.items.map((item) =>
              item.id === itemId ? { ...item, isListed: false, listPrice: null } : item
            ),
          }));
        } catch (error: any) {
          console.error('Unlist item error:', error);
          throw error;
        }
      },

      clearInventory: () => set({ items: [], error: null }),
    }),
    {
      name: 'user-inventory-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
