import React from 'react';

const AiAssistantLogo = ({ className = "w-8 h-8", hasGlow = true }) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {/* Outer subtle cyan glow */}
      {hasGlow && (
        <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-sm animate-pulse" />
      )}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10"
      >
        <defs>
          <linearGradient id="logo-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#090d16" />
          </linearGradient>
          <linearGradient id="logo-visor-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#030712" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="logo-cyan-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="logo-head-metal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Circle Frame */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="url(#logo-bg-grad)"
          stroke="#38bdf8"
          strokeWidth="2.5"
          strokeOpacity="0.6"
        />

        {/* Headset band */}
        <path
          d="M 22 50 C 22 30 35 22 50 22 C 65 22 78 30 78 50"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Headset Earcups with Cyan Glow */}
        <rect x="16" y="44" width="8" height="18" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
        <rect x="18" y="48" width="4" height="10" rx="2" fill="url(#logo-cyan-glow)" filter="url(#logo-glow)" />
        <rect x="76" y="44" width="8" height="18" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
        <rect x="78" y="48" width="4" height="10" rx="2" fill="url(#logo-cyan-glow)" filter="url(#logo-glow)" />

        {/* Antenna top node */}
        <path d="M 50 22 L 50 14" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="50" cy="13" r="3.5" fill="url(#logo-cyan-glow)" filter="url(#logo-glow)" />

        {/* Main Head Shape */}
        <rect x="25" y="32" width="50" height="42" rx="16" fill="url(#logo-head-metal)" />

        {/* Visor / Face Screen */}
        <rect x="29" y="38" width="42" height="26" rx="10" fill="url(#logo-visor-grad)" stroke="#334155" strokeWidth="1" />

        {/* Glowing Cyan Cyber Eyes */}
        <path
          d="M 37 49 Q 42 43 47 49"
          fill="none"
          stroke="url(#logo-cyan-glow)"
          strokeWidth="3.2"
          strokeLinecap="round"
          filter="url(#logo-glow)"
        />
        <path
          d="M 53 49 Q 58 43 63 49"
          fill="none"
          stroke="url(#logo-cyan-glow)"
          strokeWidth="3.2"
          strokeLinecap="round"
          filter="url(#logo-glow)"
        />

        {/* Digital blush dots */}
        <circle cx="36" cy="56" r="1.5" fill="#38bdf8" opacity="0.8" />
        <circle cx="64" cy="56" r="1.5" fill="#38bdf8" opacity="0.8" />

        {/* Digital smile */}
        <path d="M 46 56 Q 50 59 54 56" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />

        {/* Neck & Shoulder Plate */}
        <path d="M 39 74 L 61 74 L 67 86 L 33 86 Z" fill="#475569" />
        <path d="M 44 74 L 56 74 L 58 80 L 42 80 Z" fill="url(#logo-cyan-glow)" opacity="0.85" />
        <circle cx="50" cy="83" r="1.5" fill="#ffffff" />
      </svg>
    </div>
  );
};

export default AiAssistantLogo;
