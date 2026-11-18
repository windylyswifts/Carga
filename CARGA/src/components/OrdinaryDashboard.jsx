import React, { useState, useEffect } from 'react';
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
  Truck,
  Home,
  History,
  Bell,
  User,
  ChevronRight,
  Phone,
  Building2,
  Check,
} from 'lucide-react';
import { useLogistics, evaluatePermitRequirement } from '../context/LogisticsContext';
import { LANGUAGES } from '../utils/translations';
import LiveTruckTracker from './LiveTruckTracker';
import PermitFormModal from './PermitFormModal';
import PermitSoftCopyModal from './PermitSoftCopyModal';
import { BookTruck3DIcon, PermitInquiry3DIcon } from './ActionIcons3D';

export default function OrdinaryDashboard() {
  const {
    language,
    setLanguage,
    t,
    farmerTab,
    setFarmerTab,
    isBookingFormOpen,
    setIsBookingFormOpen,
    trucks,
    activeBooking,
    createBooking,
    transportPermit,
    approveTransportPermit,
    farmerProfile,
    updateFarmerProfile,
    activityLogs,
    notifications,
    markAllNotificationsRead,
  } = useLogistics();

  // 3-Step Stepper State: 1 = Locations | 2 = Crop & Sacks | 3 = Capable Trucks
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 Inputs
  const [pickup, setPickup] = useState(farmerProfile.farmLocation);
  const [destination, setDestination] = useState('Langihan Public Market');
  const [isMainRoadOrIntercity, setIsMainRoadOrIntercity] = useState(false);

  // Step 2 Inputs
  const [cropType, setCropType] = useState('Bananas (Saba)');
  const [sackWeightKg, setSackWeightKg] = useState(50);
  const [sackCountInput, setSackCountInput] = useState('12');

  // Step 3 Selection
  const [selectedTruckId, setSelectedTruckId] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);

  // Permit Modal & Interception Hold State
  const [isPermitModalOpen, setIsPermitModalOpen] = useState(false);
  const [isSoftCopyOpen, setIsSoftCopyOpen] = useState(false);
  const [bookingOnHoldForPermit, setBookingOnHoldForPermit] = useState(false);
  const [permitTriggerInfo, setPermitTriggerInfo] = useState(null);

  // Profile Edit Form State
  const [profileDraft, setProfileDraft] = useState(farmerProfile);
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    setProfileDraft(farmerProfile);
  }, [farmerProfile]);

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const numericSackCount = Math.max(0, parseInt(sackCountInput, 10) || 0);
  const totalWeightKg = numericSackCount * sackWeightKg;

  const capableTrucks = trucks.filter(
    (truck) => truck.isAvailable && truck.capacityKg >= totalWeightKg
  );

  const canProceedStep1 = pickup.trim().length > 0 && destination.trim().length > 0;
  const canProceedStep2 = cropType.trim().length > 0 && numericSackCount >= 1;

  const hasValidApprovedPermit =
    transportPermit?.status === 'approved' &&
    Number(transportPermit.weightInKilos) >= totalWeightKg;

  const handleOpenBookingForm = () => {
    setPickup(farmerProfile.farmLocation || 'Brgy. Sumilihon Farm');
    setCurrentStep(1);
    setSelectedTruckId(null);
    setBookingOnHoldForPermit(false);
    setFarmerTab('home');
    setIsBookingFormOpen(true);
  };

  const handlePermitCardClick = () => {
    if (transportPermit?.status === 'approved') {
      setIsSoftCopyOpen(true);
      return;
    }
    setPermitTriggerInfo(null);
    setIsPermitModalOpen(true);
  };

  const handleSackInputChange = (e) => {
    const raw = e.target.value;
    if (raw === '') {
      setSackCountInput('');
      return;
    }
    const digitsOnly = raw.replace(/\D/g, '');
    setSackCountInput(digitsOnly);
  };

  const handleSackInputBlur = () => {
    setSackCountInput(String(Math.max(1, numericSackCount)));
  };

  const adjustSackCount = (delta) => {
    const next = Math.max(1, numericSackCount + delta);
    setSackCountInput(String(next));
  };

  const handleStep2Next = () => {
    if (!canProceedStep2) return;
    setSackCountInput(String(numericSackCount));

    const validation = evaluatePermitRequirement({
      weightKg: totalWeightKg,
      pickup,
      destination,
      isMainRoadOrIntercity,
    });

    if (validation.required && !hasValidApprovedPermit) {
      setPermitTriggerInfo(validation);
      setBookingOnHoldForPermit(true);

      if (transportPermit?.status !== 'pending') {
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
      sackCount: numericSackCount,
      sackWeightKg,
    });
    setIsConfirming(false);
    setSelectedTruckId(null);
    setBookingOnHoldForPermit(false);
    setCurrentStep(1);
    setIsBookingFormOpen(false);
    setFarmerTab('home');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileDraft.fullName.trim()) return;
    updateFarmerProfile(profileDraft);
    setPickup(profileDraft.farmLocation);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2200);
  };

  const steps = [
    { num: 1, label: t('step1Short') },
    { num: 2, label: t('step2Short') },
    { num: 3, label: t('step3Short') },
  ];

  const prefillPermitData = {
    plantDetails: isBookingFormOpen
      ? `${cropType} — ${numericSackCount} Sacks (${sackWeightKg} kg/sack)`
      : '',
    applicantFullName: farmerProfile.fullName,
    plantSource: isBookingFormOpen ? pickup : farmerProfile.farmLocation,
    weightInKilos: isBookingFormOpen ? totalWeightKg : '',
  };

  const navItems = [
    { id: 'home', label: t('navHome'), icon: Home },
    { id: 'history', label: t('navHistory'), icon: History },
    { id: 'notifications', label: t('navNotifications'), icon: Bell, badge: unreadNotifCount },
    { id: 'profile', label: t('navProfile'), icon: User },
  ];

  return (
    <>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* =========================================================
            TAB 1A: FARMER HOME LANDING PAGE
           ========================================================= */}
        {farmerTab === 'home' && !isBookingFormOpen && (
          <div key="farmer-home" className="space-y-6 animate-fade-slide">
            {/* Greeting Header */}
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                {t('farmerBadge')}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5">
                {t('farmerTitle', { name: farmerProfile.fullName.split(' ')[0] })}
              </h1>
              <p className="text-sm font-medium text-slate-500 mt-0.5">{t('farmerSubtitle')}</p>
            </div>

            {/* Live Trip Tracker (Shown right on Home if a trip is active) */}
            {activeBooking && (
              <div className="animate-fade-slide">
                <LiveTruckTracker />
              </div>
            )}

            {/* ROW 1: Two Equal-Width 3D Action Cards (Color-Psychology Paired) */}
            <div className="grid grid-cols-2 gap-3.5 sm:gap-5">
              {/* Card 1: Book a Truck — Rich Emerald-Teal Gradient (Action & Harvest Growth) */}
              <button
                type="button"
                onClick={handleOpenBookingForm}
                className="group relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-500 hover:to-teal-700 active:scale-[0.98] text-white rounded-2xl p-5 sm:p-6 border border-emerald-400/40 shadow-md flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer"
              >
                <div className="mb-2.5 transform group-hover:-translate-y-0.5 group-hover:scale-105 transition-transform duration-200">
                  <BookTruck3DIcon className="w-16 h-16 sm:w-20 sm:h-20" />
                </div>
                <span className="text-base sm:text-lg font-extrabold tracking-tight leading-tight">
                  {t('cardBookTitle')}
                </span>
                <span className="text-xs font-medium text-emerald-100 mt-1">
                  {t('cardBookSub')}
                </span>
              </button>

              {/* Card 2: Transport Permit Inquiry — Deep Royal Navy + Warm Gold (Official Trust & Clearance) */}
              <button
                type="button"
                onClick={handlePermitCardClick}
                className={`group relative overflow-hidden rounded-2xl p-5 sm:p-6 border shadow-md flex flex-col items-center justify-center text-center active:scale-[0.98] transition-all duration-200 cursor-pointer ${
                  transportPermit?.status === 'approved'
                    ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 border-emerald-400 text-emerald-950'
                    : 'bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 hover:from-blue-800 hover:to-slate-900 border-amber-400/50 text-white'
                }`}
              >
                <div className="mb-2.5 transform group-hover:-translate-y-0.5 group-hover:scale-105 transition-transform duration-200">
                  <PermitInquiry3DIcon className="w-16 h-16 sm:w-20 sm:h-20" />
                </div>
                <span className="text-base sm:text-lg font-extrabold tracking-tight leading-tight">
                  {t('cardPermitTitle')}
                </span>
                <span
                  className={`text-xs font-semibold mt-1 ${
                    transportPermit?.status === 'approved'
                      ? 'text-emerald-800'
                      : 'text-amber-300'
                  }`}
                >
                  {transportPermit?.status === 'approved'
                    ? t('cardPermitApprovedSub', { id: transportPermit.id })
                    : transportPermit?.status === 'pending'
                    ? t('cardPermitPendingSub', { id: transportPermit.id })
                    : t('cardPermitSub')}
                </span>
              </button>
            </div>

            {/* ROW 2: Full-Width Activity & Historic Log Card (Redirects to History Tab) */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setFarmerTab('history')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setFarmerTab('history');
                }
              }}
              className="w-full bg-white hover:bg-slate-50/90 active:scale-[0.995] rounded-2xl border-2 border-slate-200 hover:border-emerald-500 p-5 sm:p-6 shadow-2xs transition-all duration-150 cursor-pointer"
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                      {t('homeActivityTitle')}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">{t('homeActivitySub')}</p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full shrink-0">
                  {t('homeActivityViewAll')}
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>

              <div className="space-y-2.5">
                {activityLogs.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          item.type === 'permit'
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.type === 'permit' ? (
                          <FileCheck2 className="w-4 h-4" />
                        ) : (
                          <Truck className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-extrabold text-slate-900 truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{item.subtitle}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`inline-block text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          item.status === 'Completed' || item.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'Cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {item.status}
                      </span>
                      <span className="block text-[11px] font-semibold text-slate-400 mt-1">
                        {item.amountText}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 1B: 3-STEP TRUCK BOOKING WIZARD
           ========================================================= */}
        {farmerTab === 'home' && isBookingFormOpen && (
          <div key="booking-wizard" className="space-y-5 animate-fade-slide">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsBookingFormOpen(false)}
                className="inline-flex items-center gap-1.5 text-sm font-extrabold text-slate-700 hover:text-emerald-700 bg-white border border-slate-300 px-3.5 py-2 rounded-xl transition-colors duration-150 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('btnBackToHome')}</span>
              </button>

              {transportPermit?.status === 'approved' && (
                <button
                  type="button"
                  onClick={() => setIsSoftCopyOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-200" />
                  <span>{t('permitActiveChip', { id: transportPermit.id })}</span>
                </button>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t('bookingFormTitle')}
            </h1>

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
                          className={`h-2.5 rounded-full transition-all duration-300 ${
                            isCompleted || isCurrent ? 'bg-emerald-600' : 'bg-slate-200'
                          }`}
                        />
                        <span
                          className={`text-xs mt-1.5 transition-colors duration-200 ${
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

              {/* STEP 1 */}
              {currentStep === 1 && (
                <div key="step-1" className="p-5 sm:p-7 space-y-6 animate-fade-slide">
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
                        className="w-full px-4 py-4 rounded-xl border-2 border-slate-300 text-base font-semibold transition-colors duration-150 focus:outline-none focus:border-emerald-600"
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
                        className="w-full px-4 py-4 rounded-xl border-2 border-slate-300 text-base font-semibold transition-colors duration-150 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsMainRoadOrIntercity((prev) => !prev)}
                      className={`w-full px-4 py-3.5 rounded-xl border-2 flex items-center justify-between text-left transition-all duration-150 cursor-pointer ${
                        isMainRoadOrIntercity
                          ? 'border-blue-700 bg-blue-50 text-blue-950'
                          : 'border-slate-200 bg-slate-50 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2.5 text-sm font-extrabold">
                        <Route
                          className={`w-5 h-5 transition-colors duration-150 ${
                            isMainRoadOrIntercity ? 'text-blue-700' : 'text-slate-400'
                          }`}
                        />
                        {t('labelMainRoadToggle')}
                      </span>
                      <span
                        className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-extrabold transition-all duration-150 ${
                          isMainRoadOrIntercity
                            ? 'bg-blue-800 text-white scale-105'
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
                      className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-base flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer"
                    >
                      <span>{t('btnNextStep')}</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {currentStep === 2 && (
                <div key="step-2" className="p-5 sm:p-7 space-y-6 animate-fade-slide">
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
                        className="w-full px-4 py-4 rounded-xl border-2 border-slate-300 text-base font-semibold transition-colors duration-150 focus:outline-none focus:border-emerald-600"
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
                          className="w-full appearance-none px-4 py-4 pr-11 rounded-xl border-2 border-slate-300 bg-white text-base font-bold text-slate-900 transition-colors duration-150 focus:outline-none focus:border-emerald-600 cursor-pointer"
                        >
                          <option value={50}>{t('sackOption50')}</option>
                          <option value={25}>{t('sackOption25')}</option>
                        </select>
                        <ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-4.5 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="sack-count-input"
                        className="block text-base font-bold text-slate-800 mb-2"
                      >
                        {t('labelSackCount')}
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => adjustSackCount(-1)}
                          aria-label="Decrease sack count"
                          className="w-16 h-16 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 flex items-center justify-center text-slate-900 cursor-pointer active:scale-95 transition-all duration-150 shrink-0"
                        >
                          <Minus className="w-6 h-6" />
                        </button>

                        <div className="flex-1 h-16 bg-white border-2 border-slate-300 focus-within:border-emerald-600 rounded-xl px-4 flex flex-col items-center justify-center transition-colors duration-150">
                          <input
                            id="sack-count-input"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={sackCountInput}
                            onChange={handleSackInputChange}
                            onBlur={handleSackInputBlur}
                            placeholder="0"
                            className="w-full text-center text-2xl font-extrabold text-slate-900 bg-transparent focus:outline-none leading-none"
                          />
                          <span className="text-xs sm:text-sm font-bold text-emerald-700 mt-1 block">
                            {t('totalWeightSummary', { kg: totalWeightKg.toLocaleString() })}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => adjustSackCount(1)}
                          aria-label="Increase sack count"
                          className="w-16 h-16 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 flex items-center justify-center text-slate-900 cursor-pointer active:scale-95 transition-all duration-150 shrink-0"
                        >
                          <Plus className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {bookingOnHoldForPermit && transportPermit?.status === 'pending' && (
                    <div className="rounded-2xl border-2 border-blue-800 bg-blue-50 p-5 space-y-3 animate-fade-slide">
                      <div className="flex items-start gap-3">
                        <Clock className="w-6 h-6 text-blue-800 shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-base font-extrabold text-blue-950">
                            {t('permitHoldTitle')}
                          </h3>
                          <p className="text-xs sm:text-sm text-blue-900 mt-1">
                            {t('permitHoldSub', { id: transportPermit.id })}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={approveTransportPermit}
                        className="w-full py-3 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 active:scale-[0.99] text-white font-extrabold text-sm transition-all duration-150 cursor-pointer"
                      >
                        {t('btnSimApprovePermit')}
                      </button>
                    </div>
                  )}

                  {bookingOnHoldForPermit && hasValidApprovedPermit && (
                    <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-5 space-y-3 animate-fade-slide">
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
                          className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-xs font-extrabold shrink-0 cursor-pointer hover:bg-emerald-100 transition-colors duration-150"
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
                        className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer"
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
                      className="py-4 px-4 rounded-xl border-2 border-slate-300 hover:bg-slate-100 active:scale-[0.98] text-slate-700 font-extrabold text-base flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-150"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span>{t('btnBack')}</span>
                    </button>
                    <button
                      type="button"
                      disabled={!canProceedStep2}
                      onClick={handleStep2Next}
                      className="col-span-2 py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-base flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer"
                    >
                      <span>{t('btnNextStep')}</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {currentStep === 3 && (
                <div key="step-3" className="p-5 sm:p-7 space-y-6 animate-fade-slide">
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
                            className={`w-full px-5 py-4 rounded-xl border-2 flex items-center justify-between gap-4 text-left transition-all duration-150 cursor-pointer ${
                              isSelected
                                ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-2xs scale-[1.005]'
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
                      className="py-4 px-4 rounded-xl border-2 border-slate-300 hover:bg-slate-100 active:scale-[0.98] text-slate-700 font-extrabold text-base flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-150"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span>{t('btnBack')}</span>
                    </button>
                    <button
                      type="button"
                      disabled={!selectedTruckId || isConfirming}
                      onClick={handleConfirmTruck}
                      className="col-span-2 py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-base flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer"
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
          </div>
        )}

        {/* =========================================================
            TAB 2: FULL ACTIVITY & TRIP HISTORY LOG
           ========================================================= */}
        {farmerTab === 'history' && (
          <div key="tab-history" className="space-y-5 animate-fade-slide">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {t('historyTitle')}
              </h1>
              <p className="text-sm text-slate-500 mt-1">{t('historySubtitle')}</p>
            </div>

            {activityLogs.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-slate-200 p-10 text-center text-sm font-semibold text-slate-500">
                {t('historyEmpty')}
              </div>
            ) : (
              <div className="space-y-3">
                {activityLogs.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border-2 border-slate-200 p-4 sm:p-5 flex items-start justify-between gap-4 shadow-2xs"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                          item.type === 'permit'
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.type === 'permit' ? (
                          <FileCheck2 className="w-5 h-5" />
                        ) : (
                          <Truck className="w-5 h-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-base font-extrabold text-slate-900">{item.title}</p>
                        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">{item.subtitle}</p>
                        <p className="text-xs text-slate-400 font-medium mt-1.5">
                          {item.timestamp}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`inline-block text-xs font-extrabold px-3 py-1 rounded-full ${
                          item.status === 'Completed' || item.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'Cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {item.status}
                      </span>
                      <p className="text-sm font-extrabold text-slate-800 mt-1.5">
                        {item.amountText}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            TAB 3: NOTIFICATIONS / ALERTS
           ========================================================= */}
        {farmerTab === 'notifications' && (
          <div key="tab-notifications" className="space-y-5 animate-fade-slide">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {t('notifTitle')}
                </h1>
                <p className="text-sm text-slate-500 mt-1">{t('notifSubtitle')}</p>
              </div>

              {unreadNotifCount > 0 && (
                <button
                  type="button"
                  onClick={markAllNotificationsRead}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition cursor-pointer"
                >
                  {t('btnMarkAllRead')}
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-slate-200 p-10 text-center text-sm font-semibold text-slate-500">
                {t('notifEmpty')}
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`rounded-2xl border-2 p-4 sm:p-5 flex items-start gap-3.5 transition ${
                      notif.read
                        ? 'bg-white border-slate-200'
                        : 'bg-emerald-50/70 border-emerald-400'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        notif.read
                          ? 'bg-slate-100 text-slate-500'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      <Bell className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-base font-extrabold text-slate-900">{notif.title}</p>
                        <span className="text-xs font-semibold text-slate-400 shrink-0">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            TAB 4: FARMER PROFILE
           ========================================================= */}
        {farmerTab === 'profile' && (
          <div key="tab-profile" className="space-y-5 animate-fade-slide">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {t('profileTitle')}
              </h1>
              <p className="text-sm text-slate-500 mt-1">{t('profileSubtitle')}</p>
            </div>

            <form
              onSubmit={handleSaveProfile}
              className="bg-white rounded-2xl border-2 border-slate-200 p-5 sm:p-7 space-y-5 shadow-2xs"
            >
              <div>
                <label className="flex items-center gap-2 text-sm font-extrabold text-slate-800 mb-1.5">
                  <User className="w-4 h-4 text-emerald-600" />
                  {t('profileNameLabel')}
                </label>
                <input
                  type="text"
                  required
                  value={profileDraft.fullName}
                  onChange={(e) =>
                    setProfileDraft((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-300 text-base font-semibold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-extrabold text-slate-800 mb-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  {t('profileFarmLabel')}
                </label>
                <input
                  type="text"
                  required
                  value={profileDraft.farmLocation}
                  onChange={(e) =>
                    setProfileDraft((prev) => ({ ...prev, farmLocation: e.target.value }))
                  }
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-300 text-base font-semibold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-extrabold text-slate-800 mb-1.5">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    {t('profilePhoneLabel')}
                  </label>
                  <input
                    type="text"
                    value={profileDraft.phone}
                    onChange={(e) =>
                      setProfileDraft((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-300 text-base font-semibold focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-extrabold text-slate-800 mb-1.5">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    {t('profileCoopLabel')}
                  </label>
                  <input
                    type="text"
                    value={profileDraft.coopName}
                    onChange={(e) =>
                      setProfileDraft((prev) => ({ ...prev, coopName: e.target.value }))
                    }
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-300 text-base font-semibold focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <span className="block text-sm font-extrabold text-slate-800 mb-2">
                  {t('profileLangLabel')}
                </span>
                <div className="grid grid-cols-3 gap-2.5">
                  {LANGUAGES.map((lang) => {
                    const active = language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setLanguage(lang.code)}
                        className={`py-3 px-3 rounded-xl border-2 text-sm font-extrabold transition cursor-pointer ${
                          active
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {lang.fullName}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-base flex items-center justify-center gap-2 transition cursor-pointer"
              >
                {profileSaved ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>{t('profileSavedToast')}</span>
                  </>
                ) : (
                  <span>{t('btnSaveProfile')}</span>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* =========================================================
          FIXED BOTTOM NAVIGATION PANEL (Home | History | Alerts | Profile)
         ========================================================= */}
      <nav
        aria-label="Farmer Navigation"
        className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_16px_rgba(15,23,42,0.06)]"
      >
        <div className="max-w-3xl mx-auto px-2 py-1.5 grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = farmerTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setFarmerTab(item.id);
                  if (item.id === 'home') {
                    setIsBookingFormOpen(false);
                  }
                }}
                className={`relative py-2 px-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-semibold'
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-150 ${
                      isSelected ? 'text-emerald-600 scale-110' : ''
                    }`}
                  />
                  {item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] sm:text-xs leading-none">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 5-Attribute Permit Application Modal */}
      <PermitFormModal
        isOpen={isPermitModalOpen}
        onClose={() => setIsPermitModalOpen(false)}
        prefillData={prefillPermitData}
        triggerReasons={permitTriggerInfo}
        onSubmitted={() => {
          if (isBookingFormOpen && currentStep === 2) {
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
    </>
  );
}