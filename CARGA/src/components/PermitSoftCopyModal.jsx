import React from 'react';
import { ShieldCheck, X, QrCode } from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import CargaLogo from './CargaLogo';
import ModalShell from './ModalShell';

export default function PermitSoftCopyModal({ permit, isOpen, onClose }) {
  const { t } = useLogistics();

  if (!permit) return null;

  const modalHeader = (
    <div className="bg-white border-b border-slate-200 px-5 sm:px-6 py-4 flex items-center justify-between gap-3">
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
  );

  const modalSubHeader = (
    <div className="bg-emerald-950 text-white px-5 sm:px-6 py-2.5 flex items-center justify-between text-xs">
      <span className="font-extrabold uppercase tracking-wider text-emerald-300">
        {t('softCopyHeader')}
      </span>
      <span className="font-mono font-bold text-white">{permit.id}</span>
    </div>
  );

  const modalFooter = (
    <button
      type="button"
      onClick={onClose}
      className="w-full py-3.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-extrabold text-sm transition-all duration-150 cursor-pointer"
    >
      {t('btnCloseModal')}
    </button>
  );

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      maxWidthClass="max-w-lg"
      borderClass="border-emerald-600"
      header={modalHeader}
      subHeader={modalSubHeader}
      footer={modalFooter}
    >
      <div className="p-5 sm:p-6 space-y-5 pb-8">
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
      </div>
    </ModalShell>
  );
}