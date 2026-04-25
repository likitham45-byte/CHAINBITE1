import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  Settings, 
  Plus, 
  ShieldCheck, 
  Coins, 
  ArrowUpRight,
  Package
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const data = [
  { name: 'Mon', revenue: 4000, orders: 24 },
  { name: 'Tue', revenue: 3000, orders: 18 },
  { name: 'Wed', revenue: 2000, orders: 12 },
  { name: 'Thu', revenue: 2780, orders: 20 },
  { name: 'Fri', revenue: 1890, orders: 15 },
  { name: 'Sat', revenue: 2390, orders: 22 },
  { name: 'Sun', revenue: 3490, orders: 28 },
];

export const VendorDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Restaurant Dashboard</h1>
          <p className="text-zinc-500">Manage your kitchen and track revenue in real-time.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-white border border-zinc-200 rounded-2xl font-bold flex items-center gap-2">
            <Settings className="w-4 h-4" /> Settings
          </button>
          <button className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Revenue', value: '$12,450', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { label: 'Active Orders', value: '12', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Avg Rating', value: '4.9', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
          { label: 'Quality Score', value: '98', icon: ShieldCheck, color: 'text-zinc-900', bg: 'bg-zinc-100' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-black/5">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-zinc-400 uppercase mb-1">{stat.label}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-black/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-lg">Revenue Analytics</h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-black/5 overflow-hidden">
          <div className="p-6 border-b border-black/5 flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              Incoming Orders
            </h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">LIVE</span>
          </div>
          <div className="divide-y divide-black/5">
            {[
              { id: '#4821', items: '2x Signature Dish', total: '$45.00', status: 'Preparing' },
              { id: '#4820', items: '1x Burger Combo', total: '$18.50', status: 'New' },
              { id: '#4819', items: '3x Sushi Platter', total: '$62.00', status: 'Preparing' },
              { id: '#4818', items: '1x Pizza Large', total: '$24.00', status: 'New' },
            ].map((order, i) => (
              <div key={i} className="p-6 hover:bg-zinc-50 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <div className="font-bold">{order.id}</div>
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    order.status === 'New' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status}
                  </div>
                </div>
                <div className="text-xs text-zinc-500 mb-3">{order.items}</div>
                <div className="flex justify-between items-center">
                  <div className="text-sm font-bold text-emerald-600">{order.total}</div>
                  <button className="p-1.5 bg-zinc-900 text-white rounded-lg">
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-4 bg-zinc-50 text-zinc-600 text-sm font-bold hover:bg-zinc-100 transition-colors">
            View All Orders
          </button>
        </div>
      </div>
    </div>
  );
};
