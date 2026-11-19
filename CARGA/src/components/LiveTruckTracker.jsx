import React, { useState } from 'react';
import {
  Phone,
  Clock,
  MapPin,
  Sprout,
  CheckCircle2,
  FastForward,
  Navigation,
  Gauge,
  Compass,
  ShieldCheck,
  Radio,
} from 'lucide-react';
import { useLogistics, TRIP_STAGES } from '../context/LogisticsContext';
import { getLocalizedText } from '../utils/translations';
import { formatGpsCoords } from '../utils/gpsEngine';
import LiveGpsMap from './LiveGpsMap';
import PermitSoftCopyModal from './PermitSoftCopyModal';

export default function LiveTruckTracker() {
  const {
    language,
    t,
    activeBooking,
    advanceTripStage,
    nudgeTruckGps,
    completeAndClearBooking,
  } = useLogistics();

  const [isPermitModalOpen, setIsPermitModalOpen] = useState(false);

  if (!activeBooking) return null;

  const {
    truck,
    pickup,
    destination,
    cropType,
    sackCount,
    weightKg,
    estimatedMinutes,
    totalFare,
    fareBreakdown,
    permit,
    stageIndex,
    gps,
  } = activeBooking;

  const currentStage = TRIP_STAGES[stageIndex] || TRIP_STAGES[0];
  const isWaitingForDriver = stageIndex === 0;
  const isArrived = stageIndex === TRIP_STAGES.length - 1;
  const isMovingStage = stageIndex === 1 || stageIndex === 3;

  const localizedPickup = getLocalizedText(pickup, language);
  const localizedDestination = getLocalizedText(destination, language);
  const localizedCrop = getLocalizedText(cropType, language);

  const dynamicEtaMins = isArrived
    ? 0
    : gps?.remainingKm != null && gps.remainingKm > 0
    ? Math.max(2, Math.round(gps.remainingKm * 2.2))
    : estimatedMinutes;

  return (
    <>
      <div className="bg-white rounded-2xl border-2 border-emerald-600 shadow-sm overflow-hidden animate-fade-slide">
        {/* Top Live GPS Status Bar */}
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-3 h-3 rounded-full ${
                isWaitingForDriver
                  ? 'bg-amber-400 animate-ping'
                  : isArrived
                  ? 'bg-emerald-400'
                  : 'bg-emerald-400 animate-pulse'
              }`}
            />
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-emerald-300">
              {isWaitingForDriver
                ? t('waitingForDriverBadge')
                : isArrived
                ? t('deliveredBadge')
                : t('liveMapBadge')}
            </span>
            {gps && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                <Radio className="w-3 h-3 text-emerald-400" />
                {gps.source === 'device-gps'
                  ? t('gpsSignalSourceHardware')
                  : t('gpsSignalSourceSim')}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isMovingStage && (
              <button
                type="button"
                onClick={nudgeTruckGps}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-emerald-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{t('btnNudgeGpsDemo')}</span>
              </button>
            )}

            {!isArrived ? (
              <button
                type="button"
                onClick={advanceTripStage}
                className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>
                  {isWaitingForDriver ? t('btnSimAccept') : t('btnNextStepDemo')}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={completeAndClearBooking}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs cursor-pointer transition"
              >
                {t('btnBookAnother')}
              </button>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Columns: Stage Header + Interactive Live GPS Map + 5 Checkpoints */}
          <div className="lg:col-span-2 space-y-5">
            {/* Current Checkpoint & Arrival ETA */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  {t('whatHappeningNow')}
                </p>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                  {t(currentStage.labelKey)}
                </h2>
                <p className="text-sm text-slate-600 mt-0.5">{t(currentStage.subKey)}</p>
              </div>

              <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-right">
                <span className="text-[11px] font-bold text-slate-500 flex items-center justify-end gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  {t('arrivalTimeLabel')}
                </span>
                <p className="text-lg font-extrabold text-slate-900">
                  {isArrived
                    ? t('arrivedExcl')
                    : t('minsApprox', { mins: dynamicEtaMins })}
                </p>
              </div>
            </div>

            {/* Interactive Real-Time GPS Map */}
            {gps && (
              <LiveGpsMap
                truckCoords={gps.truckCoords}
                pickupCoords={gps.pickupCoords}
                destinationCoords={gps.destinationCoords}
                approachWaypoints={gps.approachWaypoints}
                deliveryWaypoints={gps.deliveryWaypoints}
                heading={gps.heading}
                speedKmh={gps.speedKmh}
                stageIndex={stageIndex}
                plateNumber={truck.plateNumber}
                farmerCoords={gps.farmerCoords}
              />
            )}

            {/* Live GPS Telemetry Readout Bar */}
            {gps && (
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    {t('gpsCoordsLabel')}
                  </span>
                  <p className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5 truncate">
                    {formatGpsCoords(gps.truckCoords)}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    {t('gpsSpeedLabel')}
                  </span>
                  <p className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5">
                    {gps.speedKmh} km/h
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    {t('gpsDistanceLeft')}
                  </span>
                  <p className="text-xs sm:text-sm font-extrabold text-emerald-700 mt-0.5">
                    {isArrived ? '0.0 km' : `${gps.remainingKm} km`}
                  </p>
                </div>
              </div>
            )}

            {/* Route Endpoints Summary */}
            <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                {localizedPickup}
              </span>
              <span className="text-slate-400">→</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                {localizedDestination}
              </span>
            </div>

            {/* Existing 5-Checkpoint Stepper Preserved */}
            <div className="grid grid-cols-5 gap-1.5">
              {TRIP_STAGES.map((stage, idx) => {
                const isDone = idx <= stageIndex;
                return (
                  <div key={stage.id} className="flex flex-col items-center text-center">
                    <div
                      className={`w-full h-2 rounded-full mb-1.5 transition-colors duration-300 ${
                        isDone ? 'bg-emerald-600' : 'bg-slate-200'
                      }`}
                    />
                    <span
                      className={`text-[11px] leading-tight ${
                        idx === stageIndex
                          ? 'font-extrabold text-emerald-700'
                          : isDone
                          ? 'font-semibold text-slate-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {t(stage.labelKey)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Driver Info, Load & Transparent Fare Breakdown */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t('yourDriverHeader')}
              </p>

              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {truck.driverName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{truck.vehicleModel}</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-mono text-xs font-extrabold shrink-0">
                  {truck.plateNumber}
                </span>
              </div>

              <a
                href={`tel:${truck.phone}`}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span>{t('callDriverBtn', { phone: truck.phone })}</span>
              </a>
            </div>

            {permit && (
              <button
                type="button"
                onClick={() => setIsPermitModalOpen(true)}
                className="w-full p-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 flex items-center justify-between gap-2 text-left transition cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-emerald-950 truncate">
                      {permit.id}
                    </p>
                    <p className="text-[11px] font-semibold text-emerald-700">
                      {t('btnViewPermitCopy')}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-emerald-800 shrink-0">→</span>
              </button>
            )}

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t('yourLoadHeader')}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  {t('cropColon')}
                </span>
                <span className="font-bold text-slate-900">{localizedCrop}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">{t('totalLoadColon')}</span>
                <span className="font-bold text-slate-900">
                  {t('sacksUnit', { count: sackCount })} ({weightKg.toLocaleString()} kg)
                </span>
              </div>

              {fareBreakdown && (
                <div className="pt-2.5 border-t border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>
                      {t('distanceCostLabel', {
                        km: fareBreakdown.distanceKm,
                        rate: fareBreakdown.ratePerKm,
                      })}
                    </span>
                    <span className="font-bold text-slate-800">
                      ₱{fareBreakdown.distanceCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>
                      {t('handlingCostLabel', {
                        kg: weightKg.toLocaleString(),
                        rate: fareBreakdown.handlingRatePerKg,
                      })}
                    </span>
                    <span className="font-bold text-slate-800">
                      ₱{fareBreakdown.handlingCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>{t('multiplierLabel')}</span>
                    <span className="font-bold text-slate-800">
                      {fareBreakdown.availabilityMultiplier.toFixed(2)}×
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-800">{t('totalPaymentLabel')}</span>
                <span className="text-lg font-extrabold text-emerald-700">
                  ₱{totalFare.toLocaleString()}
                </span>
              </div>

              <div className="pt-1 flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{t('noMiddlemanNote')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PermitSoftCopyModal
        permit={permit}
        isOpen={isPermitModalOpen}
        onClose={() => setIsPermitModalOpen(false)}
      />
    </>
  );
}