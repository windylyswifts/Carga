import React from 'react';
import { LogisticsProvider, useLogistics } from './context/LogisticsContext';
import RoleSwitcher from './components/RoleSwitcher';
import OrdinaryDashboard from './components/OrdinaryDashboard';

function MainWorkspace() {
  const { activeRole } = useLogistics();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <RoleSwitcher />

      {activeRole === 'ordinary' && <OrdinaryDashboard />}

      {activeRole === 'driver' && (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-slate-800">Driver / Lender Interface</h2>
          <p className="text-slate-600 mt-2">
            Ready to build next: availability toggle, incoming farmer trip requests, and live GPS checkpoint controls.
          </p>
        </div>
      )}

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