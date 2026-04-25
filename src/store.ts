import { create } from 'zustand';

interface CartItem {
  id: number;
  name: string;
  price_fiat: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  restaurantId: number | null;
  addItem: (item: CartItem, restaurantId: number) => void;
  decrementItem: (id: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  totalFiat: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  restaurantId: null,
  addItem: (item, restaurantId) => set((state) => {
    if (state.restaurantId !== null && state.restaurantId !== restaurantId) {
      if (!confirm("Adding items from a different restaurant will clear your current cart. Continue?")) {
        return state;
      }
      return { items: [{ ...item, quantity: 1 }], restaurantId };
    }
    
    const existingItem = state.items.find((i) => i.id === item.id);
    if (existingItem) {
      return {
        items: state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
        restaurantId
      };
    }
    return { items: [...state.items, { ...item, quantity: 1 }], restaurantId };
  }),
  decrementItem: (id) => set((state) => {
    const existingItem = state.items.find((i) => i.id === id);
    if (existingItem && existingItem.quantity > 1) {
      return {
        items: state.items.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        )
      };
    }
    return {
      items: state.items.filter((i) => i.id !== id),
      restaurantId: state.items.length === 1 ? null : state.restaurantId
    };
  }),
  removeItem: (id) => set((state) => ({
    items: state.items.filter((i) => i.id !== id),
    restaurantId: state.items.length === 1 ? null : state.restaurantId
  })),
  clearCart: () => set({ items: [], restaurantId: null }),
  totalFiat: () => get().items.reduce((sum, i) => sum + i.price_fiat * i.quantity, 0),
}));

interface AuthState {
  user: any | null;
  setUser: (user: any) => void;
  setWallet: (address: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  setWallet: (address) => {}, // No-op
  logout: () => set({ user: null }),
}));
