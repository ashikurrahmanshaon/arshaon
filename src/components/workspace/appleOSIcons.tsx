'use client';

import React from 'react';

export type AppleAppId =
  | 'finder'
  | 'notes'
  | 'messages'
  | 'mail'
  | 'photos'
  | 'calendar'
  | 'preview'
  | 'terminal'
  | 'settings'
  | 'hire'
  | 'launchpad'
  | 'trash';

/**
 * Shared SVG gradient and shadow definitions injected once at the top of the OS DOM.
 * Inspired by macOS Sequoia & iOS 18 squircle iconography.
 */
export function AppleSVGDefs() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ic-gloss" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ic-finder" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#73d1ff" />
          <stop offset="1" stopColor="#0a5fe0" />
        </linearGradient>
        <linearGradient id="ic-finder-right" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f5faff" />
          <stop offset="1" stopColor="#cce6ff" />
        </linearGradient>
        <linearGradient id="ic-notes" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe27a" />
          <stop offset="1" stopColor="#ffc300" />
        </linearGradient>
        <linearGradient id="ic-msg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6cf07c" />
          <stop offset="1" stopColor="#0db534" />
        </linearGradient>
        <linearGradient id="ic-mail" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5ab8ff" />
          <stop offset="1" stopColor="#0a64e0" />
        </linearGradient>
        <linearGradient id="ic-photo-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e8e8ed" />
        </linearGradient>
        <linearGradient id="ic-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff9a5a" />
          <stop offset="1" stopColor="#e2483d" />
        </linearGradient>
        <linearGradient id="ic-prev" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9ad9ff" />
          <stop offset="1" stopColor="#1f6ff0" />
        </linearGradient>
        <linearGradient id="ic-term" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a4a4f" />
          <stop offset="1" stopColor="#0b0b0d" />
        </linearGradient>
        <linearGradient id="ic-set" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e5e5ea" />
          <stop offset="1" stopColor="#9a9aa1" />
        </linearGradient>
        <linearGradient id="ic-hire" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0a84ff" />
          <stop offset="1" stopColor="#5e5ce6" />
        </linearGradient>
        <filter id="ic-sh" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25" />
        </filter>
        <clipPath id="sq-clip">
          <rect width="100" height="100" rx="22.5" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function AppleAppIcon({
  id,
  size = 50,
  trashFull = false,
  className = '',
}: {
  id: AppleAppId;
  size?: number;
  trashFull?: boolean;
  className?: string;
}) {
  const now = new Date();
  const mon = now.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const dayNum = now.getDate();

  const renderInner = () => {
    switch (id) {
      case 'finder':
        return (
          <>
            <g clipPath="url(#sq-clip)">
              <rect width="100" height="100" fill="url(#ic-finder-right)" />
              <path
                d="M0,0 L54,0 C49,36 46,55 55,100 L0,100 Z"
                fill="url(#ic-finder)"
              />
              <path
                d="M54,0 C49,36 46,52 58,56 L51,58 C53,73 54,84 55,100"
                fill="none"
                stroke="#004C99"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <ellipse cx="31" cy="37" rx="3.5" ry="5.8" fill="#1c1c1e" />
              <ellipse cx="70" cy="37" rx="3.5" ry="5.8" fill="#1c1c1e" />
              <path
                d="M26,65 Q50,83 74,65"
                fill="none"
                stroke="#1c1c1e"
                strokeWidth="4.2"
                strokeLinecap="round"
              />
            </g>
            <rect width="100" height="100" rx="22.5" fill="url(#ic-gloss)" />
          </>
        );

      case 'notes':
        return (
          <>
            <rect width="100" height="100" rx="22.5" fill="#fdfdfd" />
            <path
              d="M0 22.5A22.5 22.5 0 0 1 22.5 0h55A22.5 22.5 0 0 1 100 22.5V31H0z"
              fill="url(#ic-notes)"
            />
            <path d="M0 31h100" stroke="#e0a800" strokeWidth="1.5" />
            <path
              d="M16 50h68M16 64h68M16 78h48"
              stroke="#dcdce2"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <rect width="100" height="100" rx="22.5" fill="url(#ic-gloss)" />
          </>
        );

      case 'messages':
        return (
          <>
            <rect width="100" height="100" rx="22.5" fill="url(#ic-msg)" />
            <path
              filter="url(#ic-sh)"
              d="M50 21c17.7 0 32 11.6 32 26s-14.3 26-32 26c-3.6 0-7-.5-10.2-1.4L25 79l3.9-13C22.7 61.3 18 54.5 18 47c0-14.4 14.3-26 32-26z"
              fill="#ffffff"
            />
            <rect width="100" height="100" rx="22.5" fill="url(#ic-gloss)" />
          </>
        );

      case 'mail':
        return (
          <>
            <rect width="100" height="100" rx="22.5" fill="url(#ic-mail)" />
            <g filter="url(#ic-sh)">
              <rect x="18" y="30" width="64" height="44" rx="7" fill="#ffffff" />
              <path
                d="M20 34l30 22 30-22"
                fill="none"
                stroke="#1a7cf0"
                strokeWidth="4"
                strokeLinejoin="round"
              />
            </g>
            <rect width="100" height="100" rx="22.5" fill="url(#ic-gloss)" />
          </>
        );

      case 'photos':
        return (
          <>
            <rect width="100" height="100" rx="22.5" fill="url(#ic-photo-bg)" />
            <g filter="url(#ic-sh)">
              <rect
                x="24"
                y="20"
                width="52"
                height="52"
                rx="9"
                fill="#cfd3dc"
                transform="rotate(-9 50 46)"
              />
              <rect x="24" y="28" width="52" height="52" rx="9" fill="url(#ic-sky)" />
              <circle cx="62" cy="43" r="6" fill="#ffe27a" />
              <path
                d="M24 70l15-17 11 12 7-7 19 18v1a9 9 0 0 1-9 9H33a9 9 0 0 1-9-9z"
                fill="#4b2f6e"
              />
            </g>
          </>
        );

      case 'calendar':
        return (
          <>
            <g clipPath="url(#sq-clip)">
              <rect width="100" height="100" fill="#fafafa" />
              <rect width="100" height="33" fill="#f0524a" />
            </g>
            <text
              x="50"
              y="25.5"
              textAnchor="middle"
              fontFamily="-apple-system, BlinkMacSystemFont, Inter, Arial, sans-serif"
              fontSize="18"
              fontWeight="700"
              letterSpacing="0.5"
              fill="#ffffff"
            >
              {mon}
            </text>
            <text
              x="50"
              y="82"
              textAnchor="middle"
              fontFamily="-apple-system, BlinkMacSystemFont, Inter, Arial, sans-serif"
              fontSize="49"
              fontWeight="300"
              fill="#2b2b2b"
            >
              {dayNum}
            </text>
          </>
        );

      case 'preview':
        return (
          <>
            <rect width="100" height="100" rx="22.5" fill="url(#ic-prev)" />
            <g filter="url(#ic-sh)">
              <path d="M29 18h30l14 14v50H29z" fill="#ffffff" />
              <path d="M59 18v14h14" fill="#cfe6ff" />
              <path
                d="M37 46h28M37 55h28M37 64h18"
                stroke="#9cc3f0"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle
                cx="64"
                cy="66"
                r="11"
                fill="none"
                stroke="#1f3d6b"
                strokeWidth="5"
              />
              <path
                d="M72 74l8 8"
                stroke="#1f3d6b"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </g>
          </>
        );

      case 'terminal':
        return (
          <>
            <rect width="100" height="100" rx="22.5" fill="url(#ic-term)" />
            <rect
              x="7"
              y="7"
              width="86"
              height="86"
              rx="16"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="2"
            />
            <path
              d="M26 38l14 12-14 12"
              fill="none"
              stroke="#32d74b"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M47 64h24"
              stroke="#f2f2f7"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <rect width="100" height="100" rx="22.5" fill="url(#ic-gloss)" />
          </>
        );

      case 'settings':
        return (
          <>
            <rect width="100" height="100" rx="22.5" fill="url(#ic-set)" />
            <g filter="url(#ic-sh)">
              <circle
                cx="50"
                cy="50"
                r="27"
                fill="none"
                stroke="#5c5c63"
                strokeWidth="12"
                strokeDasharray="8 6.14"
              />
              <circle cx="50" cy="50" r="22" fill="#6e6e75" />
              <circle cx="50" cy="50" r="14" fill="#c7c7cc" />
              <circle cx="50" cy="50" r="6" fill="#6e6e75" />
            </g>
            <rect width="100" height="100" rx="22.5" fill="url(#ic-gloss)" />
          </>
        );

      case 'hire':
        return (
          <>
            <rect width="100" height="100" rx="22.5" fill="url(#ic-hire)" />
            <g filter="url(#ic-sh)">
              <path
                d="M50 22l7.5 16.5L75 41l-13 12 3.5 17.5L50 62l-15.5 8.5L38 53 25 41l17.5-2.5z"
                fill="#ffd60a"
              />
            </g>
            <rect width="100" height="100" rx="22.5" fill="url(#ic-gloss)" />
          </>
        );

      case 'launchpad':
        return (
          <>
            <rect width="100" height="100" rx="22.5" fill="url(#ic-term)" />
            {[
              [22, 22, '#ff5f57'],
              [43, 22, '#febc2e'],
              [64, 22, '#28c840'],
              [22, 43, '#0a84ff'],
              [43, 43, '#bf5af2'],
              [64, 43, '#ff375f'],
              [22, 64, '#64d2ff'],
              [43, 64, '#30d158'],
              [64, 64, '#ff9f0a'],
            ].map(([x, y, c], idx) => (
              <rect
                key={idx}
                x={x}
                y={y}
                width="14"
                height="14"
                rx="3.5"
                fill={String(c)}
              />
            ))}
            <rect width="100" height="100" rx="22.5" fill="url(#ic-gloss)" />
          </>
        );

      case 'trash':
        return (
          <>
            {trashFull && (
              <>
                <path
                  d="M29 31c-3-9 6-16 14-11 3-9 16-9 18 0 8-4 16 3 12 11z"
                  fill="#ffffff"
                  stroke="#c3c9d3"
                  strokeWidth="1.5"
                />
                <path
                  d="M44 21l5 9M58 19l-3 10"
                  stroke="#d5dae2"
                  strokeWidth="1.5"
                />
              </>
            )}
            <path
              d="M21 30h58l-6 58a6 6 0 0 1-6 5H33a6 6 0 0 1-6-5z"
              fill="rgba(240,243,248,0.94)"
              stroke="#97a1af"
              strokeWidth="2"
            />
            {[31, 37.3, 43.6, 50, 56.3, 62.6, 69].map((x, idx) => (
              <path
                key={idx}
                d={`M${x.toFixed(1)} 37L${(50 + (x - 50) * 0.8).toFixed(1)} 88`}
                stroke="#aab2bf"
                strokeWidth="1.6"
              />
            ))}
            <ellipse
              cx="50"
              cy="30"
              rx="29.5"
              ry="5.5"
              fill="#e4e9f0"
              stroke="#97a1af"
              strokeWidth="2"
            />
          </>
        );
    }
  };

  return (
    <span
      className={`inline-grid place-items-center shrink-0 select-none filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.28)] ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full block">
        {renderInner()}
      </svg>
    </span>
  );
}

export function MacFolderIcon({ size = 54 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 64 52"
      style={{ width: size, height: Math.round((size * 52) / 64) }}
      className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] select-none"
    >
      <path
        d="M2 8a4 4 0 0 1 4-4h16l6 6h30a4 4 0 0 1 4 4v32a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z"
        fill="#3d9cf0"
      />
      <path
        d="M2 16h60v30a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z"
        fill="#74bdfb"
      />
    </svg>
  );
}

export function MacDocBadgeIcon({
  color,
  label,
  size = 54,
}: {
  color: string;
  label: string;
  size?: number;
}) {
  const L = label.toUpperCase();
  const long = L.length > 5;
  return (
    <svg
      viewBox="0 0 48 60"
      style={{ width: Math.round((size * 48) / 60), height: size }}
      className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] select-none"
    >
      <path
        d="M11 1.5h21.5L45 14v41.5a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3v-51a3 3 0 0 1 3-3z"
        fill="#e3e6ea"
      />
      <path d="M32.5 1.5V11a3 3 0 0 0 3 3H45z" fill="#b4b9c1" />
      <path d="M35.5 14L45 23.5V14z" fill="#cfd3d8" />
      <rect x="2" y="27" width="37" height="17" rx="3" fill={color} />
      <rect x="8" y="44" width="31" height="2" fill="#cfd3d8" />
      <text
        x="20.5"
        y="39.4"
        fontSize={long ? 8.5 : L.length > 4 ? 10 : 12}
        fontWeight="700"
        fill="#ffffff"
        textAnchor="middle"
        fontFamily="-apple-system, BlinkMacSystemFont, Inter, Arial, sans-serif"
      >
        {L}
      </text>
    </svg>
  );
}

