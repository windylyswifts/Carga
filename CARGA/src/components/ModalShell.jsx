import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function ModalShell({
  isOpen,
  onClose,
  maxWidthClass = 'max-w-xl',
  borderClass = 'border-slate-200',
  header,
  subHeader = null,
  footer = null,
  children,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const html = document.documentElement;
    const body = document.body;
    const scrollbarWidth = window.innerWidth - html.clientWidth;

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyPaddingRight = body.style.paddingRight;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.paddingRight = prevBodyPaddingRight;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-slate-950/75 flex items-end sm:items-center justify-center p-0 sm:p-5 animate-backdrop-fade"
    >
      {/* Responsive Sheet on Mobile (92dvh) -> Centered Card on Desktop (max-h-88dvh) */}
      <div
        className={`bg-white w-full ${maxWidthClass} h-[92dvh] sm:h-auto sm:max-h-[88dvh] rounded-t-3xl sm:rounded-2xl border-t-2 sm:border-2 ${borderClass} shadow-2xl flex flex-col overflow-hidden animate-modal-pop`}
      >
        {header && <div className="shrink-0">{header}</div>}
        {subHeader && <div className="shrink-0">{subHeader}</div>}

        {/* Single Native Scroll Container (min-h-0 allows flex child to shrink & scroll cleanly) */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
          {children}
        </div>

        {footer && (
          <div className="shrink-0 bg-slate-50 border-t border-slate-200 px-5 sm:px-6 py-3.5">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}