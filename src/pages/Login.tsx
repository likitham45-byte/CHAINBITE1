import React from 'react';
import { motion } from 'motion/react';
import { Wallet, Mail, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { useAuthStore } from '../store';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const { setWallet } = useAuthStore();
  const navigate = useNavigate();

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWallet(accounts[0]);
        navigate('/');
      } catch (error) {
        console.error("User denied account access");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-10 rounded-[2.5rem] border border-black/5 shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
          <p className="text-zinc-500">Secure entry to the ChainBite protocol.</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={connectWallet}
            className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all group"
          >
            <Wallet className="w-5 h-5" />
            Connect Wallet
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform opacity-50" />
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase font-bold text-zinc-400">
              <span className="bg-white px-4">Or continue with</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="email" 
                placeholder="Email address"
                className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="password" 
                placeholder="Password"
                className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all">
              Sign In
            </button>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-zinc-50 text-center">
          <p className="text-sm text-zinc-500">
            New to ChainBite? <a href="#" className="text-emerald-600 font-bold hover:underline">Create Account</a>
          </p>
          <div className="mt-4 flex justify-center gap-4 grayscale opacity-50">
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Logo.svg" alt="MetaMask" className="h-5" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c2/Coinbase_Logo.svg" alt="Coinbase" className="h-5" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
