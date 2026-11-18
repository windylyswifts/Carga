import React from 'react';
import {
  MapPin,
  Navigation,
  Phone,
  CheckCircle2,
  Truck,
  Package,
  Clock,
  FastForward,
  RotateCcw,
} from 'lucide-react';
import { useLogistics, TRIP_STAGES } from '../context/LogisticsContext';

export default function LiveTruckTracker() {
  const { activeBooking, advanceTripStage, completeAndClearBooking } = useLogistics();

  if (!activeBooking) return null;

  const {
    id,
    truck,
    pickup,
    destination,
    cropType,
    weightKg,
    estimatedKm,
    totalFare,
    stageIndex,
    liveProgress,
  } = activeBooking;

  const currentStage = TRIP_STAGES[stageIndex];
  const isDelivered = stageIndex === TRIP_STAGES.length - 1;
  const remainingMinutes = Math.max(
    0,
    Math.round(((100 - liveProgress) / 100) * (estimatedKm * 2.4))
  );

  // Calculate SVG path coordinates for the moving truck pin
  // Path curves from (80, 190) -> control (300, 40) -> (520, 160)
  const t = liveProgress / 100;
  const truckX = (1 - t) * (1 - t) * 80 + 2 * (1 - t) * t * 300 + t * t * 520;
  const truckY = (1 - t) * (1 - t) * 190 + 2 * (1 - t) * t * 40 + t * t * 160;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            {isDelivered ? 'TRIP COMPLETED' : 'LIVE GPS TRACKING'}
          </span>
          <span className="text-sm text-slate-400 font-mono">Booking #{id}</span>
        </div>

        {/* Pitch Demo Helper Button (Simulates Driver updating status) */}
        <div className="flex items-center gap-2">
          {!isDelivered ? (
            <button
              onClick={advanceTripStage}
              className="flex items-center gap-1.5 text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer"
              title="Simulate the driver advancing to the next checkpoint"
            >
              <FastForward className="w-3.5 h-3.5" />
              Simulate Next Checkpoint
            </button>
          ) : (
            <button
              onClick={completeAndClearBooking}
              className="flex items-center gap-1.5 text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Book Another Truck
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Interactive Route Visualizer (Left 2 Columns) */}
        <div className="lg:col-span-2 p-6 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Current Status
              </p>
              <h3 className="text-xl font-bold text-slate-900">{currentStage.label}</h3>
              <p className="text-sm text-slate-600">{currentStage.subtext}</p>
            </div>
            <div className="text-right bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Estimated Arrival</span>
              </div>
              <p className="text-lg font-bold text-slate-900">
                {isDelivered ? 'Arrived' : `${remainingMinutes} mins`}
              </p>
            </div>
          </div>

          {/* Stylized Topographic / Road Map Canvas */}
          <div className="relative w-full h-64 bg-[#eef3ef] rounded-xl border border-slate-200 overflow-hidden shadow-inner">
            <svg viewBox="0 0 600 240" className="w-full h-full">
              {/* Subtle Map Grid & River/Road Decoration */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="#dce5de"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="600" height="240" fill="url(#grid)" />

              {/* Decorative Secondary Roads */}
              <path
                d="M 0 110 Q 220 130 600 90"
                fill="none"
                stroke="#ffffff"
                strokeWidth="8"
              />
              <path
                d="M 240 0 L 290 240"
                fill="none"
                stroke="#ffffff"
                strokeWidth="6"
              />

              {/* Full Planned Route (Dashed Line) */}
              <path
                d="M 80 190 Q 300 40 520 160"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="5"
                strokeDasharray="8 6"
                strokeLinecap="round"
              />

              {/* Active Traveled Route Highlight */}
              <path
                d="M 80 190 Q 300 40 520 160"
                fill="none"
                stroke="#10b981"
                strokeWidth="5"
                strokeLinecap="round"
                pathLength="100"
                strokeDasharray={`${liveProgress} 100`}
              />

              {/* Origin Pin (Farm) */}
              <g transform="translate(80, 190)">
                <circle r="10" fill="#0f172a" />
                <circle r="4" fill="#10b981" />
                <rect x="-45" y="14" width="90" height="20" rx="4" fill="#0f172a" />
                <text
                  x="0"
                  y="27"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="600"
                >
                  FARM PICKUP
                </text>
              </g>

              {/* Destination Pin (Market / Drop-off) */}
              <g transform="translate(520, 160)">
                <circle r="10" fill="#dc2626" />
                <circle r="4" fill="#ffffff" />
                <rect x="-50" y="14" width="100" height="20" rx="4" fill="#dc2626" />
                <text
                  x="0"
                  y="27"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="600"
                >
                  DESTINATION
                </text>
              </g>

              {/* Moving Truck Marker */}
              <g transform={`translate(${truckX}, ${truckY})`}>
                <circle r="18" fill="#10b981" fillOpacity="0.25" />
                <circle r="12" fill="#059669" stroke="#ffffff" strokeWidth="2.5" />
                <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="11">
                  🚚
                </text>
              </g>
            </svg>

            {/* Route Endpoints Overlay Pill */}
            <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-xs px-3.5 py-2 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 truncate max-w-[44%]">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-medium text-slate-800 truncate">{pickup}</span>
              </div>
              <Navigation className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <div className="flex items-center gap-1.5 truncate max-w-[44%]">
                <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span className="font-medium text-slate-800 truncate">{destination}</span>
              </div>
            </div>
          </div>

          {/* 5-Stage Progress Stepper */}
          <div className="mt-5 grid grid-cols-5 gap-2">
            {TRIP_STAGES.map((stage, idx) => {
              const completed = idx <= stageIndex;
              const current = idx === stageIndex;
              return (
                <div key={stage.id} className="flex flex-col">
                  <div
                    className={`h-2 rounded-full mb-1.5 transition-all ${
                      completed ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                  <span
                    className={`text-[11px] leading-tight font-medium ${
                      current
                        ? 'text-emerald-700 font-bold'
                        : completed
                        ? 'text-slate-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Driver & Cargo Details Sidebar (Right Column) */}
        <div className="p-6 flex flex-col justify-between bg-white">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Assigned Vehicle & Driver
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-slate-900 text-base">{truck.driverName}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{truck.vehicleModel}</p>
                </div>
                <span className="px-2 py-1 bg-slate-900 text-white text-xs font-mono font-bold rounded">
                  {truck.plateNumber}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">Contact Driver</span>
                <a
                  href={`tel:${truck.phone}`}
                  className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {truck.phone}
                </a>
              </div>
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Cargo Manifest
            </h4>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-slate-400" /> Crop / Produce
                </span>
                <span className="font-semibold text-slate-900">{cropType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-slate-400" /> Load Weight
                </span>
                <span className="font-semibold text-slate-900">{weightKg} kg</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Est. Distance</span>
                <span className="font-semibold text-slate-900">{estimatedKm} km</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-slate-600">Agreed Point-to-Point Fare</span>
              <span className="text-xl font-extrabold text-emerald-700">
                ₱{totalFare.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Direct farmer-to-driver rate (0% middleman fee)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}