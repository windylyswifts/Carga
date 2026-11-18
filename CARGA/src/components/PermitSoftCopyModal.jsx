import React, { useEffect } from 'react';
import { ShieldCheck, X, QrCode } from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import CargaLogo from './CargaLogo';

export default function PermitSoftCopyModal({ permit, isOpen, onClose }) {
  const { t } = useLogistics();

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !permit) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-slate-950/75 flex items-center justify-center p-3 sm:p-5 animate-backdrop-fade"
    >
      <div className="bg-white w-full max-w-lg max-h-[90dvh] rounded-2xl border-2 border-emerald-600 shadow-2xl flex flex-col overflow-hidden animate-modal-pop">
        {/* Pinned Official Bar with CARGA Horizontal Logo */}
        <div className="bg-white border-b border-slate-200 px-5 sm:px-6 py-4 flex items-center justify-between gap-3 shrink-0">
          <CargaLogo variant="horizontal" className="h-11 sm:h-12 w-auto object-contain" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors duration-150 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-header */}
        <div className="bg-emerald-950 text-white px-5 sm:px-6 py-2.5 flex items-center justify-between text-xs shrink-0">
          <span className="font-extrabold uppercase tracking-wider text-emerald-300">
            {t('softCopyHeader')}
          </span>
          <span className="font-mono font-bold text-white">{permit.id}</span>
        </div>

        {/* Smooth Scrollable Official Soft Copy Body */}
        <div className="overflow-y-auto overscroll-contain touch-pan-y flex-1 p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 bg-emerald-200/80 px-2.5 py-1 rounded-full">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                {t('softCopyVerifiedStamp')}
              </span>
              <p className="text-xs text-slate-600 mt-2">
                <span className="font-bold">{t('softCopyIssuedLabel')}:</span>{' '}
                {permit.issuedAt || permit.submittedAt}
              </p>
            </div>

            <div className="w-16 h-16 rounded-xl bg-white border-2 border-emerald-600 flex flex-col items-center justify-center text-emerald-900 shrink-0">
              <QrCode className="w-9 h-9" />
              <span className="text-[8px] font-mono font-extrabold mt-0.5">VERIFIED</span>
            </div>
          </div>

          <div className="space-y-3 text-sm divide-y divide-slate-100">
            <div className="pt-1">
              <span className="text-xs font-bold text-slate-400 block">
                {t('permitAttr1Label')}
              </span>
              <p className="font-extrabold text-slate-900 mt-0.5">{permit.plantDetails}</p>
            </div>

            <div className="pt-3">
              <span className="text-xs font-bold text-slate-400 block">
                {t('permitAttr2Label')}
              </span>
              <p className="font-extrabold text-slate-900 mt-0.5">{permit.applicantFullName}</p>
            </div>

            <div className="pt-3">
              <span className="text-xs font-bold text-slate-400 block">
                {t('permitAttr3Label')}
              </span>
              <p className="font-extrabold text-slate-900 mt-0.5">{permit.plantSource}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3">
              <div>
                <span className="text-xs font-bold text-slate-400 block">
                  {t('permitAttr4Label')}
                </span>
                <p className="font-extrabold text-slate-900 mt-0.5">
                  {permit.declaredConveyance}
                </p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block">
                  {t('permitAttr5Label')}
                </span>
                <p className="font-extrabold text-emerald-700 mt-0.5">
                  {Number(permit.weightInKilos).toLocaleString()} kg
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-extrabold text-sm transition-all duration-150 cursor-pointer"
          >
            {t('btnCloseModal')}
          </button>
        </div>
      </div>
    </div>
  );
}