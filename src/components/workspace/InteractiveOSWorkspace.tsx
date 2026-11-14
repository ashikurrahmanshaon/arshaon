'use client';

import React, { useEffect } from 'react';

declare global {
  interface Window {
    __ARSHAON_OS_LOADING?: boolean;
    __ARSHAON_OS_BOOTED?: boolean;
    SITE?: Record<string, unknown>;
  }
}

export function InteractiveOSWorkspace() {
  useEffect(() => {
    if (typeof window === 'undefined' || window.__ARSHAON_OS_LOADING) return;
    window.__ARSHAON_OS_LOADING = true;

    const loadScript = (src: string): Promise<void> =>
      new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.async = false;
        s.onload = () => resolve();
        s.onerror = (err) => reject(err);
        document.body.appendChild(s);
      });

    loadScript('/arshaon-content.js?v=20261115a')
      .then(() => loadScript('/arshaon-os.js?v=20261115a'))
      .catch((err) => {
        console.error('Failed to boot Macintosh OS:', err);
      });
  }, []);

  return (
    <>
      {/* Background picture & procedural skyline */}
      <div id="wallpaper" suppressHydrationWarning>
        <svg
          id="skyline"
          viewBox="0 0 1440 260"
          preserveAspectRatio="xMidYMax slice"
          suppressHydrationWarning
        />
      </div>

      {/* Top menu bar (macOS menu bar on desktop, iOS status bar on mobile) */}
      <header className="menubar" suppressHydrationWarning>
        <div className="mb-left" suppressHydrationWarning>
          <button
            className="mb-item mb-logo"
            data-menu="brand"
            aria-label="Apple Menu"
            suppressHydrationWarning
          >
            <svg className="mb-apple-svg" viewBox="0 0 814 1000" width="12" height="14.5" fill="currentColor" style={{ display: 'block' }} aria-hidden="true">
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
            </svg>
          </button>
          <button className="mb-item mb-bold" id="mb-app" data-menu="app">
            Finder
          </button>
          <button className="mb-item mb-hide" data-menu="file">
            File
          </button>
          <button className="mb-item mb-hide" data-menu="edit">
            Edit
          </button>
          <button className="mb-item mb-hide" data-menu="view">
            View
          </button>
          <button className="mb-item mb-hide" data-menu="go">
            Go
          </button>
          <button className="mb-item mb-hide" data-menu="window">
            Window
          </button>
          <button className="mb-item mb-hide" data-menu="help">
            Help
          </button>
        </div>
        <div className="mb-right" suppressHydrationWarning>
          <span className="mb-icon mb-hide" title="Battery" suppressHydrationWarning>
            <span className="mb-batt-pct" suppressHydrationWarning>100%</span>
            <svg className="mb-batt-svg" viewBox="0 0 25 12" aria-hidden="true">
              <rect x="0.75" y="0.75" width="20.5" height="10.5" rx="3" fill="none" stroke="currentColor" strokeWidth="1.15" strokeOpacity="0.48" />
              <rect
                className="mb-batt-fill"
                x="2.5"
                y="2.5"
                width="17"
                height="7"
                rx="1.6"
                fill="currentColor"
                stroke="none"
              />
              <path d="M22.6 4.1c.95.25 1.55.95 1.55 1.9s-.6 1.65-1.55 1.9V4.1z" fill="currentColor" stroke="none" fillOpacity="0.48" />
            </svg>
          </span>
          <span className="mb-icon" title="Wi-Fi" suppressHydrationWarning>
            <svg className="mb-wifi-svg" viewBox="0 0 18 14" aria-hidden="true">
              <path d="M1.4 4.5a11.2 11.2 0 0 1 15.2 0M4.5 7.8a6.8 6.8 0 0 1 9 0" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              <circle cx="9" cy="11.2" r="1.45" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <button
            className="mb-item mb-icon"
            data-menu="control"
            aria-label="Control centre"
            suppressHydrationWarning
          >
            <svg className="mb-cc-svg" viewBox="0 0 18 18" aria-hidden="true">
              <rect x="1.5" y="2.2" width="15" height="6.2" rx="3.1" fill="none" stroke="currentColor" strokeWidth="1.35" />
              <circle cx="13.3" cy="5.3" r="1.95" fill="currentColor" stroke="none" />
              <path fillRule="evenodd" clipRule="evenodd" d="M4.6 9.8h8.8a3.1 3.1 0 1 1 0 6.2H4.6a3.1 3.1 0 1 1 0-6.2zm.3 5a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8z" fill="currentColor" stroke="none" />
            </svg>
          </button>
          <button
            className="mb-item"
            id="clock"
            aria-label="Notification centre"
            suppressHydrationWarning
          />
        </div>
      </header>

      {/* Desktop (computer) icons, top right */}
      <div id="desk-icons" suppressHydrationWarning />

      {/* Phone home screen (only visible on small screens) */}
      <div id="home" suppressHydrationWarning />

      {/* App windows get added here */}
      <div id="windows" suppressHydrationWarning />

      {/* Dock at the bottom */}
      <nav className="dock" id="dock" suppressHydrationWarning />

      {/* Drop-down menus & side panel */}
      <div id="menu" className="menu" hidden suppressHydrationWarning />
      <aside id="nc" className="nc" hidden suppressHydrationWarning />

      {/* Lock / sleep / startup screens */}
      <div id="lock" className="overlay lock" hidden suppressHydrationWarning>
        <div className="lock-time" id="lock-time" suppressHydrationWarning />
        <div className="lock-date" id="lock-date" suppressHydrationWarning />
        <div className="lock-user" suppressHydrationWarning>
          <div className="avatar big" id="lock-avatar" suppressHydrationWarning />
          <div className="lock-name" id="lock-name" suppressHydrationWarning />
          <button className="lock-btn" id="lock-btn">
            Click to enter →
          </button>
        </div>
      </div>
      <div id="sleep" className="overlay sleep" hidden suppressHydrationWarning />
      <div id="boot" className="overlay boot" hidden suppressHydrationWarning>
        <div className="boot-logo" suppressHydrationWarning></div>
        <div className="boot-bar">
          <span />
        </div>
        <div className="boot-hint" id="boot-hint" suppressHydrationWarning />
      </div>
    </>
  );
}
