import React, { useState } from 'react';
import {
  MapPin,
  Sprout,
  Minus,
  Plus,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  FileCheck2,
  Clock,
  ShieldCheck,
  Route,
} from 'lucide-react';
import { useLogistics, evaluatePermitRequirement } from '../context/LogisticsContext';
import LiveTruckTracker from './LiveTruckTracker';
import PermitFormModal from './PermitFormModal';
import PermitSoftCopyModal from './PermitSoftCopyModal';

export default function OrdinaryDashboard() {
  const {
    t,
    trucks,
    activeBooking,
    createBooking,
    transportPermit,
    approveTransportPermit,
  } = useLogistics();

  // 3-Step Stepper State: 1 = Locations | 2 = Crop & Sacks | 3 = Capable Trucks
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 Inputs (clean inputs with zero extra wording underneath)
  const [pickup, setPickup] = useState('Brgy. Sumilihon Farm');
  const [destination, setDestination] = useState('Langihan Public Market');
  const [isMainRoadOrIntercity, setIsMainRoadOrIntercity] = useState(false);

  // Step 2 Inputs
  const [cropType, setCropType] = useState('Bananas (Saba)');
  const [sackWeightKg, setSackWeightKg] = useState(50);
  const [sackCount, setSackCount] = useState(12);

  // Step 3 Selection
  const [selectedTruckId, setSelectedTruckId] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);

  // Permit Modal & Interception Hold State
  const [isPermitModalOpen, setIsPermitModalOpen] = useState(false);
  const [isSoftCopyOpen, setIsSoftCopyOpen] = useState(false);
  const [bookingOnHoldForPermit, setBookingOnHoldForPermit] = useState(false);
  const [permitTriggerInfo, setPermitTriggerInfo] = useState(null);

  const totalWeightKg = sackCount * sackWeightKg;

  const capableTrucks = trucks.filter(
    (truck) => truck.isAvailable && truck.capacityKg >= totalWeightKg
  );

  const canProceedStep1 = pickup.trim().length > 0 && destination.trim().length > 0;
  const canProceedStep2 = cropType.trim().length > 0 && sackCount >= 1;

  // Step 2 -> Step 3 Transition with Weight (> 8,000 kg) & Main Road / City-to-City Validation
  const handleStep2Next = () => {
    const validation = evaluatePermitRequirement({
      weightKg: totalWeightKg,
      pickup,
      destination,
      isMainRoadOrIntercity,
    });

    if (validation.required && transportPermit?.status !== 'approved') {
      setPermitTriggerInfo(validation);
      setBookingOnHoldForPermit(true);

      // If farmer has not submitted a permit yet, open the 5-attribute permit form immediately
      if (!transportPermit) {
        setIsPermitModalOpen(true);
      }
      return;
    }

    setBookingOnHoldForPermit(false);
    setSelectedTruckId(null);
    setCurrentStep(3);
  };

  const handleConfirmTruck = async () => {
    const chosenTruck = capableTrucks.find((tr) => tr.id === selectedTruckId);
    if (!chosenTruck || isConfirming) return;

    setIsConfirming(true);
    await createBooking({
      truck: chosenTruck,
      pickup,
      destination,
      cropType,
      sackCount,
      sackWeightKg,
    });
    setIsConfirming(false);
    setSelectedTruckId(null);
    setBookingOnHoldForPermit(false);
    setCurrentStep(1);
  };

  const steps = [
    { num: 1, label: t('step1Short') },
    { num: 2, label: t('step2Short') },
    { num: 3, label: t('step3Short') },
  ];

  const prefillPermitData = {
    plantDetails: `${cropType} — ${sackCount} Sacks (${sackWeightKg} kg/sack)`,
    plantSource: pickup,
    weightInKilos: totalWeightKg,
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header + High-Contrast Color-Theory "Apply for Permit" Button */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            {t('farmerBadge')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5">
            {t('farmerTitle')}
          </h1>
        </div>

        {/* High-Visibility Amber/Gold CTA against Emerald/Slate palette */}
        <div className="flex items-center gap-2">
          {transportPermit?.status === 'approved' ? (
            <button
              type="button"
              onClick={() => setIsSoftCopyOpen(true)}
              className="px-4 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
              <span>{t('permitActiveChip', { id: transportPermit.id })}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setPermitTriggerInfo(null);
                setIsPermitModalOpen(true);
              }}
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-slate-950 border-2 border-amber-600 font-extrabold text-sm flex items-center gap-2 shadow-md transition cursor-pointer"
            >
              <FileCheck2 className="w-5 h-5" />
              <span>
                {transportPermit?.status === 'pending'
                  ? t('permitPendingChip', { id: transportPermit.id })
                  : t('btnApplyPermitTop')}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Live Map Tracker (Shown whenever a trip is active) */}
      {activeBooking ? (
        <LiveTruckTracker />
      ) : (
        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-2xs overflow-hidden">
          {/* Top Stepper Progress Header */}
          <div className="bg-slate-50 border-b border-slate-200 px-5 sm:px-7 py-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-3">
              <span>{t('stepIndicator', { current: currentStep })}</span>
              <span className="text-emerald-700 font-extrabold">
                {steps.find((s) => s.num === currentStep)?.label}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {steps.map((step) => {
                const isCompleted = step.num < currentStep;
                const isCurrent = step.num === currentStep;
                return (
                  <div key={step.num} className="flex flex-col">
                    <div
                      className={`h-2.5 rounded-full transition-all ${
                        isCompleted || isCurrent ? 'bg-emerald-600' : 'bg-slate-200'
                      }`}
                    />
                    <span
                      className={`text-xs mt-1.5 ${
                        isCurrent
                          ? 'font-extrabold text-emerald-800'
                          : isCompleted
                          ? 'font-semibold text-slate-700'
                          : 'font-medium text-slate-400'
                      }`}
                    >
                      {step.num}. {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 1: LOCATIONS + MAIN ROAD / CITY-TO-CITY SELECTOR */}
          {currentStep === 1 && (
            <div className="p-5 sm:p-7 space-y-6">
              <h2 className="text-xl font-extrabold text-slate-900">{t('step1Title')}</h2>

              <div className="space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-base font-bold text-slate-800 mb-2">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    {t('labelPickup')}
                  </label>
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder={t('placeholderPickup')}
                    className="w-full px-4 py-4 rounded-xl border-2 border-slate-300 text-base font-semibold focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-base font-bold text-slate-800 mb-2">
                    <MapPin className="w-5 h-5 text-red-600" />
                    {t('labelDestination')}
                  </label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder={t('placeholderDestination')}
                    className="w-full px-4 py-4 rounded-xl border-2 border-slate-300 text-base font-semibold focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {/* Clean Main Road / City-to-City Route Toggle */}
                <button
                  type="button"
                  onClick={() => setIsMainRoadOrIntercity((prev) => !prev)}
                  className={`w-full px-4 py-3.5 rounded-xl border-2 flex items-center justify-between text-left transition cursor-pointer ${
                    isMainRoadOrIntercity
                      ? 'border-amber-500 bg-amber-50 text-amber-950'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2.5 text-sm font-extrabold">
                    <Route
                      className={`w-5 h-5 ${
                        isMainRoadOrIntercity ? 'text-amber-600' : 'text-slate-400'
                      }`}
                    />
                    {t('labelMainRoadToggle')}
                  </span>
                  <span
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-extrabold ${
                      isMainRoadOrIntercity
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-white border border-slate-300 text-transparent'
                    }`}
                  >
                    ✓
                  </span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled={!canProceedStep1}
                  onClick={() => setCurrentStep(2)}
                  className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-base flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>{t('btnNextStep')}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: WHAT CROP + 50 KG / 25 KG SACK DROPDOWN + QUANTITY + PERMIT HOLD */}
          {currentStep === 2 && (
            <div className="p-5 sm:p-7 space-y-6">
              <h2 className="text-xl font-extrabold text-slate-900">{t('step2Title')}</h2>

              <div className="space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-base font-bold text-slate-800 mb-2">
                    <Sprout className="w-5 h-5 text-emerald-600" />
                    {t('labelCropSending')}
                  </label>
                  <input
                    type="text"
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    placeholder={t('placeholderCropSending')}
                    className="w-full px-4 py-4 rounded-xl border-2 border-slate-300 text-base font-semibold focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-base font-bold text-slate-800 mb-2">
                    {t('labelSackSize')}
                  </label>
                  <div className="relative">
                    <select
                      value={sackWeightKg}
                      onChange={(e) => setSackWeightKg(Number(e.target.value))}
                      className="w-full appearance-none px-4 py-4 pr-11 rounded-xl border-2 border-slate-300 bg-white text-base font-bold text-slate-900 focus:outline-none focus:border-emerald-600 cursor-pointer"
                    >
                      <option value={50}>{t('sackOption50')}</option>
                      <option value={25}>{t('sackOption25')}</option>
                    </select>
                    <ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-4.5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-base font-bold text-slate-800 mb-2">
                    {t('labelSackCount')}
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSackCount((prev) => Math.max(1, prev - 1))}
                      className="w-16 h-16 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 flex items-center justify-center text-slate-900 cursor-pointer active:scale-95 transition"
                    >
                      <Minus className="w-6 h-6" />
                    </button>

                    <div className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl py-3 px-4 text-center">
                      <span className="text-2xl font-extrabold text-slate-900 block leading-none">
                        {t('sacksUnit', { count: sackCount })}
                      </span>
                      <span className="text-sm font-bold text-emerald-700 mt-1 block">
                        {t('totalWeightSummary', { kg: totalWeightKg.toLocaleString() })}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSackCount((prev) => prev + 1)}
                      className="w-16 h-16 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 flex items-center justify-center text-slate-900 cursor-pointer active:scale-95 transition"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>

              {/* On-Hold Banner when Booking is Paused Waiting for Permit Approval */}
              {bookingOnHoldForPermit && transportPermit?.status === 'pending' && (
                <div className="rounded-2xl border-2 border-amber-500 bg-amber-50 p-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <Clock className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-base font-extrabold text-amber-950">
                        {t('permitHoldTitle')}
                      </h3>
                      <p className="text-xs sm:text-sm text-amber-900 mt-1">
                        {t('permitHoldSub', { id: transportPermit.id })}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={approveTransportPermit}
                    className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition cursor-pointer"
                  >
                    {t('btnSimApprovePermit')}
                  </button>
                </div>
              )}

              {/* Approved Permit Banner -> Proceed to Step 3 */}
              {bookingOnHoldForPermit && transportPermit?.status === 'approved' && (
                <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-base font-extrabold text-emerald-950">
                          {t('permitApprovedTitle', { id: transportPermit.id })}
                        </h3>
                        <p className="text-xs sm:text-sm text-emerald-900 mt-1">
                          {t('permitApprovedSub')}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSoftCopyOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-xs font-extrabold shrink-0 cursor-pointer"
                    >
                      {t('btnViewPermitCopy')}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setBookingOnHoldForPermit(false);
                      setSelectedTruckId(null);
                      setCurrentStep(3);
                    }}
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <span>{t('btnProceedStep3')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="py-4 px-4 rounded-xl border-2 border-slate-300 hover:bg-slate-100 text-slate-700 font-extrabold text-base flex items-center justify-center gap-1.5 cursor-pointer transition"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>{t('btnBack')}</span>
                </button>
                <button
                  type="button"
                  disabled={!canProceedStep2}
                  onClick={handleStep2Next}
                  className="col-span-2 py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-base flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>{t('btnNextStep')}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: MINIMALIST RECTANGLE LIST OF CAPABLE TRUCKS + CONFIRM */}
          {currentStep === 3 && (
            <div className="p-5 sm:p-7 space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">{t('step3Title')}</h2>
                <p className="text-sm font-semibold text-slate-500 mt-0.5">
                  {t('step3Subtitle', { kg: totalWeightKg.toLocaleString() })}
                </p>
              </div>

              {capableTrucks.length === 0 ? (
                <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-8 text-center">
                  <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                  <p className="text-base font-extrabold text-slate-900">
                    {t('noCapableTrucksTitle', { kg: totalWeightKg.toLocaleString() })}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">{t('noCapableTrucksSub')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {capableTrucks.map((truck) => {
                    const isSelected = selectedTruckId === truck.id;
                    return (
                      <button
                        key={truck.id}
                        type="button"
                        onClick={() => setSelectedTruckId(truck.id)}
                        className={`w-full px-5 py-4 rounded-xl border-2 flex items-center justify-between gap-4 text-left transition cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-2xs'
                            : 'border-slate-300 bg-white hover:border-slate-400 text-slate-900'
                        }`}
                      >
                        <span className="text-base sm:text-lg font-extrabold">
                          {truck.vehicleModel}
                        </span>
                        <span
                          className={`text-base sm:text-lg font-extrabold shrink-0 ${
                            isSelected ? 'text-emerald-700' : 'text-slate-600'
                          }`}
                        >
                          {truck.capacityKg.toLocaleString()} kg
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="py-4 px-4 rounded-xl border-2 border-slate-300 hover:bg-slate-100 text-slate-700 font-extrabold text-base flex items-center justify-center gap-1.5 cursor-pointer transition"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>{t('btnBack')}</span>
                </button>
                <button
                  type="button"
                  disabled={!selectedTruckId || isConfirming}
                  onClick={handleConfirmTruck}
                  className="col-span-2 py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-base flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>
                    {isConfirming ? t('btnConfirmingBooking') : t('btnConfirmBooking')}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5-Attribute Permit Application Modal */}
      <PermitFormModal
        isOpen={isPermitModalOpen}
        onClose={() => setIsPermitModalOpen(false)}
        prefillData={prefillPermitData}
        triggerReasons={permitTriggerInfo}
        onSubmitted={() => {
          if (currentStep === 2) {
            setBookingOnHoldForPermit(true);
          }
        }}
      />

      {/* Authenticated Soft Copy Viewer */}
      <PermitSoftCopyModal
        permit={transportPermit}
        isOpen={isSoftCopyOpen}
        onClose={() => setIsSoftCopyOpen(false)}
      />
    </div>
  );
}