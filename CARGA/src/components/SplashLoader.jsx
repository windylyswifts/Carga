import React, { useState, useEffect } from 'react';

export default function SplashLoader() {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setIsFadingOut(true), 1100);
    const unmountTimer = setTimeout(() => setIsUnmounted(true), 1400);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (isUnmounted) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center transition-all duration-300 ease-out ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Soft Emerald Ambient Glow */}
        <div className="absolute -inset-5 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />

        {/* Animated CARGA App Icon */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 drop-shadow-xl animate-splash-tile">
          <svg
            viewBox="0 0 120 120"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="splashIconBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2f852b" />
                <stop offset="55%" stopColor="#135d2b" />
                <stop offset="100%" stopColor="#083b1c" />
              </linearGradient>
              <clipPath id="splashIconClip">
                <rect x="4" y="4" width="112" height="112" rx="26" />
              </clipPath>
            </defs>

            {/* Rounded Square App Icon Base */}
            <rect
              x="4"
              y="4"
              width="112"
              height="112"
              rx="26"
              fill="url(#splashIconBg)"
              stroke="#3b9436"
              strokeWidth="1.5"
            />

            <g clipPath="url(#splashIconClip)">
              {/* Staggered Speed Lines */}
              <path
                className="animate-streak-1"
                d="M17 59.5 L29 57.5 L28.5 61.5 L17 61 Z"
                fill="#ffffff"
              />
              <path
                className="animate-streak-2"
                d="M13 68.5 L28.5 65.5 L29.5 69.5 L13 69.8 Z"
                fill="#ffffff"
              />
              <path
                className="animate-streak-3"
                d="M18 77 L30.5 73.5 L32.2 77.2 L18 77.8 Z"
                fill="#ffffff"
              />

              {/* Vehicle + C-Body Group Driving In & Settling */}
              <g className="animate-truck-drive">
                {/* Outer Dynamic Arcs */}
                <path
                  d="M27 52 C34 33, 56 24, 76 31.5 C64 29, 43 32, 27 52 Z"
                  fill="#ffffff"
                />
                <path
                  d="M32 81 C42 93, 58 95, 68 89 C56 91, 43 89, 32 81 Z"
                  fill="#ffffff"
                />

                {/* Bold White C-Letterform + Truck Cab */}
                <path
                  d="M84 40.5
                     C 74 34, 59 33, 47 39
                     C 34 46, 28 60, 33 73
                     C 37 83, 47 88, 59 88
                     L 73 88
                     C 73 79, 80 73, 88 73
                     C 93 73, 97 76, 98 81
                     L 98 86
                     L 106 86
                     C 108 86, 109 84.5, 109 82.5
                     L 109 73
                     C 109 70.5, 108 68.5, 106.5 66.5
                     L 97 54
                     C 95.5 52, 93.5 51, 91 51
                     L 76 51
                     C 78 54, 79 57, 79 60
                     L 82 60
                     L 84 53.5
                     L 91 53.5
                     C 93 53.5, 94.5 54.5, 96 56.5
                     L 103.5 66.5
                     L 86 66.5
                     L 88 59
                     L 93 59
                     L 96.5 64
                     L 104 64
                     L 105.5 68.5
                     L 105.5 81
                     L 99 81
                     C 98 74, 92 70, 86 70
                     C 77 70, 71 77, 71 84
                     L 59 84
                     C 49 84, 42 78, 40 68
                     C 38 56, 46 46, 58 45
                     C 65 44.5, 71 46.5, 75 49.5
                     C 76.5 50.5, 78 50, 79 48.8
                     L 86 41.5
                     C 86.5 40.8, 85.2 41.2, 84 40.5 Z"
                  fill="#ffffff"
                />

                {/* Front Truck Wheel */}
                <circle cx="86" cy="84" r="9.5" fill="#ffffff" />
                <circle cx="86" cy="84" r="4.2" fill="#0d4b24" />
              </g>

              {/* Rising Sun + Farm Rows + Sprout Leaves */}
              <g className="animate-farm-bloom">
                {/* Golden Rising Sun Arc */}
                <path
                  d="M55.5 57.5 A 10.5 10.5 0 0 1 74 59.5"
                  stroke="#f5b82e"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                {/* Sprout Leaves */}
                <path
                  d="M60 63 C59.5 57, 54 55, 50.5 56.5 C52 60.5, 56 62.5, 60 63 Z"
                  fill="#ffffff"
                />
                <path
                  d="M62 62.5 C62 56, 67.5 54, 71 55.5 C69.5 59.5, 65.5 62, 62 62.5 Z"
                  fill="#ffffff"
                />
                {/* Contoured Farm Fields */}
                <path
                  d="M47 67.5 Q52 65.5 57 65.5 Q51 68 48.5 70 Z"
                  fill="#ffffff"
                />
                <path
                  d="M50 71.5 Q59 65.5 71 64.5 Q60 68.5 53 74 Z"
                  fill="#ffffff"
                />
                <path
                  d="M55.5 75 Q64 67.5 76.5 64.5 Q67 69.5 61 76 Z"
                  fill="#ffffff"
                />
                <path
                  d="M63.5 76 Q70 70.5 78.5 66.5 L77 73 Q71 76 63.5 76 Z"
                  fill="#ffffff"
                />
              </g>
            </g>
          </svg>
        </div>

        {/* Sleek Loading Progress Indicator */}
        <div className="w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-5">
          <div className="h-full w-full bg-emerald-500 rounded-full animate-splash-bar" />
        </div>
      </div>
    </div>
  );
}