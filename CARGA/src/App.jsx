import React from 'react';
import { LogisticsProvider, useLogistics } from './context/LogisticsContext';
import RoleSwitcher from './components/RoleSwitcher';
import OrdinaryDashboard from './components/OrdinaryDashboard';
import DriverDashboard from './components/DriverDashboard';
import SplashLoader from './components/SplashLoader';

function MainWorkspace() {
  const { activeRole } = useLogistics();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <SplashLoader />
      <RoleSwitcher />
      <main
        key={activeRole}
        className={`flex-1 animate-fade-slide ${
          activeRole === 'ordinary' ? 'pb-24' : 'pb-12'
        }`}
      >
        {activeRole === 'ordinary' ? <OrdinaryDashboard /> : <DriverDashboard />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <LogisticsProvider>
      <MainWorkspace />
    </LogisticsProvider>
  );
}