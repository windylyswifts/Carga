import React from 'react';
import {
  MapPin,
  Navigation,
  Phone,
  CheckCircle2,
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
    truck,
    pickup,
    destination,
    cropType,
    weightKg,
    estimatedMinutes,
    totalFare,
    stageIndex,
    liveProgress,
  } = activeBooking;

  const currentStage = TRIP_STAGES[stageIndex];
  const isDelivered = stageIndex === TRIP_STAGES.length - 1;
  const remainingMinutes = Math.max(
    0,
    Math.round(((100 - liveProgress) / 100) * estimatedMinutes)
  );

  // Quadratic Bezier curve coordinates for moving truck pin
  const t = liveProgress / 100;
  const truckX = (1 - t) * (1 - t) * 80 + 2 * (1 - t) * t * 300 + t * t * 520;
  const truckY = (1 - t) * (1 - t) * 190 + 2 * (1 - t) * t * 40 + t * t * 160;

  return (
    <div className="bg-white rounded-2xl border-2 border-emerald-500 shadow-md overflow-hidden">
      {/* Top Status Banner */}
      <div className="bg-slate-900 text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            {isDelivered ? 'DELIVERED' : 'LIVE TRUCK MAP'}
          </span>
        </div>

        {/* Pitch Demo Helper Button */}
        <div>
          {!isDelivered ? (
            <button
              onClick={advanceTripStage}
              className="flex items-center gap-1.5 text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-3.5 py-2 rounded-xl transition cursor-pointer"
            >
              <FastForward className="w-4 h-4" />
              Next Trip Step (Demo)
            </button>
          ) : (
            <button
              onClick={completeAndClearBooking}
              className="flex items-center gap-1.5 text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-3.5 py-2 rounded-xl transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Book Another Truck
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Visual Route Map (Left 2 Columns) */}
        <div className="lg:col-span-2 p-5 sm:p-6 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                What is happening now
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900">{currentStage.label}</h3>
              <p className="text-base text-slate-600">{currentStage.subtext}</p>
            </div>

            <div className="bg-white px-4 py-2.5 rounded-xl border-2 border-slate-200 text-right">
              <div className="flex items-center justify-end gap-1.5 text-slate-500 text-xs font-bold">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Arrival Time</span>
              </div>
              <p className="text-xl font-extrabold text-slate-900">
                {isDelivered ? 'Arrived!' : `~${remainingMinutes} mins`}
              </p>
            </div>
          </div>

          {/* Interactive Route Map */}
          <div className="relative w-full h-64 bg-[#eef3ef] rounded-xl border-2 border-slate-200 overflow-hidden">
            <svg viewBox="0 0 600 240" className="w-full h-full">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#dce5de" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="600" height="240" fill="url(#grid)" />

              {/* Decorative Local Roads */}
              <path d="M 0 110 Q 220 130 600 90" fill="none" stroke="#ffffff" strokeWidth="8" />
              <path d="M 240 0 L 290 240" fill="none" stroke="#ffffff" strokeWidth="6" />

              {/* Planned Route */}
              <path
                d="M 80 190 Q 300 40 520 160"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="6"
                strokeDasharray="8 6"
                strokeLinecap="round"
              />

              {/* Traveled Route */}
              <path
                d="M 80 190 Q 300 40 520 160"
                fill="none"
                stroke="#10b981"
                strokeWidth="6"
                strokeLinecap="round"
                pathLength="100"
                strokeDasharray={`${liveProgress} 100`}
              />

              {/* Farm Origin Pin */}
              <g transform="translate(80, 190)">
                <circle r="11" fill="#0f172a" />
                <circle r="4" fill="#10b981" />
                <rect x="-42" y="14" width="84" height="22" rx="5" fill="#0f172a" />
                <text
                  x="0"
                  y="28"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="700"
                >
                  YOUR FARM
                </text>
              </g>

              {/* Market Destination Pin */}
              <g transform="translate(520, 160)">
                <circle r="11" fill="#dc2626" />
                <circle r="4" fill="#ffffff" />
                <rect x="-42" y="14" width="84" height="22" rx="5" fill="#dc2626" />
                <text
                  x="0"
                  y="28"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="700"
                >
                  MARKET
                </text>
              </g>

              {/* Moving Truck Pin */}
              <g transform={`translate(${truckX}, ${truckY})`}>
                <circle r="20" fill="#10b981" fillOpacity="0.25" />
                <circle r="14" fill="#059669" stroke="#ffffff" strokeWidth="3" />
                <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="13">
                  🚚
                </text>
              </g>
            </svg>

            {/* Bottom Route Summary Bar */}
            <div className="absolute bottom-3 left-3 right-3 bg-white/95 px-4 py-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 truncate max-w-[44%]">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-900 truncate">{pickup}</span>
              </div>
              <Navigation className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex items-center gap-1.5 truncate max-w-[44%]">
                <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                <span className="font-bold text-slate-900 truncate">{destination}</span>
              </div>
            </div>
          </div>

          {/* 5-Step Visual Progress Bar */}
          <div className="mt-5 grid grid-cols-5 gap-2">
            {TRIP_STAGES.map((stage, idx) => {
              const completed = idx <= stageIndex;
              const current = idx === stageIndex;
              return (
                <div key={stage.id} className="flex flex-col">
                  <div
                    className={`h-2.5 rounded-full mb-1.5 transition-all ${
                      completed ? 'bg-emerald-600' : 'bg-slate-200'
                    }`}
                  />
                  <span
                    className={`text-xs leading-tight ${
                      current
                        ? 'text-emerald-800 font-extrabold'
                        : completed
                        ? 'text-slate-700 font-semibold'
                        : 'text-slate-400 font-medium'
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Driver Contact & Load Summary (Right Column) */}
        <div className="p-5 sm:p-6 flex flex-col justify-between bg-white">
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
              Your Driver
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 mb-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-extrabold text-slate-900 text-lg">{truck.driverName}</p>
                  <p className="text-sm text-slate-600">{truck.vehicleModel}</p>
                </div>
                <span className="px-2.5 py-1 bg-slate-900 text-white text-xs font-mono font-bold rounded-lg">
                  {truck.plateNumber}
                </span>
              </div>

              <a
                href={`tel:${truck.phone}`}
                className="mt-4 w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition"
              >
                <Phone className="w-4 h-4" />
                Call Driver ({truck.phone})
              </a>
            </div>

            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
              Your Load
            </h4>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-slate-400" /> Crop:
                </span>
                <span className="font-bold text-slate-900">{cropType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Total Load:</span>
                <span className="font-bold text-slate-900">
                  {Math.round(weightKg / 50)} Sacks ({weightKg} kg)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold text-slate-700">Total Payment</span>
              <span className="text-2xl font-extrabold text-emerald-700">
                ₱{totalFare.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Pay directly to the driver—no middleman fee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}