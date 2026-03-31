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
    exterior?: string;
    float?: number;
  };
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  loading: boolean;
  error: string | null;
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
  error: null,

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
      throw new Error(error.response?.data?.message || 'Failed to add to cart');
    }
  },

  removeFromCart: async (cartItemId: string) => {
    try {
      set({ error: null });
      await api.delete(`/cart/${cartItemId}`);
      await get().fetchCart();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to remove item from cart';
      set({ error: message });
      console.error('Remove from cart error:', error);
      throw error;
    }
  },

  clearCart: async () => {
    try {
      set({ error: null });
      await api.delete('/cart');
      set({ items: [], total: 0, itemCount: 0 });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      set({ error: message });
      console.error('Clear cart error:', error);
      throw error;
    }
  },
}));
