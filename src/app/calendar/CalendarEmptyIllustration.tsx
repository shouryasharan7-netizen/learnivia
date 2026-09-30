import React from "react";

export function CalendarEmptyIllustration({ className }: { className?: string }) {
  return (
    <svg
      width="240"
      height="220"
      viewBox="0 0 240 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Soft background glow / puddle */}
      <path
        d="M60 110C50 65 95 35 140 45C185 55 205 95 195 140C185 185 130 195 85 180C45 165 70 150 60 110Z"
        fill="#F0FDF4"
      />

      {/* Calendar Outer Card */}
      <rect
        x="65"
        y="50"
        width="110"
        height="100"
        rx="14"
        fill="#FFFFFF"
        stroke="#1E293B"
        strokeWidth="2.5"
      />

      {/* Header divider line */}
      <line
        x1="65"
        y1="75"
        x2="175"
        y2="75"
        stroke="#1E293B"
        strokeWidth="2.5"
      />

      {/* Binder Rings */}
      <rect x="80" y="42" width="6" height="16" rx="3" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
      <rect x="102" y="42" width="6" height="16" rx="3" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
      <rect x="128" y="42" width="6" height="16" rx="3" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
      <rect x="150" y="42" width="6" height="16" rx="3" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />

      {/* Grid of days */}
      {/* Row 1 */}
      <rect x="78" y="86" width="18" height="18" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
      <rect x="102" y="86" width="18" height="18" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
      <rect x="126" y="86" width="18" height="18" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
      <rect x="150" y="86" width="18" height="18" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />

      {/* Row 2 */}
      <rect x="78" y="112" width="18" height="18" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
      <rect x="102" y="112" width="18" height="18" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
      <rect x="126" y="112" width="18" height="18" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
      <rect x="150" y="112" width="18" height="18" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />

      {/* Pointer Cursor Arrow clicking into calendar */}
      <g filter="drop-shadow(0px 3px 6px rgba(0,0,0,0.12))">
        <path
          d="M165 130L165 158L173 151L179 164L183 162L177 149L186 149L165 130Z"
          fill="#FFFFFF"
          stroke="#0F172A"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
