import React from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Coins, ArrowRight, Star, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6">
              <Zap className="w-3 h-3" />
              Premium Food Delivery
            </div>
            <h1 className="text-6xl md:text-7xl font-bold tracking-tighter leading-[0.9] mb-6">
              Your Favorite <span className="text-emerald-600">Indian Flavors</span>, Delivered Fast.
            </h1>
            <p className="text-lg text-zinc-600 mb-8 max-w-lg">
              From Hyderabadi Biryani to Masala Dosa, get the best of Indian cuisine delivered with full transparency and zero hidden fees.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/restaurants" className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 group">
                Browse Restaurants
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="mt-12 flex items-center gap-8 grayscale opacity-50">
              <div className="flex items-center gap-2 font-bold text-sm"><Shield className="w-4 h-4" /> Verified</div>
              <div className="flex items-center gap-2 font-bold text-sm"><Star className="w-4 h-4" /> Top Rated</div>
              <div className="flex items-center gap-2 font-bold text-sm"><CheckCircle2 className="w-4 h-4" /> 10k+ Orders</div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://picsum.photos/seed/indian-thali/1000/1000" 
                alt="Indian Thali" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-black/5">
              <div className="text-xs text-zinc-500 font-bold uppercase mb-1">Total Orders Delivered</div>
              <div className="text-2xl font-bold text-emerald-600">50,000+</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why ChainBite */}
      <section className="bg-zinc-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why ChainBite India?</h2>
            <p className="text-zinc-400">The most trusted way to order your favorite Indian meals.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Authentic Sourcing", desc: "Every spice and ingredient is tracked from Indian farms to your plate." },
              { step: "02", title: "Zero Hidden Fees", desc: "No surge pricing or hidden convenience fees. What you see is what you pay." },
              { step: "03", title: "Instant Rewards", desc: "Earn loyalty points on every Biryani or Thali. Redeem for massive discounts." }
            ].map((item, i) => (
              <div key={i} className="relative p-8 rounded-3xl bg-zinc-800 border border-zinc-700">
                <div className="text-6xl font-black text-emerald-600/20 absolute top-4 right-4">{item.step}</div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">Popular Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: 'Biryani', img: 'biryani-1' },
            { name: 'Dosa', img: 'dosa-1' },
            { name: 'Thali', img: 'thali' },
            { name: 'Curry', img: 'curry-1' },
            { name: 'Mithai', img: 'mithai' },
            { name: 'Chai', img: 'chai' },
          ].map((cat) => (
            <div key={cat.name} className="group cursor-pointer">
              <div className="aspect-square rounded-2xl overflow-hidden mb-2 bg-zinc-100">
                <img 
                  src={`https://picsum.photos/seed/${cat.img}/300/300`} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-center font-bold text-sm">{cat.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold mb-2">Trending Now</h2>
            <p className="text-zinc-500">Top rated by the community DAO.</p>
          </div>
          <Link to="/restaurants" className="text-emerald-600 font-bold flex items-center gap-1 hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Royal Biryani House", cuisine: "Biryani, North Indian", img: "biryani" },
            { name: "South Indian Delights", cuisine: "South Indian", img: "dosa" },
            { name: "Punjab Grill", cuisine: "North Indian, Punjabi", img: "punjab" }
          ].map((res, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-4 relative">
                <img 
                  src={`https://picsum.photos/seed/${res.img}/800/600`} 
                  alt={res.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> 4.9
                </div>
              </div>
              <h3 className="text-xl font-bold mb-1">{res.name}</h3>
              <p className="text-zinc-500 text-sm mb-2">{res.cuisine} • 20-30 min • Verified</p>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Accepts ETH</span>
                <span className="px-2 py-0.5 bg-zinc-100 text-zinc-700 text-[10px] font-bold rounded uppercase">Farm-to-Table</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Dishes */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">Trending Dishes</h2>
        <div className="flex overflow-x-auto gap-6 pb-8 scrollbar-hide">
          {[
            { name: 'Butter Chicken', price: '₹450', img: 'butter-chicken' },
            { name: 'Chicken Biryani', price: '₹350', img: 'biryani-1' },
            { name: 'Masala Dosa', price: '₹120', img: 'dosa-1' },
            { name: 'Paneer Tikka', price: '₹250', img: 'paneer-tikka' },
            { name: 'Dal Makhani', price: '₹280', img: 'dal-makhani' },
            { name: 'Gulab Jamun', price: '₹100', img: 'mithai' },
          ].map((dish) => (
            <div key={dish.name} className="flex-shrink-0 w-48 group cursor-pointer">
              <div className="aspect-square rounded-3xl overflow-hidden mb-3 relative">
                <img 
                  src={`https://picsum.photos/seed/${dish.img}/400/400`} 
                  alt={dish.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold">
                  {dish.price}
                </div>
              </div>
              <div className="font-bold text-sm truncate">{dish.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-20 border-y border-black/5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold mb-1">99.9%</div>
            <div className="text-xs text-zinc-500 font-bold uppercase">Uptime</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">0.01%</div>
            <div className="text-xs text-zinc-500 font-bold uppercase">Dispute Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">$2.4M</div>
            <div className="text-xs text-zinc-500 font-bold uppercase">Volume</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">100%</div>
            <div className="text-xs text-zinc-500 font-bold uppercase">Transparency</div>
          </div>
        </div>
      </section>
    </div>
  );
};
