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
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import LiveTruckTracker from './LiveTruckTracker';

export default function OrdinaryDashboard() {
  const { t, trucks, activeBooking, createBooking } = useLogistics();

  // 3-Step Stepper State: 1 = Locations | 2 = Crop & Sacks | 3 = Capable Trucks
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 Inputs (clean inputs with zero extra wording underneath)
  const [pickup, setPickup] = useState('Brgy. Sumilihon Farm');
  const [destination, setDestination] = useState('Langihan Public Market');

  // Step 2 Inputs (Crop + 50kg / 25kg dropdown + Sack quantity)
  const [cropType, setCropType] = useState('Bananas (Saba)');
  const [sackWeightKg, setSackWeightKg] = useState(50); // 50 or 25
  const [sackCount, setSackCount] = useState(12);

  // Step 3 Selection
  const [selectedTruckId, setSelectedTruckId] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const totalWeightKg = sackCount * sackWeightKg;

  // Automatically filter trucks that are online AND capable of carrying the total crop weight
  const capableTrucks = trucks.filter(
    (truck) => truck.isAvailable && truck.capacityKg >= totalWeightKg
  );

  const canProceedStep1 = pickup.trim().length > 0 && destination.trim().length > 0;
  const canProceedStep2 = cropType.trim().length > 0 && sackCount >= 1;

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
    setCurrentStep(1);
  };

  const steps = [
    { num: 1, label: t('step1Short') },
    { num: 2, label: t('step2Short') },
    { num: 3, label: t('step3Short') },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6">
        <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
          {t('farmerBadge')}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5">
          {t('farmerTitle')}
        </h1>
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

          {/* STEP 1: WHERE IS YOUR FARM & DESTINATION (NO WORDINGS BELOW INPUTS) */}
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

          {/* STEP 2: WHAT CROP + 50 KG / 25 KG SACK DROPDOWN + QUANTITY */}
          {currentStep === 2 && (
            <div className="p-5 sm:p-7 space-y-6">
              <h2 className="text-xl font-extrabold text-slate-900">{t('step2Title')}</h2>

              <div className="space-y-5">
                {/* Crop Name Input */}
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

                {/* Farmer-Friendly 50 kg or 25 kg Sack Weight Dropdown */}
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

                {/* Large +/- Sack Count Controls */}
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
                  onClick={() => {
                    setSelectedTruckId(null);
                    setCurrentStep(3);
                  }}
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
                        {/* Left Side: Vehicle Name Only */}
                        <span className="text-base sm:text-lg font-extrabold">
                          {truck.vehicleModel}
                        </span>

                        {/* Right Side: Weight Capacity Only */}
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
    </div>
  );
}