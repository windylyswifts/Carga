import React, { useId } from 'react';

export function BookTruck3DIcon({ className = 'w-14 h-14 sm:w-16 sm:h-16' }) {
  const uid = useId().replace(/:/g, '');

  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`truckShadow-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#022c22" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#022c22" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`cargoTop-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id={`cargoSide-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id={`cabBody-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="65%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <linearGradient id={`windshield-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
      </defs>

      {/* Floating 3D Ground Shadow */}
      <ellipse cx="48" cy="79" rx="36" ry="8" fill={`url(#truckShadow-${uid})`} />

      {/* 3D Cargo Bed Extrusion (Back Wall & Depth) */}
      <path
        d="M14 34 L46 24 L56 30 L56 58 L22 68 L14 62 Z"
        fill="#064e3b"
      />

      {/* Harvest Sacks / Crates Stacked in 3D */}
      <rect
        x="18"
        y="24"
        width="17"
        height="13"
        rx="4"
        fill={`url(#cargoTop-${uid})`}
        stroke="#fef9c3"
        strokeWidth="1"
      />
      <rect
        x="33"
        y="21"
        width="18"
        height="14"
        rx="4"
        fill={`url(#cargoSide-${uid})`}
        stroke="#fde68a"
        strokeWidth="1"
      />
      <rect
        x="23"
        y="32"
        width="24"
        height="14"
        rx="4"
        fill={`url(#cargoTop-${uid})`}
        stroke="#ffffff"
        strokeWidth="1"
      />

      {/* 3D Cargo Side Panel */}
      <path
        d="M14 41 L54 41 L54 63 C54 65.2 52.2 67 50 67 L18 67 C15.8 67 14 65.2 14 63 Z"
        fill={`url(#cabBody-${uid})`}
      />
      <path
        d="M14 41 L54 41 L54 45 L14 45 Z"
        fill="#ffffff"
      />
      {/* Emerald Side Stripe */}
      <rect x="18" y="50" width="32" height="5" rx="2.5" fill="#10b981" />

      {/* 3D Truck Cab (Front Right) */}
      <path
        d="M54 33 L70 33 C73.5 33 76.5 35 78 38.2 L83 49 C83.7 50.5 84 52.1 84 53.8 L84 62 C84 64.8 81.8 67 79 67 L54 67 Z"
        fill={`url(#cabBody-${uid})`}
      />
      {/* Specular Roof Highlight */}
      <path
        d="M55 34.5 L69.5 34.5 C72 34.5 74 35.8 75.2 38 L55 38 Z"
        fill="#ffffff"
      />
      {/* 3D Tinted Windshield */}
      <path
        d="M59 38 L70.5 38 C72.2 38 73.7 39 74.4 40.5 L78.5 49 L59 49 Z"
        fill={`url(#windshield-${uid})`}
      />
      {/* Glass Glare */}
      <path d="M62 40 L67 40 L64 47 L60 47 Z" fill="#bae6fd" fillOpacity="0.65" />

      {/* Headlight Glow */}
      <rect x="80" y="55" width="4" height="6" rx="2" fill="#fde047" />

      {/* 3D Chassis Undercarriage */}
      <rect x="16" y="65" width="66" height="4" rx="2" fill="#1e293b" />

      {/* 3D Rear Wheel */}
      <circle cx="29" cy="69" r="9.5" fill="#0f172a" />
      <circle cx="29" cy="69" r="6" fill="#cbd5e1" />
      <circle cx="29" cy="69" r="2.5" fill="#334155" />

      {/* 3D Front Wheel */}
      <circle cx="70" cy="69" r="9.5" fill="#0f172a" />
      <circle cx="70" cy="69" r="6" fill="#cbd5e1" />
      <circle cx="70" cy="69" r="2.5" fill="#334155" />
    </svg>
  );
}

export function PermitInquiry3DIcon({ className = 'w-14 h-14 sm:w-16 sm:h-16' }) {
  const uid = useId().replace(/:/g, '');

  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`docShadow-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#020617" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#020617" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`paperFront-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <linearGradient id={`goldBadge-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="45%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id={`emeraldSeal-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      {/* Ground Shadow */}
      <ellipse cx="48" cy="82" rx="30" ry="7" fill={`url(#docShadow-${uid})`} />

      {/* Back Stacked Sheet (3D Paper Depth) */}
      <rect
        x="26"
        y="14"
        width="46"
        height="58"
        rx="8"
        transform="rotate(6 26 14)"
        fill="#93c5fd"
        fillOpacity="0.45"
      />

      {/* Main 3D Document Card */}
      <rect
        x="21"
        y="16"
        width="48"
        height="60"
        rx="9"
        fill={`url(#paperFront-${uid})`}
        stroke="#ffffff"
        strokeWidth="1.5"
      />

      {/* Top Official Header Strip */}
      <path
        d="M21 25 C21 20 25 16 30 16 L60 16 C65 16 69 20 69 25 L69 29 L21 29 Z"
        fill={`url(#goldBadge-${uid})`}
      />

      {/* Document Text Lines */}
      <rect x="29" y="36" width="26" height="4" rx="2" fill="#64748b" />
      <rect x="29" y="44" width="32" height="3.5" rx="1.75" fill="#94a3b8" />
      <rect x="29" y="51" width="22" height="3.5" rx="1.75" fill="#94a3b8" />

      {/* 3D Floating Official Clearance Seal + Checkmark (Bottom Right) */}
      <circle cx="63" cy="61" r="16" fill="#0f172a" fillOpacity="0.22" />
      <circle
        cx="62"
        cy="59"
        r="15"
        fill={`url(#emeraldSeal-${uid})`}
        stroke="#ffffff"
        strokeWidth="2"
      />
      {/* Specular Gloss Arc on Seal */}
      <path
        d="M52 53 A 12 12 0 0 1 68 48"
        stroke="#a7f3d0"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Crisp Checkmark */}
      <path
        d="M56 59.5 L60.2 63.5 L68.5 55"
        stroke="#ffffff"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}