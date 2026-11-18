import React, { useState } from 'react';
import {
  Truck,
  Power,
  MapPin,
  Navigation,
  Phone,
  CheckCircle2,
  XCircle,
  Package,
  Wallet,
  Star,
  ArrowRight,
  Clock,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';
import { useLogistics, TRIP_STAGES } from '../context/LogisticsContext';
import { getLocalizedText } from '../utils/translations';
import PermitSoftCopyModal from './PermitSoftCopyModal';

const STANDBY_SPOTS = [
  'Ampayon Highway Junction',
  'Libertad Public Terminal',
  'Baan Viaduct Crossing',
  'Langihan Market Parking',
];

export default function DriverDashboard() {
  const {
    language,
    t,
    trucks,
    toggleTruckAvailability,
    updateTruckLocation,
    activeBooking,
    advanceTripStage,
    cancelBooking,
    completeAndClearBooking,
  } = useLogistics();

  const [selectedTruckId, setSelectedTruckId] = useState(trucks[0].id);
  const [isPermitViewerOpen, setIsPermitViewerOpen] = useState(false);

  const currentTruck = trucks.find((tr) => tr.id === selectedTruckId) || trucks[0];
  const hasBookingForThisTruck = activeBooking && activeBooking.truck.id === currentTruck.id;
  const hasBookingForOtherTruck = activeBooking && activeBooking.truck.id !== currentTruck.id;

  const isPendingAcceptance = hasBookingForThisTruck && activeBooking.stageIndex === 0;
  const isDelivered =
    hasBookingForThisTruck && activeBooking.stageIndex === TRIP_STAGES.length - 1;
  const currentStage = hasBookingForThisTruck ? TRIP_STAGES[activeBooking.stageIndex] : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header + Fleet Account Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
            {t('driverPortalBadge')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5">
            {t('driverPortalTitle')}
          </h1>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-xl px-3.5 py-2 flex items-center gap-2.5 self-start">
          <span className="text-xs font-bold text-slate-500 uppercase">{t('viewingAccount')}</span>
          <select
            value={currentTruck.id}
            onChange={(e) => setSelectedTruckId(e.target.value)}
            className="text-sm font-extrabold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
          >
            {trucks.map((tr) => (
              <option key={tr.id} value={tr.id}>
                {tr.driverName} ({tr.plateNumber})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pitch Helper Banner if another truck received the booking */}
      {hasBookingForOtherTruck && (
        <div className="mb-6 bg-amber-50 border-2 border-amber-400 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
            <p className="text-sm font-semibold text-amber-950">
              {t('otherTruckBookedMsg', {
                driver: activeBooking.truck.driverName,
                model: activeBooking.truck.vehicleModel,
              })}
            </p>
          </div>
          <button
            onClick={() => setSelectedTruckId(activeBooking.truck.id)}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shrink-0 cursor-pointer transition"
          >
            {t('switchDriverViewBtn', { name: activeBooking.truck.driverName.split(' ')[0] })}
          </button>
        </div>
      )}

      {/* Primary Availability Master Switch Card */}
      <div
        className={`rounded-2xl border-2 p-6 mb-8 transition shadow-2xs ${
          currentTruck.isAvailable
            ? 'bg-emerald-950 text-white border-emerald-700'
            : 'bg-white text-slate-900 border-slate-300'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                currentTruck.isAvailable
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-extrabold">{currentTruck.driverName}</h2>
                <span
                  className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded ${
                    currentTruck.isAvailable
                      ? 'bg-emerald-800 text-emerald-200'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {currentTruck.plateNumber}
                </span>
              </div>
              <p
                className={`text-sm mt-0.5 ${
                  currentTruck.isAvailable ? 'text-emerald-200' : 'text-slate-500'
                }`}
              >
                {currentTruck.vehicleModel} •{' '}
                {t('maxCapacityLine', { kg: currentTruck.capacityKg.toLocaleString() })}
              </p>
              <p
                className={`text-xs mt-2 font-semibold ${
                  currentTruck.isAvailable ? 'text-emerald-300' : 'text-slate-500'
                }`}
              >
                {currentTruck.isAvailable ? t('visibleToFarmers') : t('offlineFromFarmers')}
              </p>
            </div>
          </div>

          <button
            onClick={() => toggleTruckAvailability(currentTruck.id)}
            className={`px-6 py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2.5 transition cursor-pointer shrink-0 shadow-sm ${
              currentTruck.isAvailable
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            <Power className="w-5 h-5" />
            {currentTruck.isAvailable ? t('btnAvailableOn') : t('btnAvailableOff')}
          </button>
        </div>
      </div>

      {/* Main 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {!hasBookingForThisTruck ? (
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                {currentTruck.isAvailable
                  ? t('waitingRequestsTitle')
                  : t('currentlyOfflineTitle')}
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
                {currentTruck.isAvailable ? t('waitingRequestsSub') : t('currentlyOfflineSub')}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border-2 border-blue-500 shadow-md overflow-hidden">
              <div
                className={`px-6 py-4 text-white flex items-center justify-between ${
                  isPendingAcceptance
                    ? 'bg-amber-600'
                    : isDelivered
                    ? 'bg-emerald-700'
                    : 'bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                  <span className="text-xs font-extrabold uppercase tracking-wider">
                    {isPendingAcceptance
                      ? t('newBookingBanner')
                      : isDelivered
                      ? t('tripCompletedBanner')
                      : t('activeJobBanner', { stage: t(currentStage.labelKey).toUpperCase() })}
                  </span>
                </div>
                <span className="text-xs font-mono opacity-80">#{activeBooking.id}</span>
              </div>

              <div className="p-6 space-y-6">
                {/* Official Soft Copy Permit Card (Shown whenever farmer attached a permit) */}
                {activeBooking.permit && (
                  <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <FileCheck2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-emerald-950">
                          {t('driverPermitBannerTitle')} ({activeBooking.permit.id})
                        </p>
                        <p className="text-xs font-semibold text-emerald-800">
                          {t('driverPermitBannerSub')}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsPermitViewerOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shrink-0 cursor-pointer transition"
                    >
                      {t('btnShowPermitSoftCopy')}
                    </button>
                  </div>
                )}

                {/* Route Card */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs font-bold uppercase text-slate-400 block">
                        {t('pickupAtFarmLabel')}
                      </span>
                      <span className="text-base font-extrabold text-slate-900">
                        {getLocalizedText(activeBooking.pickup, language)}
                      </span>
                    </div>
                  </div>

                  <div className="border-l-2 border-dashed border-slate-300 h-4 ml-2.5" />

                  <div className="flex items-start gap-3">
                    <Navigation className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs font-bold uppercase text-slate-400 block">
                        {t('dropoffDestLabel')}
                      </span>
                      <span className="text-base font-extrabold text-slate-900">
                        {getLocalizedText(activeBooking.destination, language)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cargo, Farmer & Formula Payout */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <Package className="w-3.5 h-3.5" /> {t('cargoLoadLabel')}
                    </span>
                    <p className="text-base font-extrabold text-slate-900 mt-1">
                      {getLocalizedText(activeBooking.cropType, language)}
                    </p>
                    <p className="text-xs font-semibold text-slate-600">
                      {t('sacksUnit', { count: activeBooking.sackCount })} (
                      {activeBooking.weightKg.toLocaleString()} kg)
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-400">
                      {t('farmerContactLabel')}
                    </span>
                    <p className="text-base font-extrabold text-slate-900 mt-1">
                      {activeBooking.farmerName}
                    </p>
                    <a
                      href={`tel:${activeBooking.farmerPhone}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline mt-0.5"
                    >
                      <Phone className="w-3 h-3" /> {activeBooking.farmerPhone}
                    </a>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="text-xs font-bold text-emerald-800">{t('yourTripPayout')}</span>
                    <p className="text-2xl font-extrabold text-emerald-700 mt-1">
                      ₱{activeBooking.totalFare.toLocaleString()}
                    </p>
                    {activeBooking.fareBreakdown && (
                      <p className="text-[11px] font-semibold text-emerald-800 mt-0.5">
                        (₱{activeBooking.fareBreakdown.distanceCost} + ₱
                        {activeBooking.fareBreakdown.handlingCost}) ×{' '}
                        {activeBooking.fareBreakdown.availabilityMultiplier.toFixed(2)}×
                      </p>
                    )}
                    <p className="text-[11px] font-semibold text-emerald-700">
                      {t('directCashNote')}
                    </p>
                  </div>
                </div>

                {/* Stage Progress Indicator */}
                <div className="grid grid-cols-5 gap-2">
                  {TRIP_STAGES.map((stage, idx) => (
                    <div key={stage.id}>
                      <div
                        className={`h-2 rounded-full mb-1 ${
                          idx <= activeBooking.stageIndex ? 'bg-blue-600' : 'bg-slate-200'
                        }`}
                      />
                      <span
                        className={`text-[11px] block leading-tight ${
                          idx === activeBooking.stageIndex
                            ? 'font-extrabold text-blue-700'
                            : 'text-slate-500'
                        }`}
                      >
                        {t(stage.labelKey)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Driver Controls */}
                {isPendingAcceptance ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <button
                      onClick={cancelBooking}
                      className="py-3.5 px-4 rounded-xl border-2 border-slate-300 hover:bg-slate-100 text-slate-700 font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition"
                    >
                      <XCircle className="w-5 h-5 text-red-500" />
                      {t('btnDecline')}
                    </button>
                    <button
                      onClick={advanceTripStage}
                      className="sm:col-span-2 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-sm cursor-pointer transition"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      {t(currentStage.driverBtnKey)}
                    </button>
                  </div>
                ) : !isDelivered ? (
                  <button
                    onClick={advanceTripStage}
                    className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-sm cursor-pointer transition"
                  >
                    <span>{t(currentStage.driverBtnKey)}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={completeAndClearBooking}
                    className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base flex items-center justify-center gap-2 cursor-pointer transition"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    {t('btnDoneNextFarmer')}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Standby Location & Earnings */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-2xs">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 mb-1">
              <MapPin className="w-5 h-5 text-blue-600" />
              {t('standbyAreaTitle')}
            </h3>
            <p className="text-xs text-slate-500 mb-3">{t('standbyAreaSub')}</p>

            <input
              type="text"
              value={currentTruck.currentLocation}
              onChange={(e) => updateTruckLocation(currentTruck.id, e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 text-sm font-semibold focus:outline-none focus:border-blue-600"
            />

            <div className="flex flex-wrap gap-1.5 mt-3">
              {STANDBY_SPOTS.map((spot) => (
                <button
                  key={spot}
                  type="button"
                  onClick={() => updateTruckLocation(currentTruck.id, spot)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                    currentTruck.currentLocation === spot
                      ? 'bg-blue-50 border-blue-600 text-blue-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {spot}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-2xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-600" />
              {t('driverSummaryTitle')}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-bold text-slate-400 block">
                  {t('totalEarningsLabel')}
                </span>
                <span className="text-lg font-extrabold text-slate-900">
                  ₱{currentTruck.totalEarnings.toLocaleString()}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-bold text-slate-400 block">
                  {t('completedTripsLabel')}
                </span>
                <span className="text-lg font-extrabold text-slate-900">
                  {currentTruck.tripsCompleted}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-sm">
              <span className="text-slate-500 font-medium">{t('farmerRatingLabel')}</span>
              <span className="font-extrabold text-amber-600 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {currentTruck.rating} / 5.0
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Driver Official Permit Soft Copy Modal */}
      <PermitSoftCopyModal
        permit={activeBooking?.permit}
        isOpen={isPermitViewerOpen}
        onClose={() => setIsPermitViewerOpen(false)}
      />
    </div>
  );
}