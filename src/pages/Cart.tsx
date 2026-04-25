import React, { useState } from 'react';
import { useCartStore } from '../store';
import { Trash2, Plus, Minus, CreditCard, ArrowRight, ShieldCheck, Info, MapPin, Smartphone, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Cart = () => {
  const { items, addItem, decrementItem, removeItem, clearCart, totalFiat, restaurantId } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'phonepay' | 'gpay'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          total_fiat: totalFiat(),
          payment_method: paymentMethod,
        })
      });
      const data = await res.json();
      clearCart();
      navigate(`/track/${data.orderId}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-32 text-center">
        <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-zinc-400" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-zinc-500 mb-8">Add some delicious food from our verified restaurants.</p>
        <button onClick={() => navigate('/restaurants')} className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold">
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-12">Checkout</h1>
      
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Items List */}
          <div className="bg-white rounded-3xl border border-black/5 overflow-hidden">
            <div className="p-6 border-b border-black/5 flex justify-between items-center">
              <h2 className="font-bold">Order Summary</h2>
              <button onClick={clearCart} className="text-xs font-bold text-red-500 hover:underline">Clear All</button>
            </div>
            <div className="divide-y divide-black/5">
              {items.map((item) => (
                <div key={item.id} className="p-6 flex items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold">{item.name}</h3>
                    <div className="text-sm text-zinc-500">${item.price_fiat}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => decrementItem(item.id)} className="p-1.5 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors">
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="font-bold w-8 text-center">{item.quantity}</div>
                    <button onClick={() => addItem(item, restaurantId!)} className="p-1.5 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                    <button onClick={() => removeItem(item.id)} className="ml-2 p-1 text-zinc-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Address Selection (Realistic Ordering) */}
          <div className="bg-white rounded-3xl border border-black/5 p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-emerald-600" />
              Delivery Address
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border-2 border-emerald-600 bg-emerald-50 cursor-pointer">
                <div className="font-bold text-sm mb-1">Home</div>
                <div className="text-xs text-zinc-500">123, Food Street, Green Park, Bangalore</div>
              </div>
              <div className="p-4 rounded-2xl border-2 border-zinc-100 hover:border-zinc-200 cursor-pointer">
                <div className="font-bold text-sm mb-1">Office</div>
                <div className="text-xs text-zinc-500">456, Tech Plaza, IT Hub, Mumbai</div>
              </div>
            </div>
            <button className="mt-4 text-emerald-600 text-sm font-bold hover:underline">+ Add New Address</button>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-3xl border border-black/5 p-8">
            <h2 className="text-xl font-bold mb-6">Select Payment Method</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <button 
                onClick={() => setPaymentMethod('card')}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${
                  paymentMethod === 'card' ? 'border-emerald-600 bg-emerald-50' : 'border-zinc-100 hover:border-zinc-200'
                }`}
              >
                <CreditCard className={`w-6 h-6 mb-4 ${paymentMethod === 'card' ? 'text-emerald-600' : 'text-zinc-400'}`} />
                <div className="font-bold">Credit / Debit Card</div>
                <div className="text-xs text-zinc-500">Visa, Mastercard, RuPay</div>
              </button>
              <button 
                onClick={() => setPaymentMethod('upi')}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${
                  paymentMethod === 'upi' ? 'border-emerald-600 bg-emerald-50' : 'border-zinc-100 hover:border-zinc-200'
                }`}
              >
                <Smartphone className={`w-6 h-6 mb-4 ${paymentMethod === 'upi' ? 'text-emerald-600' : 'text-zinc-400'}`} />
                <div className="font-bold">UPI ID</div>
                <div className="text-xs text-zinc-500">Pay using any UPI app</div>
              </button>
              <button 
                onClick={() => setPaymentMethod('phonepay')}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${
                  paymentMethod === 'phonepay' ? 'border-emerald-600 bg-emerald-50' : 'border-zinc-100 hover:border-zinc-200'
                }`}
              >
                <img src="https://img.icons8.com/color/48/phone-pe.png" className="w-6 h-6 mb-4" alt="PhonePe" />
                <div className="font-bold">PhonePe</div>
                <div className="text-xs text-zinc-500">Direct wallet payment</div>
              </button>
              <button 
                onClick={() => setPaymentMethod('gpay')}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${
                  paymentMethod === 'gpay' ? 'border-emerald-600 bg-emerald-50' : 'border-zinc-100 hover:border-zinc-200'
                }`}
              >
                <img src="https://img.icons8.com/color/48/google-pay.png" className="w-6 h-6 mb-4" alt="GPay" />
                <div className="font-bold">Google Pay</div>
                <div className="text-xs text-zinc-500">Fast and secure</div>
              </button>
            </div>
          </div>
        </div>

        {/* Totals */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-black/5 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Total</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal</span>
                <span>${totalFiat().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Delivery Fee</span>
                <span>$2.50</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Platform Fee</span>
                <span>$0.99</span>
              </div>
              <div className="pt-4 border-t border-black/5">
                <div className="text-xs font-bold text-zinc-400 uppercase">Grand Total</div>
                <div className="text-3xl font-bold">${(totalFiat() + 3.49).toFixed(2)}</div>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isProcessing ? 'Processing Payment...' : 'Pay & Place Order'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="mt-6 flex items-start gap-3 p-4 bg-emerald-50 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5" />
              <p className="text-[10px] text-emerald-800 leading-relaxed">
                Your payment is secure with our 256-bit encrypted payment gateway. 
                We guarantee 100% safe transactions and easy refunds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
