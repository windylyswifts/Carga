import React, { useState, useEffect, useRef } from 'react';
import {
  Truck,
  Power,
  MapPin,
  Package,
  Phone,
  Star,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  FileText,
  Radio,
} from 'lucide-react';
import { useLogistics, TRIP_STAGES } from '../context/LogisticsContext';
import { getLocalizedText } from '../utils/translations';
import { formatGpsCoords } from '../utils/gpsEngine';
import PermitSoftCopyModal from './PermitSoftCopyModal';

export default function DriverDashboard() {
  const {
    language,
    t,
    trucks,
    toggleTruckAvailability,
    updateTruckLocation,
    updateLiveTruckGps,
    activeBooking,
    advanceTripStage,
    cancelBooking,
    completeAndClearBooking,
  } = useLogistics();

  const [selectedDriverId, setSelectedDriverId] = useState(trucks[0]?.id || 'TRK-101');
  const [isPermitModalOpen, setIsPermitModalOpen] = useState(false);
  const [isStreamingGps, setIsStreamingGps] = useState(false);
  const watchIdRef = useRef(null);

  const currentTruck = trucks.find((tr) => tr.id === selectedDriverId) || trucks[0];
  const hasJobForThisTruck = activeBooking && activeBooking.truck.id === currentTruck.id;
  const currentStage = hasJobForThisTruck
    ? TRIP_STAGES[activeBooking.stageIndex] || TRIP_STAGES[0]
    : null;
  const isJobCompleted =
    hasJobForThisTruck && activeBooking.stageIndex === TRIP_STAGES.length - 1;

  // Manage real browser hardware GPS watchPosition when enabled by driver
  useEffect(() => {
    if (!isStreamingGps) {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    if (!navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        updateLiveTruckGps(currentTruck.id, {
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
          speedKmh:
            pos.coords.speed != null ? Math.round(pos.coords.speed * 3.6) : 40,
        });
      },
      () => {
        setIsStreamingGps(false);
      },
      { enableHighAccuracy: true, maximumAge: 2000 }
    );

    return () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [isStreamingGps, currentTruck.id]);

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Top Driver Account Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
              {t('driverPortalBadge')}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              {t('driverPortalTitle')}
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500">{t('viewingAccount')}</span>
            <select
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
              className="text-xs sm:text-sm font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
            >
              {trucks.map((tr) => (
                <option key={tr.id} value={tr.id}>
                  {tr.driverName} ({tr.plateNumber})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Alert if farmer booked another driver in the prototype */}
        {activeBooking && !hasJobForThisTruck && (
          <div className="rounded-xl bg-amber-50 border border-amber-300 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs sm:text-sm text-amber-900 font-medium">
              {t('otherTruckBookedMsg', {
                driver: activeBooking.truck.driverName,
                model: activeBooking.truck.vehicleModel,
              })}
            </p>
            <button
              type="button"
              onClick={() => setSelectedDriverId(activeBooking.truck.id)}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs cursor-pointer transition"
            >
              {t('switchDriverViewBtn', { name: activeBooking.truck.driverName })}
            </button>
          </div>
        )}

        {/* Truck Availability & Live GPS Broadcast Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                  currentTruck.isAvailable
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <Truck className="w-7 h-7" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {currentTruck.driverName}
                  </h2>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-xs font-bold">
                    {currentTruck.plateNumber}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-0.5">
                  {currentTruck.vehicleModel} •{' '}
                  <span className="font-semibold text-slate-800">
                    {t('maxCapacityLine', {
                      kg: currentTruck.capacityKg.toLocaleString(),
                    })}
                  </span>
                </p>
                <p
                  className={`text-xs font-semibold mt-1.5 ${
                    currentTruck.isAvailable ? 'text-emerald-700' : 'text-slate-500'
                  }`}
                >
                  {currentTruck.isAvailable
                    ? t('visibleToFarmers')
                    : t('offlineFromFarmers')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleTruckAvailability(currentTruck.id)}
              className={`px-5 py-3.5 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2.5 transition cursor-pointer shadow-sm ${
                currentTruck.isAvailable
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-800 hover:bg-slate-900 text-slate-200'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>
                {currentTruck.isAvailable
                  ? t('btnAvailableOn')
                  : t('btnAvailableOff')}
              </span>
            </button>
          </div>

          {/* Driver Real-Time GPS Broadcast Toggle */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isStreamingGps
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900">
                  {t('driverGpsBroadcastTitle')}
                </p>
                <p className="text-xs text-slate-500">
                  {isStreamingGps
                    ? `${t('driverGpsBroadcastOn')} (${formatGpsCoords(currentTruck.coords)})`
                    : `${t('driverGpsBroadcastOff')} (${formatGpsCoords(currentTruck.coords)})`}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsStreamingGps((prev) => !prev)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold border-2 transition cursor-pointer ${
                isStreamingGps
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                  : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              {isStreamingGps ? 'GPS ON' : 'Stream Device GPS'}
            </button>
          </div>
        </div>

        {/* Main Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Columns: Active Hauling Job or Standby State */}
          <div className="lg:col-span-2">
            {!hasJobForThisTruck ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold text-slate-800">
                  {currentTruck.isAvailable
                    ? t('waitingRequestsTitle')
                    : t('currentlyOfflineTitle')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  {currentTruck.isAvailable
                    ? t('waitingRequestsSub')
                    : t('currentlyOfflineSub')}
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border-2 border-emerald-600 shadow-sm overflow-hidden animate-fade-slide">
                <div
                  className={`px-5 py-3.5 text-white flex items-center justify-between ${
                    activeBooking.stageIndex === 0
                      ? 'bg-amber-500 text-slate-950'
                      : isJobCompleted
                      ? 'bg-emerald-700'
                      : 'bg-slate-900'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider">
                    {activeBooking.stageIndex === 0
                      ? t('newBookingBanner')
                      : isJobCompleted
                      ? t('tripCompletedBanner')
                      : t('activeJobBanner', {
                          stage: t(currentStage.labelKey),
                        })}
                  </span>
                  <span className="text-xs font-mono font-bold opacity-85">
                    #{activeBooking.id}
                  </span>
                </div>

                <div className="p-5 sm:p-6 space-y-5">
                  {activeBooking.permit && (
                    <div className="rounded-xl bg-emerald-50 border-2 border-emerald-400 p-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-extrabold text-emerald-950">
                            {t('driverPermitBannerTitle')} ({activeBooking.permit.id})
                          </p>
                          <p className="text-xs text-emerald-800 mt-0.5">
                            {t('driverPermitBannerSub')}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsPermitModalOpen(true)}
                        className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition shrink-0"
                      >
                        <FileText className="w-4 h-4" />
                        <span>{t('btnShowPermitSoftCopy')}</span>
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        {t('pickupAtFarmLabel')}
                      </span>
                      <p className="text-sm font-extrabold text-slate-900 mt-1">
                        {getLocalizedText(activeBooking.pickup, language)}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                        {t('dropoffDestLabel')}
                      </span>
                      <p className="text-sm font-extrabold text-slate-900 mt-1">
                        {getLocalizedText(activeBooking.destination, language)}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-emerald-700" />
                        <span>
                          {t('cargoLoadLabel')}:{' '}
                          <strong className="text-slate-900">
                            {getLocalizedText(activeBooking.cropType, language)} •{' '}
                            {t('sacksUnit', { count: activeBooking.sackCount })} (
                            {activeBooking.weightKg.toLocaleString()} kg)
                          </strong>
                        </span>
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Phone className="w-4 h-4 text-emerald-700" />
                        <span>
                          {t('farmerContactLabel')}:{' '}
                          <strong className="text-slate-900">
                            {activeBooking.farmerName} ({activeBooking.farmerPhone})
                          </strong>
                        </span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-bold text-slate-500 block">
                        {t('yourTripPayout')}
                      </span>
                      <span className="text-2xl font-extrabold text-emerald-700">
                        ₱{activeBooking.totalFare.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-emerald-800 block font-medium">
                        {t('directCashNote')}
                      </span>
                    </div>
                  </div>

                  {!isJobCompleted ? (
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      {activeBooking.stageIndex === 0 && (
                        <button
                          type="button"
                          onClick={cancelBooking}
                          className="px-4 py-3.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-sm flex items-center gap-1.5 cursor-pointer transition"
                        >
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span>{t('btnDecline')}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={advanceTripStage}
                        className="flex-1 py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm cursor-pointer transition"
                      >
                        <span>{t(currentStage.driverBtnKey)}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={completeAndClearBooking}
                      className="w-full py-3.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{t('btnDoneNextFarmer')}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Standby Location & Earnings Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                {t('standbyAreaTitle')}
              </label>
              <input
                type="text"
                value={currentTruck.currentLocation}
                onChange={(e) => updateTruckLocation(currentTruck.id, e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-slate-500">{t('standbyAreaSub')}</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t('driverSummaryTitle')}
              </p>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-xs text-slate-600">{t('totalEarningsLabel')}</span>
                <span className="text-base font-extrabold text-emerald-700">
                  ₱{currentTruck.totalEarnings.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-xs text-slate-600">{t('completedTripsLabel')}</span>
                <span className="text-sm font-extrabold text-slate-900">
                  {currentTruck.tripsCompleted}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-600">{t('farmerRatingLabel')}</span>
                <span className="text-sm font-extrabold text-amber-600 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {currentTruck.rating} / 5.0
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PermitSoftCopyModal
        permit={activeBooking?.permit}
        isOpen={isPermitModalOpen}
        onClose={() => setIsPermitModalOpen(false)}
      />
    </>
  );
}