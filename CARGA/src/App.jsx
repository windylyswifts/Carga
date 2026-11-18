import React from 'react';
import { LogisticsProvider, useLogistics } from './context/LogisticsContext';
import RoleSwitcher from './components/RoleSwitcher';
import OrdinaryDashboard from './components/OrdinaryDashboard';
import DriverDashboard from './components/DriverDashboard';

function MainWorkspace() {
  const { activeRole } = useLogistics();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <RoleSwitcher />

      {activeRole === 'ordinary' && <OrdinaryDashboard />}
      {activeRole === 'driver' && <DriverDashboard />}

      {activeRole === 'business' && (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-slate-800">Business Interface</h2>
          <p className="text-slate-600 mt-2">
            Ready to build next: live feed of available farm harvests and direct procurement requests.
          </p>
        </div>
      )}
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