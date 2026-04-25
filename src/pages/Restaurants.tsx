import React, { useEffect, useState } from 'react';
import { Search, Filter, Star, ShieldCheck, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export const Restaurants = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadRestaurants = async (retries = 3) => {
      console.log(`Fetching restaurants... (retries left: ${retries})`);
      try {
        const res = await fetch('/api/restaurants');
        console.log('Fetch response status:', res.status);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();
        console.log('Fetched restaurants data:', data);
        setRestaurants(data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        if (retries > 0) {
          setTimeout(() => loadRestaurants(retries - 1), 1000);
        } else {
          setLoading(false);
        }
      }
    };
    loadRestaurants();
  }, []);

  const filtered = restaurants.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter === 'all' || r.cuisine.toLowerCase().includes(filter.toLowerCase()))
  );

  if (loading) return <div className="p-20 text-center">Loading verified restaurants...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Verified Restaurants</h1>
          <p className="text-zinc-500">Every restaurant on ChainBite is hand-picked for quality.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search cuisine or name..."
              className="pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-full sm:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2 bg-white border border-zinc-200 rounded-xl focus:outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Cuisines</option>
            <option value="biryani">Biryani</option>
            <option value="north indian">North Indian</option>
            <option value="south indian">South Indian</option>
            <option value="mughlai">Mughlai</option>
            <option value="chinese">Chinese</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link to={`/restaurants/${r.id}`} className="group block bg-white rounded-3xl overflow-hidden border border-black/5 hover:shadow-xl transition-all">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={r.image_url} 
                  alt={r.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {r.is_verified && (
                    <div className="px-2 py-1 bg-white/90 backdrop-blur rounded-lg text-[10px] font-bold flex items-center gap-1 text-emerald-600">
                      <ShieldCheck className="w-3 h-3" /> VERIFIED
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{r.name}</h3>
                  <div className="flex items-center gap-1 text-sm font-bold">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    {r.rating}
                  </div>
                </div>
                <p className="text-sm text-zinc-500 mb-4">{r.cuisine} • {r.delivery_time} • {r.price_range}</p>
                <div className="flex items-center justify-between pt-4 border-t border-black/5">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Hygiene Score: {r.hygiene_score}</div>
                  <div className="text-emerald-600 text-sm font-bold">View Menu →</div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
