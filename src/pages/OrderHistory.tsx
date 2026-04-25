import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { History, ExternalLink, ShieldCheck, Download, Star } from 'lucide-react';
import { useAuthStore } from '../store';

export const OrderHistory = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/user/1`) // Mock user ID 1
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-20 text-center">Loading your on-chain history...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Order History</h1>
          <p className="text-zinc-500">All receipts are stored on IPFS and verified on-chain.</p>
        </div>
        <button className="px-6 py-3 bg-zinc-900 text-white rounded-2xl font-bold flex items-center gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-black/5 overflow-hidden hover:shadow-md transition-all"
          >
            <div className="p-8">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{order.restaurant_name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-sm text-zinc-500 mb-4">
                    Ordered on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-1 text-xs font-bold text-zinc-400">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      TX: {order.tx_hash ? `${order.tx_hash.slice(0, 10)}...` : 'N/A'}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-zinc-400">
                      <ExternalLink className="w-3 h-3" />
                      IPFS: QmX...8z
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:items-end justify-between">
                  <div className="text-right">
                    <div className="text-2xl font-bold">${order.total_fiat}</div>
                    <div className="text-xs font-bold text-emerald-600">{order.total_crypto} ETH</div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button className="px-4 py-2 bg-zinc-100 text-zinc-900 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-colors">
                      Reorder
                    </button>
                    {order.status === 'delivered' && (
                      <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1">
                        <Star className="w-3 h-3" /> Rate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
