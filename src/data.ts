import { Restaurant, OrderStatus } from './types';

const categories = ['Main', 'Starter', 'Drink', 'Dessert', 'Side'];
const dishPrefixes = ['Crypto', 'Blockchain', 'Decentralised', 'Hash', 'Token', 'Smart', 'Stable', 'Bull', 'Bear', 'Ledger', 'Minted', 'Wrapped', 'Encoded', 'Digital', 'Atomic'];

const dishImages = [
  '1540189549336-e6e99c3679fe', // Vibrant Salad
  '1565299624-a169b1228224', // Colorful Sandwich
  '1567622658-0bb13669c48a', // Grilled Chicken
  '1565958011703-44f9829ba187', // Deep Dish Pizza
  '1476224203421-9ac3993557a4', // Gourmet Plate
  '1493770348161-369560ae357d', // Fruit Breakfast
  '1504674900247-0877df9cc836', // Mixed Platter
  '1482049016688-2d3e1b311543', // Avocado Toast
  '1473093226795-af9932fe5856', // Pasta
  '1546069901-ba9599a7e63c', // Healthy Salad
  '1568901346375-23c9450c58cd', // Burger
  '1512621776951-a57141f2eefd', // Buddha Bowl
  '1551024601-bec78aea704b', // Rainbow Cake
  '1565299507175-b0da4405527d', // Street Tacos
  '1513104890138-7c749659a591'  // Pepperoni Pizza
];

const generateMenu = (restaurantName: string, type: string): any[] => {
  const items = [];
  const basePrices = [0.005, 0.008, 0.012, 0.004, 0.002, 0.015];
  
  for (let i = 0; i < 15; i++) {
    const prefix = dishPrefixes[Math.floor(Math.random() * dishPrefixes.length)];
    const imageId = dishImages[i % dishImages.length];
    items.push({
      id: `${restaurantName.replace(/\s/g, '').toLowerCase()}-m${i}`,
      name: `${prefix} ${type} Special #${i + 1}`,
      description: `A delicious ${type} prepared with ${prefix.toLowerCase()} technology and premium ingredients.`,
      price: (basePrices[i % basePrices.length] + (Math.random() * 0.005)).toFixed(4),
      category: categories[i % categories.length],
      image: `https://images.unsplash.com/photo-${imageId}?w=400&auto=format&fit=crop`
    });
  }
  return items;
};

export const restaurants: Restaurant[] = [
  {
    id: 'r1',
    name: 'The Satoshi Grill',
    address: 'Genesis Block Road 0',
    rating: 4.9,
    deliveryTime: '25-35 min',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
    menu: generateMenu('Satoshi Grill', 'Steak')
  },
  {
    id: 'r2',
    name: 'Ethereum Eats',
    address: 'Vitalik Square 2',
    rating: 4.8,
    deliveryTime: '20-30 min',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    menu: generateMenu('Ethereum Eats', 'Fusion')
  },
  {
    id: 'r3',
    name: 'Solana Sushi',
    address: 'High Speed Lane 50',
    rating: 4.7,
    deliveryTime: '15-20 min',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800',
    menu: generateMenu('Solana Sushi', 'Sushi')
  },
  {
    id: 'r4',
    name: 'Polygon Pizzeria',
    address: 'Layer 2 Avenue 14',
    rating: 4.6,
    deliveryTime: '20-35 min',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
    menu: generateMenu('Polygon Pizzeria', 'Pizza')
  },
  {
    id: 'r5',
    name: 'Cardano Cafe',
    address: 'Academic Way 8',
    rating: 4.5,
    deliveryTime: '30-40 min',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
    menu: generateMenu('Cardano Cafe', 'Coffee & Brunch')
  },
  {
    id: 'r6',
    name: 'Avalanche Alpine',
    address: 'Snowy Peak Dr 33',
    rating: 4.8,
    deliveryTime: '40-50 min',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
    menu: generateMenu('Avalanche Alpine', 'European')
  },
  {
    id: 'r7',
    name: 'Polkadot Pasta',
    address: 'Parachain Pl 10',
    rating: 4.7,
    deliveryTime: '25-35 min',
    image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=800',
    menu: generateMenu('Polkadot Pasta', 'Italian')
  },
  {
    id: 'r9',
    name: 'Chainlink Asian',
    address: 'Oracle Boulevard 7',
    rating: 4.6,
    deliveryTime: '20-30 min',
    image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=800',
    menu: generateMenu('Chainlink Asian', 'Thai')
  },
  {
    id: 'r10',
    name: 'Uniswap Umami',
    address: 'DEX District 9',
    rating: 4.8,
    deliveryTime: '25-35 min',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
    menu: generateMenu('Uniswap Umami', 'Japanese')
  },
  {
    id: 'r12',
    name: 'Hbar Healthy',
    address: 'Graph Town 4',
    rating: 4.5,
    deliveryTime: '20-25 min',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    menu: generateMenu('Hbar Healthy', 'Salad')
  },
  {
    id: 'r13',
    name: 'Doge Diner',
    address: 'Meme Mansion 69',
    rating: 4.4,
    deliveryTime: '15-30 min',
    image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800',
    menu: generateMenu('Doge Diner', 'Burgers')
  },
  {
    id: 'r15',
    name: 'Ghost Garnish',
    address: 'Privacy Park 0',
    rating: 4.6,
    deliveryTime: '25-35 min',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    menu: generateMenu('Ghost Garnish', 'Vegan')
  },
  {
    id: 'r16',
    name: 'Optimism Oyster',
    address: 'Rollup Pier 3',
    rating: 4.8,
    deliveryTime: '35-45 min',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
    menu: generateMenu('Optimism Oyster', 'Seafood')
  },
  {
    id: 'r17',
    name: 'Arbitrum Artichoke',
    address: 'L2 Luxury Ln 5',
    rating: 4.7,
    deliveryTime: '25-35 min',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800',
    menu: generateMenu('Arbitrum Artichoke', 'Mediterranean')
  },
  {
    id: 'r18',
    name: 'Litecoin Libations',
    address: 'Silver St 4',
    rating: 4.5,
    deliveryTime: '15-25 min',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800',
    menu: generateMenu('Litecoin Libations', 'Drinks')
  },
  {
    id: 'r19',
    name: 'Near Noodles',
    address: 'Nightshade Ave 11',
    rating: 4.6,
    deliveryTime: '20-30 min',
    image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=800',
    menu: generateMenu('Near Noodles', 'Vietnamese')
  },
  {
    id: 'r20',
    name: 'Tether Treats',
    address: 'Stable St 1',
    rating: 4.8,
    deliveryTime: '20-30 min',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
    menu: generateMenu('Tether Treats', 'Desserts')
  }
];
