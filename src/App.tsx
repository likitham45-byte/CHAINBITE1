<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  User, 
  MapPin, 
  Clock, 
  Star, 
  Wallet, 
  ChevronRight, 
  Plus, 
  Minus,
  CheckCircle2,
  Package,
  Truck,
  CookingPot,
  UtensilsCrossed,
  LayoutDashboard,
  Sparkles,
  AlertCircle,
  Home,
  BarChart3,
  ListTodo,
  QrCode
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { BlockchainService } from './services/blockchain';
import { Restaurant, MenuItem, Order, OrderStatus } from './types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Components
const Navbar = ({ wallet, connectWallet, role, setRole, hasMetaMask }: any) => (
  <nav className="h-16 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-8 shrink-0 fixed top-0 left-0 right-0 z-50 backdrop-blur-md">
    <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.hash = ''}>
      <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
        <UtensilsCrossed size={18} className="text-slate-950" />
      </div>
      <span className="text-xl font-bold tracking-tight text-white">ChainBite</span>
      <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 uppercase tracking-widest">Mainnet</span>
    </div>
    
    <div className="flex items-center gap-6">
      {!hasMetaMask && !wallet && (
        <div className="flex items-center gap-2 text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
          <AlertCircle size={14} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Demo Mode Activation</span>
        </div>
      )}
      {!hasMetaMask && wallet && (
        <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
          <CheckCircle2 size={14} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Simulated Wallet Active</span>
        </div>
      )}
      
      <div className="flex items-center gap-3">
        <select 
          value={role} 
          onChange={(e) => setRole(e.target.value)}
          className="text-xs font-bold text-slate-400 bg-slate-800/50 border-none rounded-lg px-3 py-1.5 cursor-pointer focus:ring-1 focus:ring-emerald-500 uppercase tracking-wider"
        >
          <option value="USER">Customer</option>
          <option value="RESTAURANT">Merchant</option>
        </select>
      </div>
      
      {wallet ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-mono">{wallet.slice(0, 6)}...{wallet.slice(-4)}</span>
          </div>
        </div>
      ) : (
        <button 
          onClick={connectWallet}
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-lg shadow-emerald-500/10 flex items-center gap-2 uppercase tracking-widest"
        >
          <Wallet size={14} />
          Connect Wallet
        </button>
      )}
    </div>
  </nav>
);

const Sidebar = ({ view, setView, role }: any) => (
  <aside className="w-64 border-r border-slate-800 bg-slate-900/30 p-6 flex flex-col gap-8 shrink-0 fixed top-16 bottom-0 left-0">
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3">Menu</label>
      <button 
        onClick={() => setView('HOME')}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${view === 'HOME' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:text-white'}`}
      >
        <Home size={18} />
        <span className="text-sm font-semibold">Discovery</span>
      </button>
      <button 
        onClick={() => setView('DASHBOARD')}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${view === 'DASHBOARD' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:text-white'}`}
      >
        <ListTodo size={18} />
        <span className="text-sm font-semibold">My Orders</span>
      </button>
      {role === 'RESTAURANT' && (
        <button 
          onClick={() => setView('ADMIN')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${view === 'ADMIN' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:text-white'}`}
        >
          <BarChart3 size={18} />
          <span className="text-sm font-semibold">Merchant Portal</span>
        </button>
      )}
    </div>

    <div className="mt-auto p-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700">
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">NFT Loyalty</span>
        <span className="text-xs text-emerald-400">Lv. 4</span>
      </div>
      <div className="text-sm font-bold text-white mb-1">Silver Gourmet</div>
      <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden">
        <div className="bg-emerald-500 h-full w-2/3"></div>
      </div>
      <p className="text-[10px] text-slate-500 mt-2">250 Points to Gold Tier</p>
    </div>
  </aside>
);

const RestaurantCard = ({ restaurant, onClick }: { restaurant: Restaurant, onClick: () => void }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    onClick={onClick}
    className="bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-800 cursor-pointer group hover:border-emerald-500/30 transition-all"
  >
    <div className="h-40 overflow-hidden relative">
      <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" />
      <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur px-2 py-1 rounded flex items-center gap-1 text-[10px] font-bold shadow-sm border border-slate-700">
        <Star size={12} className="text-emerald-500 fill-emerald-500" />
        <span className="text-white">{restaurant.rating}</span>
      </div>
    </div>
    <div className="p-4">
      <h3 className="font-bold text-white mb-1">{restaurant.name}</h3>
      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
        <div className="flex items-center gap-1">
          <Clock size={12} className="text-emerald-500" />
          <span>{restaurant.deliveryTime}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin size={12} className="text-emerald-500" />
          <span>{restaurant.address}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

const MenuItemCard = ({ item, quantity, onAdd, onRemove }: any) => (
  <div className="flex items-center gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-colors">
    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover shrink-0 grayscale opacity-80" />
    <div className="flex-1">
      <h4 className="font-bold text-white text-sm">{item.name}</h4>
      <p className="text-[10px] text-slate-500 line-clamp-1 uppercase tracking-wider font-bold mb-1">{item.category}</p>
      <div className="text-emerald-400 font-mono text-sm">{item.price} ETH</div>
    </div>
    <div className="flex items-center gap-3 bg-slate-800 p-1 rounded-xl">
      <button onClick={onRemove} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-emerald-400"><Minus size={14} /></button>
      <span className="font-bold w-4 text-center text-white text-sm">{quantity}</span>
      <button onClick={onAdd} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-emerald-400"><Plus size={14} /></button>
    </div>
  </div>
);

const OrderTracker = ({ order }: { order: Order }) => {
  const steps = [
    { status: OrderStatus.PLACED, label: 'Placed', icon: Package },
    { status: OrderStatus.COOKING, label: 'Cooking', icon: CookingPot },
    { status: OrderStatus.OUT_FOR_DELIVERY, label: 'Transit', icon: Truck },
    { status: OrderStatus.DELIVERED, label: 'Verified', icon: CheckCircle2 },
  ];

  const currentStep = steps.findIndex(s => s.status === order.status);

  return (
    <div className="space-y-6">
      <div className="flex justify-between relative px-2">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0">
          <div 
            className="h-full bg-emerald-500 transition-all duration-1000 ease-in-out" 
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>
        
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isCompleted = i <= currentStep;
          const isActive = i === currentStep;

          return (
            <div key={step.status} className="relative z-10 flex flex-col items-center gap-3 bg-slate-900 px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isCompleted ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'bg-slate-950 text-slate-700 border border-slate-800'
              } ${isActive ? 'scale-110 ring-4 ring-emerald-500/20' : ''}`}>
                <Icon size={18} />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest ${isCompleted ? 'text-emerald-400' : 'text-slate-600'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      
      <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-emerald-500 border border-slate-800">
            <UtensilsCrossed size={18} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{order.status.replace(/_/g, ' ')}</div>
            <div className="text-xs text-slate-400 font-medium">Smart contract processing update...</div>
          </div>
        </div>
        {order.transactionHash && (
          <div className="text-right">
            <div className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-1">Hash Verified</div>
            <div className="text-[9px] font-mono text-emerald-500/60 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {order.transactionHash.slice(0, 10)}...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [role, setRole] = useState<'USER' | 'RESTAURANT'>('USER');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [orders, setOrders] = useState<Order[]>([]);
  const [view, setView] = useState<'HOME' | 'RESTAURANT' | 'CART' | 'DASHBOARD' | 'ADMIN'>('HOME');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [recommendation, setRecommendation] = useState<string>("");
  const [hasMetaMask, setHasMetaMask] = useState<boolean>(true);

  useEffect(() => {
    setHasMetaMask(typeof window.ethereum !== 'undefined');
    
    const getRecommendation = async () => {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: "Suggest a catchy, 1-sentence foodie recommendation based on current crypto trends (e.g., 'Bullish on Burgers', 'HODL your hunger for an Ethereum Enchilada'). Keep it extremely short.",
        });
        setRecommendation(response.text || "");
      } catch (err) {
        setRecommendation("Hungry for a decentralised deal?");
      }
    };
    getRecommendation();
    
    fetch('/api/restaurants').then(res => res.json()).then(setRestaurants);
    
    const newSocket = io();
    setSocket(newSocket);
    
    newSocket.on('order_update', (updatedOrder: Order) => {
      setOrders(prev => {
        const index = prev.findIndex(o => o.id === updatedOrder.id);
        if (index > -1) {
          const newOrders = [...prev];
          newOrders[index] = updatedOrder;
          return newOrders;
        }
        return [updatedOrder, ...prev];
      });
    });

    return () => { newSocket.disconnect(); };
  }, []);

  useEffect(() => {
    if (wallet) {
      fetch(`/api/orders/${wallet}`).then(res => res.json()).then(setOrders);
    }
  }, [wallet]);

  const connectWallet = async () => {
    const address = await BlockchainService.getInstance().connectWallet();
    if (address) setWallet(address);
  };

  const addToCart = (itemId: string) => {
    setCart(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) newCart[itemId]--;
      else delete newCart[itemId];
      return newCart;
    });
  };

  const calculateTotal = () => {
    if (!selectedRestaurant) return '0';
    let total = 0;
    Object.entries(cart).forEach(([_, qty]) => {
      const item = selectedRestaurant.menu.find(m => m.id === _);
      if (item) total += parseFloat(item.price) * Number(qty);
    });
    return total.toFixed(4);
  };

  const placeOrder = async () => {
    if (!wallet) return connectWallet();
    if (!selectedRestaurant) return;

    const total = calculateTotal();
    
    // Blockchain confirmation
    const txHash = await BlockchainService.getInstance().placeOrder(selectedRestaurant.id, total);
    
    if (txHash) {
      const orderData = {
        userId: wallet,
        restaurantId: selectedRestaurant.id,
        items: Object.entries(cart).map(([menuItemId, quantity]) => ({ menuItemId, quantity })),
        totalPrice: total,
        transactionHash: txHash,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        setCart({});
        setView('DASHBOARD');
      }
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col overflow-hidden">
      <Navbar wallet={wallet} connectWallet={connectWallet} role={role} setRole={setRole} hasMetaMask={hasMetaMask} />
      
      <div className="flex flex-1 overflow-hidden pt-16">
        <Sidebar view={view} setView={setView} role={role} />
        
        <main className="flex-1 p-8 ml-64 overflow-y-auto">
          <AnimatePresence mode="wait">
            {view === 'HOME' && (
              <motion.div 
                key="home"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="relative h-64 rounded-3xl overflow-hidden bg-slate-900 border border-slate-800">
                  <img 
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600" 
                    className="w-full h-full object-cover opacity-30"
                    alt="Hero"
                  />
                  <div className="absolute inset-0 flex flex-col justify-center px-12">
                    <h1 className="text-4xl font-bold text-white leading-tight">
                      Order Faster <br />Through <span className="text-emerald-500 uppercase tracking-widest font-black">Chain</span>.
                    </h1>
                    <p className="text-slate-400 mt-4 max-w-sm font-medium text-sm">
                      A blockchain-based food ecosystem. Secure escrow payments and real-time transit validation.
                    </p>
                    {recommendation && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mt-6 flex items-center gap-2 bg-slate-800/50 backdrop-blur-md border border-slate-700 w-fit px-3 py-1.5 rounded-lg text-emerald-400 font-bold"
                      >
                        <Sparkles size={14} />
                        <span className="text-[10px] uppercase tracking-widest">{recommendation}</span>
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                      <h2 className="text-xl font-bold text-white tracking-tight">Verified Markets</h2>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Direct merchant connection</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restaurants.map(r => (
                    <div key={r.id}>
                      <RestaurantCard 
                        restaurant={r} 
                        onClick={() => {
                            setSelectedRestaurant(r);
                            setView('RESTAURANT');
                        }}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {view === 'RESTAURANT' && selectedRestaurant && (
              <motion.div 
                key="restaurant"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-12 gap-8"
              >
                <div className="col-span-8 space-y-8">
                  <header className="flex justify-between items-start bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <div>
                        <h2 className="text-3xl font-bold text-white">{selectedRestaurant.name}</h2>
                        <div className="flex items-center gap-4 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <div className="flex items-center gap-1"><MapPin size={12} className="text-emerald-500" /> {selectedRestaurant.address}</div>
                            <div className="flex items-center gap-1"><Star size={12} className="text-emerald-500 fill-emerald-500" /> {selectedRestaurant.rating}</div>
                            <div className="flex items-center gap-1"><Clock size={12} className="text-emerald-500" /> {selectedRestaurant.deliveryTime}</div>
                        </div>
                    </div>
                    <button onClick={() => setView('HOME')} className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"><ChevronRight className="rotate-180" size={20} /></button>
                  </header>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 px-1">Curated Selection</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedRestaurant.menu.map(item => (
                        <MenuItemCard 
                          key={item.id} 
                          item={item} 
                          quantity={cart[item.id] || 0}
                          onAdd={() => addToCart(item.id)}
                          onRemove={() => removeFromCart(item.id)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-span-4 sticky top-0 h-fit">
                    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Escrow Cart</h3>
                            <ShoppingBag size={18} className="text-emerald-500" />
                        </div>

                        {Object.keys(cart).length === 0 ? (
                            <div className="text-center py-12">
                              <Package size={32} className="mx-auto text-slate-800 mb-3" />
                              <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">Empty Transaction</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    {Object.entries(cart).map(([id, qty]) => {
                                        const item = selectedRestaurant.menu.find(m => m.id === id);
                                        return (
                                            <div key={id} className="flex justify-between items-center text-xs">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-emerald-500">{qty}x</span>
                                                    <span className="font-semibold text-slate-300">{item?.name}</span>
                                                </div>
                                                <span className="font-mono text-emerald-400">{item ? (parseFloat(item.price) * Number(qty)).toFixed(4) : 0}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                <div className="pt-6 border-t border-slate-800">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Total Value</span>
                                        <span className="text-2xl font-mono text-emerald-500">{calculateTotal()} <span className="text-xs">ETH</span></span>
                                    </div>
                                    <button 
                                        onClick={placeOrder}
                                        className="w-full bg-emerald-500 text-slate-950 font-black py-4 rounded-xl shadow-lg shadow-emerald-500/10 hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-widest"
                                    >
                                        <Wallet size={16} />
                                        Commit Transaction
                                    </button>
                                    <p className="text-[9px] text-center text-slate-600 mt-4 font-bold uppercase tracking-widest leading-relaxed">
                                      Funds will be locked in smart contract until delivery confirmation
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-start gap-3">
                        <QrCode size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Courier Verification</h4>
                          <p className="text-[9px] text-emerald-500/80 mt-1">A secure QR code will be generated to release funds upon arrival.</p>
                        </div>
                    </div>
                </div>
              </motion.div>
            )}

            {(view === 'DASHBOARD' || view === 'ADMIN') && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl space-y-8"
              >
                <header className="flex justify-between items-end">
                  <div>
                      <h2 className="text-3xl font-bold text-white">{view === 'ADMIN' ? 'Merchant Audit' : 'On-Chain Activity'}</h2>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                        {view === 'ADMIN' ? 'Validate and fulfill pending smart contracts' : 'Immutable order history and tracking'}
                      </p>
                  </div>
                </header>

                <div className="space-y-6">
                  {(view === 'ADMIN' ? orders : orders.filter(o => o.userId === wallet)).map(order => (
                    <div key={order.id} className="bg-slate-900 rounded-3xl p-8 border border-slate-800 transition-all hover:bg-slate-900/80">
                      <div className="flex justify-between items-start mb-10 pb-6 border-b border-slate-800">
                          <div>
                              <div className="text-[9px] uppercase tracking-widest font-black text-slate-600 mb-2 font-mono">ID: {order.id.toUpperCase()}</div>
                              <h4 className="text-xl font-bold text-white">{restaurants.find(r => r.id === order.restaurantId)?.name}</h4>
                              <div className="text-emerald-400 font-mono text-sm mt-1">{order.totalPrice} ETH Locked</div>
                          </div>
                          {view === 'ADMIN' && (
                              <div className="flex gap-2">
                                  {Object.values(OrderStatus).filter(s => s !== order.status && s !== OrderStatus.CANCELLED).slice(0, 2).map(s => (
                                      <button 
                                        key={s}
                                        onClick={() => updateOrderStatus(order.id, s as OrderStatus)}
                                        className="text-[9px] font-black uppercase tracking-widest bg-slate-800 text-slate-400 hover:bg-emerald-500 hover:text-slate-950 px-4 py-2 rounded-lg transition-all border border-slate-700"
                                      >
                                          Set {s.replace(/_/g, ' ')}
                                      </button>
                                  ))}
                              </div>
                          )}
                      </div>
                      
                      <OrderTracker order={order} />
                      
                      {order.status === OrderStatus.DELIVERED && view === 'DASHBOARD' && (
                        <div className="mt-8 pt-8 border-t border-slate-800 flex justify-between items-center">
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map(s => <Star key={s} size={16} className="text-slate-800 cursor-pointer hover:text-emerald-500" />)}
                          </div>
                          <button className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-lg hover:bg-emerald-500 hover:text-slate-950 transition-all uppercase tracking-widest">
                            Attest Service Quality
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {view === 'DASHBOARD' && (
                    <div className="space-y-4 pt-8">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Asset Collection</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-indigo-500 to-emerald-600 p-6 rounded-3xl text-white overflow-hidden relative group">
                          <div className="relative z-10">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mb-4">
                              <Sparkles size={20} />
                            </div>
                            <h4 className="font-bold text-lg">Genesis #402</h4>
                            <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">First Order Badge</p>
                          </div>
                        </div>
                        <div className="bg-slate-900 p-6 rounded-3xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-700">
                          <Package size={24} className="mb-2" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Unlock More</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {((view === 'ADMIN' ? orders : orders.filter(o => o.userId === wallet)).length === 0) && (
                      <div className="text-center py-20 bg-slate-900 rounded-[32px] border border-slate-800 border-dashed">
                          <Package className="mx-auto text-slate-800 mb-4" size={40} />
                          <h3 className="font-bold text-slate-600 text-sm uppercase tracking-widest">No Active State Found</h3>
                      </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
=======
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Restaurants } from './pages/Restaurants';
import { RestaurantProfile } from './pages/RestaurantProfile';
import { Cart } from './pages/Cart';
import { OrderTracking } from './pages/OrderTracking';
import { VendorDashboard } from './pages/VendorDashboard';
import { OrderHistory } from './pages/OrderHistory';
import { Login } from './pages/Login';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/restaurants/:id" element={<RestaurantProfile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/track/:orderId" element={<OrderTracking />} />
            <Route path="/dashboard" element={<VendorDashboard />} />
            <Route path="/history" element={<OrderHistory />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-black/5 py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 text-center text-zinc-500 text-sm">
            <p>© 2024 ChainBite. Premium Food Delivery Platform.</p>
            <div className="mt-4 flex justify-center gap-6">
              <a href="#" className="hover:text-emerald-600">Privacy Policy</a>
              <a href="#" className="hover:text-emerald-600">Terms of Service</a>
              <a href="#" className="hover:text-emerald-600">Help Center</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
>>>>>>> 1ba813d9bbd7f8ddd70b7c10c23c0c70e64a64a6
  );
}
