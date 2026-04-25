export enum OrderStatus {
  PLACED = 'PLACED',
  COOKING = 'COOKING',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string; // in ETH/MATIC
  category: string;
  image: string;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  rating: number;
  deliveryTime: string;
  image: string;
  menu: MenuItem[];
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  items: { menuItemId: string; quantity: number }[];
  totalPrice: string;
  status: OrderStatus;
  createdAt: number;
  transactionHash?: string;
}

export interface User {
  walletAddress: string;
  name?: string;
  role: 'USER' | 'RESTAURANT' | 'DELIVERY';
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
