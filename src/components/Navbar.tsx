import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { useCartStore, useAuthStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { items } = useCartStore();
  const location = useLocation();

  const navLinks = [
    { name: 'Restaurants', href: '/restaurants' },
    { name: 'Order History', href: '/history' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-bottom border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-2xl font-bold tracking-tighter text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="w-8 h-8" />
              <span>ChainBite</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
                  location.pathname === link.href ? 'text-emerald-600' : 'text-zinc-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/login"
              className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
                location.pathname === '/login' ? 'text-emerald-600' : 'text-zinc-600'
              }`}
            >
              Login
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/cart" className="relative p-2 text-zinc-600 hover:text-emerald-600 transition-colors">
              <motion.div
                key={items.length}
                animate={items.length > 0 ? { scale: [1, 1.2, 1] } : {}}
              >
                <ShoppingCart className="w-6 h-6" />
              </motion.div>
              {items.length > 0 && (
                <span className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {items.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </Link>
            
            <Link to="/dashboard" className="p-2 text-zinc-600 hover:text-emerald-600 transition-colors">
              <LayoutDashboard className="w-6 h-6" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/cart" className="relative p-2 text-zinc-600">
              <ShoppingCart className="w-6 h-6" />
              {items.length > 0 && (
                <span className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {items.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-zinc-600 hover:text-emerald-600 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-black/5"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-zinc-600 hover:text-emerald-600 hover:bg-zinc-50 rounded-lg"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-100 rounded-xl text-sm font-medium text-zinc-700"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Vendor Dashboard
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
