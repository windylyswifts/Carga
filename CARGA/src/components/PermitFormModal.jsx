import React, { useState, useEffect } from 'react';
import { FileCheck2, ShieldCheck, X, AlertTriangle } from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import ModalShell from './ModalShell';

export default function PermitFormModal({
  isOpen,
  onClose,
  onSubmitted,
  prefillData = {},
  triggerReasons = null,
}) {
  const { t, submitPermitApplication } = useLogistics();

  const [plantDetails, setPlantDetails] = useState('');
  const [applicantFullName, setApplicantFullName] = useState('');
  const [plantSource, setPlantSource] = useState('');
  const [declaredConveyance, setDeclaredConveyance] = useState('');
  const [weightInKilos, setWeightInKilos] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setPlantDetails(prefillData.plantDetails || '');
    setApplicantFullName(prefillData.applicantFullName || 'Juan Dela Cruz');
    setPlantSource(prefillData.plantSource || '');
    setDeclaredConveyance(prefillData.declaredConveyance || 'Cargo Hauling Truck');
    setWeightInKilos(prefillData.weightInKilos ? String(prefillData.weightInKilos) : '');
  }, [isOpen, prefillData]);

  const isFormValid =
    plantDetails.trim().length > 0 &&
    applicantFullName.trim().length > 0 &&
    plantSource.trim().length > 0 &&
    declaredConveyance.trim().length > 0 &&
    Number(weightInKilos) > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid || isAuthenticating) return;

    setIsAuthenticating(true);
    setTimeout(() => {
      const created = submitPermitApplication({
        plantDetails,
        applicantFullName,
        plantSource,
        declaredConveyance,
        weightInKilos,
      });
      setIsAuthenticating(false);
      onSubmitted?.(created);
      onClose();
    }, 450);
  };

  const modalHeader = (
    <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
          <FileCheck2 className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300 block">
            {t('permitModalBadge')}
          </span>
          <h3 className="text-base sm:text-lg font-extrabold leading-tight truncate">
            {t('permitModalTitle')}
          </h3>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close modal"
        className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors duration-150 cursor-pointer shrink-0"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );

  const modalFooter = (
    <button
      type="submit"
      form="permit-application-form"
      disabled={!isFormValid || isAuthenticating}
      className="w-full py-3.5 sm:py-4 px-6 rounded-xl bg-blue-900 hover:bg-blue-800 active:scale-[0.99] disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition-all duration-150 cursor-pointer"
    >
      <ShieldCheck className="w-5 h-5 text-amber-300 shrink-0" />
      <span>{isAuthenticating ? t('btnAuthenticating') : t('btnAvailPermitAuth')}</span>
    </button>
  );

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      maxWidthClass="max-w-xl"
      borderClass="border-blue-900"
      header={modalHeader}
      footer={modalFooter}
    >
      {/* Validation Reason Alert */}
      {triggerReasons && (triggerReasons.exceedsWeight || triggerReasons.crossesRoute) && (
        <div className="bg-blue-50 border-b border-blue-200 px-5 sm:px-6 py-3 flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
          <div className="text-xs font-bold text-blue-950 space-y-0.5">
            {triggerReasons.exceedsWeight && (
              <p>
                •{' '}
                {t('permitTriggerWeight', {
                  kg: Number(prefillData.weightInKilos || 0).toLocaleString(),
                })}
              </p>
            )}
            {triggerReasons.crossesRoute && <p>• {t('permitTriggerRoute')}</p>}
          </div>
        </div>
      )}

      {/* 5-Attribute Form */}
      <form
        id="permit-application-form"
        onSubmit={handleSubmit}
        className="p-5 sm:p-6 space-y-4 pb-8"
      >
        <div>
          <label className="block text-xs sm:text-sm font-extrabold text-slate-800 mb-1.5">
            {t('permitAttr1Label')}
          </label>
          <input
            type="text"
            required
            value={plantDetails}
            onChange={(e) => setPlantDetails(e.target.value)}
            placeholder={t('permitAttr1Placeholder')}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 text-sm font-semibold transition-colors duration-150 focus:outline-none focus:border-blue-800"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-extrabold text-slate-800 mb-1.5">
            {t('permitAttr2Label')}
          </label>
          <input
            type="text"
            required
            value={applicantFullName}
            onChange={(e) => setApplicantFullName(e.target.value)}
            placeholder={t('permitAttr2Placeholder')}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 text-sm font-semibold transition-colors duration-150 focus:outline-none focus:border-blue-800"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-extrabold text-slate-800 mb-1.5">
            {t('permitAttr3Label')}
          </label>
          <input
            type="text"
            required
            value={plantSource}
            onChange={(e) => setPlantSource(e.target.value)}
            placeholder={t('permitAttr3Placeholder')}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 text-sm font-semibold transition-colors duration-150 focus:outline-none focus:border-blue-800"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-extrabold text-slate-800 mb-1.5">
              {t('permitAttr4Label')}
            </label>
            <input
              type="text"
              required
              value={declaredConveyance}
              onChange={(e) => setDeclaredConveyance(e.target.value)}
              placeholder={t('permitAttr4Placeholder')}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 text-sm font-semibold transition-colors duration-150 focus:outline-none focus:border-blue-800"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-extrabold text-slate-800 mb-1.5">
              {t('permitAttr5Label')}
            </label>
            <input
              type="number"
              min="1"
              required
              value={weightInKilos}
              onChange={(e) => setWeightInKilos(e.target.value)}
              placeholder="e.g., 8500"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 text-sm font-semibold transition-colors duration-150 focus:outline-none focus:border-blue-800"
            />
          </div>
        </div>
      </form>
    </ModalShell>
  );
}