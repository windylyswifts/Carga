import React from 'react';
import { LogisticsProvider, useLogistics } from './context/LogisticsContext';
import RoleSwitcher from './components/RoleSwitcher';
import OrdinaryDashboard from './components/OrdinaryDashboard';
import DriverDashboard from './components/DriverDashboard';
import BusinessDashboard from './components/BusinessDashboard';

function MainWorkspace() {
  const { activeRole } = useLogistics();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <RoleSwitcher />

      {activeRole === 'ordinary' && <OrdinaryDashboard />}
      {activeRole === 'driver' && <DriverDashboard />}
      {activeRole === 'business' && <BusinessDashboard />}
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