import React from 'react';
import { Sprout, Truck, Globe } from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { LANGUAGES } from '../utils/translations';
import CargaLogo from './CargaLogo';

export default function RoleSwitcher() {
  const {
    language,
    setLanguage,
    t,
    activeRole,
    setActiveRole,
    navigateToFarmerHome,
    activeBooking,
    trucks,
  } = useLogistics();

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
        {/* Clickable Blended CARGA Logo -> Redirects to Farmer Home */}
        <button
          type="button"
          onClick={navigateToFarmerHome}
          title="Go to Home"
          aria-label="CARGA — Go to Home"
          className="rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 hover:opacity-90 active:scale-[0.98] transition-all duration-150 cursor-pointer"
        >
          <CargaLogo variant="navbar-blended" />
        </button>

        {/* Role Switcher Pills */}
        <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/70 order-3 sm:order-2 w-full sm:w-auto justify-between sm:justify-start">
          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = activeRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold scale-[1.01]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{role.label}</span>
                {role.badge && (
                  <span
                    className={`hidden md:inline-block text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-colors duration-200 ${
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
                className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all duration-150 cursor-pointer ${
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