import React from 'react';
import { Sprout, Store, Truck, Radio } from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';

export default function RoleSwitcher() {
  const { activeRole, setActiveRole, activeBooking, trucks } = useLogistics();
  const onlineTruckCount = trucks.filter((t) => t.isAvailable).length;

  const roles = [
    {
      id: 'ordinary',
      label: 'Ordinary (Farmer)',
      icon: Sprout,
      badge: activeBooking ? '1 Live Trip' : null,
    },
    {
      id: 'driver',
      label: 'Driver / Lender',
      icon: Truck,
      badge: `${onlineTruckCount} Online`,
    },
    {
      id: 'business',
      label: 'Business (Buyer)',
      icon: Store,
      badge: null,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950 shadow-sm">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold tracking-tight text-lg block leading-none">
              CARGA<span className="text-emerald-400">.</span>
            </span>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">
              Pitch Prototype
            </span>
          </div>
        </div>

        {/* Role Switcher Pills */}
        <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/70">
          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = activeRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{role.label}</span>
                <span className="sm:hidden">{role.label.split(' ')[0]}</span>
                {role.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-slate-950/20 text-slate-950'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {role.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Live System Status Indicator */}
        <div className="hidden md:flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-full">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>Live Sync Active</span>
        </div>
      </div>
    </header>
  );
}