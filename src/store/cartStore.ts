import { create } from 'zustand';
import api from '@/lib/api';

interface CartItem {
  id: string;
  skinId: string;
  quantity: number;
  skin: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    rarity: string;
  };
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (skinId: string) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  total: 0,
  itemCount: 0,
  loading: false,

  fetchCart: async () => {
    const currentState = get();
    if (currentState.loading) return; // Prevent multiple simultaneous requests
    
    try {
      set({ loading: true });
      const { data } = await api.get('/cart');
      set({
        items: data.items || [],
        total: data.total || 0,
        itemCount: data.itemCount || 0,
        loading: false,
      });
    } catch (error: any) {
      set({ 
        loading: false,
        items: [],
        total: 0,
        itemCount: 0
      });
      console.error('Cart fetch error:', error);
      
      // If it's an authentication error, don't throw
      if (error.response?.status === 401) {
        console.log('User not authenticated for cart');
        return;
      }
      
      throw error;
    }
  },

  addToCart: async (skinId: string) => {
    try {
      await api.post('/cart', { skinId });
      await get().fetchCart();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Cartga qo\'shishda xatolik');
    }
  },

  removeFromCart: async (cartItemId: string) => {
    try {
      await api.delete(`/cart/${cartItemId}`);
      await get().fetchCart();
    } catch (error) {
      console.error('Remove from cart error:', error);
    }
  },

  clearCart: async () => {
    try {
      await api.delete('/cart');
      set({ items: [], total: 0, itemCount: 0 });
    } catch (error) {
      console.error('Clear cart error:', error);
    }
  },
}));
