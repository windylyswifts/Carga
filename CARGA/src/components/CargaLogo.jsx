import React from 'react';

const LOGO_ASSETS = {
  icon: {
    src: '/carga-app-icon.svg',
    alt: 'CARGA App Icon',
    defaultClass: 'w-10 h-10 object-contain',
  },
  horizontal: {
    src: '/carga-logo-horizontal.svg',
    alt: 'CARGA — Agri Transport Marketplace',
    defaultClass: 'h-10 sm:h-11 w-auto object-contain',
  },
  'navbar-blended': {
    src: '/carga-logo-horizontal.svg',
    alt: 'CARGA — Agri Transport Marketplace',
    defaultClass: 'h-9 sm:h-10 w-auto object-contain brightness-0 invert',
  },
  stacked: {
    src: '/carga-logo-stacked.svg',
    alt: 'CARGA — Agri Transport Marketplace',
    defaultClass: 'h-24 w-auto object-contain',
  },
};

export default function CargaLogo({ variant = 'horizontal', className = '' }) {
  const asset = LOGO_ASSETS[variant] || LOGO_ASSETS.horizontal;

  return (
    <img
      src={asset.src}
      alt={asset.alt}
      className={`select-none shrink-0 transition-transform duration-200 ${
        className || asset.defaultClass
      }`}
      draggable="false"
    />
  );
}