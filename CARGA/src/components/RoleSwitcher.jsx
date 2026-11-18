import React from 'react';
import { Sprout, Truck, Globe } from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { LANGUAGES } from '../utils/translations';

export default function RoleSwitcher() {
  const { language, setLanguage, t, activeRole, setActiveRole, activeBooking, trucks } =
    useLogistics();

  const onlineTruckCount = trucks.filter((tr) => tr.isAvailable).length;

  const roles = [
    {
      id: 'ordinary',
      label: t('roleOrdinary'),
      icon: Sprout,
      badge: activeBooking ? t('badgeLiveTrip') : null,
    },
    {
      id: 'driver',
      label: t('roleDriver'),
      icon: Truck,
      badge: t('badgeOnline', { count: onlineTruckCount }),
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
        {/* Brand Identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950 shadow-sm">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold tracking-tight text-lg block leading-none">
              AgriHaul<span className="text-emerald-400">.</span>
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">
              {t('prototypeTag')}
            </span>
          </div>
        </div>

        {/* Role Switcher Pills */}
        <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/70 order-3 sm:order-2 w-full sm:w-auto justify-between sm:justify-start">
          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = activeRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{role.label}</span>
                {role.badge && (
                  <span
                    className={`hidden md:inline-block text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
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

        {/* Language Switcher: EN | TAG | CEB */}
        <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 p-1 rounded-xl order-2 sm:order-3">
          <Globe className="w-3.5 h-3.5 text-emerald-400 ml-1.5 shrink-0" />
          {LANGUAGES.map((lang) => {
            const active = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                title={lang.fullName}
                className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                  active
                    ? 'bg-white text-slate-950 shadow-2xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {lang.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}