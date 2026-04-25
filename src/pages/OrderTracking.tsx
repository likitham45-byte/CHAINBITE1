import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Package, Bike, CheckCircle2, ShieldCheck, Clock, ExternalLink } from 'lucide-react';
import { useSocket } from '../hooks/useSocket';

export const OrderTracking = () => {
  const { orderId } = useParams();
  const socket = useSocket();
  const [status, setStatus] = useState<string>('placed');
  const [location, setLocation] = useState({ lat: 40.7128, lng: -74.0060 });
  const [milestones, setMilestones] = useState<any[]>([]);

  useEffect(() => {
    if (!socket || !orderId) return;

    socket.emit('track_order', orderId);

    socket.on(`order_status_${orderId}`, (data) => {
      setStatus(data.status);
      setLocation({ lat: data.lat, lng: data.lng });
      setMilestones(prev => [...prev, { status: data.status, time: data.timestamp }]);
    });

    return () => {
      socket.off(`order_status_${orderId}`);
    };
  }, [socket, orderId]);

  const steps = [
    { id: 'placed', label: 'Order Placed', icon: Package, desc: 'Logged on-chain at block #48291' },
    { id: 'preparing', label: 'Preparing', icon: Clock, desc: 'Restaurant confirmed ingredients' },
    { id: 'picked_up', label: 'Picked Up', icon: Bike, desc: 'Agent 0x72...a1 picked up order' },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle2, desc: 'Smart contract escrow released' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === status);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tracking Order #{orderId}</h1>
          <p className="text-zinc-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Blockchain-verified delivery milestones
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-zinc-400 uppercase mb-1">Estimated Delivery</div>
          <div className="text-xl font-bold">12:45 PM</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Progress */}
        <div className="md:col-span-1 space-y-8">
          {steps.map((step, i) => {
            const isCompleted = i <= currentStepIndex;
            const isCurrent = i === currentStepIndex;
            const Icon = step.icon;

            return (
              <div key={step.id} className="relative flex gap-4">
                {i < steps.length - 1 && (
                  <div className={`absolute left-5 top-10 w-0.5 h-12 ${isCompleted ? 'bg-emerald-500' : 'bg-zinc-200'}`} />
                )}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                  isCompleted ? 'bg-emerald-600 text-white' : 'bg-zinc-100 text-zinc-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-bold ${isCompleted ? 'text-zinc-900' : 'text-zinc-400'}`}>{step.label}</h3>
                  <p className="text-xs text-zinc-500">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Map Simulation */}
        <div className="md:col-span-2 space-y-6">
          <div className="aspect-video bg-zinc-200 rounded-3xl relative overflow-hidden border border-black/5">
            <div className="absolute inset-0 flex items-center justify-center text-zinc-400 font-medium">
              {/* This would be a real map in a production app */}
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto mb-2 text-emerald-600 animate-bounce" />
                <p>Live GPS Tracking Active</p>
                <p className="text-xs">Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</p>
              </div>
            </div>
            {/* Simulation overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-4 rounded-2xl border border-black/5 flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Bike className="text-emerald-600 w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-zinc-400 uppercase">Delivery Agent</div>
                <div className="font-bold">CryptoRider #421</div>
              </div>
              <button className="px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-xl">Message</button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-black/5">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-emerald-600" />
              On-Chain Activity
            </h3>
            <div className="space-y-3">
              {milestones.map((m, i) => (
                <div key={i} className="flex justify-between items-center text-xs py-2 border-b border-zinc-50 last:border-0">
                  <span className="font-mono text-zinc-400">0x{Math.random().toString(16).slice(2, 10)}...</span>
                  <span className="font-bold uppercase text-emerald-600">{m.status.replace('_', ' ')}</span>
                  <span className="text-zinc-500">{new Date(m.time).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
