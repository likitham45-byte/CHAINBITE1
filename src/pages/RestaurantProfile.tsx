import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Info, Clock, Star, Plus, Minus, ShoppingBag, QrCode } from 'lucide-react';
import { useCartStore } from '../store';
import { motion } from 'motion/react';

export const RestaurantProfile = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const { addItem, decrementItem, items, totalFiat } = useCartStore();

  useEffect(() => {
    const loadRestaurant = async (retries = 3) => {
      try {
        const res = await fetch(`/api/restaurants/${id}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setRestaurant(data);
        setLoading(false);
      } catch (err) {
        if (retries > 0) {
          setTimeout(() => loadRestaurant(retries - 1), 1000);
        } else {
          console.error(err);
          setLoading(false);
        }
      }
    };
    loadRestaurant();
  }, [id]);

  if (loading) return <div className="p-20 text-center">Loading menu...</div>;
  if (!restaurant) return <div className="p-20 text-center text-red-600 font-bold">Failed to load restaurant. Please try again later.</div>;

  const categories = ['All', ...new Set(restaurant.menu.map((item: any) => item.category))];
  const filteredMenu = activeCategory === 'All' 
    ? restaurant.menu 
    : restaurant.menu.filter((item: any) => item.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="relative h-80 rounded-3xl overflow-hidden mb-12">
        <img 
          src={restaurant.image_url} 
          alt={restaurant.name} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
          <div className="text-white">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-4xl font-bold">{restaurant.name}</h1>
              {restaurant.is_verified && <ShieldCheck className="text-emerald-400 w-6 h-6" />}
            </div>
            <div className="flex items-center gap-6 text-sm font-medium text-zinc-300">
              <div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> {restaurant.rating}</div>
              <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {restaurant.delivery_time}</div>
              <div className="flex items-center gap-1"><Info className="w-4 h-4" /> Hygiene: {restaurant.hygiene_score}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Menu */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Menu</h2>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                {categories.map((cat: any) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      activeCategory === cat 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {filteredMenu.map((item: any) => (
                <motion.div 
                  key={item.id}
                  whileHover={{ y: -4 }}
                  className="bg-white p-4 rounded-2xl border border-black/5 flex gap-4"
                >
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold">{item.name}</h3>
                      <div className="flex items-center gap-2">
                        {items.find(i => i.id === item.id) ? (
                          <div className="flex items-center bg-emerald-600 text-white rounded-lg overflow-hidden">
                            <button 
                              onClick={() => decrementItem(item.id)}
                              className="p-1.5 hover:bg-emerald-700 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold">{items.find(i => i.id === item.id)?.quantity}</span>
                            <button 
                              onClick={() => addItem(item, restaurant.id)}
                              className="p-1.5 hover:bg-emerald-700 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => addItem(item, restaurant.id)}
                            className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-500 mb-2 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold">${item.price_fiat}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="bg-zinc-100 p-8 rounded-3xl">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <h2 className="text-xl font-bold">Quality Assurance</h2>
            </div>
            <p className="text-sm text-zinc-600 mb-6">
              We verify the source of every ingredient. 
              All our partner restaurants adhere to strict hygiene and quality standards.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-black/5">
                <div className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Ingredient Traceability</div>
                <div className="text-sm font-medium">100% Organic Verified</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-black/5">
                <div className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Supply Chain</div>
                <div className="text-sm font-medium">Farm-to-Table Tracked</div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Cart Summary (Realistic Ordering) */}
          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm sticky top-24">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              Your Cart
            </h3>
            {items.length > 0 ? (
              <div className="space-y-4">
                <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex-1">
                        <div className="font-bold">{item.name}</div>
                        <div className="text-xs text-zinc-500">x{item.quantity}</div>
                      </div>
                      <div className="font-bold">${(item.price_fiat * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-black/5">
                  <div className="flex justify-between font-bold mb-4">
                    <span>Subtotal</span>
                    <span>${totalFiat().toFixed(2)}</span>
                  </div>
                  <Link 
                    to="/cart"
                    className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all"
                  >
                    Checkout Order
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingBag className="w-10 h-10 text-zinc-200 mx-auto mb-2" />
                <p className="text-sm text-zinc-400">Your cart is empty</p>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-3xl border border-black/5">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Service Terms
            </h3>
            <ul className="space-y-4 text-sm text-zinc-600">
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <span>Secure payment processing via trusted gateways.</span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <span>Refund guarantee if delivery exceeds 60 minutes.</span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <span>Verified reviews from real customers.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
