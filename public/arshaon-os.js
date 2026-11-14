/* =====================================================================
   APP FILE: makes the desktop work (windows, dock, menus, apps).
   You don't need to edit this to change your text; use content.js.
   ===================================================================== */
(() => {
  "use strict";
  if (window.__ARSHAON_OS_BOOTED) return;
  window.__ARSHAON_OS_BOOTED = true;
  const SITE = window.SITE;

  /* ---------- Small helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const isMobile = () => matchMedia("(max-width: 760px)").matches;
  const initials = SITE.name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  const avatar = (cls = "") => SITE.photo
    ? `<div class="avatar ${cls}" style="background-image:url('${SITE.photo}')"></div>`
    : `<div class="avatar ${cls}">${initials}</div>`;

  /* ---------- Saved preferences (stays in this browser only) ---------- */
  const prefs = Object.assign({ theme: "auto", wall: null, h24: false, accent: "blue", dockMag: true, dockSize: 50,
    showIcons: true, showDate: true, focus: false, wifi: true, bt: true }, (() => {
    try { return JSON.parse(localStorage.getItem("arshaon-prefs")) || {}; } catch { return {}; }
  })());
  // Wallpapers can only be changed in Settings: forget any photo picked earlier.
  ["wall", "phoneWall"].forEach((k) => { if (String(prefs[k] || "").startsWith("photo:")) delete prefs[k]; });
  function useH12() { return isMobile() || !prefs.h24; }
  const savePrefs = () => { try { localStorage.setItem("arshaon-prefs", JSON.stringify(prefs)); } catch {} };

  /* ---------- Wallpapers ---------- */
  const WALLS = {
    dusk: { name: "Studio Dusk", skyline: true, css: "radial-gradient(1100px 500px at 70% 105%, #ffb36b 0%, transparent 60%), radial-gradient(900px 500px at 10% 100%, #e2483d 0%, transparent 55%), linear-gradient(180deg, #16244a 0%, #4b2f6e 42%, #b6527a 72%, #f2a06b 100%)" },
    dunes: { name: "Dunes", skyline: false, css: "radial-gradient(1400px 400px at 30% 100%, #b4612f 0%, transparent 70%), radial-gradient(1200px 380px at 80% 95%, #d98a4a 0%, transparent 70%), linear-gradient(180deg, #8fc3e8 0%, #f5d7a6 55%, #e9a86b 100%)" },
    ocean: { name: "Gulf Blue", skyline: true, css: "radial-gradient(900px 500px at 80% 10%, #58c3d6 0%, transparent 60%), linear-gradient(160deg, #0b1f45 0%, #1e5f9e 55%, #3fb0c9 100%)" },
    night: { name: "Night", skyline: true, css: "radial-gradient(900px 420px at 50% 115%, #4a2f9a 0%, transparent 70%), linear-gradient(180deg, #04050c 0%, #10173a 100%)" },
    mint: { name: "Mint", skyline: false, css: "radial-gradient(800px 600px at 15% 20%, #ffffff 0%, transparent 60%), linear-gradient(135deg, #c9f2e1 0%, #a9d6f2 60%, #c8b6f2 100%)" },
  };

  // A simple city skyline drawn with code (tallest tower in the middle).
  function drawSkyline() {
    let x = 0, d = "M0 260", seed = 7;
    const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    while (x < 1440) {
      const w = 22 + rnd() * 46, hgt = 40 + rnd() * 110;
      if (x > 660 && x < 700) { // the tall spire
        d += ` L${x} 160 L${x + 14} 120 L${x + 22} 40 L${x + 26} 0 L${x + 30} 40 L${x + 38} 120 L${x + 52} 160`;
        x += 52; continue;
      }
      d += ` L${x} ${260 - hgt} L${x + w} ${260 - hgt}`;
      if (rnd() > .7) d += ` L${x + w / 2} ${260 - hgt - 18} L${x + w} ${260 - hgt}`;
      x += w;
    }
    $("#skyline").innerHTML = `<path d="${d} L1440 260 Z"/>`;
  }
  // Safe picture addresses (handles #, spaces and quotes in file names).
  const srcUrl = (src) => String(src || "").replace(/#/g, "%23").replace(/ /g, "%20");
  const cssUrl = (src) => `url('${srcUrl(src).replace(/['"\\()]/g, (c) => encodeURIComponent(c))}')`;
  function allWalls() {
    const w = {};
    (SITE.wallpapers || []).forEach((x, i) => {
      w["img" + i] = { name: x.name || `Wallpaper ${i + 1}`, skyline: false, mine: true, css: `#111 ${cssUrl(x.src)} center/cover no-repeat`,
        thumb: x.thumb ? `#111 ${cssUrl(x.thumb)} center/cover no-repeat` : null };
    });
    return Object.assign(w, WALLS);
  }
  function defaultWallId() {
    const d = SITE.defaultWallpaper; if (!d) return "dusk";
    const i = (SITE.wallpapers || []).findIndex((x) => x.src === d || x.name === d);
    return i >= 0 ? "img" + i : d;
  }
  const currentWallId = () => prefs.wall || defaultWallId();
  function wallById(id) {
    if (id && id.startsWith("photo:")) return { name: "From Photos", skyline: false, css: `#111 ${cssUrl(id.slice(6))} center/cover no-repeat` };
    const all = allWalls();
    return all[id] || all[defaultWallId()] || WALLS.dusk;
  }
  function applyWall() {
    const w = wallById(currentWallId());
    $("#wallpaper").style.background = w.css;
    $("#skyline").style.display = w.skyline ? "" : "none";
  }
  // Accent colour, dock size, menu bar extras
  const ACCENTS = { blue: "#0a84ff", purple: "#bf5af2", pink: "#ff375f", red: "#ff3b30", orange: "#ff9f0a", yellow: "#e6b800", green: "#30d158", graphite: "#8e8e93" };
  function applyAccent() { document.documentElement.style.setProperty("--accent", ACCENTS[prefs.accent] || ACCENTS.blue); }
  function applyDockPrefs() {
    document.documentElement.style.setProperty("--dock-s", prefs.dockSize + "px");
    $$(".dock-item .appicon").forEach((a) => a.style.setProperty("--s", prefs.dockSize + "px"));
    const di = $("#desk-icons"); if (di) di.hidden = !prefs.showIcons;
  }
  function applyMenuPrefs() {
    const wifi = $('.mb-icon[title="Wi-Fi"]'); if (wifi) wifi.classList.toggle("off", !prefs.wifi);
    let moon = $("#mb-focus");
    if (!moon) {
      moon = el(`<span class="mb-icon" id="mb-focus" title="Do Not Disturb"><svg viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" fill="currentColor" stroke="none"/></svg></span>`);
      $(".mb-right").prepend(moon);
    }
    moon.hidden = !prefs.focus;
    tick();
  }
  function applyTheme() {
    if (prefs.theme === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", prefs.theme);
  }

  /* ---------- Icons (modern rounded style, drawn in code) ---------- */
  // The resume's file name (from SITE.resume), e.g. "Ashikur-Rahman-Shaon-Resume.pdf"
  function resumeName() { return String(SITE.resume || "resume.pdf").split("/").pop(); }
  const SQ = (fill) => `<rect width="100" height="100" rx="22.5" fill="${fill}"/>`;
  const GLOSS = '<rect width="100" height="100" rx="22.5" fill="url(#ic-gloss)"/>';
  const ICON_DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
    <linearGradient id="ic-gloss" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="ic-finder" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#73d1ff"/><stop offset="1" stop-color="#0a5fe0"/></linearGradient>
    <linearGradient id="ic-notes" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe27a"/><stop offset="1" stop-color="#ffc300"/></linearGradient>
    <linearGradient id="ic-msg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6cf07c"/><stop offset="1" stop-color="#0db534"/></linearGradient>
    <linearGradient id="ic-photo-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e8e8ed"/></linearGradient>
    <linearGradient id="ic-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9a5a"/><stop offset="1" stop-color="#e2483d"/></linearGradient>
    <linearGradient id="ic-prev" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ad9ff"/><stop offset="1" stop-color="#1f6ff0"/></linearGradient>
    <linearGradient id="ic-term" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4a4f"/><stop offset="1" stop-color="#0b0b0d"/></linearGradient>
    <linearGradient id="ic-set" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e5e5ea"/><stop offset="1" stop-color="#9a9aa1"/></linearGradient>
    <filter id="ic-sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity=".25"/></filter>
  </defs></svg>`;
  const ICONS = {
    finder: SQ("url(#ic-finder)") + `<g filter="url(#ic-sh)"><path d="M20 33a7 7 0 0 1 7-7h15l7 7h24a7 7 0 0 1 7 7v27a7 7 0 0 1-7 7H27a7 7 0 0 1-7-7z" fill="#fff"/><path d="M20 44h60v23a7 7 0 0 1-7 7H27a7 7 0 0 1-7-7z" fill="#d6ecff"/></g>` + GLOSS,
    notes: SQ("#fdfdfd") + `<path d="M0 22.5A22.5 22.5 0 0 1 22.5 0h55A22.5 22.5 0 0 1 100 22.5V31H0z" fill="url(#ic-notes)"/><path d="M0 31h100" stroke="#e0a800" stroke-width="1.5"/><path d="M16 50h68M16 64h68M16 78h48" stroke="#dcdce2" stroke-width="3" stroke-linecap="round"/>` + GLOSS,
    messages: SQ("url(#ic-msg)") + `<path filter="url(#ic-sh)" d="M50 21c17.7 0 32 11.6 32 26s-14.3 26-32 26c-3.6 0-7-.5-10.2-1.4L25 79l3.9-13C22.7 61.3 18 54.5 18 47c0-14.4 14.3-26 32-26z" fill="#fff"/>` + GLOSS,
    photos: SQ("url(#ic-photo-bg)") + `<g filter="url(#ic-sh)"><rect x="24" y="20" width="52" height="52" rx="9" fill="#cfd3dc" transform="rotate(-9 50 46)"/><rect x="24" y="28" width="52" height="52" rx="9" fill="url(#ic-sky)"/><circle cx="62" cy="43" r="6" fill="#ffe27a"/><path d="M24 70l15-17 11 12 7-7 19 18v1a9 9 0 0 1-9 9H33a9 9 0 0 1-9-9z" fill="#4b2f6e"/></g>`,
    preview: SQ("url(#ic-prev)") + `<g filter="url(#ic-sh)"><path d="M29 18h30l14 14v50H29z" fill="#fff"/><path d="M59 18v14h14" fill="#cfe6ff"/><path d="M37 46h28M37 55h28M37 64h18" stroke="#9cc3f0" stroke-width="3.5" stroke-linecap="round"/><circle cx="64" cy="66" r="11" fill="none" stroke="#1f3d6b" stroke-width="5"/><path d="M72 74l8 8" stroke="#1f3d6b" stroke-width="6" stroke-linecap="round"/></g>`,
    terminal: SQ("url(#ic-term)") + `<rect x="7" y="7" width="86" height="86" rx="16" fill="none" stroke="#ffffff22" stroke-width="2"/><path d="M26 38l14 12-14 12" fill="none" stroke="#32d74b" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M47 64h24" stroke="#f2f2f7" stroke-width="7" stroke-linecap="round"/>` + GLOSS,
    settings: SQ("url(#ic-set)") + `<g filter="url(#ic-sh)"><circle cx="50" cy="50" r="27" fill="none" stroke="#5c5c63" stroke-width="12" stroke-dasharray="8 6.14"/><circle cx="50" cy="50" r="22" fill="#6e6e75"/><circle cx="50" cy="50" r="14" fill="#c7c7cc"/><circle cx="50" cy="50" r="6" fill="#6e6e75"/></g>` + GLOSS,
  };
  // Calendar icon always shows today's date.
  function calendarIconSVG() {
    const d = new Date(), mon = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
    return '<defs><clipPath id="cal-clip"><rect width="100" height="100" rx="22.5"/></clipPath>' +
      '<linearGradient id="cal-top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff645c"/><stop offset="1" stop-color="#e0352b"/></linearGradient>' +
      '<linearGradient id="cal-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#eceef2"/></linearGradient></defs>' +
      '<g clip-path="url(#cal-clip)"><rect width="100" height="100" fill="url(#cal-body)"/><rect width="100" height="33" fill="url(#cal-top)"/><rect y="33" width="100" height="2" fill="rgba(0,0,0,.08)"/></g>' +
      `<text x="50" y="24.5" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,Inter,sans-serif" font-size="17.5" font-weight="700" letter-spacing="1" fill="#fff">${mon}</text>` +
      `<text x="50" y="81" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,Inter,sans-serif" font-size="50" font-weight="300" fill="#1d1d1f">${d.getDate()}</text>` +
      GLOSS + '<rect x="1" y="1" width="98" height="98" rx="22" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.4"/>';
  }
  // Trash can: shows paper when it has something in it.
  function trashIconSVG(full) {
    let lines = "";
    for (let x = 31; x <= 69.5; x += 6.3) lines += `<path d="M${x.toFixed(1)} 37L${(50 + (x - 50) * 0.8).toFixed(1)} 88" stroke="#aab2bf" stroke-width="1.6"/>`;
    const papers = full ? `<path d="M29 31c-3-9 6-16 14-11 3-9 16-9 18 0 8-4 16 3 12 11z" fill="#fff" stroke="#c3c9d3" stroke-width="1.5"/><path d="M44 21l5 9M58 19l-3 10" stroke="#d5dae2" stroke-width="1.5"/>` : "";
    return `${papers}<path d="M21 30h58l-6 58a6 6 0 0 1-6 5H33a6 6 0 0 1-6-5z" fill="rgba(240,243,248,.94)" stroke="#97a1af" stroke-width="2"/>${lines}<ellipse cx="50" cy="30" rx="29.5" ry="5.5" fill="#e4e9f0" stroke="#97a1af" stroke-width="2"/>`;
  }
  const icon = (id, size = 48) => {
    if (id === "finder" && isMobile() && ICONS.files) id = "files";
    if (id === "calendar") {
      const d = new Date(), mon = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
      return `<span class="appicon" data-ic="calendar" style="--s:${size}px"><img src="icons/calendar-bg.png" alt=""><svg class="cal-dyn" viewBox="0 0 100 100"><text x="50" y="25" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,Inter,sans-serif" font-size="16" font-weight="700" letter-spacing="1.2" fill="#fff">${mon}</text><text x="50" y="79" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,Inter,sans-serif" font-size="47" font-weight="300" fill="#1d1d1f">${d.getDate()}</text></svg></span>`;
    }
    const custom = SITE.icons && SITE.icons[id];
    const art = id === "trash" ? trashIconSVG(trashFull()) : ICONS[id];
    const inner = custom ? `<img src="${esc(custom)}" alt="">` : `<svg viewBox="0 0 100 100">${art}</svg>`;
    return `<span class="appicon" data-ic="${id}" style="--s:${size}px">${inner}</span>`;
  };
  const FOLDER = '<svg viewBox="0 0 64 52"><defs><linearGradient id="fd-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3fa3f7"/><stop offset="1" stop-color="#1e76d6"/></linearGradient><linearGradient id="fd-f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#87d0ff"/><stop offset=".15" stop-color="#6cc2ff"/><stop offset="1" stop-color="#3898f2"/></linearGradient></defs><path d="M2 8.5A4.5 4.5 0 0 1 6.5 4h15.2a4.5 4.5 0 0 1 3.2 1.3l4.2 4.2H57.5A4.5 4.5 0 0 1 62 14v31.5a4.5 4.5 0 0 1-4.5 4.5h-51A4.5 4.5 0 0 1 2 45.5z" fill="url(#fd-b)"/><path d="M2 16.5A3.5 3.5 0 0 1 5.5 13h53a3.5 3.5 0 0 1 3.5 3.5v29a4.5 4.5 0 0 1-4.5 4.5h-51A4.5 4.5 0 0 1 2 45.5z" fill="url(#fd-f)"/><path d="M5.5 13.7h53a2.8 2.8 0 0 1 2.8 2.8v.6A2.8 2.8 0 0 0 58.5 14.3h-53A2.8 2.8 0 0 0 2.7 17v-.5a2.8 2.8 0 0 1 2.8-2.8z" fill="rgba(255,255,255,.55)"/></svg>';
  const DOC_LABEL = { TXT: "TEXT", PROJ: "PROJECT" };
  const docIcon = (color, label) => {
    const L = DOC_LABEL[label] || String(label || "FILE").toUpperCase(), long = L.length > 5;
    return `<svg viewBox="0 0 48 60"><defs><linearGradient id="dc-p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e5e9f0"/></linearGradient></defs><path d="M11 1.5h21.5L45 14v41.5a3.5 3.5 0 0 1-3.5 3.5h-30.5A3.5 3.5 0 0 1 7.5 55.5v-50.5A3.5 3.5 0 0 1 11 1.5z" fill="url(#dc-p)" stroke="rgba(0,0,0,.12)" stroke-width=".8"/>` +
      `<path d="M14 14h13M14 19.5h24M14 24.5h20" stroke="#cfd6e0" stroke-width="2" stroke-linecap="round"/>` +
      `<path d="M32.5 1.5V11a3 3 0 0 0 3 3H45z" fill="#c3cad5"/><path d="M35.5 14L45 22.5V14z" fill="rgba(0,0,0,.09)"/>` +
      `<rect x="2.5" y="28.5" width="37" height="17" rx="4" fill="${color}"/><rect x="8" y="45.5" width="31" height="2" fill="rgba(0,0,0,.12)"/>` +
      `<text x="21" y="40.6" font-size="${long ? 9 : L.length > 4 ? 10.5 : 12.2}" font-weight="800" letter-spacing=".4" fill="#fff" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,Inter,Arial,sans-serif"${long ? ' textLength="31" lengthAdjust="spacingAndGlyphs"' : ""}>${esc(L)}</text></svg>`;
  };

  /* ---------- Documents (TextEdit windows) ---------- */
  const DOCS = {};
  SITE.campaigns.forEach((c, i) => {
    DOCS["c" + i] = { title: c.title, html: projectHTML(c), wide: true };
  });
  SITE.experience.forEach((e, i) => {
    DOCS["e" + i] = {
      title: `${e.company}: ${e.role}`,
      html: `<div class="doc"><div class="inner"><h1>${esc(e.role)}</h1><div class="meta">${esc(e.company)} · ${esc(e.dates)}</div>
        <ul>${e.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div></div>`,
    };
  });
  DOCS.skills = {
    title: "Skills.txt",
    html: `<div class="doc"><div class="inner"><h1>Skills</h1>${Object.entries(SITE.skills).map(([k, v]) =>
      `<h3 style="margin-top:14px">${esc(k)}</h3><div class="chips">${v.map((s) => `<span>${esc(s)}</span>`).join("")}</div>`).join("")}</div></div>`,
  };
  // The full project page used in Photos and Finder.
  function projectHTML(c) {
    const stats = (c.stats || []).map(([n, l]) => `<div class="pstat"><b>${esc(n)}</b><span>${esc(l)}</span></div>`).join("");
    const gallery = (c.gallery || []).map((g) => `<img src="${esc(g)}" alt="${esc(c.title)} photo" loading="lazy">`).join("");
    return `<div class="project">
      <div class="pbanner${genCls(c)}" style="${bannerBg(c)}">${genArt(c, "banner")}<div>
        <span class="ptag">${c.kind ? esc(c.kind) + " · " : ""}${esc(c.type)}${c.year ? " · " + esc(c.year) : ""}</span>${c.featured ? ' <span class="ptag flag">★ Flagship case study</span>' : ""}
        <h1>${esc(c.title)}</h1><p>${esc(c.role || "")}${c.market ? " · " + esc(c.market) : ""}</p></div></div>
      <div class="pbody">
        <div class="pmeta">
          ${c.role ? `<div class="prole"><span>My role</span>${esc(c.role)}</div>` : ""}
          ${c.partners ? `<div class="prole"><span>Partners</span>${esc(c.partners)}</div>` : ""}
          ${c.market ? `<div class="prole"><span>Market</span>${esc(c.market)}</div>` : ""}
        </div>
        ${stats ? `<div class="pstats">${stats}</div>` : ""}
        <p class="plead">${esc(c.desc)}</p>
        <div class="pdetails">${c.details || ""}</div>
        ${gallery ? `<h3>Gallery</h3><div class="pgallery">${gallery}</div>` : ""}
        <div class="pactions">
          ${c.link ? `<a class="btn blue" href="${esc(c.link)}" target="_blank" rel="noopener">View project ↗</a>` : ""}
          <a class="btn" data-open="messages">Ask me about this</a>
          ${SITE.newsStyle === "button" ? newsHTML(c, true) : ""}
        </div>
        ${SITE.newsStyle === "button" ? "" : newsHTML(c)}
      </div></div>`;
  }
  // "Read more" at the very end of a project page: one row per news article.
  // Only shown when the project has a news link in content.js.
  function newsHTML(c, asButtons) {
    const NEWS_SOURCES = { "kathmandupost.com": "The Kathmandu Post", "bangladeshpost.net": "Bangladesh Post", "thedailystar.net": "The Daily Star", "english.onlinekhabar.com": "Onlinekhabar",
      "technologykhabar.com": "Technology Khabar", "tbsnews.net": "The Business Standard", "prothomalo.com": "Prothom Alo (Bangla)", "en.prothomalo.com": "Prothom Alo (English)",
      "pcb.com.pk": "Pakistan Cricket Board", "dhakatribune.com": "Dhaka Tribune", "lnkd.in": "LinkedIn", "linkedin.com": "LinkedIn" };
    const list = [].concat(c.news || []).map((n) => (typeof n === "string" ? { url: n } : n)).filter((n) => n && /^https?:\/\//i.test(n.url || ""));
    if (!list.length) return "";
    const src = (n) => { let host = ""; try { host = new URL(n.url).hostname.replace(/^www\./, ""); } catch {} return n.source || NEWS_SOURCES[host] || host; };
    // Option B (newsStyle: "button" in content.js): plain buttons beside "Ask me about this".
    if (asButtons) return list.map((n) => `<a class="btn blue pnews-btn" href="${esc(n.url)}" target="_blank" rel="noopener" title="${esc(n.label || "")}">Read more · ${esc(src(n))} ↗</a>`).join("");
    const rows = list.map((n) => {
      let host = ""; try { host = new URL(n.url).hostname.replace(/^www\./, ""); } catch {}
      const source = n.source || NEWS_SOURCES[host] || host, post = /linkedin|lnkd\.in/i.test(host);
      return `<a class="pnews-row" href="${esc(n.url)}" target="_blank" rel="noopener">
        <span class="pnews-ic"><svg viewBox="0 0 24 24"><path d="M5 5h11v14H6.5A1.5 1.5 0 0 1 5 17.5zM16 9h3v8.5a1.5 1.5 0 0 1-3 0M8 9h5M8 12.5h5M8 16h3"/></svg></span>
        <span class="pnews-text"><b>${esc(n.label || (post ? "See the post about this" : "Read the news article"))}</b><small>${esc(source)}</small></span>
        <span class="pnews-go">Read more ↗</span></a>`;
    }).join("");
    return `<div class="pnews"><h3>${list.length > 1 ? "In the news" : "Read more"}</h3>${rows}</div>`;
  }
  function bannerBg(c) {
    const pic = c.banner || c.image;
    return pic
      ? `background-image:linear-gradient(180deg,rgba(0,0,0,.05) 30%,rgba(0,0,0,.7)),${cssUrl(pic)}`
      : genBg(c, 135);
  }
  // ---- Automatic hashtag artwork for projects without a picture ----
  var FLAG = "★ Flagship";
  function hasPic(c) { return !!(c.image || c.banner); }
  function genTag(c) {
    if (c.tag) return c.tag;
    if (/^#/.test(c.title)) return c.title.split(/\s/)[0];
    return "#" + String(c.title).replace(/\(.*?\)/g, " ").replace(/[^A-Za-z0-9 ]/g, " ").split(/\s+/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join("");
  }
  function genCls(c) { return hasPic(c) ? "" : " gen"; }
  function flagBadge(c) { return c.featured ? '<span class="flag-badge" title="Flagship case study">★</span>' : ""; }
  function genArt(c, where) {
    if (hasPic(c)) return flagBadge(c);
    const tag = genTag(c);
    const showTag = where === "cover" || (where === "banner" && tag.toLowerCase() !== String(c.title).toLowerCase());
    return `<span class="gen-art" aria-hidden="true"><i class="gen-big">#</i>${showTag ? `<b class="gen-tag" style="--n:${Math.max(tag.length, 9)}">${esc(tag)}</b>` : ""}</span>${flagBadge(c)}`;
  }
  // Text on a project tile: the name (or hashtag on drawn banners) and your role.
  function tileText(c) {
    if (hasPic(c)) return `<div class="big">${esc(c.title)}</div><small>${esc(c.role || c.type)}</small>`;
    const tag = genTag(c), same = tag.replace(/^#/, "").toLowerCase() === String(c.title).replace(/^#/, "").replace(/\s+/g, "").toLowerCase();
    return `<div class="big gtag" style="--n:${Math.max(tag.length, 8)}">${esc(tag)}</div><small>${same ? esc(c.role || c.type) : esc(c.title)}</small>`;
  }
  function genBg(c, angle) {
    const a = (c.colors || [])[0] || "#555", b = (c.colors || [])[1] || "#111";
    return `background:repeating-linear-gradient(${angle + 90}deg,rgba(255,255,255,.045) 0 2px,transparent 2px 14px),radial-gradient(circle at 85% 12%,rgba(255,255,255,.3),transparent 42%),radial-gradient(circle at 0% 100%,rgba(0,0,0,.35),transparent 55%),linear-gradient(${angle}deg,${a},${b})`;
  }
  function tileBg(c) {
    return (c.image || c.banner)
      ? `background-image:linear-gradient(180deg,transparent 40%,rgba(0,0,0,.65)),${cssUrl(c.image || c.banner)}`
      : genBg(c, 150);
  }
  function openDoc(id) {
    const d = DOCS[id]; if (!d) return;
    openWindow({ key: "doc-" + id, title: d.title, app: d.wide ? "Photos" : "TextEdit", w: d.wide ? 760 : 560, h: d.wide ? 600 : 520, render: (b) => { b.innerHTML = d.html; } });
  }

  /* =====================================================================
     WINDOW MANAGER
     ===================================================================== */
  const wins = {};   // key -> window element
  let z = 10, cascade = 0;

  function openWindow({ key, title, app, w = 720, h = 480, render, onReopen }) {
    if (wins[key]) { const ex = wins[key]; ex.classList.remove("minimized"); focusWin(ex); onReopen && onReopen(ex); return ex; }
    const win = el(`<section class="window" role="dialog" aria-label="${esc(title)}">
      <div class="titlebar">
        <div class="lights">
          <button class="l close" title="Close">×</button><button class="l min" title="Minimise">−</button><button class="l max" title="Maximise">+</button>
        </div>
        <button class="back">‹ Home</button>
        <div class="wtitle">${esc(title)}</div>
      </div>
      <div class="wbody"></div>
      <div class="resizer"></div>
    </section>`);
    win.dataset.key = key; win.dataset.app = app;
    let W = Math.min(w, innerWidth - 40); const H = Math.min(h, innerHeight - 140);
    const off = (cascade++ % 6) * 28;
    // Keep new windows beside the sticky note (not on top of it) when there's room.
    let minL = !isMobile() && innerWidth >= 1120 ? 214 : 14;
    const st = !isMobile() && ($(".sticky") || $("#weather:not([hidden])"));
    if (st) {
      const r = st.getBoundingClientRect(), right = r.right + 16;
      if (r.width && r.left < innerWidth / 2 && innerWidth - right - 10 >= Math.min(W, 560)) { minL = Math.max(minL, right); W = Math.min(W, innerWidth - minL - 10); }
    }
    let maxR = innerWidth - 14;
    const di = !isMobile() && $("#desk-icons:not([hidden]) .dicon");
    if (di) { const dl = Math.min(...$$("#desk-icons .dicon").map((x) => x.getBoundingClientRect().left)) - 14; if (dl > innerWidth / 2 && dl - minL >= 560) { maxR = dl; W = Math.min(W, maxR - minL); } }
    win.style.width = W + "px"; win.style.height = H + "px";
    win.style.left = clamp(Math.round(minL + (maxR - minL - W) / 2) + off, minL, Math.max(minL, maxR - W)) + "px";
    win.style.top = clamp(54 + off, 36, innerHeight - H - 88) + "px";
    $("#windows").append(win);
    wins[key] = win;

    const tb = $(".titlebar", win);
    $(".close", win).onclick = () => closeWin(win);
    $(".back", win).onclick = () => closeWin(win);
    $(".min", win).onclick = () => {
      if (!isMobile() && win.animate && !reduceMotion()) {
        const dockBtn = $(`.dock-item[data-app="${win.dataset.key}"]`) || $("#dock");
        const dr = dockBtn ? dockBtn.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight - 30, width: 48, height: 48 };
        const wr = win.getBoundingClientRect();
        const tx = (dr.left + dr.width / 2) - (wr.left + wr.width / 2);
        const ty = (dr.top + dr.height / 2) - (wr.top + wr.height / 2);
        const a = win.animate(
          [{ transform: "translate3d(0,0,0) scale(1)", opacity: 1 }, { transform: `translate3d(${tx}px, ${ty}px, 0) scale(0.18)`, opacity: 0 }],
          { duration: 240, easing: "cubic-bezier(0.32, 0, 0.67, 0)" }
        );
        a.onfinish = () => { win.classList.add("minimized"); win.classList.remove("active"); topWin(); };
        return;
      }
      win.classList.add("minimized"); win.classList.remove("active"); topWin();
    };
    $(".max", win).onclick = () => win.classList.toggle("maxed");
    tb.ondblclick = (e) => { if (!e.target.closest("button")) win.classList.toggle("maxed"); };
    win.addEventListener("pointerdown", () => focusWin(win));
    dragger(tb, (dx, dy, o, commit) => {
      if (win.classList.contains("maxed") || isMobile()) return;
      const nx = clamp(o.x + dx, 80 - o.w, innerWidth - 80);
      const ny = clamp(o.y + dy, 28, innerHeight - 40);
      if (commit) {
        win.style.transform = "";
        win.style.left = nx + "px";
        win.style.top = ny + "px";
      } else {
        win.style.transform = `translate3d(${nx - o.x}px, ${ny - o.y}px, 0)`;
      }
    }, () => ({ x: win.offsetLeft, y: win.offsetTop, w: win.offsetWidth }));
    dragger($(".resizer", win), (dx, dy, o) => {
      win.style.width = Math.max(320, o.w + dx) + "px";
      win.style.height = Math.max(220, o.h + dy) + "px";
    }, () => ({ w: win.offsetWidth, h: win.offsetHeight }));

    render($(".wbody", win), win);
    focusWin(win);
    updateDock();
    return win;
  }
  function dragger(handle, onMove, getStart) {
    handle.addEventListener("pointerdown", (e) => {
      if (e.button !== 0 || e.target.closest("button, input, textarea, a, label")) return;
      const sx = e.clientX, sy = e.clientY, o = getStart(), win = handle.closest(".window");
      let raf = 0, lx = sx, ly = sy, moved = false;
      if (win) win.classList.add("dragging");
      handle.setPointerCapture(e.pointerId);
      const move = (ev) => {
        lx = ev.clientX; ly = ev.clientY; moved = true;
        if (!raf) raf = requestAnimationFrame(() => { raf = 0; onMove(lx - sx, ly - sy, o, false); });
      };
      const up = () => {
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
        if (moved) onMove(lx - sx, ly - sy, o, true);
        if (win) win.classList.remove("dragging");
        handle.removeEventListener("pointermove", move);
        handle.removeEventListener("pointerup", up);
        handle.removeEventListener("pointercancel", up);
      };
      handle.addEventListener("pointermove", move);
      handle.addEventListener("pointerup", up);
      handle.addEventListener("pointercancel", up);
    });
  }
  function focusWin(win) {
    $$(".window.active").forEach((w) => w !== win && w.classList.remove("active"));
    win.classList.add("active");
    win.style.zIndex = ++z;
    $("#mb-app").textContent = win.dataset.app;
  }
  function closeWin(win) {
    if (!win || win._closing) return;
    delete wins[win.dataset.key];
    topWin(); updateDock();
    if (!isMobile() && win.animate && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      win._closing = true;
      win.style.pointerEvents = "none";
      const a = win.animate(
        [{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(.93) translateY(8px)" }],
        { duration: 160, easing: "cubic-bezier(.32, 0, .67, 0)", fill: "forwards" }
      );
      a.onfinish = () => win.remove();
      return;
    }
    win.remove();
  }
  function topWin() {
    const open = $$(".window:not(.minimized)").sort((a, b) => b.style.zIndex - a.style.zIndex);
    if (open[0]) focusWin(open[0]); else $("#mb-app").textContent = "Finder";
  }
  const activeWin = () => $(".window.active");

  /* =====================================================================
     APPS
     ===================================================================== */
  
  const RIM3D = '<rect x="1" y="1" width="98" height="98" rx="22" fill="none" stroke="rgba(255,255,255,.52)" stroke-width="1.4"/><path d="M22.5 99h55A21.5 21.5 0 0 0 99 77.5v-2A21.5 21.5 0 0 1 77.5 97h-55A21.5 21.5 0 0 1 1 75.5v2A21.5 21.5 0 0 0 22.5 99z" fill="rgba(0,0,0,.18)"/>';
  ICONS.safari =
    '<defs>' +
      '<linearGradient id="ic-saf-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dfe4ec"/></linearGradient>' +
      '<radialGradient id="ic-saf-dial" cx="50%" cy="38%" r="62%"><stop offset="0" stop-color="#37c3ff"/><stop offset=".65" stop-color="#0b77f5"/><stop offset="1" stop-color="#0051c4"/></radialGradient>' +
    '</defs>' +
    SQ("url(#ic-saf-bg)") +
    '<circle cx="50" cy="50" r="41" fill="rgba(0,0,0,.12)"/>' +
    '<circle cx="50" cy="50" r="39.5" fill="url(#ic-saf-dial)" stroke="rgba(255,255,255,.7)" stroke-width="1.2"/>' +
    '<circle cx="50" cy="50" r="35.2" fill="none" stroke="rgba(255,255,255,.65)" stroke-width="2" stroke-dasharray="1.4 4.42"/>' +
    '<circle cx="50" cy="50" r="32.2" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1" stroke-dasharray="1.2 4.02"/>' +
    '<g filter="url(#ic-sh)"><polygon points="50,50 69,31 54.8,54.8 45.2,45.2" fill="#ff3b30"/><polygon points="50,50 31,69 45.2,45.2 54.8,54.8" fill="#ffffff"/><circle cx="50" cy="50" r="3.4" fill="#d1d5db"/></g>' +
    GLOSS + RIM3D;
  function renderSafari(body, arg) {
    const ios = isMobile();
    if (ios) iosWindow(body);
    let raw = String(arg || "linkedin").trim();
    const isArshaon = raw === "arshaon" || /arshaon\.com/i.test(raw);
    const isLI = !isArshaon && (raw === "linkedin" || /linkedin\.com/i.test(raw) || !/^https?:\/\//i.test(raw));
    const cur = isArshaon ? "https://arshaon.com" : isLI ? (SITE.linkedin || "https://www.linkedin.com/in/ashikurrahmanshaon/") : raw;
    const displayHost = isArshaon ? "arshaon.com" : isLI ? "linkedin.com/in/ashikurrahmanshaon" : cur.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
    const exps = (SITE.experience || []).map((e) => `
      <div class="sfli-exp">
        <div class="sfli-exp-logo">AR</div>
        <div>
          <b>${esc(e.role)}</b>
          <div class="sfli-exp-co">${esc(e.company)} · ${esc(e.dates)}</div>
          <ul>${(e.points || []).map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
        </div>
      </div>`).join("");
    const skills = Object.values(SITE.skills || {}).flat();
    body.innerHTML = `<div class="sf-app ${ios ? "sf-ios ios" : ""}">
      <div class="sf-bar">
        ${ios ? '<button class="sf-nav-btn sf-done-btn" data-sf="close" aria-label="Done">‹ Home</button>' : `<div class="sf-nav-grp"><button class="sf-nav-btn ${isLI ? "on" : ""}" data-sf="linkedin" title="LinkedIn Profile">in LinkedIn</button><button class="sf-nav-btn ${isArshaon ? "on" : ""}" data-sf="arshaon" title="arshaon.com" style="display:inline-flex;align-items:center;gap:4px"><svg viewBox="0 0 814 1000" width="10" height="12" fill="currentColor" style="display:block" aria-hidden="true"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/></svg> arshaon.com</button><button class="sf-nav-btn" data-sf="reload" title="Reload">↻</button></div>`}
        <div class="sf-url" title="${esc(cur)}">
          <svg viewBox="0 0 16 16" width="12" height="12"><rect x="3" y="7" width="10" height="7" rx="1.8" fill="currentColor"/><path d="M5.2 7V5a2.8 2.8 0 0 1 5.6 0v2" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
          <span>${esc(displayHost)}</span>
        </div>
        <div class="sf-actions">
          <a class="sf-ext-btn" href="${esc(cur)}" target="_blank" rel="noopener" data-external-link title="Open in external browser tab">Open ↗</a>
        </div>
      </div>
      ${ios ? `<div class="sf-ios-tabs"><button class="sf-nav-btn ${isLI ? "on" : ""}" data-sf="linkedin">in LinkedIn</button><button class="sf-nav-btn ${isArshaon ? "on" : ""}" data-sf="arshaon" style="display:inline-flex;align-items:center;gap:4px"><svg viewBox="0 0 814 1000" width="10" height="12" fill="currentColor" style="display:block" aria-hidden="true"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/></svg> arshaon.com</button></div>` : ""}
      <div class="sf-viewport">
        ${(isLI || isArshaon) ? `
          <div class="sfli-page">
            <div class="sfli-topbar">
              <div class="sfli-brand">
                ${isArshaon
                  ? '<span class="sfli-verified" style="width:24px;height:24px;background:#111;display:inline-grid;place-items:center"><svg class="mb-apple-svg" viewBox="0 0 814 1000" width="12" height="14.5" fill="currentColor" style="display:block" aria-hidden="true"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/></svg></span><span>ARSHAON — Official Workspace</span>'
                  : '<svg viewBox="0 0 100 100" width="26" height="26"><rect width="100" height="100" rx="18" fill="#0a66c2"/><path d="M27 41h11v33H27zM32.5 24a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zM45 41h10.5v4.6c1.5-2.8 5.2-5.6 10.6-5.6 11.3 0 13.4 7.4 13.4 17V74H68.6V59.1c0-3.6-.1-8.2-5-8.2-5 0-5.8 3.9-5.8 7.9V74H45z" fill="#fff"/></svg><span>LinkedIn</span>'}
              </div>
              <span class="sfli-handle">${isArshaon ? "arshaon.com" : "@ashikurrahmanshaon"}</span>
            </div>
            <div class="sfli-card">
              <div class="sfli-cover">
                <div class="sfli-cover-badge">ARSHAON · DIGITAL PRODUCT ARCHITECTURE</div>
              </div>
              <div class="sfli-profile">
                <img class="sfli-avatar" src="${esc(SITE.photo || "icons/ashikur.jpg")}" alt="${esc(SITE.name)}">
                <div class="sfli-head">
                  <h1>${esc(SITE.name)} <span class="sfli-verified" title="Verified">✓</span></h1>
                  <p class="sfli-headline">${esc(SITE.title)}</p>
                  <p class="sfli-loc">📍 ${esc(SITE.location)} · <span>linkedin.com/in/ashikurrahmanshaon</span></p>
                  <div class="sfli-btns">
                    <button class="sfli-btn primary" data-open="mail">✉️ Email (${esc(SITE.email)})</button>
                    <button class="sfli-btn" data-open="preview">📄 View CV / Resume</button>
                    <button class="sfli-btn" data-open="photos" data-arg="library">🖼️ Photos</button>
                    <a class="sfli-btn ghost" href="${esc(SITE.linkedin)}" target="_blank" rel="noopener" data-external-link>LinkedIn ↗</a>
                  </div>
                </div>
              </div>
            </div>
            <div class="sfli-card sfli-sec">
              <h3>About</h3>
              <p>Founder & Digital Product Architect at <b>ARSHAON</b> (arshaon.com). Building high-performance web applications, AI-powered automation systems, scalable SaaS products, and full-funnel digital brand growth.</p>
              <div class="sfli-contact-strip">
                <div><small>Email</small><b>${esc(SITE.email)}</b></div>
                <div><small>LinkedIn</small><b>in/ashikurrahmanshaon</b></div>
                <div><small>Website</small><b>arshaon.com</b></div>
              </div>
            </div>
            <div class="sfli-card sfli-sec">
              <h3>Experience</h3>
              ${exps}
            </div>
            <div class="sfli-card sfli-sec">
              <h3>Core Skills</h3>
              <div class="sfli-chips">${skills.map((s) => `<span>${esc(s)}</span>`).join("")}</div>
            </div>
          </div>
        ` : `
          <iframe class="sf-frame" src="${esc(cur)}" title="${esc(displayHost)}"></iframe>
        `}
      </div>
      ${ios ? '<button class="ios-homebar" aria-label="Go to Home screen"></button>' : ""}
    </div>`;
    body.onclick = (e) => {
      if (e.target.closest('[data-sf="close"]') || e.target.closest(".ios-homebar")) return closeWin(body.closest(".window"));
      if (e.target.closest('[data-sf="reload"]')) return renderSafari(body, raw);
      if (e.target.closest('[data-sf="linkedin"]')) return renderSafari(body, "linkedin");
      if (e.target.closest('[data-sf="arshaon"]')) return renderSafari(body, "arshaon");
    };
  }

  const APPS = {
    safari: { name: "Safari", title: "Safari — Ashikur Rahman Shaon", w: 880, h: 620, mobile: true, render: renderSafari },
    finder: { name: "Finder", w: 820, h: 560, mobile: false, render: renderFinder },
    notes: { name: "Notes", w: 800, h: 500, mobile: true, render: renderNotes },
    messages: { name: "Messages", w: 860, h: 580, mobile: true, render: renderMessages },
    photos: { name: "Photos", w: 980, h: 640, mobile: true, render: renderPhotos },
    preview: { name: "Preview", title: resumeName(), w: 720, h: 620, mobile: true, render: renderPreview },
    terminal: { name: "Terminal", title: "ashikur@arshaon: ~", w: 680, h: 420, mobile: false, render: renderTerminal },
    settings: { name: "Settings", w: 880, h: 600, mobile: false, render: renderSettings },
    calendar: { name: "Calendar", w: 940, h: 620, mobile: false, render: renderCalendar },
    trash: { name: "Bin", w: 640, h: 420, mobile: false, render: renderTrash },
  };
  function openApp(id, arg) {
    const a = APPS[id]; if (!a) return;
    if (isMobile()) $$(".window").forEach((w) => w.dataset.key !== id && closeWin(w)); // one app at a time on phones
    openWindow({
      key: id, title: a.title || a.name, app: a.name, w: a.w, h: a.h,
      render: (b, win) => a.render(b, arg, win),
      onReopen: (win) => arg && a.render($(".wbody", win), arg, win),
    });
  }

  /* ---------- Notes (like Apple Notes) ---------- */
  const NT_IC = {
    compose: '<svg viewBox="0 0 24 24"><path d="M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6"/><path d="M17.5 3.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>',
    trash: '<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13z"/></svg>',
    sidebar: '<svg viewBox="0 0 24 24"><rect x="3" y="4.5" width="18" height="15" rx="3.5"/><path d="M9.5 4.5v15M5.6 8.5h1.6M5.6 11.5h1.6M5.6 14.5h1.6"/></svg>',
    dots: '<svg viewBox="0 0 24 24"><path d="M6 12h.01M12 12h.01M18 12h.01" stroke-width="2.8"/></svg>',
    format: '<svg viewBox="0 0 24 24"><path d="M3 18.5L8 5.5l5 13M4.8 14.2h6.4"/><circle cx="18" cy="15.2" r="3.2"/><path d="M21.2 11.8v6.7"/></svg>',
    check: '<svg viewBox="0 0 24 24"><circle cx="6" cy="7" r="3"/><path d="M4.7 7l1 1 1.7-2"/><circle cx="6" cy="17" r="3"/><path d="M13 7h8M13 17h8"/></svg>',
    table: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3 9.7h18M3 14.3h18M12 5v14"/></svg>',
    clip: '<svg viewBox="0 0 24 24"><path d="M20 11.5l-8.2 8.2a5 5 0 0 1-7.1-7.1l8.5-8.5a3.4 3.4 0 0 1 4.8 4.8l-8.4 8.4a1.8 1.8 0 0 1-2.5-2.5l7.6-7.6"/></svg>',
    share: '<svg viewBox="0 0 24 24"><path d="M12 15V3.5M8 7.5l4-4 4 4M7 11H5.5v9.5h13V11H17"/></svg>',
    chev: '<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>',
    folder: '<svg viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
  };
  // Notes visitors write themselves (saved only in their own browser).
  let myNotes = (() => { try { return JSON.parse(localStorage.getItem("arshaon-notes")) || []; } catch { return []; } })();
  const saveMyNotes = () => { try { localStorage.setItem("arshaon-notes", JSON.stringify(myNotes)); } catch {} };
  const stripHtml = (h) => { const d = document.createElement("div"); d.innerHTML = h || ""; return (d.textContent || "").replace(/\s+/g, " ").trim(); };
  const hashNum = (str) => { let h = 0; for (const c of String(str)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
  function noteList() {
    const anyPinned = SITE.notes.some((n) => n.pinned || n.date === "Pinned");
    const DAYS = [0, 1, 1, 3, 4, 6, 12, 20, 40, 75], now = new Date();
    let k = 0;
    const site = SITE.notes.map((n, i) => {
      const pinned = !!(n.pinned || n.date === "Pinned" || (!anyPinned && i === 0));
      // Use "updated" from content.js if given (e.g. "2026-11-07"), otherwise a recent date.
      let when = n.updated ? parsePhotoDate(n.updated) : null;
      if (!when) { when = new Date(now); when.setDate(now.getDate() - (pinned ? 0 : DAYS[Math.min(k++, DAYS.length - 1)])); }
      when.setHours(9 + (hashNum(n.title) % 10), hashNum(n.title + "m") % 60, 0, 0);
      if (when > now) when = new Date(now.getTime() - (hashNum(n.title) % 50 + 5) * 60000);
      return { id: "s" + i, primary: n.date === "Pinned", title: n.title, html: n.html, text: stripHtml((n.html || "").replace(/<h1[\s\S]*?<\/h1>/i, "")), pinned, when, own: false };
    });
    const mine = myNotes.map((m) => {
      const [first, ...rest] = (m.text || "").split("\n");
      return { id: m.id, title: first.trim() || "New Note", text: rest.join(" ").trim(), body: m.text || "", pinned: false, when: new Date(m.updated), own: true };
    });
    return [...mine, ...site];
  }
  function noteGroup(n) {
    if (n.pinned) return "Pinned";
    const d0 = new Date(); d0.setHours(0, 0, 0, 0);
    const d1 = new Date(n.when); d1.setHours(0, 0, 0, 0);
    const diff = Math.round((d0 - d1) / 864e5);
    if (diff <= 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return "Previous 7 Days";
    if (diff < 30) return "Previous 30 Days";
    return n.when.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }
  function renderNotes(body, arg) {
    if (isMobile()) return renderNotesMobile(body, arg); // phone layout
    let notes = noteList(), query = "", cur = null, sortBy = "date", pinnedOpen = true;
    if (arg !== undefined && arg !== null && /^\d+$/.test(String(arg))) cur = "s" + arg;
    const tb = (a, ic, label) => `<button data-a="${a}" title="${label}" aria-label="${label}">${ic}</button>`;
    body.innerHTML = `<div class="nt2">
      <div class="nt-top">
        <div class="nt-pill nt-toggle">${tb("side", NT_IC.sidebar, "Show or hide the notes list")}</div>
        <div class="nt-heading"><b>All iCloud</b><small class="nt-count"></small></div>
        <button class="nt-circle" data-a="listmenu" title="List options" aria-label="List options">${NT_IC.dots}</button>
        <i class="nt-div"></i>
        <button class="nt-circle" data-a="new" title="New note" aria-label="New note">${NT_IC.compose}</button>
        <div class="nt-pill">${tb("format", NT_IC.format, "Text size")}${tb("check", NT_IC.check, "Checklist")}${tb("table", NT_IC.table, "Table")}${tb("attach", NT_IC.clip, "Attachments")}</div>
        <div class="nt-pill">${tb("share", NT_IC.share, "Share")}</div>
        <button class="nt-circle" data-a="more" title="More" aria-label="More">${NT_IC.dots}</button>
        <label class="nt-search">${NT_IC.search}<input placeholder="Search" aria-label="Search notes"></label>
      </div>
      <div class="split nt show-main">
        <div class="side nt-side"><div class="nt-compose-cta"><button class="nt-write-btn" data-a="new">+ Write a Note / Message Ashikur</button></div><div class="nt-list"></div></div>
        <div class="main nt-main"></div>
      </div></div>`;
    const root = $(".nt2", body), split = $(".split", body), list = $(".nt-list", body), main = $(".nt-main", body), search = $(".nt-search input", body);
    if (cur === null || !notes.some((n) => n.id === cur)) cur = (notes.find((n) => n.primary) || notes.find((n) => n.pinned) || notes[0] || {}).id;
    const clock = (d) => d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: useH12() });
    const fmtShort = (d) => (d.toDateString() === new Date().toDateString() ? clock(d) : d.toLocaleDateString("en-GB", { day: "numeric", month: "numeric", year: "2-digit" }));
    const stamp = (d) => `${d.toLocaleDateString("en-GB", { day: "numeric", month: "long" })}, ${d.getFullYear()} at ${clock(d)}`;
    const SIZES = { Small: "13.5px", Default: "", Large: "17px", "Extra Large": "19px" };
    const applySize = () => main.style.setProperty("--nt-size", SIZES[prefs.noteSize] || "15px");
    const drawList = () => {
      const q = query.toLowerCase();
      const rank = (n) => (n.pinned ? -1e15 - (n.primary ? 1 : 0) : -n.when.getTime());
      const shown = notes.filter((n) => !q || n.title.toLowerCase().includes(q) || (n.own ? n.body : n.text).toLowerCase().includes(q))
        .sort((x, y) => (sortBy === "title" && x.pinned === y.pinned && !x.primary && !y.primary ? x.title.replace(/^[^\p{L}\p{N}]+/u, "").localeCompare(y.title.replace(/^[^\p{L}\p{N}]+/u, "")) : rank(x) - rank(y)));
      let html = "", last = null;
      shown.forEach((n) => {
        const g = sortBy === "title" && !n.pinned ? "Notes" : noteGroup(n);
        if (g !== last) {
          html += g === "Pinned" ? `<h5 class="nt-pinhead ${pinnedOpen ? "" : "shut"}" data-a="pins" role="button" tabindex="0">Pinned${NT_IC.chev}</h5>` : `<h5>${esc(g)}</h5>`;
          last = g;
        }
        if (g === "Pinned" && !pinnedOpen) return;
        html += `<button class="nt-row ${n.id === cur ? "active" : ""}" data-id="${n.id}"><b>${esc(n.title)}</b><small><span>${fmtShort(n.when)}</span> ${esc(n.text.slice(0, 90)) || "No additional text"}</small><em>${NT_IC.folder}Notes</em></button>`;
      });
      list.innerHTML = html || `<p class="im-none">No notes found</p>`;
      $(".nt-count", body).textContent = `${notes.length} notes`;
    };
    const drawNote = () => {
      const n = notes.find((x) => x.id === cur);
      $$('[data-a="check"], [data-a="table"]', root).forEach((b) => { b.disabled = !n || !n.own; });
      if (!n) { main.innerHTML = `<div class="empty"><h3>No note selected</h3></div>`; return; }
      if (n.own) {
        main.innerHTML = `<div class="nt-bar"><span class="nt-private">🔒 Only you can see this note. To share it privately with ${esc(SITE.short)}, use Send below.</span>
            <button class="nt-btn" data-a="del" title="Delete note" aria-label="Delete note">${NT_IC.trash}</button></div>
          <div class="note"><div class="stamp">${stamp(n.when)}</div><textarea class="nt-edit" placeholder="Start typing… The first line becomes the title." aria-label="Note text">${esc(n.body)}</textarea></div>`;
        const ta = $(".nt-edit", main);
        ta.oninput = () => {
          const m = myNotes.find((x) => x.id === n.id); if (!m) return;
          m.text = ta.value; m.updated = Date.now(); saveMyNotes(); notes = noteList(); drawList();
        };
        ta.focus();
      } else {
        main.innerHTML = `<div class="note"><div class="stamp">${stamp(n.when)}</div>${n.html}</div>`;
      }
      main.scrollTop = 0;
    };
    const newNote = () => {
      const m = { id: "u" + Date.now(), text: "", updated: Date.now() };
      myNotes.unshift(m); saveMyNotes(); notes = noteList(); cur = m.id; query = ""; search.value = "";
      root.classList.remove("no-side"); drawList(); drawNote();
    };
    const delNote = () => {
      myNotes = myNotes.filter((x) => x.id !== cur); saveMyNotes(); notes = noteList();
      cur = (notes.find((n) => n.primary) || notes.find((n) => n.pinned) || notes[0] || {}).id; drawList(); drawNote();
    };
    // Types text into a visitor's own note at the cursor (checklist and table buttons).
    const insert = (text) => {
      const ta = $(".nt-edit", main); if (!ta) return;
      const at = ta.selectionStart, before = ta.value.slice(0, at);
      const add = (before && !before.endsWith("\n") ? "\n" : "") + text;
      ta.setRangeText(add, at, ta.selectionEnd, "end"); ta.focus(); ta.oninput();
    };
    list.onclick = (e) => {
      if (e.target.closest('[data-a="pins"]')) { pinnedOpen = !pinnedOpen; drawList(); return; }
      const r = e.target.closest("[data-id]"); if (!r) return; cur = r.dataset.id; drawList(); drawNote();
    };
    search.oninput = () => { query = search.value.trim(); drawList(); };
    body.onclick = (e) => {
      const a = e.target.closest("[data-a]"); if (!a || a.disabled) return;
      const r = a.getBoundingClientRect(), menu = (items) => showCtx(r.left, r.bottom + 6, items), tick = (on, label) => (on ? "✓ " : "") + label;
      const n = notes.find((x) => x.id === cur), own = !!(n && n.own), act = a.dataset.a;
      if (act === "new") newNote();
      if (act === "del") delNote();
      if (act === "side") root.classList.toggle("no-side");
      if (act === "listmenu") menu([[tick(sortBy === "date", "Sort by Date Edited"), () => { sortBy = "date"; drawList(); }], [tick(sortBy === "title", "Sort by Title"), () => { sortBy = "title"; drawList(); }], "-",
        [pinnedOpen ? "Collapse Pinned" : "Expand Pinned", () => { pinnedOpen = !pinnedOpen; drawList(); }], [root.classList.contains("no-side") ? "Show Notes List" : "Hide Notes List", () => root.classList.toggle("no-side")]]);
      if (act === "format") menu(Object.keys(SIZES).map((k) => [tick((prefs.noteSize || "Default") === k, k), () => { prefs.noteSize = k; savePrefs(); applySize(); }]));
      if (act === "check") insert("☐ ");
      if (act === "table") insert("┌──────────────┬──────────────┐\n│              │              │\n├──────────────┼──────────────┤\n│              │              │\n└──────────────┴──────────────┘\n");
      if (act === "attach") menu([["Resume (PDF)", () => openApp("preview")], ["Projects & Campaigns", () => openApp("photos")], ["Work Experience", () => openApp("finder", "experience")]]);
      if (act === "share") menu([["Copy Link to This Site", () => navigator.clipboard?.writeText(location.origin + location.pathname)], ["Email", () => openApp("mail")], ["Messages", () => openApp("messages")], "-",
        ["LinkedIn", SITE.linkedin ? () => window.open(SITE.linkedin, "_blank", "noopener") : null]]);
      if (act === "more") menu([["New Note", newNote], ["Delete Note", own ? delNote : null], "-", ["Print…", () => window.print()], ["Keyboard Shortcuts", showShortcuts, "?"]]);
    };
    // Drag the window from the empty part of the toolbar.
    const nwin = body.closest(".window");
    if (nwin) dragger($(".nt-top", body), (dx, dy, o) => {
      if (nwin.classList.contains("maxed") || isMobile()) return;
      nwin.style.left = clamp(o.x + dx, 80 - nwin.offsetWidth, innerWidth - 80) + "px";
      nwin.style.top = clamp(o.y + dy, 28, innerHeight - 40) + "px";
    }, () => ({ x: nwin.offsetLeft, y: nwin.offsetTop }));
    applySize(); drawList(); drawNote();
  }

  /* ---------- Finder (list view, like macOS) ---------- */
  const FD_IC = {
    recents: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    applications: '<svg viewBox="0 0 24 24"><path d="M5 5h.01M12 5h.01M19 5h.01M5 12h.01M12 12h.01M19 12h.01M5 19h.01M12 19h.01M19 19h.01" stroke-width="3.4"/></svg>',
    desktop: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M9 20h6M12 16v4"/></svg>',
    documents: '<svg viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6z" fill="currentColor"/></svg>',
    downloads: '<svg viewBox="0 0 24 24"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>',
    projects: '<svg viewBox="0 0 24 24"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/></svg>',
    trash: '<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13z"/></svg>',
    list: '<svg viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" /></svg>',
    grid: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>',
  };
  const FD_TAGS = [["Red", "#ff6b63"], ["Orange", "#ffab4a"], ["Yellow", "#ffd84d"], ["Green", "#5fd47a"], ["Blue", "#4aa3ff"], ["Purple", "#c98be6"], ["Grey", "#a9a9ae"]];
  const FD_PLACES = [["recents", "Recents"], ["applications", "Applications"], ["desktop", "Desktop"], ["documents", "Documents"],
    ["downloads", "Downloads"], ["projects", "Projects"], ["trash", "Bin"]];
  // A believable "Date Modified" for each item (the same on every visit).
  function fakeDate(name) {
    let h = 0; for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const d = new Date(); d.setMinutes(d.getMinutes() - (h % (7 * 24 * 60))); return d;
  }
  function fmtModified(d) {
    const now = new Date(), y = new Date(now); y.setDate(now.getDate() - 1);
    const t = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: useH12() });
    if (d.toDateString() === now.toDateString()) return `Today at ${t}`;
    if (d.toDateString() === y.toDateString()) return `Yesterday at ${t}`;
    return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} at ${t}`;
  }
  // What is inside each Finder location.
  function fdItems(place) {
    const file = (name, kind, ic, open, extra = {}) => ({ name, kind, ic, open, ...extra });
    const folder = (name, children) => ({ name, kind: "Folder", ic: "folder", children });
    const project = (c, i) => file(c.title, "Project", { doc: (c.colors || [])[0] || "#555", label: "PROJ" }, () => openDoc("c" + i));
    const resume = file(resumeName(), "PDF Document", { doc: "#e2483d", label: "PDF" }, () => openApp("preview"));
    const about = file("About me", "Note", { doc: "#ffc400", label: "NOTE" }, () => openApp("notes"));
    const experience = folder("Experience", () => SITE.experience.map((e, i) =>
      file(`${e.company} – ${e.role}`, "Plain Text", { doc: "#555", label: "TXT" }, () => openDoc("e" + i))));
    if (place === "recents") return [resume, about, ...SITE.campaigns.slice(0, 4).map(project)];
    if (place === "applications") return Object.entries(APPS).filter(([id]) => ["finder", "safari", "messages", "mail", "photos", "notes", "calendar", "preview", "terminal", "settings"].includes(id)).map(([id, a]) => file(id === "preview" ? "CV" : a.name, "Application", { app: id }, () => openApp(id)));
    if (place === "desktop") return deskItems.filter((_, i) => !trashedItems.some((t) => t.i === i)).map((d) =>
      file(d.name, d.name.endsWith(".pdf") ? "PDF Document" : d.name.includes(".") ? "Plain Text" : "Folder", { raw: d.icon }, d.open));
    if (place === "documents") return [resume, about, file("Skills.txt", "Plain Text", { doc: "#0a84ff", label: "TXT" }, () => openDoc("skills")), experience];
    if (place === "downloads") return [file(`${SITE.name.replace(/\s+/g, "-")}-Resume.pdf`, "PDF Document", { doc: "#e2483d", label: "PDF" }, () => {
      const a = document.createElement("a"); a.href = SITE.resume; a.download = ""; document.body.append(a); a.click(); a.remove();
    })];
    if (place === "projects") return [...new Set(SITE.campaigns.map((c) => c.type))].map((t) =>
      folder(t, () => SITE.campaigns.map((c, i) => [c, i]).filter(([c]) => c.type === t).map(([c, i]) => project(c, i))));
    if (place === "trash") return [
      ...(SITE.trash || []).map((t) => file(t.name, t.type === "image" ? "Image" : t.type === "link" ? "Web Link" : "Document",
        { doc: "#8e8e93", label: (t.name.includes(".") ? t.name.split(".").pop() : "FILE").toUpperCase().slice(0, 4) }, () => openTrashFile(t))),
      ...trashedItems.map((t) => file(t.name, "Moved to Bin", { raw: t.icon }, t.open, { putBack: t.i })),
    ];
    return [];
  }
  function fdIcon(it, size) {
    const c = it.ic;
    if (c && c.app) return icon(c.app, size);
    const art = c === "folder" ? FOLDER : c.raw ? c.raw : docIcon(c.doc, c.label);
    return `<span class="fi" style="--fi:${size}px">${art}</span>`;
  }

  function renderFinder(body, arg) {
    if (isMobile()) return renderFilesMobile(body, arg); // phone layout: Files
    const alias = { campaigns: "projects", apps: "applications", experience: "documents" };
    const deskFolder = String(arg || "").startsWith("desktop/") ? String(arg).slice(8) : "";
    let place = deskFolder ? "desktop" : alias[arg] || (FD_PLACES.some((p) => p[0] === arg) ? arg : "home");
    let path = arg === "experience" ? ["Experience"] : deskFolder ? [deskFolder] : [];
    let hist = [{ place, path }], hi = 0, view = "icons", query = "", sortBy = "name", sortDir = 1, sel = -1, rows = [];
    body.innerHTML = `<div class="fd">
      <aside class="fd-side"><div class="fd-places fd-top"></div><h5>Favourites</h5><div class="fd-places fd-favs"></div><h5>Locations</h5><div class="fd-places fd-locs"></div><h5>Tags</h5><div class="fd-places fd-tags"></div></aside>
      <section class="fd-main">
        <div class="fd-bar">
          <div class="fd-pill"><button class="fd-nav" data-nav="-1" aria-label="Back"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button><button class="fd-nav" data-nav="1" aria-label="Forward"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button></div>
          <b class="fd-title"></b>
          <div class="fd-pill fd-views"><button data-view="icons" aria-label="Icon view">${FD_IC.grid}</button><button data-view="list" aria-label="List view">${FD_IC.list}</button></div>
          <div class="fd-pill"><button data-fd="share" aria-label="Share">${FD_IC.share}</button><button data-fd="tag" aria-label="Tags">${FD_IC.tag}</button></div>
          <button class="fd-circle" data-fd="more" aria-label="More">${FD_IC.more}</button>
          <label class="fd-search">${FD_IC.search}<input placeholder="Search" aria-label="Search files"></label>
        </div>
        <div class="fd-content" tabindex="0"></div>
      </section></div>`;
    const content = $(".fd-content", body);

    const current = () => {
      if (query) { // search everywhere
        const all = [], seen = new Set();
        const walk = (items, p, pth, depth) => items.forEach((it) => {
          it.loc = { place: p, path: pth }; all.push(it);
          if (it.children && depth < 2) walk(it.children(), p, [...pth, it.name], depth + 1);
        });
        FD_PLACES.forEach(([p]) => !/^(recents|shared|tags?(-.*)?)$/.test(p) && walk(fdItems(p), p, [], 0));
        return all.filter((it) => it.name.toLowerCase().includes(query) && !seen.has(it.name + it.kind) && seen.add(it.name + it.kind));
      }
      let items = fdItems(place);
      for (const name of path) { const f = items.find((x) => x.children && x.name === name); items = f ? f.children() : []; }
      return items;
    };
    const sorted = (items) => [...items].sort((a, b) => {
      if (sortBy === "date") return sortDir * (fakeDate(a.name) - fakeDate(b.name));
      const x = sortBy === "kind" ? a.kind : a.name, y = sortBy === "kind" ? b.kind : b.name;
      return sortDir * x.localeCompare(y, undefined, { numeric: true, sensitivity: "base" });
    });

    const draw = () => {
      const label = FD_PLACES.find((p) => p[0] === place)[1];
      const title = query ? "Search" : path.length ? path[path.length - 1] : label;
      $(".fd-title", body).textContent = title;
      const win = body.closest(".window"); if (win) $(".wtitle", win).textContent = title;
      // Sidebar, laid out like the macOS Finder: Recents & Shared, Favourites, Locations, Tags.
      const pl = (k) => { const p = FD_PLACES.find((x) => x[0] === k); return p ? `<button class="fd-place ${k === place && !query ? "active" : ""}" data-place="${k}">${FD_IC[k] || ""}<span>${esc(p[1])}</span></button>` : ""; };
      const group = (cls, keys) => { $(cls, body).innerHTML = keys.map(pl).join(""); };
      $(".fd-top", body).innerHTML = "";
      group(".fd-favs", ["desktop", "documents", "downloads", "applications"]);
      group(".fd-locs", ["home", "trash"]);
      $(".fd-tags", body).innerHTML = "";
      $$(".fd-side h5", body).forEach((h) => { if (h.textContent === "Tags") h.hidden = true; });
      $(".fd-search", body).classList.toggle("has", !!query);
      $('[data-nav="-1"]', body).disabled = hi === 0;
      $('[data-nav="1"]', body).disabled = hi >= hist.length - 1;
      $$(".fd-views button", body).forEach((b) => b.classList.toggle("on", b.dataset.view === view));
      rows = sorted(current()); sel = -1;
      if (!rows.length && place === "airdrop" && !query) { content.innerHTML = `<div class="fd-air"><i></i><b>AirDrop lets you share instantly with people nearby.</b><span>No one nearby right now. Say hi in Messages instead 👋</span></div>`; return; }
      if (!rows.length) { content.innerHTML = `<div class="empty"><h3>${query ? "No results" : "This folder is empty"}</h3></div>`; return; }
      const arrow = (k) => (sortBy === k ? `<i class="fd-sort">${sortDir > 0 ? "▲" : "▼"}</i>` : "");
      content.innerHTML = view === "list"
        ? `<div class="fd-list"><div class="fd-head"><button data-sort="name">Name${arrow("name")}</button><button data-sort="kind">Kind${arrow("kind")}</button><button data-sort="date">Date Modified${arrow("date")}</button></div>
            ${rows.map((it, i) => `<button class="fd-row" data-i="${i}"><span class="fd-name">${fdIcon(it, 18)}<span>${esc(it.name)}</span></span><span class="fd-kind">${esc(it.kind)}</span><span class="fd-date">${fmtModified(fakeDate(it.name))}</span></button>`).join("")}</div>`
        : `<div class="fgrid">${rows.map((it, i) => `<button class="fitem fd-row" data-i="${i}">${fdIcon(it, 58)}<span>${esc(it.name)}</span></button>`).join("")}</div>`;
      if (place === "trash" && !query) content.insertAdjacentHTML("beforeend", `<div class="fd-trashbar"><span>${rows.length} item${rows.length === 1 ? "" : "s"}</span>
        <button class="btn" data-act="putback" disabled>Put Back</button><button class="btn" data-act="empty" ${trashedItems.length ? "" : "disabled"}>Empty Bin</button></div>`);
    };
    const goTo = (p, pth) => {
      hist = hist.slice(0, hi + 1); hist.push({ place: p, path: pth }); hi = hist.length - 1;
      place = p; path = pth; query = ""; $(".fd-search input", body).value = ""; draw();
    };
    const openItem = (it) => {
      if (it.children) { const base = (query && it.loc) || { place, path }; goTo(base.place, [...base.path, it.name]); }
      else if (it.open) it.open();
    };

    $(".fd-side", body).onclick = (e) => { const b = e.target.closest("[data-place]"); if (b) goTo(b.dataset.place, []); };
    $(".fd-bar", body).onclick = (e) => {
      const n = e.target.closest("[data-nav]"), v = e.target.closest("[data-view]");
      if (n && !n.disabled) { hi += +n.dataset.nav; ({ place, path } = hist[hi]); query = ""; $(".fd-search input", body).value = ""; draw(); }
      if (v) { view = v.dataset.view; draw(); }
      const f = e.target.closest("[data-fd]");
      if (f) {
        const r = f.getBoundingClientRect(), cur = sel >= 0 ? rows[sel] : null;
        if (f.dataset.fd === "share") showCtx(r.left, r.bottom + 6, [["Copy Link to This Site", () => navigator.clipboard?.writeText(location.origin + location.pathname)], ["Email", () => openApp("mail")], ["Messages", () => openApp("messages")], "-", ["LinkedIn", SITE.linkedin ? () => window.open(SITE.linkedin, "_blank", "noopener") : null]]);
        if (f.dataset.fd === "tag") showCtx(r.left, r.bottom + 6, [...["🔴 Red", "🟠 Orange", "🟡 Yellow", "🟢 Green", "🔵 Blue", "🟣 Purple"].map((t) => [t, () => goTo("tag-" + t.split(" ")[1].toLowerCase(), [])]), "-", ["All Tags…", () => goTo("tags", [])]]);
        if (f.dataset.fd === "more") showCtx(r.left, r.bottom + 6, [["New Folder", null, "⇧⌘N"], ["Get Info", cur ? () => getInfo({ name: cur.name, kind: cur.kind, where: $(".fd-title", body).textContent }) : null, "⌘I"], "-",
          ["as Icons", () => { view = "icons"; draw(); }, "⌘1"], ["as List", () => { view = "list"; draw(); }, "⌘2"], "-", ["Show View Options", null, "⌘J"]]);
      }
    };
    // Drag the window from the empty part of the toolbar or sidebar.
    const fwin = body.closest(".window");
    if (fwin) [".fd-bar", ".fd-side"].forEach((sel2) => dragger($(sel2, body), (dx, dy, o) => {
      if (fwin.classList.contains("maxed") || isMobile()) return;
      fwin.style.left = clamp(o.x + dx, 80 - fwin.offsetWidth, innerWidth - 80) + "px";
      fwin.style.top = clamp(o.y + dy, 28, innerHeight - 40) + "px";
    }, () => ({ x: fwin.offsetLeft, y: fwin.offsetTop })));
    $(".fd-search input", body).oninput = (e) => { query = e.target.value.trim().toLowerCase(); draw(); };
    content.onclick = (e) => {
      const s = e.target.closest("[data-sort]"), r = e.target.closest(".fd-row"), act = e.target.closest("[data-act]");
      if (s) { const k = s.dataset.sort; sortDir = sortBy === k ? -sortDir : 1; sortBy = k; draw(); return; }
      if (act) {
        if (act.dataset.act === "empty") { trashedItems = []; crumple(); updateTrashIcon(); draw(); }
        if (act.dataset.act === "putback" && sel >= 0 && rows[sel].putBack != null) { putBack(rows[sel].putBack); draw(); }
        return;
      }
      if (!r) { sel = -1; $$(".fd-row.sel", content).forEach((x) => x.classList.remove("sel")); return; }
      sel = +r.dataset.i;
      $$(".fd-row", content).forEach((x) => x.classList.toggle("sel", x === r));
      const pb = $('[data-act="putback"]', content); if (pb) pb.disabled = rows[sel].putBack == null;
      if (isMobile() || e.detail >= 2) openItem(rows[sel]);
    };
    content.onkeydown = (e) => { if (e.key === "Enter" && sel >= 0) openItem(rows[sel]); };
    draw();
  }

  /* ---------- Messages: find the best answer for a typed question ----------
     Looks at this conversation's questions first, then the private-topic
     replies and the extra answers in content.js (chatPrivate / chatExtra). */
  function chatScore(text, x) {
    return (x.words || []).reduce((n, w) => {
      const k = String(w).toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      // whole words for short words and phrases ("cv", "see you"); word starts for stems ("negotiat")
      const re = new RegExp((/^\w/.test(w) ? "(^|[^a-z0-9])" : "") + k + (w.length <= 3 || /\s/.test(w) ? "s?($|[^a-z0-9])" : ""));
      return n + (re.test(text) ? w.length : 0);
    }, 0);
  }
  function chatFind(c, lower) {
    const text = " " + lower.replace(/[’']/g, "'").replace(/\s+/g, " ") + " ";
    const own = c.chat || [];
    const exact = own.find((x) => x.q && x.q.toLowerCase() === lower.trim()); if (exact) return exact;
    const pool = [...own, ...(SITE.chatPrivate || []), ...(SITE.chatExtra || [])];
    let best = null, top = 0;
    pool.forEach((x) => { const sc = chatScore(text, x); if (sc > top) { top = sc; best = x; } });
    return best;
  }
  /* ---------- Messages (iMessage style, with reactions) ---------- */
  const TAPBACKS = {
    heart: '<svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.6 4.5c2.2 0 3.6 1.3 5.4 3.3 1.8-2 3.2-3.3 5.4-3.3 3.6 0 5.7 3.9 4.2 7.3C19.5 16.4 12 21 12 21z" fill="currentColor"/></svg>',
    like: '<svg viewBox="0 0 24 24"><path d="M7 21H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h3zm2 0V10.5l4.2-7.1c.4-.6 1.2-.8 1.8-.4 1 .6 1.4 1.8 1.1 2.9L15.2 10H20a2 2 0 0 1 2 2.3l-1.3 7A2 2 0 0 1 18.7 21z" fill="currentColor"/></svg>',
    dislike: '<svg viewBox="0 0 24 24"><g transform="rotate(180 12 12)"><path d="M7 21H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h3zm2 0V10.5l4.2-7.1c.4-.6 1.2-.8 1.8-.4 1 .6 1.4 1.8 1.1 2.9L15.2 10H20a2 2 0 0 1 2 2.3l-1.3 7A2 2 0 0 1 18.7 21z" fill="currentColor"/></g></svg>',
    haha: '<span class="tb-haha">HA<br>HA</span>',
    bang: '<span class="tb-txt">!!</span>',
    q: '<span class="tb-txt">?</span>',
  };
  const isToday = (t) => new Date(t).toDateString() === new Date().toDateString();
  function fmtListDate(t) {
    const d = new Date(t), y = new Date(); y.setDate(y.getDate() - 1);
    if (isToday(t)) return fmtTime(d);
    if (d.toDateString() === y.toDateString()) return "Yesterday";
    return d.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "2-digit" });
  }
  // All conversations. The first one is your main chat (chat / chatGreeting in content.js),
  // the others come from "conversations" in content.js.
  let CONVOS = null;
  function convos() {
    if (CONVOS) return CONVOS;
    const main = { name: SITE.short, photo: SITE.photo, pinned: true, color: "linear-gradient(135deg,#ff9a5a,#e2483d)",
      greeting: SITE.chatGreeting || [`Hey 👋 I'm ${SITE.short}.`], chat: SITE.chat || [], fallback: SITE.chatFallback };
    CONVOS = [main, ...(SITE.conversations || [])].map((c, i) => ({
      ...c, id: i,
      initials: c.initials || c.name.replace(/[^A-Za-z0-9 ]/g, "").split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase(),
      msgs: (c.greeting || []).map((t) => ({ who: "them", text: t, react: null })),
      unread: true, time: Date.now() - i * 7.3e7,
    }));
    return CONVOS;
  }
  function updateBadge() {
    const b = $('.dock-item[data-app="messages"] .badge'); if (!b) return;
    const n = convos().filter((c) => c.unread).length;
    b.textContent = n; b.hidden = !n;
  }
  const convAvatar = (c, cls = "") => c.photo
    ? `<div class="avatar ${cls}" style="background-image:url('${esc(c.photo)}')"></div>`
    : `<div class="avatar ${cls}" style="background:${c.color || "linear-gradient(180deg,#a8a8b0,#7c7c85)"}">${esc(c.initials)}</div>`;

  function renderMessages(body) {
    if (isMobile()) return renderMessagesMobile(body); // phone layout
    const C = convos(); let cur = 0, busy = false, query = "", bar = null;
    body.innerHTML = `<div class="split imsg ${isMobile() ? "" : "show-main"}">
      <div class="side im-side">
        <div class="im-tools">
          <label class="im-search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg><input placeholder="Search" aria-label="Search conversations"></label>
          <button class="im-compose" title="New message" aria-label="New message"><svg viewBox="0 0 24 24"><path d="M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6"/><path d="M17.5 3.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z"/></svg></button>
        </div>
        <div class="im-pins"></div><div class="im-list"></div>
      </div>
      <div class="main im-main">
        <div class="im-head"><button class="mobile-back im-back" aria-label="Back">‹</button><span class="im-to">To:</span> <b class="im-name"></b></div>
        <div class="chat-log" aria-live="polite"></div>
        <div class="quick"></div>
        <form class="im-input"><input placeholder="iMessage" aria-label="Type a message" autocomplete="off"><button type="button" class="im-emoji" aria-label="Emoji">☺</button><button class="im-send" aria-label="Send">↑</button></form>
      </div></div>`;
    const split = $(".split", body), pins = $(".im-pins", body), list = $(".im-list", body), log = $(".chat-log", body), quick = $(".quick", body), input = $(".im-input input", body);
    const preview = (c) => { const m = c.msgs[c.msgs.length - 1]; return m ? (m.who === "me" ? "You: " : "") + m.text : ""; };
    const match = (c) => !query || c.name.toLowerCase().includes(query) || c.msgs.some((m) => m.text.toLowerCase().includes(query));

    const drawSide = () => {
      pins.innerHTML = C.filter((c) => c.pinned && match(c)).map((c) => `<button class="pin ${c.id === cur ? "active" : ""}" data-c="${c.id}">
          ${c.unread ? `<span class="pin-peek">${esc(preview(c))}</span>` : ""}
          ${convAvatar(c, "pin-av")}<span class="pin-name">${c.unread ? '<i class="udot"></i>' : ""}<span class="pn">${esc(c.name)}</span></span></button>`).join("");
      list.innerHTML = C.filter((c) => !c.pinned && match(c)).map((c) => `<button class="im-row ${c.id === cur ? "active" : ""}" data-c="${c.id}">
          <i class="udot ${c.unread ? "" : "off"}"></i>${convAvatar(c)}
          <div class="im-row-txt"><div class="im-row-top"><b>${esc(c.name)}</b><small>${fmtListDate(c.time)}</small></div><p>${esc(preview(c))}</p></div></button>`).join("")
        || (query && !pins.innerHTML ? `<p class="im-none">No results</p>` : "");
    };
    const drawLog = () => {
      const c = C[cur]; bar = null;
      $(".im-name", body).textContent = c.name;
      const lastMe = c.msgs.map((m) => m.who).lastIndexOf("me");
      log.innerHTML = `<div class="im-stamp">iMessage<br>${isToday(c.time) ? "Today " : ""}${fmtListDate(c.time)}</div>` + c.msgs.map((m, i) => `
        <div class="mrow ${m.who} ${m.react ? "reacted" : ""}" data-i="${i}">
          ${c.group && m.who === "them" && (i === 0 || c.msgs[i - 1].who !== "them") ? `<div class="sender">${esc(SITE.short)}</div>` : ""}
          <div class="bub ${m.who}" title="Click to react">${m.who === "them" ? linkify(m.text) : esc(m.text)}${m.react ? `<span class="tb-badge ${m.react.by}">${TAPBACKS[m.react.type]}</span>` : ""}</div>
          ${i === lastMe ? `<div class="read">${c.read ? "Read" : "Delivered"}</div>` : ""}
        </div>`).join("");
      quick.innerHTML = (c.chat || []).map((q) => `<button type="button">${esc(q.q)}</button>`).join("");
      log.scrollTop = log.scrollHeight;
    };
    const open = (id) => {
      cur = id; C[id].unread = false; updateBadge(); drawSide(); drawLog();
      split.classList.add("show-main"); if (!isMobile()) input.focus();
    };

    $(".im-side", body).onclick = (e) => { const b = e.target.closest("[data-c]"); if (b) open(+b.dataset.c); };
    $(".im-search input", body).oninput = (e) => { query = e.target.value.trim().toLowerCase(); drawSide(); };
    $(".im-compose", body).onclick = () => open(0);
    $(".im-back", body).onclick = () => { split.classList.remove("show-main"); drawSide(); };

    // Reactions: click a bubble to show the tapback bar, click a reaction to add or remove it.
    const closeBar = () => { bar?.remove(); bar = null; };
    log.onclick = (e) => {
      const tb = e.target.closest(".tapbar button");
      if (tb) {
        const m = C[cur].msgs[+tb.closest(".mrow").dataset.i], t = tb.dataset.r;
        m.react = m.react && m.react.by === "me" && m.react.type === t ? null : { by: "me", type: t };
        drawLog(); return;
      }
      const bub = e.target.closest(".bub:not(.typing)");
      if (!bub || e.target.closest("a")) return closeBar();
      const row = bub.closest(".mrow");
      if (bar && bar.parentNode === row) return closeBar();
      closeBar();
      const m = C[cur].msgs[+row.dataset.i];
      bar = el(`<div class="tapbar ${row.classList.contains("me") ? "right" : ""} ${row.offsetTop - log.scrollTop < 60 ? "below" : ""}">${Object.keys(TAPBACKS).map((k) =>
        `<button type="button" data-r="${k}" class="${m.react && m.react.by === "me" && m.react.type === k ? "on" : ""}" aria-label="${k}">${TAPBACKS[k]}</button>`).join("")}</div>`);
      row.append(bar);
    };

    const ask = (q) => {
      if (busy || !q.trim()) return;
      closeBar(); $(".emoji-pop", body)?.remove();
      const c = C[cur], mine = { who: "me", text: q, react: null };
      c.msgs.push(mine); c.read = false; c.time = Date.now();
      ping(660, 990); drawLog(); drawSide();
      const lower = q.toLowerCase();
      let hit = chatFind(c, lower);
      const answer = hit ? hit.a : (c.fallback || SITE.chatFallback);
      busy = true;
      setTimeout(() => { // "Read", and sometimes a reaction back
        c.read = true;
        if (hit && Math.random() < 0.45) mine.react = { by: "them", type: ["heart", "like", "bang"][Math.floor(Math.random() * 3)] };
        if (C[cur] === c && body.isConnected) drawLog();
      }, 700);
      setTimeout(() => {
        if (C[cur] === c && body.isConnected) { log.append(el(`<div class="mrow them"><div class="bub them typing"><i></i><i></i><i></i></div></div>`)); log.scrollTop = log.scrollHeight; }
      }, 950);
      setTimeout(() => {
        c.msgs.push({ who: "them", text: answer, react: null }); c.time = Date.now(); busy = false;
        if (C[cur] !== c || !body.isConnected) c.unread = true;
        updateBadge(); ping();
        if (body.isConnected) { drawSide(); if (C[cur] === c) drawLog(); }
      }, 1900 + Math.min(answer.length * 8, 900));
    };
    quick.onclick = (e) => { const b = e.target.closest("button"); if (b) ask(b.textContent); };
    $(".im-input", body).onsubmit = (e) => { e.preventDefault(); ask(input.value); input.value = ""; };
    $(".im-emoji", body).onclick = () => {
      const ex = $(".emoji-pop", body); if (ex) return ex.remove();
      const pop = el(`<div class="emoji-pop">${"😀 😂 😍 🔥 👏 🙌 🤝 🚀 💯 🎉 ⚽ 🎬".split(" ").map((x) => `<button type="button">${x}</button>`).join("")}</div>`);
      pop.onclick = (ev) => { const b = ev.target.closest("button"); if (b) { input.value += b.textContent; input.focus(); pop.remove(); } };
      $(".im-input", body).append(pop);
    };
    C[0].unread = false; updateBadge();
    drawSide(); drawLog();
  }

  // Turns emails and web addresses in a reply into clickable links.
  function linkify(text) {
    return esc(text)
      .replace(/(https?:\/\/[^\s<]+[^\s<.,!?)])/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
      .replace(/([\w.+-]+@[\w-]+\.[\w.]+[\w])/g, '<a href="mailto:$1">$1</a>');
  }
  // A tiny "pop" sound for new messages, generated in the browser.
  function ping(f1 = 880, f2 = 1320) {
    if (prefs.focus) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.setValueAtTime(f1, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(f2, ctx.currentTime + .08);
      g.gain.setValueAtTime(.08, ctx.currentTime); g.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + .25);
      o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + .25);
    } catch {}
  }

  /* ---------- Photos (Mac Photos style) ---------- */
  const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  // Understands "2025-03-14", "2025-03", "14 March 2025", "March 14, 2025", "March 2025" and "2025".
  function parsePhotoDate(v) {
    if (!v) return null;
    const s = String(v).trim(); let m;
    const mon = (w) => MONTHS.findIndex((x) => x.startsWith(w.toLowerCase().slice(0, 3)));
    if ((m = s.match(/^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?/))) return new Date(+m[1], +m[2] - 1, +(m[3] || 1));
    if ((m = s.match(/^(\d{1,2})\s+([A-Za-z]+)\.?,?\s+(\d{4})$/)) && mon(m[2]) >= 0) return new Date(+m[3], mon(m[2]), +m[1]);
    if ((m = s.match(/^([A-Za-z]+)\.?\s+(\d{1,2}),?\s+(\d{4})$/)) && mon(m[1]) >= 0) return new Date(+m[3], mon(m[1]), +m[2]);
    if ((m = s.match(/^([A-Za-z]+)\.?,?\s+(\d{4})$/)) && mon(m[1]) >= 0) return new Date(+m[2], mon(m[1]), 1);
    if ((m = s.match(/^(\d{4})$/))) return new Date(+m[1], 0, 1);
    return null;
  }
  let favs = (() => { try { return JSON.parse(localStorage.getItem("arshaon-favs")) || []; } catch { return []; } })();
  const saveFavs = () => { try { localStorage.setItem("arshaon-favs", JSON.stringify(favs)); } catch {} };
  const isFav = (p) => favs.includes(p.src);
  const fmtDay = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const fmtMonth = (d) => d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const PH_IC = {
    lib: '<svg viewBox="0 0 24 24"><rect x="3" y="6" width="14" height="14" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.3-9-8.6C1.6 8.2 3.6 5 6.8 5c2 0 3.4 1.2 5.2 3.1C13.8 6.2 15.2 5 17.2 5c3.2 0 5.2 3.2 3.8 6.4C19 15.7 12 20 12 20z"/></svg>',
    folder: '<svg viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
    star: '<svg viewBox="0 0 24 24"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>',
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/></svg>',
  };

  function renderPhotos(body, arg) {
    if (isMobile()) return renderPhotosMobile(body, arg); // phone layout
    const photos = (SITE.eventPhotos || []).map((p, i) => ({ ...p, i, d: parsePhotoDate(p.date) }))
      .sort((a, b) => ((a.d ? a.d.getTime() : Infinity) - (b.d ? b.d.getTime() : Infinity)) || (a.i - b.i));
    const events = [...new Set(photos.map((p) => p.event || "Other"))];
    const ZOOMS = [84, 118, 160, 220];
    let sec = "library", mode = "all", zoom = 2, pfilter = "All", seq = [], showInfo = false;
    if (String(arg || "").startsWith("projects:")) pfilter = String(arg).slice(9) || "All";
    body.innerHTML = `<div class="split ph show-main">
      <div class="side ph-side"></div>
      <div class="main ph-main">
        <div class="ph-head"><button class="mobile-back ph-mback" aria-label="Show sidebar">‹</button>
          <div class="ph-title"><b></b><small></small></div><div class="ph-tools"></div></div>
        <div class="ph-body"></div>
      </div></div>`;
    const split = $(".split", body), side = $(".ph-side", body), main = $(".ph-main", body), pb = $(".ph-body", body), tools = $(".ph-tools", body);

    const drawSide = () => {
      const row = (k, ic, label) => `<button class="ph-row ${sec === k ? "active" : ""}" data-s="${esc(k)}">${ic}<span>${esc(label)}</span></button>`;
      side.innerHTML = `<h5>Library</h5>${row("library", PH_IC.lib, "All Photos")}${row("favorites", PH_IC.heart, "Favorites")}
        ${events.length ? `<h5>Albums</h5>${events.map((e) => row("event:" + e, PH_IC.folder, e)).join("")}` : ""}`;
    };
    const tile = (p) => `<button class="ph-tile" data-p="${p.i}"><img src="${esc(srcUrl(p.src))}" alt="${esc(p.caption || p.event || "Photo")}" loading="lazy">${isFav(p) ? '<span class="ph-fav">♥</span>' : ""}</button>`;
    const grid = (list) => `<div class="ph-grid" style="--z:${ZOOMS[zoom]}px">${list.map(tile).join("")}</div>`;
    const range = (list) => {
      const ds = list.filter((p) => p.d);
      return ds.length ? `${fmtDay(ds[0].d)} – ${fmtDay(ds[ds.length - 1].d)}` : `${list.length} photo${list.length === 1 ? "" : "s"}`;
    };
    const projectList = () => SITE.campaigns.filter((c) => pfilter === "All" || (pfilter === FLAG ? c.featured : c.type === pfilter));

    const drawMain = () => {
      $(".ph-viewer", main)?.remove(); $(".viewer", main)?.remove();
      let title = "", sub = "", html = "", list = [];
      if (sec === "projects") {
        title = "Projects"; sub = `${SITE.campaigns.length} projects & campaigns`; tools.innerHTML = "";
        const types = ["All", ...(SITE.campaigns.some((c) => c.featured) ? [FLAG] : []), ...new Set(SITE.campaigns.map((c) => c.type))];
        html = `<div class="toolbar ph-filters">${types.map((t) => `<button class="btn ${t === pfilter ? "on" : ""}" data-t="${esc(t)}">${esc(t)}</button>`).join("")}</div>
          <div class="pgrid">${projectList().map((c, i) => `<div class="tile${genCls(c)}" data-i="${i}" style="${tileBg(c)}" tabindex="0">${genArt(c, "tile")}${tileText(c)}</div>`).join("")}</div>`;
      } else {
        if (sec === "library") { title = "Library"; list = photos; }
        else if (sec === "favorites") { title = "Favorites"; list = photos.filter(isFav); }
        else { title = sec.slice(6); list = photos.filter((p) => (p.event || "Other") === title); }
        sub = list.length ? range(list) : "";
        seq = list;
        tools.innerHTML = `<div class="seg ph-zoom"><button data-z="-1" aria-label="Zoom out">−</button><button data-z="1" aria-label="Zoom in">+</button></div>` +
          (sec === "library" ? `<div class="seg">${[["years", "Years"], ["months", "Months"], ["all", "All Photos"]].map(([k, n]) => `<button data-m="${k}" class="${mode === k ? "on" : ""}">${n}</button>`).join("")}</div>` : "");
        if (!list.length) {
          html = sec === "favorites"
            ? `<div class="empty"><div style="font-size:42px">♡</div><h3>No favorites yet</h3><p>Open a photo and click the heart to add it here.</p></div>`
            : `<div class="empty"><div style="font-size:42px">📷</div><h3>No photos yet</h3><p>Put photos in <code>images/events</code> and list them under <code>eventPhotos</code> in content.js.</p></div>`;
        } else if (sec === "library" && mode === "years") {
          const years = {};
          list.forEach((p) => { const y = p.d ? p.d.getFullYear() : "Undated"; (years[y] = years[y] || []).push(p); });
          html = `<div class="ph-years">${Object.entries(years).map(([y, ps]) => `<button class="ph-year" data-y="${y}" style="background-image:${cssUrl(ps[ps.length - 1].src)}"><b>${y}</b><small>${ps.length} photo${ps.length === 1 ? "" : "s"}</small></button>`).join("")}</div>`;
        } else if ((sec === "library" && mode === "months") || sec.startsWith("event:")) {
          const groups = [];
          list.forEach((p) => { const k = p.d ? fmtMonth(p.d) : "Undated"; const g = groups[groups.length - 1]; if (g && g.k === k) g.ps.push(p); else groups.push({ k, ps: [p] }); });
          html = groups.map((g) => `<section class="ph-month" data-k="${esc(g.k)}"><h3>${esc(g.k)}<small>${esc([...new Set(g.ps.map((p) => p.event).filter(Boolean))].join(" · "))}</small></h3>${grid(g.ps)}</section>`).join("");
        } else html = grid(list);
      }
      $(".ph-title b", body).textContent = title;
      $(".ph-title small", body).textContent = sub;
      pb.innerHTML = html;
      pb.scrollTop = sec === "library" && mode !== "years" ? pb.scrollHeight : 0; // newest at the bottom, like the Mac
    };
    const updateHearts = () => $$(".ph-tile", pb).forEach((t) => {
      const p = photos.find((x) => x.i === +t.dataset.p), h = $(".ph-fav", t);
      if (p && isFav(p) && !h) t.append(el('<span class="ph-fav">♥</span>'));
      if (p && !isFav(p) && h) h.remove();
    });

    // ----- Full photo viewer (zooms out of the thumbnail, like the Mac) -----
    const fitImg = (v) => {
      const img = $("img", v), stage = $(".pv-stage", v);
      if (!img || !img.naturalWidth) return;
      const r = Math.min((stage.clientWidth - 32) / img.naturalWidth, (stage.clientHeight - 32) / img.naturalHeight);
      img.style.width = Math.max(1, img.naturalWidth * r) + "px";
      img.style.height = Math.max(1, img.naturalHeight * r) + "px";
    };
    const closeViewer = () => {
      const v = $(".ph-viewer", main); if (!v) return;
      const done = () => { v.remove(); if (sec === "favorites") drawMain(); else updateHearts(); };
      if (v.animate) v.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160 }).onfinish = done; else done();
    };
    const toast = (v, msg) => { const t = $(".pv-toast", v); t.textContent = msg; t.hidden = false; clearTimeout(t._t); t._t = setTimeout(() => (t.hidden = true), 1600); };
    const openPhoto = (k, fromEl) => {
      if (k < 0 || !seq.length) return;
      let v = $(".ph-viewer", main); const first = !v;
      if (!v) {
        v = el(`<div class="ph-viewer" tabindex="-1">
          <div class="pv-bar"><button class="pv-btn" data-a="x" aria-label="Back">‹</button>
            <div class="pv-title"><b></b><small></small></div>
            <div class="pv-tools"><button class="pv-btn" data-a="fav" aria-label="Favorite">${PH_IC.heart}</button><button class="pv-btn" data-a="info" aria-label="Info">${PH_IC.info}</button></div></div>
          <div class="pv-wrap"><div class="pv-stage"><img alt=""><button class="pv-nav prev" data-a="prev" aria-label="Previous">‹</button><button class="pv-nav next" data-a="next" aria-label="Next">›</button></div><aside class="pv-info"></aside></div>
          <div class="pv-toast" hidden></div></div>`);
        main.append(v);
        v.onclick = (e) => {
          const a = e.target.closest("[data-a]")?.dataset.a; if (!a) return;
          const cur = seq[+v.dataset.k];
          if (a === "x") closeViewer();
          if (a === "prev") openPhoto(+v.dataset.k - 1);
          if (a === "next") openPhoto(+v.dataset.k + 1);
          if (a === "fav") { favs = isFav(cur) ? favs.filter((x) => x !== cur.src) : [...favs, cur.src]; saveFavs(); $('[data-a="fav"]', v).classList.toggle("on", isFav(cur)); }
          if (a === "info") { showInfo = !showInfo; v.classList.toggle("info-on", showInfo); setTimeout(() => fitImg(v), 220); }
        };
        v.onkeydown = (e) => {
          if (e.key === "ArrowLeft") openPhoto(+v.dataset.k - 1);
          if (e.key === "ArrowRight") openPhoto(+v.dataset.k + 1);
          if (e.key === "Escape") closeViewer();
        };
        let sx = null; // swipe on phones
        $(".pv-stage", v).addEventListener("pointerdown", (e) => (sx = e.clientX));
        $(".pv-stage", v).addEventListener("pointerup", (e) => { if (sx !== null && Math.abs(e.clientX - sx) > 50) openPhoto(+v.dataset.k + (e.clientX < sx ? 1 : -1)); sx = null; });
        if (window.ResizeObserver) new ResizeObserver(() => fitImg(v)).observe($(".pv-stage", v));
        v.focus();
      }
      k = (k + seq.length) % seq.length;
      const p = seq[k], img = $("img", v);
      v.dataset.k = k;
      v.classList.toggle("info-on", showInfo);
      $(".pv-title b", v).textContent = p.d ? fmtDay(p.d) : (p.event || "Photo");
      $(".pv-title small", v).textContent = [p.event, p.caption].filter(Boolean).join(" · ");
      $('[data-a="fav"]', v).classList.toggle("on", isFav(p));
      let ready = false;
      const onReady = () => {
        if (ready) return; ready = true;
        fitImg(v);
        $(".pv-info", v).innerHTML = `<h4>Info</h4><dl>
          <dt>Event</dt><dd>${esc(p.event || "–")}</dd><dt>Caption</dt><dd>${esc(p.caption || "–")}</dd>
          <dt>Date</dt><dd>${esc(p.d ? fmtDay(p.d) : p.date || "–")}</dd><dt>Dimensions</dt><dd>${img.naturalWidth} × ${img.naturalHeight}</dd>
          <dt>File</dt><dd>${esc(String(p.src).split("/").pop())}</dd></dl>`;
        if (first && fromEl && img.animate && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
          const a = fromEl.getBoundingClientRect(), r = img.getBoundingClientRect();
          img.animate([
            { transform: `translate(${a.left + a.width / 2 - (r.left + r.width / 2)}px, ${a.top + a.height / 2 - (r.top + r.height / 2)}px) scale(${Math.max(a.width / r.width, a.height / r.height)})` },
            { transform: "none" }], { duration: 340, easing: "cubic-bezier(.2,.8,.2,1)" });
          v.animate([{ backgroundColor: "rgba(0,0,0,0)" }, { backgroundColor: getComputedStyle(v).backgroundColor }], { duration: 340 });
          $(".pv-bar", v).animate([{ opacity: 0 }, { opacity: 1 }], { duration: 340 });
        }
      };
      img.onload = onReady;
      img.alt = p.caption || p.event || "Photo";
      img.src = srcUrl(p.src);
      if (img.complete && img.naturalWidth) onReady();
    };

    // ----- Projects (your project pages) -----
    const viewProject = (i) => {
      const items = projectList(); i = (i + items.length) % items.length;
      if (items[i]) gcEvent("project/" + gcSlug(items[i].title), "Project: " + items[i].title);
      $(".viewer", main)?.remove();
      const v = el(`<div class="viewer" tabindex="-1">
        <div class="vtop"><button class="btn" data-a="x">‹ All projects</button><span>${i + 1} of ${items.length}</span>
          <div style="display:flex;gap:6px"><button class="btn" data-a="prev" aria-label="Previous">‹</button><button class="btn" data-a="next" aria-label="Next">›</button></div></div>
        <div class="vscroll">${projectHTML(items[i])}</div></div>`);
      v.onclick = (e) => { const a = e.target.closest("[data-a]")?.dataset.a; if (a === "prev") viewProject(i - 1); if (a === "next") viewProject(i + 1); if (a === "x") v.remove(); };
      v.onkeydown = (e) => { if (e.key === "ArrowLeft") viewProject(i - 1); if (e.key === "ArrowRight") viewProject(i + 1); if (e.key === "Escape") v.remove(); };
      main.append(v); v.focus();
    };

    side.onclick = (e) => { const b = e.target.closest("[data-s]"); if (!b) return; sec = b.dataset.s; drawSide(); drawMain(); split.classList.add("show-main"); };
    $(".ph-mback", body).onclick = () => split.classList.remove("show-main");
    tools.onclick = (e) => {
      const z = e.target.closest("[data-z]"), m = e.target.closest("[data-m]");
      if (z) { zoom = clamp(zoom + +z.dataset.z, 0, ZOOMS.length - 1); $$(".ph-grid", pb).forEach((g) => g.style.setProperty("--z", ZOOMS[zoom] + "px")); }
      if (m) { mode = m.dataset.m; drawMain(); }
    };
    pb.onclick = (e) => {
      const t = e.target.closest(".ph-tile"), y = e.target.closest(".ph-year"), f = e.target.closest("[data-t]"), pt = e.target.closest(".tile");
      if (t) openPhoto(seq.findIndex((p) => p.i === +t.dataset.p), t);
      if (y) { mode = "months"; drawMain(); const s2 = $$(".ph-month", pb).find((x) => x.dataset.k.endsWith(y.dataset.y)); if (s2) s2.scrollIntoView({ block: "start" }); }
      if (f) { pfilter = f.dataset.t; drawMain(); }
      if (pt) viewProject(+pt.dataset.i);
    };
    pb.onkeydown = (e) => { if (e.key === "Enter" && e.target.classList.contains("tile")) viewProject(+e.target.dataset.i); };
    drawSide(); drawMain();
  }

  /* ---------- Calendar ---------- */
  // Fixed-date holidays (UAE & Bangladesh). Add more as "MM-DD": "Name".
  const HOLIDAYS = { "01-01": "New Year's Day", "02-21": "🇧🇩 Int'l Mother Language Day", "03-26": "🇧🇩 Independence Day",
    "04-14": "🇧🇩 Pohela Boishakh", "12-02": "🇦🇪 UAE National Day", "12-16": "🇧🇩 Victory Day" };
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  let myEvents = (() => { try { return JSON.parse(localStorage.getItem("arshaon-cal")) || {}; } catch { return {}; } })();
  const saveMyEvents = () => { try { localStorage.setItem("arshaon-cal", JSON.stringify(myEvents)); } catch {} };
  function eventsOn(key) {
    const out = [];
    if (HOLIDAYS[key.slice(5)]) out.push({ title: HOLIDAYS[key.slice(5)], kind: "holiday" });
    (SITE.calendarEvents || []).filter((e) => e.date === key).forEach((e) => out.push({ ...e, kind: "owner" }));
    (myEvents[key] || []).forEach((e, i) => out.push({ ...e, kind: "mine", i }));
    return out.sort((a, b) => (a.time || "").localeCompare(b.time || ""));
  }
  function renderCalendar(body) {
    if (isMobile()) return renderCalendarMobile(body); // phone layout
    const today = new Date(), tz = SITE.timezone || "Asia/Dhaka";
    let view = new Date(today.getFullYear(), today.getMonth(), 1), sel = iso(today);
    body.innerHTML = `<div class="cal-app">
      <div class="cal-clocks">
        <div class="ck"><small>Your time</small><b data-ck="you"></b><span data-ckd="you"></span></div>
        <div class="ck"><small>${esc(SITE.short)}'s time · ${esc(SITE.location.split(",")[0])}</small><b data-ck="me"></b><span data-ckd="me"></span></div>
      </div>
      <div class="cal-wrap">
        <div class="cal-month">
          <div class="cal-nav"><h2></h2><div class="cal-btns"><button class="btn" data-n="-1" aria-label="Previous month">‹</button><button class="btn" data-n="0">Today</button><button class="btn" data-n="1" aria-label="Next month">›</button></div></div>
          <div class="cal-grid"></div>
        </div>
        <div class="cal-day"><h3></h3><div class="cal-events"></div>
          <form class="cal-add"><input name="t" placeholder="New event" aria-label="Event title" required><input name="h" type="time" aria-label="Time"><button class="btn blue">Add</button></form>
          <p class="cal-hint">Events you add are saved in your browser only.</p>
        </div>
      </div></div>`;
    const clock = () => {
      if (!body.isConnected) return clearInterval(timer);
      const n = new Date(), t = { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: useH12() }, d = { weekday: "long", day: "numeric", month: "long" };
      $('[data-ck="you"]', body).textContent = n.toLocaleTimeString("en-US", t);
      $('[data-ckd="you"]', body).textContent = n.toLocaleDateString("en-GB", d);
      try {
        $('[data-ck="me"]', body).textContent = n.toLocaleTimeString("en-US", { ...t, timeZone: tz });
        $('[data-ckd="me"]', body).textContent = n.toLocaleDateString("en-GB", { ...d, timeZone: tz });
      } catch { $('[data-ck="me"]', body).textContent = "--"; }
    };
    const timer = setInterval(clock, 1000); clock();
    const draw = () => {
      $(".cal-nav h2", body).innerHTML = `<b>${view.toLocaleDateString("en-US", { month: "long" })}</b> ${view.getFullYear()}`;
      const start = new Date(view); start.setDate(1 - ((view.getDay() + 6) % 7));
      let html = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => `<div class="cal-wd">${d}</div>`).join("");
      for (let k = 0; k < 42; k++) {
        const d = new Date(start); d.setDate(start.getDate() + k);
        const key = iso(d), ev = eventsOn(key);
        html += `<button class="cal-cell ${d.getMonth() !== view.getMonth() ? "out" : ""} ${key === iso(today) ? "today" : ""} ${key === sel ? "sel" : ""}" data-d="${key}">
          <span class="cal-num">${d.getDate()}</span>${ev.slice(0, 2).map((e) => `<span class="cal-chip ${e.kind}">${esc(e.title)}</span>`).join("")}${ev.length > 2 ? `<span class="cal-more">+${ev.length - 2} more</span>` : ""}</button>`;
      }
      $(".cal-grid", body).innerHTML = html;
      $(".cal-day h3", body).textContent = new Date(sel + "T00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
      const list = eventsOn(sel);
      $(".cal-events", body).innerHTML = list.length ? list.map((e) => `<div class="cal-ev ${e.kind}"><span class="cal-ev-time">${e.time ? esc(e.time) : "All day"}</span>
          <div><b>${esc(e.title)}</b>${e.note ? `<p>${esc(e.note)}</p>` : ""}</div>${e.kind === "mine" ? `<button class="cal-del" data-del="${e.i}" aria-label="Delete event">×</button>` : ""}</div>`).join("")
        : `<p class="cal-empty">No events</p>`;
    };
    $(".cal-btns", body).onclick = (e) => {
      const b = e.target.closest("[data-n]"); if (!b) return;
      const n = +b.dataset.n;
      if (n === 0) { view = new Date(today.getFullYear(), today.getMonth(), 1); sel = iso(today); }
      else view = new Date(view.getFullYear(), view.getMonth() + n, 1);
      draw();
    };
    $(".cal-grid", body).onclick = (e) => {
      const c = e.target.closest("[data-d]"); if (!c) return;
      sel = c.dataset.d; const d = new Date(sel + "T00:00");
      if (d.getMonth() !== view.getMonth()) view = new Date(d.getFullYear(), d.getMonth(), 1);
      draw();
    };
    $(".cal-events", body).onclick = (e) => {
      const x = e.target.closest("[data-del]"); if (!x) return;
      myEvents[sel].splice(+x.dataset.del, 1); if (!myEvents[sel].length) delete myEvents[sel];
      saveMyEvents(); draw();
    };
    $(".cal-add", body).onsubmit = (e) => {
      e.preventDefault(); const f = e.target, t = f.t.value.trim(); if (!t) return;
      (myEvents[sel] = myEvents[sel] || []).push({ title: t, time: f.h.value });
      saveMyEvents(); f.reset(); draw();
    };
    draw();
  }

  /* ---------- Trash ---------- */
  let trashedItems = [];   // desktop icons a visitor dragged into the Trash
  let deskItems = [];      // the desktop icons (filled in by buildDesktop)
  const trashFull = () => (SITE.trash || []).length + trashedItems.length > 0;
  function crumple() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)(), len = Math.floor(ctx.sampleRate * 0.35);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2) * (Math.random() < 0.3 ? 1 : 0.3);
      const src = ctx.createBufferSource(), g = ctx.createGain(); g.gain.value = 0.15;
      src.buffer = buf; src.connect(g).connect(ctx.destination); src.start();
    } catch {}
  }
  function updateTrashIcon() {
    const svg = $('.dock-item[data-app="trash"] .appicon svg'); if (svg) svg.innerHTML = trashIconSVG(trashFull());
    if (wins.trash) renderTrash($(".wbody", wins.trash));
  }
  function trashDesk(i) {
    const d = $(`.dicon[data-i="${i}"]`); if (!d || d.hidden) return;
    d.hidden = true; d.classList.remove("sel");
    const it = deskItems[i];
    trashedItems.push({ i: +i, name: it.name, icon: it.icon, open: it.open });
    crumple(); updateTrashIcon();
  }
  function putBack(i) {
    trashedItems = trashedItems.filter((t) => t.i !== i);
    const d = $(`.dicon[data-i="${i}"]`); if (d) d.hidden = false;
    updateTrashIcon();
  }
  function openTrashFile(t) {
    if (t.type === "link" && t.url) return window.open(t.url, "_blank", "noopener");
    if (t.type === "image") return openWindow({ key: "trash-" + t.name, title: t.name, app: "Preview", w: 620, h: 480,
      render: (b) => { b.innerHTML = `<div class="img-view"><img src="${esc(t.src || "")}" alt="${esc(t.name)}"></div>`; } });
    openWindow({ key: "trash-" + t.name, title: t.name, app: "TextEdit", w: 520, h: 440,
      render: (b) => { b.innerHTML = `<div class="doc"><div class="inner">${t.html || ""}</div></div>`; } });
  }
  function renderTrash(body) {
    const own = (SITE.trash || []).map((t) => {
      const ext = (t.name.includes(".") ? t.name.split(".").pop() : "").toUpperCase().slice(0, 4);
      const ic = t.type === "image" && t.src ? `<img class="fthumb" src="${esc(t.src)}" alt="">`
        : docIcon(t.type === "link" ? "#0a84ff" : "#8e8e93", t.type === "link" ? "LINK" : ext || "FILE");
      return { name: t.name, mine: false, icon: ic, open: () => openTrashFile(t) };
    });
    const items = [...own, ...trashedItems.map((t) => ({ ...t, mine: true }))];
    let sel = -1;
    body.innerHTML = `<div class="toolbar"><span class="t-info">${items.length} item${items.length === 1 ? "" : "s"}</span><span style="flex:1"></span>
        <button class="btn" data-a="back" disabled>Put Back</button><button class="btn" data-a="empty" ${trashedItems.length ? "" : "disabled"}>Empty Bin</button></div>
      ${items.length ? `<div class="fgrid">${items.map((it, i) => `<button class="fitem" data-i="${i}">${it.icon}<span>${esc(it.name)}</span></button>`).join("")}</div>
        <p class="trash-hint">Tip: drag a desktop icon onto the Bin in the dock.</p>`
        : `<div class="empty"><div style="font-size:42px">🗑️</div><h3>Bin is empty</h3></div>`}`;
    const back = $('[data-a="back"]', body);
    $(".fgrid", body)?.addEventListener("click", (e) => {
      const f = e.target.closest(".fitem"); if (!f) return;
      sel = +f.dataset.i;
      $$(".fitem", body).forEach((x) => x.classList.toggle("sel", x === f));
      back.disabled = !items[sel].mine;
      if (isMobile() || e.detail >= 2) items[sel].open();
    });
    back.onclick = () => { const it = items[sel]; if (it && it.mine) putBack(it.i); };
    $('[data-a="empty"]', body).onclick = () => { trashedItems = []; crumple(); updateTrashIcon(); };
  }

  /* ---------- Preview (resume) ---------- */
  function renderPreview(body) {
    if (isMobile()) {
      const win = iosWindow(body);
      body.style.overflow = "hidden";
      body.innerHTML = `<div class="ios ios-pv">
        <div class="ios-top">
          <button class="ios-back" data-pv="close">${IOS_IC.back}<span>Home</span></button>
          <b class="ios-pv-title">My CV.pdf</b>
          <a class="ios-pv-dl" href="${esc(SITE.resume)}" download>Download</a>
        </div>
        <div class="ios-scroll pv-ios-scroll">
          <div class="pv-ios-card">
            <div class="pv-ios-head">${avatar()}<div><b>${esc(SITE.name)}</b><small>ARSHAON · Digital Product Architect</small></div></div>
            <div class="pv-ios-btns">
              <a class="btn blue" href="${esc(SITE.resume)}" download>⬇ Download CV (PDF)</a>
              <a class="btn" href="${esc(SITE.resume)}" target="_blank" rel="noopener" data-external-link>Open Full PDF ↗</a>
            </div>
          </div>
          <iframe class="pdf pv-ios-pdf" src="${esc(SITE.resume)}" title="CV"></iframe>
        </div>
        <button class="ios-homebar" aria-label="Go to Home screen"></button>
      </div>`;
      body.onclick = (e) => {
        if (e.target.closest('[data-pv="close"]') || e.target.closest(".ios-homebar")) closeWin(win);
      };
      return;
    }
    body.style.overflow = "hidden";
    body.innerHTML = `<div class="toolbar"><a class="btn blue" href="${SITE.resume}" download>Download CV (PDF)</a><button class="btn" data-act="print-pdf">Print CV</button><a class="btn" href="${SITE.resume}" target="_blank" rel="noopener" data-external-link>Open PDF Tab ↗</a></div>
      <iframe class="pdf" src="${SITE.resume}" title="CV"></iframe>`;
    const pBtn = $('[data-act="print-pdf"]', body);
    if (pBtn) pBtn.onclick = () => {
      const ifr = $("iframe.pdf", body);
      try { if (ifr && ifr.contentWindow) { ifr.contentWindow.focus(); ifr.contentWindow.print(); return; } } catch {}
      window.open(SITE.resume, "_blank", "noopener");
    };
  }

  /* ---------- Terminal ---------- */
  function renderTerminal(body) {
    body.innerHTML = `<div class="term"><div class="out"></div><div class="inrow"><span class="p">ashikur@arshaon ~ %</span><input aria-label="Terminal input" autocomplete="off" spellcheck="false"></div></div>`;
    const out = $(".out", body), input = $("input", body), hist = []; let hi = 0;
    const print = (html) => { out.append(el(`<div class="ln">${html}</div>`)); body.scrollTop = body.scrollHeight; };
    const C = {
      help: () => `<span class="y">Commands you can try:</span>
  <span class="c">whoami</span>       who I am
  <span class="c">about</span>        a short intro
  <span class="c">experience</span>   my career, role by role
  <span class="c">campaigns</span>    signature work
  <span class="c">skills</span>       what I'm good at
  <span class="c">contact</span>      how to reach me
  <span class="c">resume</span>       open my resume
  <span class="c">linkedin</span>     open my LinkedIn
  <span class="c">open</span> <span class="d">app</span>     open an app (notes, photos, messages...)
  <span class="c">ls</span>, <span class="c">date</span>, <span class="c">echo</span>, <span class="c">clear</span>`,
      whoami: () => `${esc(SITE.name)}\n${esc(SITE.title)} · ${esc(SITE.location)}`,
      about: () => esc(SITE.notes[0].html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").split("Explore")[0].trim()),
      experience: () => SITE.experience.map((e) => `<span class="y">${esc(e.dates)}</span>  <b>${esc(e.role)}</b> <span class="d">@ ${esc(e.company)}</span>`).join("\n"),
      campaigns: () => SITE.campaigns.map((c) => `<span class="c">${esc(c.title.padEnd(26))}</span>${esc(c.role || "")}`).join("\n"),
      skills: () => Object.entries(SITE.skills).map(([k, v]) => `<span class="y">${esc(k)}</span>\n  ${v.map(esc).join(", ")}`).join("\n"),
      contact: () => `email     <a href="mailto:${SITE.email}">${SITE.email}</a>\nlinkedin  <a href="${SITE.linkedin}" target="_blank" rel="noopener">${SITE.linkedin}</a>`,
      resume: () => { openApp("preview"); return "Opening " + resumeName() + " ..."; },
      linkedin: () => { openApp("safari", SITE.linkedin); return "Opening LinkedIn in Safari ..."; },
      ls: () => `<span class="c">Campaigns/</span>  <span class="c">Experience/</span>  ${resumeName()}  skills.txt  about.md`,
      date: () => new Date().toString(),
      clear: () => { out.innerHTML = ""; return null; },
    };
    const run = (line) => {
      print(`<span class="p">ashikur@arshaon ~ %</span> ${esc(line)}`);
      const [cmd, ...rest] = line.trim().split(/\s+/); if (!cmd) return;
      let res;
      if (cmd === "echo") res = esc(rest.join(" "));
      else if (cmd === "open") res = APPS[rest[0]] ? (openApp(rest[0]), `Opening ${rest[0]} ...`) : `open: try one of ${Object.keys(APPS).join(", ")}`;
      else if (cmd === "cat") res = rest[0] === "skills.txt" ? C.skills() : rest[0] === "about.md" ? C.about() : `cat: ${esc(rest[0] || "")}: try skills.txt or about.md`;
      else if (cmd === "sudo" && (rest[0] === "say-hi" || rest[0] === "hire-ashikur" || rest[0] === "hire-arshaon" || rest[0] === "hire")) res = `<span class="p">Permission granted ✅</span>\nOpening an email so you can say hi ...`, setTimeout(() => (location.href = `mailto:${SITE.email}?subject=Let's%20talk`), 900);
      else if (cmd === "sudo") res = "Nice try. Try <span class=\"c\">sudo say-hi</span> instead 😉";
      else if (C[cmd]) res = C[cmd]();
      else res = `zsh: command not found: ${esc(cmd)}. Type <span class="c">help</span>.`;
      if (res) print(res);
    };
    print(`<span class="d">Last login: ${new Date().toDateString()} on ttys000</span>\nWelcome to ${esc(SITE.short)} OS. Type <span class="c">help</span> to get started.`);
    input.onkeydown = (e) => {
      if (e.key === "Enter") { hist.push(input.value); hi = hist.length; run(input.value); input.value = ""; }
      if (e.key === "ArrowUp" && hi > 0) { input.value = hist[--hi]; e.preventDefault(); }
      if (e.key === "ArrowDown") { input.value = hist[++hi] || ""; hi = Math.min(hi, hist.length); }
    };
    body.onclick = () => { if (!getSelection().toString()) input.focus(); };
    setTimeout(() => input.focus(), 50);
  }

  /* ---------- System Settings ---------- */
  const SYS_IC = {
    wifi: '<path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0"/><circle cx="12" cy="19" r="1.3" fill="#fff" stroke="none"/>',
    bluetooth: '<path d="M7 7l10 10-5 4V3l5 4L7 17"/>',
    general: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
    appearance: '<path d="M13.5 4.5l6 6-6.5 6.5-6-6z"/><path d="M7 11l-2.5 2.5a3 3 0 0 0 0 4.2l1.3 1.3a3 3 0 0 0 4.2 0L12.5 17"/>',
    wallpaper: '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5-5-9.5 8.5"/>',
    dock: '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="M3 15h18"/>',
    menubar: '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="M3 9.5h18"/>',
    focus: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" fill="#fff" stroke="none"/>',
  };
  const SYS_PANES = [["general", "About", "#8e8e93"], ["appearance", "Appearance", "#0a84ff"], ["wallpaper", "Wallpaper", "#32ade6"], ["dock", "Desktop & Dock", "#636366"], ["menubar", "Menu Bar", "#636366"]];
  const sysIcon = (k, big) => `<span class="set-ic ${big ? "big" : ""}" style="background:${(SYS_PANES.find((x) => x[0] === k) || [])[2] || "#8e8e93"}"><svg viewBox="0 0 24 24">${SYS_IC[k]}</svg></span>`;
  const DEV_IC = {
    keyboard: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',
    trackpad: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 15h18"/>',
    mouse: '<rect x="7" y="3" width="10" height="18" rx="5"/><path d="M12 7v3"/>',
    headphones: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>',
    earbuds: '<path d="M8 4a3 3 0 0 0-3 3v1a3 3 0 0 0 3 3v8M16 4a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3v8"/>',
    phone: '<rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/>',
    watch: '<rect x="6" y="6" width="12" height="12" rx="3"/><path d="M9 6l1-4h4l1 4M9 18l1 4h4l1-4"/>',
    speaker: '<rect x="6" y="2" width="12" height="20" rx="2"/><circle cx="12" cy="14" r="3"/><circle cx="12" cy="7" r="1"/>',
    laptop: '<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19h20"/>',
  };
  const devIcon = (t) => `<svg viewBox="0 0 24 24">${DEV_IC[t] || DEV_IC.speaker}</svg>`;
  const MINI_LOCK = '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
  const MINI_WIFI = '<svg viewBox="0 0 24 24"><path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0"/><circle cx="12" cy="19" r="1" fill="currentColor"/></svg>';
  const macInfo = () => Object.assign({ deviceName: `${SITE.short}'s Mac`, model: "Mac", chip: "–", memory: "–", storage: "–", serial: "–", osName: `${SITE.short} OS`, osVersion: "3.0" }, SITE.mac || {});
  let BT = null;
  const btDevices = () => BT || (BT = (SITE.bluetoothDevices || []).map((d) => ({ ...d })));
  const battery = (n) => `<span class="batt"><i style="width:${clamp(+n, 0, 100)}%;background:${n <= 20 ? "#ff3b30" : "currentColor"}"></i></span> ${+n}%`;

  function renderSettings(body, arg) {
    if (isMobile()) return renderSettingsMobile(body, arg); // phone layout
    const alias = { clock: "menubar", about: "general" };
    const keys = ["account", ...SYS_PANES.map((x) => x[0])];
    let cur = alias[arg] || (keys.includes(arg) ? arg : "appearance"), hist = [cur], hi = 0, query = "", wifiDetails = false;
    const toggle = (key) => `<button class="toggle ${prefs[key] ? "on" : ""}" data-tog="${key}" aria-pressed="${!!prefs[key]}" aria-label="${key}"></button>`;
    const hero = (k, title, desc, tog) => `<div class="sys-hero">${sysIcon(k, true)}<div class="sys-hero-txt"><b>${title}</b><p>${desc}</p></div>${tog ? toggle(tog) : ""}</div>`;
    const center = (k, title, desc) => `<div class="sys-center">${sysIcon(k, true)}<h2>${title}</h2><p>${desc}</p></div>`;
    const P = {
      account: () => `<div class="sys-center">${avatar("big")}<h2>${esc(SITE.name)}</h2><p>ARSHAON · arshaon.com</p></div>
          <div class="set-group">
            <div class="set-row"><span>Name</span><span class="muted">${esc(SITE.name)}</span></div>
            <div class="set-row"><span>Email</span><a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a></div>
            <div class="set-row"><span>CV / Resume</span><a data-open="preview">Open PDF</a></div>
            <div class="set-row"><span>LinkedIn</span><a data-open="safari" data-arg="linkedin">linkedin.com/in/ashikurrahmanshaon</a></div>
          </div>`,
      wifi: () => {
        const w = Object.assign({ network: `${SITE.short}-5G`, hotspot: `${SITE.short}'s iPhone`, others: [] }, SITE.wifi || {});
        return hero("wifi", "Wi-Fi", "Set up Wi-Fi to wirelessly connect your Mac to the internet. Turn on Wi-Fi, then choose a network to join.", "wifi") + (prefs.wifi ? `
          <div class="set-group"><div class="set-row"><b>${esc(w.network)}</b><span class="set-right"><span class="ok-dot">Connected</span>${MINI_LOCK}${MINI_WIFI}<button class="btn" data-act="wdetails">Details…</button></span></div>
            ${wifiDetails ? `<div class="set-row sub"><span>Location</span><span>${esc(SITE.location)}</span></div><div class="set-row sub"><span>Security</span><span>WPA3 Personal</span></div><div class="set-row sub"><span>Speed</span><span>Fast enough to close deals ⚡</span></div>` : ""}</div>
          <h4 class="set-h">Personal Hotspots</h4><div class="set-group"><div class="set-row"><span>${esc(w.hotspot)}</span><span class="set-right">${MINI_LOCK}${devIcon("phone")}</span></div></div>
          <h4 class="set-h">Known Network</h4><div class="set-group"><div class="set-row"><span>✓&nbsp; ${esc(w.network)}</span><span class="set-right">${MINI_LOCK}${MINI_WIFI}<span>•••</span></span></div></div>
          ${w.others.length ? `<h4 class="set-h">Other Networks</h4><div class="set-group">${w.others.map((n) => `<button class="set-row as-btn" data-act="join" data-n="${esc(n)}"><span>${esc(n)}</span><span class="set-right">${MINI_LOCK}${MINI_WIFI}<span>•••</span></span></button>`).join("")}</div>` : ""}
          <p class="set-note join-note"></p>` : `<p class="set-off">Wi-Fi is turned off.</p>`);
      },
      bluetooth: () => hero("bluetooth", "Bluetooth", "Connect to accessories you can use for activities such as streaming music, typing and gaming.", "bt") + (prefs.bt ? `
          <p class="set-note">This Mac is discoverable as “${esc(macInfo().deviceName)}” while Bluetooth Settings is open.</p>
          <h4 class="set-h">My Devices</h4><div class="set-group">${btDevices().map((d, i) => `<div class="set-row"><span class="dev">${devIcon(d.type)}<span><b>${esc(d.name)}</b>
            <small>${d.connected ? `Connected${d.battery != null ? ` &nbsp;-&nbsp; ${battery(d.battery)}` : ""}` : "Not Connected"}</small></span></span>
            <button class="btn" data-act="bt" data-i="${i}">${d.connected ? "Disconnect" : "Connect"}</button></div>`).join("") || `<div class="set-row"><span class="muted">No devices</span></div>`}</div>`
        : `<p class="set-off">Bluetooth is turned off.</p>`),
      general: () => `<div class="sys-center">${avatar("big")}<h2>${esc(SITE.name)}</h2><p>ARSHAON · arshaon.com</p></div>
          <div class="set-group">
            <div class="set-row"><span>Name</span><span class="muted">${esc(SITE.name)}</span></div>
            <div class="set-row"><span>Brand</span><span class="muted">ARSHAON</span></div>
            <div class="set-row"><span>Email</span><a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a></div>
            <div class="set-row"><span>LinkedIn</span><a data-open="safari" data-arg="linkedin">ashikurrahmanshaon</a></div>
          </div>`,
      appearance: () => center("appearance", "Appearance", "Customize the look and feel of your Mac.") +
        `<div class="set-group"><div class="set-row top"><span>Appearance</span><div class="looks">${["auto", "light", "dark"].map((t) => `<button class="look ${prefs.theme === t ? "on" : ""}" data-theme-set="${t}"><span class="look-pic ${t}"><i></i></span><span>${t[0].toUpperCase() + t.slice(1)}</span></button>`).join("")}</div></div>
          <div class="set-row"><span>Accent colour</span><div class="accents">${Object.entries(ACCENTS).map(([k, c]) => `<button class="accent ${prefs.accent === k ? "on" : ""}" data-accent="${k}" style="background:${c}" title="${k}" aria-label="${k}"></button>`).join("")}</div></div></div>`,
      wallpaper: () => {
        const all = allWalls(), id = currentWallId(), w = wallById(id);
        const tile = ([k, x]) => `<button class="wall ${id === k ? "on" : ""}" data-wall="${k}" style="background:${x.thumb || x.css}"><span>${esc(x.name)}</span></button>`;
        const mine = Object.entries(all).filter(([, x]) => x.mine), built = Object.entries(all).filter(([, x]) => !x.mine);
        return `<div class="wall-now"><div class="wall-big" style="background:${w.css}"></div><div><b>${esc(w.name)}</b><p class="muted">Current wallpaper</p></div></div>
          ${mine.length ? `<h4 class="set-h">${esc(SITE.short)}'s Wallpapers</h4><div class="walls">${mine.map(tile).join("")}</div>` : ""}
          <h4 class="set-h">Colours</h4><div class="walls">${built.map(tile).join("")}</div>`;
      },
      dock: () => center("dock", "Desktop & Dock", "Adjust the dock and the icons on your desktop.") +
        `<h4 class="set-h">Dock</h4><div class="set-group">
          <div class="set-row"><span>Size</span><input type="range" min="36" max="72" step="2" value="${prefs.dockSize}" data-range="dockSize" aria-label="Dock size"></div>
          <div class="set-row"><span>Magnification</span>${toggle("dockMag")}</div></div>
         <h4 class="set-h">Desktop</h4><div class="set-group">
          <div class="set-row"><span>Show desktop icons</span>${toggle("showIcons")}</div>
          <div class="set-row"><span>Tidy up desktop icons</span><button class="btn" data-act="cleanup">Clean Up</button></div></div>`,
      menubar: () => center("menubar", "Menu Bar", "Choose what appears in the menu bar.") +
        `<div class="set-group"><div class="set-row"><span>Show date</span>${toggle("showDate")}</div><div class="set-row"><span>Use 24-hour clock</span>${toggle("h24")}</div></div>`,
      focus: () => hero("focus", "Do Not Disturb", "Silences message sounds and shows a moon in the menu bar.", "focus") +
        `<p class="set-note">${prefs.focus ? "🌙 Do Not Disturb is on." : "Do Not Disturb is off."}</p>`,
    };

    body.innerHTML = `<div class="split sys ${isMobile() && !arg ? "" : "show-main"}">
      <div class="side sys-side">
        <label class="im-search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg><input placeholder="Search" aria-label="Search settings"></label>
        <button class="sys-account" data-k="account">${avatar()}<span><b>${esc(SITE.name)}</b><small>${esc(SITE.accountLabel || SITE.short + " ID")}</small></span></button>
        <div class="sys-nav"></div>
      </div>
      <div class="main sys-main">
        <div class="sys-head"><button class="mobile-back sys-mback" aria-label="All settings">‹</button>
          <button class="sys-arrow" data-nav="-1" aria-label="Back">‹</button><button class="sys-arrow" data-nav="1" aria-label="Forward">›</button><b class="sys-title"></b></div>
        <div class="sys-pane"></div>
      </div></div>`;
    const split = $(".split", body), nav = $(".sys-nav", body), pane = $(".sys-pane", body);
    const draw = () => {
      $(".sys-account", body).classList.toggle("active", cur === "account");
      nav.innerHTML = SYS_PANES.filter(([, n]) => !query || n.toLowerCase().includes(query))
        .map(([k, n]) => `<button class="sys-row ${k === cur ? "active" : ""}" data-k="${k}">${sysIcon(k)}<span>${n}</span></button>`).join("") || `<p class="im-none">No results</p>`;
      $(".sys-title", body).textContent = cur === "account" ? SITE.name : SYS_PANES.find((x) => x[0] === cur)[1];
      $('[data-nav="-1"]', body).disabled = hi === 0;
      $('[data-nav="1"]', body).disabled = hi >= hist.length - 1;
      pane.innerHTML = P[cur]();
    };
    const go = (k) => {
      if (k !== cur) { hist = hist.slice(0, hi + 1); hist.push(k); hi = hist.length - 1; cur = k; }
      split.classList.add("show-main"); draw(); pane.scrollTop = 0;
    };
    $(".sys-side", body).onclick = (e) => { const b = e.target.closest("[data-k]"); if (b) go(b.dataset.k); };
    $(".sys-side input", body).oninput = (e) => { query = e.target.value.trim().toLowerCase(); draw(); };
    $(".sys-head", body).onclick = (e) => {
      const n = e.target.closest("[data-nav]");
      if (n && !n.disabled) { hi += +n.dataset.nav; cur = hist[hi]; draw(); }
      if (e.target.closest(".sys-mback")) split.classList.remove("show-main");
    };
    pane.onclick = (e) => {
      const t = e.target.closest("[data-theme-set]"), w = e.target.closest("[data-wall]"), tg = e.target.closest("[data-tog]"),
        ac = e.target.closest("[data-accent]"), act = e.target.closest("[data-act]");
      if (t) { prefs.theme = t.dataset.themeSet; applyTheme(); }
      if (w) { prefs.wall = w.dataset.wall; applyWall(); }
      if (ac) { prefs.accent = ac.dataset.accent; applyAccent(); }
      if (tg) { const k = tg.dataset.tog; prefs[k] = !prefs[k]; applyDockPrefs(); applyMenuPrefs(); }
      if (act) {
        const a = act.dataset.act;
        if (a === "signout") return lock();
        if (a === "join") { $(".join-note", pane).textContent = `“${act.dataset.n}” is password protected. Nice try 😉`; return; }
        if (a === "wdetails") wifiDetails = !wifiDetails;
        if (a === "bt") { const d = btDevices()[+act.dataset.i]; d.connected = !d.connected; }
        if (a === "cleanup") cleanUpIcons();
      }
      if (t || w || ac || tg || act) { savePrefs(); const st = pane.scrollTop; draw(); pane.scrollTop = st; }
    };
    pane.oninput = (e) => { const r = e.target.closest("[data-range]"); if (r) { prefs[r.dataset.range] = +r.value; applyDockPrefs(); savePrefs(); } };
    draw();
  }
  const aboutHTML = () => `<div class="about-box minimal-about">
      ${avatar("big")}
      <h2>${esc(SITE.name)}</h2>
      <p class="about-sub">ARSHAON · arshaon.com</p>
      <div class="about-actions">
        <button class="btn blue" data-open="preview">My CV</button>
        <button class="btn" data-open="photos" data-arg="library">Photos</button>
        <button class="btn" data-open="safari" data-arg="linkedin">LinkedIn</button>
      </div>
    </div>`;
  function openAbout() { openWindow({ key: "about", title: "About", app: "Finder", w: 320, h: 310, render: (b) => { b.innerHTML = aboutHTML(); } }); }

  /* =====================================================================
     DOCK, DESKTOP ICONS, PHONE HOME SCREEN
     ===================================================================== */
  const DOCK = ["finder", "safari", "messages", "mail", "photos", "notes", "calendar", "preview", "terminal", "settings", "trash"];
  function buildDock() {
    $("#dock").innerHTML = DOCK.map((id, i) => `${i === DOCK.length - 1 ? '<span class="dock-sep"></span>' : ""}
      <button class="dock-item ${APPS[id].mobile ? "mobile" : ""}" data-app="${id}" aria-label="${APPS[id].name}">
        <span class="tip">${APPS[id].name}</span>${icon(id, 50)}${id === "messages" ? '<span class="badge" hidden></span>' : ""}<span class="run"></span></button>`).join("");
    const dock = $("#dock");
    dock.onclick = (e) => {
      const b = e.target.closest(".dock-item"); if (!b) return;
      if (!wins[b.dataset.app]) { // bounce when an app is launched
        b.classList.remove("bounce"); void b.offsetWidth; b.classList.add("bounce");
        b.addEventListener("animationend", () => b.classList.remove("bounce"), { once: true });
      }
      openApp(b.dataset.app);
    };
    // Smooth Mac Dock Magnification (zero layout thrashing)
    const RANGE = 150;
    let dockRaf = 0, mouseX = 0;
    dock.addEventListener("mousemove", (e) => {
      if (isMobile() || !prefs.dockMag) return;
      mouseX = e.clientX;
      if (dockRaf) return;
      dockRaf = requestAnimationFrame(() => {
        dockRaf = 0;
        const BASE = prefs.dockSize, MAX = Math.round(prefs.dockSize * 1.64);
        const items = $$(".dock-item", dock);
        const centers = items.map((it) => { const r = it.getBoundingClientRect(); return r.left + r.width / 2; });
        items.forEach((it, idx) => {
          const d = Math.abs(mouseX - centers[idx]);
          const size = BASE + (MAX - BASE) * Math.cos(Math.min(d / RANGE, 1) * Math.PI / 2);
          const ic = $(".appicon", it);
          if (ic) ic.style.setProperty("--s", size.toFixed(1) + "px");
        });
      });
    });
    dock.addEventListener("mouseleave", () => {
      if (dockRaf) { cancelAnimationFrame(dockRaf); dockRaf = 0; }
      $$(".dock-item .appicon", dock).forEach((a) => a.style.setProperty("--s", prefs.dockSize + "px"));
    });
  }
  function updateDock() { $$(".dock-item").forEach((b) => b.classList.toggle("running", !!wins[b.dataset.app])); }

  // Where each desktop icon sits (remembered in this browser).
  let iconPos = (() => { try { return JSON.parse(localStorage.getItem("arshaon-icons-v2")) || {}; } catch { return {}; } })();
  const saveIconPos = () => { try { localStorage.setItem("arshaon-icons-v2", JSON.stringify(iconPos)); } catch {} };
  function placeIcons() {
    $$(".dicon").forEach((d, i) => {
      const p = iconPos[i] || { x: innerWidth - 104, y: 42 + i * 96 };
      d.style.left = clamp(p.x, 0, innerWidth - 90) + "px";
      d.style.top = clamp(p.y, 30, innerHeight - 110) + "px";
    });
  }
  function overTrash(x, y) {
    const t = $('.dock-item[data-app="trash"]'); if (!t || isMobile()) return false;
    const r = t.getBoundingClientRect();
    return x >= r.left - 8 && x <= r.right + 8 && y >= r.top - 12 && y <= r.bottom + 8;
  }
  function cleanUpIcons() { iconPos = {}; saveIconPos(); placeIcons(); }

  function buildDesktop() {
    const items = deskItems = [
      { name: "My CV.pdf", icon: docIcon("#e2483d", "PDF"), open: () => openApp("preview") },
      { name: "About Me", icon: docIcon("#f5a623", "INFO"), open: () => openApp("notes") },
      { name: "My Photos", icon: FOLDER, open: () => openApp("photos", "library") },
    ];
    const box = $("#desk-icons");
    box.innerHTML = items.map((it, i) => `<button class="dicon" data-i="${i}">${it.icon}<span>${esc(it.name)}</span></button>`).join("");
    placeIcons();
    addEventListener("resize", placeIcons);
    // Drag an icon to move it. A tiny movement still counts as a click.
    box.addEventListener("pointerdown", (e) => {
      const d = e.target.closest(".dicon"); if (!d || e.button !== 0) return;
      const i = d.dataset.i, sx = e.clientX, sy = e.clientY, ox = d.offsetLeft, oy = d.offsetTop;
      let moved = false;
      d.setPointerCapture(e.pointerId);
      const move = (ev) => {
        const dx = ev.clientX - sx, dy = ev.clientY - sy;
        if (!moved && Math.hypot(dx, dy) < 4) return;
        moved = true; d.classList.add("dragging");
        const nx = clamp(ox + dx, 0, innerWidth - 90), ny = clamp(oy + dy, 30, innerHeight - 110);
        d.style.transform = `translate3d(${nx - ox}px, ${ny - oy}px, 0)`;
        $('.dock-item[data-app="trash"]')?.classList.toggle("drop", overTrash(ev.clientX, ev.clientY));
      };
      const up = (ev) => {
        d.removeEventListener("pointermove", move); d.removeEventListener("pointerup", up);
        d.classList.remove("dragging");
        d.style.transform = "";
        $('.dock-item[data-app="trash"]')?.classList.remove("drop");
        if (moved && overTrash(ev.clientX, ev.clientY)) { d.style.left = ox + "px"; d.style.top = oy + "px"; trashDesk(i); return; }
        if (moved) {
          const nx = clamp(ox + (ev.clientX - sx), 0, innerWidth - 90), ny = clamp(oy + (ev.clientY - sy), 30, innerHeight - 110);
          d.style.left = nx + "px"; d.style.top = ny + "px";
          iconPos[i] = { x: nx, y: ny }; saveIconPos();
        }
      };
      d.addEventListener("pointermove", move); d.addEventListener("pointerup", up);
    });
    box.onclick = (e) => {
      const d = e.target.closest(".dicon"); if (!d) return;
      $$(".dicon").forEach((x) => x.classList.toggle("sel", x === d));
      if (e.detail >= 2) items[+d.dataset.i].open();
    };
    document.addEventListener("pointerdown", (e) => { if (!e.target.closest(".dicon")) $$(".dicon.sel").forEach((x) => x.classList.remove("sel")); });

    $("#home").innerHTML = `<div class="home-card"><div class="home-card-top"><div class="hc-av-wrap">${avatar()}<span class="hc-status-dot" title="Online"></span></div><div class="hc-info"><h3>${esc(SITE.name)} <span class="hc-verified" title="Verified">✓</span></h3><p>${esc(SITE.mobileTitle || "Founder · ARSHAON")}</p></div><button type="button" class="hc-action-pill" data-open="preview" aria-label="Open CV">CV ↗</button></div></div>
      <div class="home-grid">${["notes", "messages", "photos", "finder", "mail", "calendar", "settings"].filter((id) => APPS[id]).map((id) => `<button class="home-app" data-app="${id}">${icon(id, 60)}<span>${APPS[id].name}</span></button>`).join("")}</div>`;
    $("#home").onclick = (e) => { const b = e.target.closest("[data-app]"); if (b) openApp(b.dataset.app); };
  }

  /* =====================================================================
     MENUS
     ===================================================================== */
  const MENUS = {
    brand: () => [["About " + SITE.short, openAbout], ["System Settings…", () => openApp("settings")], "-", ["Sleep", sleep], ["Restart…", () => boot(false)], ["Shut Down…", () => boot(true)], "-", ["Lock Screen", lock, "⌃⌘Q"]],
    app: () => [[`About ${$("#mb-app").textContent}`, openAbout], "-", [`Quit ${$("#mb-app").textContent}`, () => activeWin() && closeWin(activeWin()), "⌘Q"]],
    file: () => [["New Finder Window", () => openApp("finder"), "⌘N"], ["Open Resume", () => openApp("preview"), "⌘O"], "-", ["Close Window", () => activeWin() && closeWin(activeWin()), "⌘W"]],
    view: () => [["Light Mode", () => setTheme("light"), "", prefs.theme === "light"], ["Dark Mode", () => setTheme("dark"), "", prefs.theme === "dark"], ["Match System", () => setTheme("auto"), "", prefs.theme === "auto"], "-", ["Clean Up Desktop Icons", cleanUpIcons], ["Change Wallpaper…", () => openApp("settings", "wallpaper")]],
    window: () => [["Minimise", () => activeWin() && $(".min", activeWin()).click(), "⌘M"], ["Zoom", () => activeWin() && activeWin().classList.toggle("maxed")], "-",
      ...Object.values(wins).map((w) => [w.querySelector(".wtitle").textContent, () => { w.classList.remove("minimized"); focusWin(w); }, "", w.classList.contains("active")])],
    help: () => [["About Ashikur", () => openApp("notes", 0)], ["My CV / Resume", () => openApp("preview")], ["My LinkedIn Profile", () => openApp("safari", SITE.linkedin)], ["My Photos", () => openApp("photos", "library")], "-", ["Send Private Note", () => openApp("notes")], ["Email Ashikur", () => openApp("mail")]],
    control: () => [["Light Mode", () => setTheme("light"), "", prefs.theme === "light"], ["Dark Mode", () => setTheme("dark"), "", prefs.theme === "dark"], ["Match System", () => setTheme("auto"), "", prefs.theme === "auto"], "-", ["Next Wallpaper", nextWall], ["Settings…", () => openApp("settings")]],
  };
  function setTheme(t) { prefs.theme = t; applyTheme(); savePrefs(); }
  function nextWall() { const k = Object.keys(allWalls()); prefs.wall = k[(k.indexOf(currentWallId()) + 1) % k.length]; applyWall(); savePrefs(); }
  let openMenuBtn = null;
  function showMenu(btn) {
    const m = $("#menu"), list = MENUS[btn.dataset.menu]();
    m.innerHTML = "";
    list.forEach((it) => {
      if (it === "-") return m.append(el("<hr>"));
      const [label, fn, key, on] = it;
      const b = el(`<button class="${on ? "on" : ""}" ${fn ? "" : "disabled"}><span>${esc(label)}</span><span class="k">${key || ""}</span></button>`);
      if (fn) b.onclick = () => { hideMenu(); fn(); };
      m.append(b);
    });
    const r = btn.getBoundingClientRect();
    m.hidden = false;
    m.style.top = r.bottom + 4 + "px";
    m.style.left = clamp(r.left, 6, innerWidth - m.offsetWidth - 6) + "px";
    $$(".mb-item.open").forEach((x) => x.classList.remove("open"));
    btn.classList.add("open"); openMenuBtn = btn;
  }
  function hideMenu() { $("#menu").hidden = true; $$(".mb-item.open").forEach((x) => x.classList.remove("open")); openMenuBtn = null; }
  function buildMenus() {
    $$("[data-menu]").forEach((b) => {
      b.addEventListener("click", (e) => { e.stopPropagation(); hideNC(); openMenuBtn === b ? hideMenu() : showMenu(b); });
      b.addEventListener("mouseenter", () => { if (openMenuBtn && openMenuBtn !== b) showMenu(b); });
    });
    document.addEventListener("pointerdown", (e) => { if (!e.target.closest("#menu, [data-menu]")) hideMenu(); if (!e.target.closest("#nc, #clock")) hideNC(); });
    $("#clock").onclick = (e) => { e.stopPropagation(); hideMenu(); $("#nc").hidden ? showNC() : hideNC(); };
  }

  /* ---------- Notification centre (click the clock) ---------- */
  function showNC() {
    const d = new Date(), y = d.getFullYear(), mo = d.getMonth();
    const first = (new Date(y, mo, 1).getDay() + 6) % 7, days = new Date(y, mo + 1, 0).getDate();
    let cal = ["M", "T", "W", "T", "F", "S", "S"].map((x) => `<b>${x}</b>`).join("") + "<span></span>".repeat(first);
    for (let i = 1; i <= days; i++) cal += `<span class="${i === d.getDate() ? "today" : ""}">${i}</span>`;
    const top = SITE.campaigns[0];
    $("#nc").innerHTML = `
      <div class="widget"><h4>${d.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</h4><div class="cal">${cal}</div></div>
      <div class="widget"><div class="contact-row">${avatar()}<div><b>${esc(SITE.name)}</b><div style="color:var(--muted)">ARSHAON · <a data-open="preview">View CV</a> · <a data-open="safari" data-arg="linkedin">LinkedIn</a></div></div></div></div>`;
    $("#nc").hidden = false;
  }
  function hideNC() { $("#nc").hidden = true; }

  /* =====================================================================
     CLOCK, LOCK SCREEN, SLEEP, RESTART
     ===================================================================== */
  function fmtTime(d) { return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: useH12() }); }
  function tick() {
    const d = new Date();
    $("#clock").innerHTML = (prefs.showDate ? `<span class="mb-date">${esc(d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }).replace(/,/g, ""))}</span>` : "") + `<span class="mb-time">${esc(fmtTime(d))}</span>`;
    $("#lock-time").textContent = fmtTime(d).replace(/\s?[AP]M/, "");
    $("#lock-date").textContent = d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  }
  function lock() {
    hideMenu(); hideNC();
    $("#lock").hidden = false;
    setTimeout(() => $("#lock-btn").focus(), 50);
  }
  function unlock() {
    $("#lock").hidden = true;
    try { sessionStorage.setItem("arshaon-unlocked", "1"); } catch {}
    if (!Object.keys(wins).length && !isMobile()) openApp("notes");
  }
  function sleep() { $("#sleep").hidden = false; }
  function boot(shutdown) {
    hideMenu();
    Object.values(wins).forEach(closeWin);
    const b = $("#boot");
    b.hidden = false; b.classList.remove("run");
    $("#boot-hint").textContent = shutdown ? "Click anywhere to turn on" : "";
    const start = () => {
      b.onclick = null; $("#boot-hint").textContent = "";
      void b.offsetWidth; b.classList.add("run");
      setTimeout(() => { b.hidden = true; unlock(); }, 1800);
    };
    shutdown ? (b.onclick = start) : start();
  }

  /* =====================================================================
     START EVERYTHING
     ===================================================================== */
  function init() {
    document.body.insertAdjacentHTML("afterbegin", ICON_DEFS);
    applyTheme(); applyAccent(); applyWall(); drawSkyline();
    buildDock(); buildDesktop(); buildMenus(); updateBadge(); applyDockPrefs(); applyMenuPrefs();
    $("#lock-avatar").outerHTML = avatar("big");
    $("#lock-name").textContent = SITE.name;
    // Top-left logo: a picture (SITE.menuLogo) or letters (SITE.menuLogoText).
    $(".mb-logo").innerHTML = '<svg class="mb-apple-svg" viewBox="0 0 814 1000" width="12" height="14.5" fill="currentColor" style="display:block" aria-hidden="true"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/></svg>';
    const bootLogo = $("#boot .boot-logo"); if (bootLogo) bootLogo.innerHTML = '<svg viewBox="0 0 814 1000" width="46" height="56" fill="currentColor" style="display:block" aria-hidden="true"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/></svg>';
    tick(); setInterval(tick, 1000 * 15);

    $("#lock-btn").onclick = unlock;
    $("#lock").addEventListener("click", (e) => { if (e.target === $("#lock")) unlock(); });
    $("#sleep").onclick = () => { $("#sleep").hidden = true; lock(); };
    document.addEventListener("keydown", (e) => {
      if (!$("#lock").hidden && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); unlock(); }
      if (e.key === "Escape") { hideMenu(); hideNC(); }
      const typing = /INPUT|TEXTAREA/.test(document.activeElement?.tagName || "");
      if (!typing && (e.key === "Delete" || (e.key === "Backspace" && (e.metaKey || e.ctrlKey)))) {
        const sel = $(".dicon.sel"); if (sel) trashDesk(sel.dataset.i);
      }
    });
    // Links inside notes like <a data-open="photos"> open apps.
    document.addEventListener("click", (e) => {
      const a = e.target.closest("[data-open]"); if (!a) return;
      e.preventDefault(); hideNC();
      openApp(a.dataset.open, a.dataset.arg);
    });

    // Go straight to the desktop. The lock screen only appears after Sleep.
    unlock();
  }
  /* =====================================================================
     STATUS MENUS: Wi-Fi, Battery and Control Centre (like macOS)
     ===================================================================== */
  for (const [k, v] of Object.entries({ volume: 0.7, brightness: 1, airdrop: "Contacts Only", lowPower: false })) if (prefs[k] === undefined) prefs[k] = v;
  const SM_IC = {
    wifi: '<svg viewBox="0 0 24 24"><path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0"/><circle cx="12" cy="19" r="1" fill="currentColor"/></svg>',
    phone: '<svg viewBox="0 0 24 24"><rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 17.5h2"/></svg>',
    lock: '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    bars: '<svg viewBox="0 0 24 24"><path d="M5 19v-3M10 19v-6M15 19v-9M20 19V7"/></svg>',
    bt: '<svg viewBox="0 0 24 24"><path d="M7 7l10 10-5 4V3l5 4L7 17"/></svg>',
    airdrop: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2"/><path d="M8 16a5.6 5.6 0 1 1 8 0M5.2 18.8a9.6 9.6 0 1 1 13.6 0"/></svg>',
    moon: '<svg viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>',
    sunS: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 5v1M12 18v1M5 12h1M18 12h1"/></svg>',
    sunL: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    spkS: '<svg viewBox="0 0 24 24"><path d="M5 10h3l4-3v10l-4-3H5z"/></svg>',
    spkL: '<svg viewBox="0 0 24 24"><path d="M4 10h3l4-3v10l-4-3H4z"/><path d="M15 9a4 4 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/></svg>',
    batt: '<svg viewBox="0 0 28 24"><rect x="2" y="7" width="21" height="10" rx="3"/><path d="M25 10.5v3"/></svg>',
    prev: '<svg viewBox="0 0 24 24"><path d="M6 5h2v14H6zM20 5v14L9 12z"/></svg>',
    next: '<svg viewBox="0 0 24 24"><path d="M16 5h2v14h-2zM4 5v14l11-7z"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="M7 4v16l13-8z"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>',
  };

  // Sounds follow the volume slider (and stay silent in Do Not Disturb).
  const playTone = (f1, f2) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.setValueAtTime(f1, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(f2, ctx.currentTime + .08);
      g.gain.setValueAtTime(.08 * prefs.volume, ctx.currentTime); g.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + .25);
      o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + .25);
    } catch {}
  };
  ping = (f1 = 880, f2 = 1320) => { if (!prefs.focus && prefs.volume > 0) playTone(f1, f2); };
  const crumpleBase = crumple;
  crumple = () => { if (prefs.volume > 0) crumpleBase(); };

  // Display brightness (a dark layer over the screen) and Low Power mode.
  const dim = el('<div id="dim" aria-hidden="true"></div>');
  document.body.append(dim);
  const applyDisplay = () => {
    dim.style.opacity = String((1 - prefs.brightness) * 0.8);
    document.body.classList.toggle("low-power", !!prefs.lowPower);
  };
  applyDisplay();

  // Real battery level when the browser shares it (Chrome / Edge), otherwise 97%.
  let batt = { level: 0.97, charging: false };
  const wifiEl = $('.mb-icon[title="Wi-Fi"]'), battEl = $('.mb-icon[title="Battery"]');
  const drawBattIcon = () => {
    if (!battEl) return;
    if (!$(".mb-batt-svg", battEl)) {
      battEl.innerHTML = '<span class="mb-batt-pct">100%</span><svg class="mb-batt-svg" viewBox="0 0 25 12" aria-hidden="true"><rect x="0.75" y="0.75" width="20.5" height="10.5" rx="3" fill="none" stroke="currentColor" stroke-width="1.15" stroke-opacity="0.48"/><rect class="mb-batt-fill" x="2.5" y="2.5" width="17" height="7" rx="1.6" fill="currentColor" stroke="none"/><path d="M22.6 4.1c.95.25 1.55.95 1.55 1.9s-.6 1.65-1.55 1.9V4.1z" fill="currentColor" fill-opacity="0.48" stroke="none"/></svg>';
    }
    const p = $(".mb-batt-pct", battEl);
    if (p) p.textContent = Math.round((batt.level || 1) * 100) + "%";
    const r = $(".mb-batt-fill", battEl);
    if (r) r.setAttribute("width", Math.max(2, 17 * (batt.level || 1)).toFixed(1));
  };
  if (navigator.getBattery) navigator.getBattery().then((b) => {
    const upd = () => { batt = { level: b.level, charging: b.charging }; drawBattIcon(); if (smOpen === "battery") showStatus("battery"); };
    upd(); b.addEventListener("levelchange", upd); b.addEventListener("chargingchange", upd);
  }).catch(() => {});
  drawBattIcon();

  const sm = el('<div id="sm" class="sm-pop" hidden></div>');
  document.body.append(sm);
  let smOpen = null, showOthers = false, audio = null;
  const wifiCfg = () => Object.assign({ network: `${SITE.short}-5G`, hotspot: `${SITE.short}'s iPhone`, others: [] }, SITE.wifi || {});
  const swi = (key) => `<button class="toggle sm-toggle ${prefs[key] ? "on" : ""}" data-tog="${key}" aria-label="${key}" aria-pressed="${!!prefs[key]}"></button>`;

  function wifiPanel() {
    const w = wifiCfg();
    return `<div class="sm-row sm-head"><b>Wi-Fi</b>${swi("wifi")}</div>
      ${prefs.wifi ? `<div class="sm-sep"></div><div class="sm-label">Personal Hotspot</div>
        <div class="sm-row"><span class="sm-dot green">${SM_IC.phone}</span><span class="sm-grow">${esc(w.hotspot)}</span><span class="sm-muted">${SM_IC.bars} 5G</span></div>
        <div class="sm-sep"></div><div class="sm-label">Known Network</div>
        <div class="sm-row"><span class="sm-dot blue">${SM_IC.wifi}</span><span class="sm-grow">${esc(w.network)}</span><span class="sm-muted">${SM_IC.lock}</span></div>
        <div class="sm-sep"></div>
        <button class="sm-row sm-btn" data-sm="others"><span class="sm-grow">Other Networks</span><span class="sm-chev ${showOthers ? "open" : ""}">›</span></button>
        ${showOthers ? w.others.map((n) => `<button class="sm-row sm-btn sm-sub" data-sm="join" data-n="${esc(n)}"><span class="sm-dot grey">${SM_IC.wifi}</span><span class="sm-grow">${esc(n)}</span><span class="sm-muted">${SM_IC.lock}</span></button>`).join("") + '<div class="sm-note"></div>' : ""}` : ""}
      <div class="sm-sep"></div><button class="sm-row sm-btn" data-sm="settings" data-pane="wifi">Wi-Fi Settings…</button>`;
  }
  function batteryPanel() {
    return `<div class="sm-row sm-head"><b>Battery</b><span class="sm-muted">${Math.round(batt.level * 100)}%</span></div>
      <div class="sm-small">Power Source: ${batt.charging ? "Power Adapter" : "Battery"}</div>
      <div class="sm-sep"></div><div class="sm-label">Energy Mode</div>
      <button class="sm-row sm-btn" data-tog="lowPower"><span class="sm-batt">${SM_IC.batt}</span><span class="sm-grow">Low Power</span>${prefs.lowPower ? '<span class="sm-check">✓</span>' : ""}</button>
      <div class="sm-sep"></div><div class="sm-small">No Apps Using Significant Energy</div>
      <div class="sm-sep"></div><button class="sm-row sm-btn" data-sm="settings" data-pane="general">Battery Settings…</button>`;
  }
  const ccConn = (tog, ic, name, sub, on) => `<button class="cc-conn-row" data-tog="${tog}"><span class="cc-ic ${on ? "on" : ""}">${SM_IC[ic]}</span><span class="cc-txt"><b>${name}</b><small>${esc(sub)}</small></span></button>`;
  function ccPanel() {
    const w = wifiCfg(), m = SITE.music || null, playing = audio && !audio.paused;
    return `<div class="cc-grid">
      <div class="cc-tile cc-conn">
        ${ccConn("wifi", "wifi", "Wi-Fi", prefs.wifi ? w.network : "Off", prefs.wifi)}
        ${ccConn("bt", "bt", "Bluetooth", prefs.bt ? "On" : "Off", prefs.bt)}
        ${ccConn("airdrop", "airdrop", "AirDrop", prefs.airdrop, prefs.airdrop !== "Off")}
      </div>
      <div class="cc-col">
        <div class="cc-tile cc-music">
          <span class="cc-cover" style="${m && m.cover ? `background-image:${cssUrl(m.cover)}` : ""}">${m && m.cover ? "" : "♪"}</span>
          <div class="cc-music-txt"><b>${esc(m ? m.title : "Not Playing")}</b><small>${esc(m ? m.artist || "" : "")}</small>
            <div class="cc-ctrls"><button data-sm="restart" aria-label="Previous" ${m && m.src ? "" : "disabled"}>${SM_IC.prev}</button>
              <button data-sm="play" aria-label="${playing ? "Pause" : "Play"}" ${m && m.src ? "" : "disabled"}>${playing ? SM_IC.pause : SM_IC.play}</button>
              <button data-sm="restart" aria-label="Next" ${m && m.src ? "" : "disabled"}>${SM_IC.next}</button></div></div>
        </div>
        <button class="cc-tile cc-focus ${prefs.focus ? "on" : ""}" data-tog="focus"><span class="cc-ic">${SM_IC.moon}</span><span class="cc-txt"><b>Focus</b><small>${prefs.focus ? "On" : "Off"}</small></span></button>
      </div>
      <div class="cc-tile cc-wide"><b>Display</b><div class="cc-slider">${SM_IC.sunS}<input type="range" min="0.4" max="1" step="0.01" value="${prefs.brightness}" data-range="brightness" aria-label="Display brightness">${SM_IC.sunL}</div></div>
      <div class="cc-tile cc-wide"><b>Sound</b><div class="cc-slider">${SM_IC.spkS}<input type="range" min="0" max="1" step="0.01" value="${prefs.volume}" data-range="volume" aria-label="Volume">${SM_IC.spkL}</div></div>
    </div>`;
  }
  function showStatus(kind, anchor) {
    hideMenu(); hideNC();
    if (anchor) sm._anchor = anchor;
    smOpen = kind;
    sm.className = "sm-pop " + kind;
    sm.innerHTML = kind === "wifi" ? wifiPanel() : kind === "battery" ? batteryPanel() : ccPanel();
    sm.hidden = false;
    const r = sm._anchor.getBoundingClientRect();
    sm.style.top = r.bottom + 6 + "px";
    sm.style.left = clamp(r.right - sm.offsetWidth + 10, 8, innerWidth - sm.offsetWidth - 8) + "px";
    $$(".mb-item.open").forEach((x) => x.classList.remove("open"));
    sm._anchor.classList.add("open");
  }
  function closeStatus() { sm.hidden = true; smOpen = null; $$(".mb-item.open").forEach((x) => x.classList.remove("open")); }
  function togglePlay() {
    const m = SITE.music; if (!m || !m.src) return;
    if (!audio) { audio = new Audio(srcUrl(m.src)); audio.loop = true; }
    audio.volume = prefs.volume;
    if (audio.paused) audio.play().catch(() => {}); else audio.pause();
    setTimeout(() => smOpen === "cc" && showStatus("cc"), 60);
  }
  sm.addEventListener("click", (e) => {
    const t = e.target.closest("[data-tog]"), a = e.target.closest("[data-sm]");
    if (t) {
      const k = t.dataset.tog;
      if (k === "airdrop") { const o = ["Contacts Only", "Everyone", "Off"]; prefs.airdrop = o[(o.indexOf(prefs.airdrop) + 1) % o.length]; }
      else prefs[k] = !prefs[k];
      savePrefs(); applyMenuPrefs(); applyDisplay(); showStatus(smOpen);
    }
    if (a) {
      const x = a.dataset.sm;
      if (x === "others") { showOthers = !showOthers; showStatus(smOpen); }
      if (x === "join") $(".sm-note", sm).textContent = `“${a.dataset.n}” is password protected. Nice try 😉`;
      if (x === "settings") { closeStatus(); openApp("settings", a.dataset.pane); }
      if (x === "play") togglePlay();
      if (x === "restart" && audio) audio.currentTime = 0;
    }
  });
  sm.addEventListener("input", (e) => {
    const r = e.target.closest("[data-range]"); if (!r) return;
    prefs[r.dataset.range] = +r.value;
    if (audio) audio.volume = prefs.volume;
    applyDisplay(); savePrefs();
  });
  // Make the menu bar icons clickable.
  const ccBtn = $('[data-menu="control"]');
  if (ccBtn) ccBtn.removeAttribute("data-menu");
  const anchors = [[wifiEl, "wifi"], [battEl, "battery"], [ccBtn, "cc"]].filter(([x]) => x);
  anchors.forEach(([x, kind]) => {
    x.classList.add("mb-item"); x.setAttribute("role", "button"); x.tabIndex = 0;
    x.addEventListener("click", (e) => { e.stopPropagation(); if (smOpen === kind) closeStatus(); else showStatus(kind, x); });
    x.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); x.click(); } });
  });
  document.addEventListener("pointerdown", (e) => {
    if (smOpen && !e.target.closest("#sm") && !anchors.some(([x]) => x.contains(e.target))) closeStatus();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && smOpen) closeStatus(); });

  /* =====================================================================
     PROFILE APP: a short "about me" card
     ===================================================================== */
  const hireInfo = () => Object.assign({ headline: "", availability: SITE.status, roles: [], facts: [], highlights: [], details: [["Location", SITE.location]] }, SITE.recruiter || {});
  ICONS.hire = SQ("url(#ic-finder)") + '<g filter="url(#ic-sh)"><rect x="17" y="33" width="66" height="44" rx="8" fill="#fff"/><path d="M38 33v-6a5 5 0 0 1 5-5h14a5 5 0 0 1 5 5v6" fill="none" stroke="#fff" stroke-width="6"/><path d="M17 51h66" stroke="#cfe6ff" stroke-width="4"/><rect x="44" y="46" width="12" height="10" rx="2" fill="#0a5fe0"/></g>' + GLOSS;
  APPS.hire = { name: "Quick View", title: "For Recruiters", w: 740, h: 700, mobile: true, render: renderHire };
  // Which fast-track steps this visitor has already looked at (saved in their browser).
  let hireSeen = (() => { try { return JSON.parse(localStorage.getItem("arshaon-fast")) || {}; } catch { return {}; } })();
  const HIRE_STEPS = [["proof", "Proof in numbers"], ["work", "Flagship work"], ["recs", "Recommendations"], ["contact", "Resume & contact"]];
  const recsInfo = () => Object.assign({ show: true, url: SITE.linkedin, count: "", title: "", text: "" }, SITE.recommendations || {});
  function renderHire(body) {
    const h = hireInfo(), rc = recsInfo();
    const skills = h.coreSkills && h.coreSkills.length ? h.coreSkills : Object.values(SITE.skills || {}).flat().slice(0, 14);
    const why = h.why || [];
    const flagship = SITE.campaigns.map((c, i) => [c, i]).filter(([c]) => c.featured).slice(0, 3);
    const steps = HIRE_STEPS.filter(([k]) => (k !== "work" || flagship.length) && (k !== "recs" || (rc.show !== false && rc.url)));
    const contact = `<a class="btn blue" href="${esc(SITE.resume)}" download>Download resume</a>
        <a class="btn" href="mailto:${esc(SITE.email)}?subject=${encodeURIComponent("Hello " + SITE.short)}">Email me</a>
        <a class="btn" href="${esc(SITE.linkedin)}" target="_blank" rel="noopener">LinkedIn ↗</a>`;
    body.innerHTML = `<div class="hire">
      <div class="hire-top">${avatar("big")}<div>
        <span class="hire-kicker">Recruiter quick view · 30 seconds</span>
        <h1>${esc(SITE.name)}</h1><p class="hire-title">${esc(SITE.title)}</p>
        <p class="hire-status">📍 ${esc(SITE.location)}</p></div></div>
      <div class="hire-actions">${contact}
        <button class="btn" data-h="copy">Copy email</button></div>
      <div class="hire-track">
        <div class="ht-head"><b>Shortlisting? Take the 2-minute fast track</b><span class="ht-prog"></span><button class="ht-tour" data-h="tour">▶ Guide me</button></div>
        <div class="ht-steps">${steps.map(([k, l], i) => `<button data-step="${k}"><i>${i + 1}</i><span>${esc(l)}</span></button>`).join("")}</div>
      </div>
      ${h.headline ? `<p class="hire-lead">${esc(h.headline)}</p>` : ""}
      <section data-sec="proof">
        ${h.facts.length ? `<div class="hire-facts">${h.facts.map(([n, l]) => `<div><b>${esc(n)}</b><span>${esc(l)}</span></div>`).join("")}</div>` : ""}
        ${why.length ? `<h4>Why shortlist me</h4><div class="hire-why">${why.map(([t, d]) => `<div><b>${esc(t)}</b><span>${esc(d)}</span></div>`).join("")}</div>` : ""}
      </section>
      ${flagship.length ? `<section data-sec="work"><h4>Flagship work · open a case study</h4><div class="hire-work">${flagship.map(([c, i]) => `<button class="hire-case" data-case="${i}" style="--c1:${esc((c.colors || [])[0] || "#444")};--c2:${esc((c.colors || [])[1] || "#111")}">
          <em>${esc(c.tag || c.type || "")}</em><b>${esc(c.title)}</b>${c.stats && c.stats[0] ? `<span><strong>${esc(c.stats[0][0])}</strong> ${esc(c.stats[0][1])}</span>` : `<span>${esc(c.role || "")}</span>`}<small>Open case study →</small></button>`).join("")}</div>
        <a class="hire-link" data-open="photos">See all ${SITE.campaigns.length} projects & campaigns →</a></section>` : ""}
      ${rc.show !== false && rc.url ? `<section data-sec="recs"><h4>What colleagues say</h4>
        <a class="hire-rec-card" data-h="recs" href="${esc(rc.url)}" target="_blank" rel="noopener">${socialIcon("linkedin", 46)}<div><b>${esc(rc.title || (rc.count ? `${rc.count} recommendations on LinkedIn` : "My recommendations on LinkedIn"))}</b>
          <span>${esc(rc.text || "Read what managers, partners and teammates say about working with me, in their own words.")}</span></div><em>Read on LinkedIn ↗</em></a></section>` : ""}
      ${h.roles.length ? `<h4>Relevant roles</h4><div class="chips">${h.roles.map((r) => `<span>${esc(r)}</span>`).join("")}</div>` : ""}
      ${h.highlights.length ? `<h4>Highlights</h4><ul>${h.highlights.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
      <h4>At a glance</h4><div class="hire-details">${h.details.filter(([, v]) => v).map(([k, v]) => `<div><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join("")}</div>
      ${skills.length ? `<h4>Core skills</h4><div class="chips">${skills.map((x) => `<span>${esc(x)}</span>`).join("")}</div>` : ""}
      <section data-sec="contact" class="hire-cta"><div><b>Ready to talk?</b><span>${esc(h.cta || "Download my resume or send a quick email. I reply fast.")}</span></div><div class="hire-cta-btns">${contact}</div></section>
      <div class="hire-more"><span>Explore more:</span><a data-open="photos">Projects</a><a data-open="finder" data-arg="experience">Experience</a><a data-open="notes"${SITE.notes.findIndex((n) => /skill/i.test(n.title)) >= 0 ? ` data-arg="${SITE.notes.findIndex((n) => /skill/i.test(n.title))}"` : ""}>Skills & notes</a><a data-open="messages">Ask me a question</a></div>
    </div>`;
    const root = $(".hire", body);
    const mark = (k) => {
      if (k && !hireSeen[k]) { hireSeen[k] = 1; try { localStorage.setItem("arshaon-fast", JSON.stringify(hireSeen)); } catch {} }
      $$("[data-step]", root).forEach((b) => b.classList.toggle("done", !!hireSeen[b.dataset.step]));
      const n = steps.filter(([s]) => hireSeen[s]).length;
      $(".ht-prog", root).textContent = n >= steps.length ? "All seen ✓" : `${n} of ${steps.length} seen`;
    };
    mark();
    $('[data-h="copy"]', body).onclick = (e) => {
      const b = e.currentTarget;
      (navigator.clipboard ? navigator.clipboard.writeText(SITE.email) : Promise.reject())
        .then(() => { b.textContent = "Copied ✓"; }).catch(() => { b.textContent = SITE.email; });
    };
    root.addEventListener("click", (e) => {
      const t = e.target;
      const st = t.closest("[data-step]");
      if (st) { const sec = $(`[data-sec="${st.dataset.step}"]`, root); if (sec) sec.scrollIntoView({ behavior: "smooth", block: "center" }); mark(st.dataset.step); return; }
      const cs = t.closest("[data-case]"); if (cs) { mark("work"); openDoc("c" + cs.dataset.case); return; }
      if (t.closest('[data-h="tour"]')) return startRecruiterTour();
      if (t.closest('[data-h="recs"]')) mark("recs");
      if (t.closest(".hire-actions a, .hire-cta a")) mark("contact");
    });
  }
  // "About" item in the Help menu.


  /* =====================================================================
     PHONE VERSIONS OF NOTES & PHOTOS (iPhone style, small screens only)
     ===================================================================== */
  const IOS_IC = {
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>',
    compose: '<svg viewBox="0 0 24 24"><path d="M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6"/><path d="M17.5 3.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>',
    back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
    trash: '<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13z"/></svg>',
    filter: '<svg viewBox="0 0 24 24"><path d="M4 7h16M7 12h10M10 17h4"/></svg>',
    library: '<svg viewBox="0 0 24 24"><rect x="3" y="6" width="14" height="14" rx="2.5"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/></svg>',
    collections: '<svg viewBox="0 0 24 24"><rect x="3" y="9" width="18" height="12" rx="2.5"/><path d="M5.5 6h13M8 3h8"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.3-9-8.6C1.6 8.2 3.6 5 6.8 5c2 0 3.4 1.2 5.2 3.1C13.8 6.2 15.2 5 17.2 5c3.2 0 5.2 3.2 3.8 6.4C19 15.7 12 20 12 20z"/></svg>',
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/></svg>',
  };
  const iosWindow = (body) => { const w = body.closest(".window"); if (w) w.classList.add("ios-win"); return w; };
  const iosPush = (root, html, onMount) => {
    const page = el(`<div class="ios-page">${html}</div>`);
    root.append(page);
    requestAnimationFrame(() => requestAnimationFrame(() => page.classList.add("in")));
    if (onMount) onMount(page);
    return page;
  };
  const iosPop = (page, after) => { page.classList.remove("in"); setTimeout(() => { page.remove(); if (after) after(); }, 260); };
  const iosTop = (label, right = "") => `<div class="ios-top"><button class="ios-back" data-a="pop">${IOS_IC.back}<span>${esc(label)}</span></button>${right}</div>`;

  /* ----- Notes on a phone ----- */
  function renderNotesMobile(body, arg) {
    const win = iosWindow(body);
    let notes = noteList(), query = "";
    body.innerHTML = `<div class="ios ios-notes">
      <div class="ios-scroll"><h1 class="ios-large">Notes</h1><p class="ios-sub"></p><div class="ios-groups"></div></div>
      <div class="ios-bottom"><label class="ios-search">${IOS_IC.search}<input placeholder="Search" aria-label="Search notes"></label>
        <button class="ios-round" data-a="new" aria-label="New note">${IOS_IC.compose}</button></div>
      <button class="ios-homebar" aria-label="Go to Home screen"></button></div>`;
    const root = $(".ios-notes", body), groups = $(".ios-groups", body), search = $(".ios-search input", body);
    const dayLabel = (d) => {
      const g = noteGroup({ when: d });
      if (g === "Today" || g === "Yesterday") return g;
      if (g === "Previous 7 Days") return d.toLocaleDateString("en-US", { weekday: "long" });
      return d.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "2-digit" });
    };
    const stamp = (d) => `${d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} at ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: useH12() })}`;
    const draw = () => {
      const q = query.toLowerCase();
      const shown = notes.filter((n) => !q || n.title.toLowerCase().includes(q) || (n.own ? n.body : n.text).toLowerCase().includes(q))
        .sort((a, b) => (a.pinned ? -1e15 - (a.primary ? 1 : 0) : -a.when.getTime()) - (b.pinned ? -1e15 - (b.primary ? 1 : 0) : -b.when.getTime()));
      $(".ios-sub", body).textContent = `${shown.length} Note${shown.length === 1 ? "" : "s"}`;
      const sections = [];
      shown.forEach((n) => { const g = noteGroup(n); let sec = sections.find((x) => x.g === g); if (!sec) sections.push((sec = { g, items: [] })); sec.items.push(n); });
      groups.innerHTML = sections.map((sec) => `<h3 class="ios-gh">${esc(sec.g)}</h3><div class="ios-group">${sec.items.map((n) =>
        `<button class="ios-row" data-id="${n.id}"><b>${esc(n.title)}</b><small><span>${dayLabel(n.when)}</span>${esc(n.text.slice(0, 80))}</small></button>`).join("")}</div>`).join("")
        || `<p class="ios-empty">No notes found</p>`;
    };
    const openNote = (id, instant) => {
      const n = notes.find((x) => x.id === id); if (!n) return;
      const page = iosPush(root, `${iosTop("Notes", n.own ? `<button class="ios-icon-btn" data-a="del" aria-label="Delete note">${IOS_IC.trash}</button>` : "")}
        <div class="ios-page-body"><div class="note"><div class="stamp">${stamp(n.when)}</div>
        ${n.own ? `<textarea class="nt-edit" placeholder="Start typing… The first line becomes the title." aria-label="Note text">${esc(n.body)}</textarea>` : n.html}</div></div>`, (pg) => {
        pg.classList.add("ios-note-page"); pg.dataset.id = id;
        if (instant) pg.classList.add("in");
        const ta = $(".nt-edit", pg);
        if (ta) ta.oninput = () => { const m = myNotes.find((x) => x.id === id); if (m) { m.text = ta.value; m.updated = Date.now(); saveMyNotes(); } };
      });
      return page;
    };
    root.onclick = (e) => {
      const t = e.target;
      if (t.closest(".ios-homebar")) return closeWin(win);
      const pop = t.closest('[data-a="pop"]');
      if (pop) return iosPop(pop.closest(".ios-page"), () => { notes = noteList(); draw(); });
      const del = t.closest('[data-a="del"]');
      if (del) { const pg = del.closest(".ios-page"); myNotes = myNotes.filter((x) => x.id !== pg.dataset.id); saveMyNotes(); return iosPop(pg, () => { notes = noteList(); draw(); }); }
      if (t.closest('[data-a="new"]')) {
        const m = { id: "u" + Date.now(), text: "", updated: Date.now() };
        myNotes.unshift(m); saveMyNotes(); notes = noteList(); draw();
        const pg = openNote(m.id); setTimeout(() => { const ta = $(".nt-edit", pg); if (ta) ta.focus(); }, 300);
        return;
      }
      const row = t.closest(".ios-row"); if (row) openNote(row.dataset.id);
    };
    search.oninput = () => { query = search.value.trim(); draw(); };
    draw();
    if (arg !== undefined && arg !== null && /^\d+$/.test(String(arg))) openNote("s" + arg, true);
  }

  /* ----- Photos on a phone: Library + Collections (project albums) ----- */
  function renderPhotosMobile(body, arg) {
    const win = iosWindow(body);
    const photos = (SITE.eventPhotos || []).map((p, i) => ({ ...p, i, d: parsePhotoDate(p.date) }))
      .sort((a, b) => ((a.d ? a.d.getTime() : Infinity) - (b.d ? b.d.getTime() : Infinity)) || (a.i - b.i));
    let tab = "library", cols = 3, favOnly = false, curList = [];
    body.innerHTML = `<div class="ios ios-photos">
      <div class="ios-view"></div>
      <div class="ios-tabbar"><div class="ios-tabs"><button data-tab="library">${IOS_IC.library}<span>Library</span></button><button data-tab="collections">${IOS_IC.collections}<span>Collections</span></button></div>
        <button class="ios-round" data-a="search" aria-label="Search">${IOS_IC.search}</button></div>
      <button class="ios-homebar" aria-label="Go to Home screen"></button></div>`;
    const root = $(".ios-photos", body), view = $(".ios-view", body);
    const items = (n) => `${n} Item${n === 1 ? "" : "s"}`;
    const photoGrid = (list) => `<div class="ios-grid" style="--cols:${cols}">${list.map((p) => `<button class="ios-ph" data-p="${p.i}"><img src="${esc(srcUrl(p.src))}" alt="${esc(p.caption || p.event || "Photo")}" loading="lazy">${isFav(p) ? '<i class="ios-fav">♥</i>' : ""}</button>`).join("")}</div>`;
    const header = (title, sub, right = "") => `<div class="ios-head"><div><h1 class="ios-large">${esc(title)}</h1>${sub ? `<p class="ios-sub">${esc(sub)}</p>` : ""}</div><div class="ios-head-r">${right}</div></div>`;
    const categories = () => { const m = new Map(); SITE.campaigns.forEach((c, i) => { if (!m.has(c.type)) m.set(c.type, []); m.get(c.type).push(i); }); return [...m]; };
    // Folder covers: the same hashtag artwork as project banners, but titled with the
    // folder's own name and colour (not one project's hashtag).
    // Colours or a picture can be changed in content.js under folderCovers.
    const FOLDER_COLORS = { [FLAG]: ["#f7b500", "#6b3d00"], "Partnerships & Strategy": ["#5e5ce6", "#17154f"], "Global Campaigns": ["#22a6c4", "#083645"],
      "Entertainment": ["#ff2d55", "#560d2b"], "Sports": ["#2fbf5b", "#0a4420"], "Food & Seasonal": ["#ff8a00", "#742a00"], "Creators & Community": ["#b658f0", "#36125f"] };
    const folderCover = (name) => {
      const own = (SITE.folderCovers || {})[name] || {};
      if (own.image) return `<span class="ios-cover" style="background-image:${cssUrl(own.image)}"></span>`;
      const hue = hashNum(name) % 360;
      const colors = own.colors || FOLDER_COLORS[name] || [`hsl(${hue} 70% 52%)`, `hsl(${hue} 70% 18%)`];
      const title = name === FLAG ? "Flagship" : name;
      return `<span class="ios-cover gen folder" style="${genBg({ colors }, 150)}"><span class="gen-art" aria-hidden="true"><i class="gen-big">#</i><b class="gen-tag">${esc(title)}</b></span>${name === FLAG ? '<span class="flag-badge">★</span>' : ""}</span>`;
    };
    const projectAlbum = (name, count, c, key) => `<button class="ios-album" data-album="${esc(key)}">${folderCover(name)}<b>${esc(name)}</b><small>${count} item${count === 1 ? "" : "s"}</small></button>`;

    const drawLibrary = () => {
      const list = favOnly ? photos.filter(isFav) : photos; curList = list;
      view.innerHTML = header(favOnly ? "Favorites" : "Library", items(list.length), `<button class="ios-pill-btn" data-a="filter" aria-label="View options">${IOS_IC.filter}</button>`) +
        (list.length ? photoGrid(list) + `<p class="ios-count">${items(list.length)}</p>`
          : `<p class="ios-empty">${favOnly ? "No favorites yet. Open a photo and tap the heart." : "No photos yet. Open Collections to see my projects."}</p>`);
      view.scrollTop = view.scrollHeight; // newest at the bottom, like the iPhone
    };
    const drawCollections = () => {
      const events = [...new Set(photos.map((p) => p.event || "Other"))];
      view.innerHTML = header("Albums", "") +
        (events.length ? `<div class="ios-albums">${events.map((ev) => {
          const ps = photos.filter((p) => (p.event || "Other") === ev);
          return `<button class="ios-album" data-event="${esc(ev)}"><span class="ios-cover" style="background-image:${cssUrl(ps[ps.length - 1].src)}"></span><b>${esc(ev)}</b><small>${items(ps.length)}</small></button>`;
        }).join("")}</div>` : `<p class="ios-empty">No albums</p>`);
      view.scrollTop = 0;
    };
    let scrollRaf = 0;
    view.onscroll = () => {
      if (tab !== "library" || scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        const sub = $(".ios-head .ios-sub", view); if (!sub) return;
        const top = view.getBoundingClientRect().top + 96;
        const firstTile = $$(".ios-ph", view).find((t) => t.getBoundingClientRect().bottom > top);
        const atEnd = view.scrollTop + view.clientHeight >= view.scrollHeight - 40;
        const ph = firstTile && curList.find((x) => x.i === +firstTile.dataset.p);
        sub.textContent = !atEnd && ph && ph.d ? ph.d.toLocaleDateString("en-US", { month: "long", year: "numeric" }) : items(curList.length);
      });
    };
    const draw = () => {
      $$("[data-tab]", root).forEach((b) => b.classList.toggle("on", b.dataset.tab === tab));
      if (tab === "library") drawLibrary(); else drawCollections();
    };

    const openAlbum = (key) => {
      const list = SITE.campaigns.map((c, i) => [c, i]).filter(([c]) => key === "__all" || (key === FLAG ? c.featured : c.type === key));
      const name = key === "__all" ? "All Projects" : key;
      iosPush(root, `${iosTop("Collections")}<div class="ios-page-body"><h1 class="ios-large">${esc(name)}</h1><p class="ios-sub">${list.length} project${list.length === 1 ? "" : "s"} & campaign${list.length === 1 ? "" : "s"}</p>
        <div class="ios-proj-grid">${list.map(([c, i]) => `<button class="tile ios-proj${genCls(c)}" data-proj="${i}" style="${tileBg(c)}">${genArt(c, "tile")}${tileText(c)}</button>`).join("")}</div></div>`,
        (pg) => { pg._name = name; });
    };
    const openProject = (i, backLabel) => (gcEvent("project/" + gcSlug(SITE.campaigns[i]?.title), "Project: " + (SITE.campaigns[i]?.title || "")), 0) || iosPush(root, `${iosTop(backLabel)}<div class="ios-page-body ios-project">${projectHTML(SITE.campaigns[i])}</div>`);
    const openEvent = (ev) => {
      const ps = photos.filter((p) => (p.event || "Other") === ev);
      iosPush(root, `${iosTop("Collections")}<div class="ios-page-body ios-flush"><div class="ios-pad"><h1 class="ios-large">${esc(ev)}</h1><p class="ios-sub">${items(ps.length)}</p></div>${photoGrid(ps)}</div>`, (pg) => { pg._list = ps; });
    };
    const openSearch = () => iosPush(root, `${iosTop("Back")}<div class="ios-page-body"><label class="ios-search big">${IOS_IC.search}<input placeholder="Photos, events and projects" aria-label="Search"></label><div class="ios-results"></div></div>`, (pg) => {
      const inp = $("input", pg), out = $(".ios-results", pg);
      const run = () => {
        const q = inp.value.trim().toLowerCase();
        if (!q) { pg._list = []; out.innerHTML = `<p class="ios-empty">Search events, captions and projects</p>`; return; }
        const ps = photos.filter((p) => [p.event, p.caption, p.date].join(" ").toLowerCase().includes(q)); pg._list = ps;
        const pr = SITE.campaigns.map((c, i) => [c, i]).filter(([c]) => [c.title, c.type, c.partners, c.desc].join(" ").toLowerCase().includes(q));
        out.innerHTML = (pr.length ? `<h3 class="ios-sec">Projects</h3><div class="ios-group">${pr.map(([c, i]) => `<button class="ios-row" data-proj="${i}"><b>${esc(c.title)}</b><small><span>${esc(c.type)}</span>${esc(c.role || "")}</small></button>`).join("")}</div>` : "") +
          (ps.length ? `<h3 class="ios-sec">Photos</h3>${photoGrid(ps)}` : "") +
          (!pr.length && !ps.length ? `<p class="ios-empty">No results for “${esc(inp.value)}”</p>` : "");
      };
      inp.oninput = run; run(); setTimeout(() => inp.focus(), 300);
    });
    const toggleMenu = () => {
      const ex = $(".ios-menu", root); if (ex) return ex.remove();
      const m = el(`<div class="ios-menu"><button data-m="fav">${favOnly ? "✓ " : ""}Favorites only</button><div class="ios-menu-sep"></div>
        <div class="ios-menu-label">Grid size</div><div class="ios-menu-cols">${[3, 4, 5].map((n) => `<button data-cols="${n}" class="${cols === n ? "on" : ""}">${n}</button>`).join("")}</div></div>`);
      m.onclick = (e) => {
        e.stopPropagation();
        const f = e.target.closest('[data-m="fav"]'), c = e.target.closest("[data-cols]");
        if (f) favOnly = !favOnly; if (c) cols = +c.dataset.cols;
        if (f || c) { m.remove(); drawLibrary(); }
      };
      root.append(m);
    };

    // Full-screen photo viewer: swipe left/right, swipe down to close.
    const openViewer = (list, k) => {
      if (!list || k < 0) return;
      const v = el(`<div class="ios-viewer"><div class="ios-v-top"><button class="ios-back light" data-v="close" aria-label="Close">${IOS_IC.back}</button><div class="ios-v-title"><b></b><small></small></div><span class="ios-v-sp"></span></div>
        <div class="ios-v-stage"><img alt=""></div><div class="ios-v-cap" hidden></div>
        <div class="ios-v-bar"><button data-v="fav" aria-label="Favorite">${IOS_IC.heart}</button><button data-v="info" aria-label="Info">${IOS_IC.info}</button></div></div>`);
      const show = () => {
        k = (k + list.length) % list.length; const p = list[k];
        $("img", v).src = srcUrl(p.src); $("img", v).alt = p.caption || p.event || "Photo";
        $(".ios-v-title b", v).textContent = p.d ? fmtDay(p.d) : (p.event || "Photo");
        $(".ios-v-title small", v).textContent = `${k + 1} of ${list.length}`;
        $('[data-v="fav"]', v).classList.toggle("on", isFav(p));
        $(".ios-v-cap", v).innerHTML = `<b>${esc(p.event || "")}</b>${p.caption ? `<p>${esc(p.caption)}</p>` : ""}`;
      };
      v.onclick = (e) => {
        e.stopPropagation();
        const a = e.target.closest("[data-v]")?.dataset.v; if (!a) return;
        const p = list[k];
        if (a === "close") { v.remove(); $$(`.ios-ph[data-p]`, root).forEach((t) => { const ph = photos.find((x) => x.i === +t.dataset.p), h = $(".ios-fav", t); if (ph && isFav(ph) && !h) t.append(el('<i class="ios-fav">♥</i>')); if (ph && !isFav(ph) && h) h.remove(); }); }
        if (a === "fav") { favs = isFav(p) ? favs.filter((x) => x !== p.src) : [...favs, p.src]; saveFavs(); show(); }
        if (a === "info") $(".ios-v-cap", v).hidden = !$(".ios-v-cap", v).hidden;
      };
      let sx = null, sy = null;
      const stage = $(".ios-v-stage", v);
      stage.addEventListener("pointerdown", (e) => { sx = e.clientX; sy = e.clientY; });
      stage.addEventListener("pointerup", (e) => {
        if (sx === null) return;
        const dx = e.clientX - sx, dy = e.clientY - sy; sx = sy = null;
        if (dy > 90 && Math.abs(dy) > Math.abs(dx)) { v.remove(); return; }
        if (Math.abs(dx) > 50) { k += dx < 0 ? 1 : -1; show(); }
      });
      root.append(v); show();
    };

    root.onclick = (e) => {
      const t = e.target;
      const menu = $(".ios-menu", root);
      if (menu && !t.closest('[data-a="filter"]')) menu.remove();
      if (t.closest(".ios-homebar")) return closeWin(win);
      const pop = t.closest('[data-a="pop"]'); if (pop) return iosPop(pop.closest(".ios-page"));
      const tb = t.closest("[data-tab]"); if (tb) { tab = tb.dataset.tab; $$(".ios-page", root).forEach((p) => p.remove()); return draw(); }
      if (t.closest('[data-a="search"]')) return openSearch();
      if (t.closest('[data-a="filter"]')) return toggleMenu();
      const alb = t.closest("[data-album]"); if (alb) return openAlbum(alb.dataset.album);
      const ev = t.closest("[data-event]"); if (ev) return openEvent(ev.dataset.event);
      const pj = t.closest("[data-proj]"); if (pj) { const pg = pj.closest(".ios-page"); return openProject(+pj.dataset.proj, (pg && pg._name) || "Back"); }
      const ph = t.closest(".ios-ph");
      if (ph) { const pg = ph.closest(".ios-page"), list = pg ? pg._list : curList; return openViewer(list, (list || []).findIndex((p) => p.i === +ph.dataset.p)); }
    };
    draw();
    const cat = String(arg || "").startsWith("projects:") ? String(arg).slice(9) : "";
    if (cat) { openAlbum(cat); const pgs = $$(".ios-page", root); if (pgs.length) pgs[pgs.length - 1].classList.add("in"); }
  }

  /* =====================================================================
     PHONE EXTRAS: iPhone app open/close animation, swipe-up home bar,
     Spotlight search, iPhone-style Messages, Settings and Calendar,
     and social media links (dock, home screen, quick view, widgets)
     ===================================================================== */
  Object.assign(IOS_IC, {
    mic: '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
    list: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h6M7 16.5h4"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    cal: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4M7 14h.01M11 14h.01M15 14h.01M7 17.5h.01M11 17.5h.01"/></svg>',
    inbox: '<svg viewBox="0 0 24 24"><path d="M3 13l3-8h12l3 8v6H3z"/><path d="M3 13h5l1.5 2.5h5L16 13h5"/></svg>',
    plane: '<svg viewBox="0 0 24 24"><path d="M21 15.5v-1.8l-8-5V4a1.5 1.5 0 0 0-3 0v4.7l-8 5v1.8l8-2.5v4.8L8 19.5V21l3.5-1 3.5 1v-1.5L13 17.8V13z" fill="#fff" stroke="none"/></svg>',
  });

  /* ----- Social media links ----- */
  const SOCIAL_ART = {
    linkedin: '<defs><linearGradient id="ic-li" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1884ea"/><stop offset="1" stop-color="#00529e"/></linearGradient></defs><rect width="100" height="100" rx="22.5" fill="url(#ic-li)"/><g filter="url(#ic-sh)"><path d="M27 41h11v33H27zM32.5 24a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zM45 41h10.5v4.6c1.5-2.8 5.2-5.6 10.6-5.6 11.3 0 13.4 7.4 13.4 17V74H68.6V59.1c0-3.6-.1-8.2-5-8.2-5 0-5.8 3.9-5.8 7.9V74H45z" fill="#fff"/></g>' + GLOSS + '<rect x="1" y="1" width="98" height="98" rx="22" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="1.4"/>',
    x: '<rect width="100" height="100" rx="22.5" fill="#000"/><path d="M28 26h12.5l32 48H60z" fill="#fff"/><path d="M71 26L31 74" stroke="#fff" stroke-width="5.5" stroke-linecap="round"/>',
    instagram: '<defs><radialGradient id="ig-g" cx="30%" cy="107%" r="150%"><stop offset="0" stop-color="#fdf497"/><stop offset=".05" stop-color="#fdf497"/><stop offset=".45" stop-color="#fd5949"/><stop offset=".6" stop-color="#d6249f"/><stop offset=".9" stop-color="#285aeb"/></radialGradient></defs><rect width="100" height="100" rx="22.5" fill="url(#ig-g)"/><rect x="24" y="24" width="52" height="52" rx="15" fill="none" stroke="#fff" stroke-width="6"/><circle cx="50" cy="50" r="12.5" fill="none" stroke="#fff" stroke-width="6"/><circle cx="66" cy="34" r="3.8" fill="#fff"/>',
    facebook: '<rect width="100" height="100" rx="22.5" fill="#1877f2"/><path d="M56 80V55h8.4l1.3-9.8H56v-6.2c0-2.8.8-4.8 4.9-4.8H66v-8.7c-.9-.1-4-.4-7.6-.4-7.5 0-12.6 4.6-12.6 13v7.2H37.4V55h8.4v25z" fill="#fff"/>',
    tiktok: '<rect width="100" height="100" rx="22.5" fill="#000"/><g transform="translate(-2 -1)"><path d="M58 22h10c.7 6.4 4.9 11.2 11 12v10c-4.2 0-8-1.3-11-3.5V61a17 17 0 1 1-17-17c.7 0 1.4 0 2 .1v10.2a7 7 0 1 0 5 6.7z" fill="#25f4ee"/></g><g transform="translate(2 1)"><path d="M58 22h10c.7 6.4 4.9 11.2 11 12v10c-4.2 0-8-1.3-11-3.5V61a17 17 0 1 1-17-17c.7 0 1.4 0 2 .1v10.2a7 7 0 1 0 5 6.7z" fill="#fe2c55"/></g><path d="M58 22h10c.7 6.4 4.9 11.2 11 12v10c-4.2 0-8-1.3-11-3.5V61a17 17 0 1 1-17-17c.7 0 1.4 0 2 .1v10.2a7 7 0 1 0 5 6.7z" fill="#fff"/>',
    youtube: '<rect width="100" height="100" rx="22.5" fill="#fff"/><rect x="18" y="30" width="64" height="40" rx="12" fill="#ff0000"/><path d="M44 40v20l17-10z" fill="#fff"/>',
    github: '<rect width="100" height="100" rx="22.5" fill="#181717"/><path d="M50 22a28 28 0 0 0-8.9 54.6c1.4.3 1.9-.6 1.9-1.3v-5c-7.8 1.7-9.4-3.3-9.4-3.3-1.3-3.2-3.1-4.1-3.1-4.1-2.5-1.7.2-1.7.2-1.7 2.8.2 4.3 2.9 4.3 2.9 2.5 4.3 6.6 3 8.2 2.3.3-1.8 1-3 1.8-3.7-6.2-.7-12.8-3.1-12.8-13.9 0-3.1 1.1-5.6 2.9-7.5-.3-.7-1.2-3.6.3-7.4 0 0 2.3-.8 7.7 2.9a26.6 26.6 0 0 1 14 0c5.3-3.7 7.7-2.9 7.7-2.9 1.5 3.8.6 6.7.3 7.4 1.8 2 2.9 4.4 2.9 7.5 0 10.8-6.6 13.2-12.8 13.9 1 .9 1.9 2.6 1.9 5.2v7.7c0 .7.5 1.6 1.9 1.3A28 28 0 0 0 50 22z" fill="#fff"/>',
    email: '<rect width="100" height="100" rx="22.5" fill="#1a8cff"/><rect x="24" y="32" width="52" height="36" rx="6" fill="#fff"/><path d="M26 35l24 18 24-18" fill="none" stroke="#1a8cff" stroke-width="5" stroke-linejoin="round"/>',
    website: '<rect width="100" height="100" rx="22.5" fill="#0a84ff"/><circle cx="50" cy="50" r="24" fill="none" stroke="#fff" stroke-width="5"/><path d="M26 50h48M50 26c-8 7-12 15-12 24s4 17 12 24c8-7 12-15 12-24s-4-17-12-24z" fill="none" stroke="#fff" stroke-width="5"/>',
  };
  const socialKey = (n) => { const k = String(n || "").toLowerCase().replace(/[^a-z]/g, ""); return k === "twitter" ? "x" : k; };
  const socialList = () => (SITE.socials || [{ name: "LinkedIn", url: SITE.linkedin }]).filter((x) => x && x.url).map((x) => ({ ...x, key: socialKey(x.icon || x.name) }));
  const socialIcon = (key, size) => (SITE.icons && SITE.icons[key]) ? `<span class="appicon" data-ic="${esc(key)}" style="--s:${size}px"><img src="${esc(SITE.icons[key])}" alt=""></span>` : `<span class="appicon" data-ic="${esc(key)}" style="--s:${size}px"><svg viewBox="0 0 100 100">${SOCIAL_ART[key] || SOCIAL_ART.website}</svg></span>`;
  const socialRow = (size) => socialList().map((x) => `<a class="soc-link" href="${esc(x.url)}" target="_blank" rel="noopener" title="${esc(x.name)}">${socialIcon(x.key, size)}<span>${esc(x.name)}</span></a>`).join("");

  // Social icons in the Mac dock (between the apps and the Trash).
  const buildDockBase = buildDock;
  buildDock = () => {
    buildDockBase();
    const links = socialList(), sep = $("#dock .dock-sep");
    if (!links.length || !sep) return;
    sep.insertAdjacentHTML("beforebegin", links.map((x) => `<a class="dock-item social" href="${esc(x.url)}" data-in-mac="safari" aria-label="${esc(x.name)}"><span class="tip">${esc(x.name)}</span>${socialIcon(x.key, 50)}<span class="run"></span></a>`).join(""));
  };
  // Social apps on the phone home screen, plus an unread badge on Messages.
  const buildDesktopBase = buildDesktop;
  buildDesktop = () => {
    buildDesktopBase();
    const grid = $("#home .home-grid");
    if (grid) grid.insertAdjacentHTML("beforeend", socialList().map((x) => `<a class="home-app" href="${esc(x.url)}" target="_blank" rel="noopener">${socialIcon(x.key, 60)}<span>${esc(x.name)}</span></a>`).join(""));
    const m = $('#home .home-app[data-app="messages"]');
    if (m && !$(".badge", m)) m.insertAdjacentHTML("beforeend", '<span class="badge" hidden></span>');
  };
  const updateBadgeBase = updateBadge;
  updateBadge = () => {
    updateBadgeBase();
    const n = convos().filter((c) => c.unread).length;
    $$('#home .home-app[data-app="messages"] .badge').forEach((b) => { b.textContent = n; b.hidden = !n; });
  };
  // "Find me online" widget in the notification centre (click the clock).
  const showNCBase = showNC;
  showNC = () => {
    showNCBase();
    if (socialList().length) $("#nc").insertAdjacentHTML("beforeend", `<div class="widget"><h4>Find me online</h4><div class="soc-row">${socialRow(40)}</div></div>`);
  };
  // Social icons in the recruiter quick view.
  APPS.hire.render = (b) => {
    renderHire(b);
    const row = socialList().length ? `<div class="soc-row hire-social">${socialRow(32)}</div>` : "";
    const act = $(".hire-actions", b); if (act && row) act.insertAdjacentHTML("afterend", row);
  };

  /* ----- iPhone-style app opening and closing ----- */
  let launchRect = null;
  document.addEventListener("pointerdown", (e) => {
    const t = e.target.closest("#home .home-app, .dock-item, .home-actions [data-app], .spot-app");
    if (t) { const ic = $(".appicon", t) || t; launchRect = ic.getBoundingClientRect(); }
  }, true);
  const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const winBox = (w) => ({ left: w.offsetLeft, top: w.offsetTop, width: w.offsetWidth, height: w.offsetHeight });
  const toRect = (fr, r) => `translate(${r.left + r.width / 2 - (fr.left + fr.width / 2)}px, ${r.top + r.height / 2 - (fr.top + fr.height / 2)}px) scale(${r.width / fr.width}, ${r.height / fr.height})`;
  const openWindowBase = openWindow;
  openWindow = (opts) => {
    const existed = !!wins[opts.key];
    const w = openWindowBase(opts);
    if (w.animate && !reduceMotion()) {
      w.getAnimations().forEach((a) => a.cancel());
      if (isMobile() && !existed) {
        const r = launchRect, fr = winBox(w);
        w.style.transformOrigin = "50% 50%";
        w.animate([{ transform: r ? toRect(fr, r) : "scale(.92)", borderRadius: "36px", opacity: r ? 1 : 0 }, { transform: "none", borderRadius: "0px", opacity: 1 }],
          { duration: 380, easing: "cubic-bezier(.32, .72, 0, 1)" });
        const wb = $(".wbody", w); if (wb) wb.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, delay: 60, fill: "backwards" });
      } else if (!isMobile() && !existed) {
        w.style.transformOrigin = "50% 60%";
        w.animate(
          [{ transform: "scale(.93) translateY(10px)", opacity: 0 }, { transform: "scale(1) translateY(0)", opacity: 1 }],
          { duration: 220, easing: "cubic-bezier(.16, 1, .3, 1)" }
        );
      }
    }
    launchRect = null;
    return w;
  };
  function goHome(w) {
    if (!w) return;
    const icn = $(`#home .home-app[data-app="${w.dataset.key}"] .appicon`) || $(`.dock-item[data-app="${w.dataset.key}"] .appicon`);
    if (!w.animate || reduceMotion()) return closeWin(w);
    const fr = winBox(w);
    const to = icn && icn.offsetParent ? toRect(fr, icn.getBoundingClientRect()) : `translateY(${fr.height * 0.3}px) scale(.2)`;
    w.style.transition = "none"; w.style.transformOrigin = "50% 50%";
    const a = w.animate([{ transform: w.style.transform || "none", borderRadius: w.style.borderRadius || "0px", opacity: 1 }, { transform: to, borderRadius: "40px", opacity: 0.25 }],
      { duration: 360, easing: "cubic-bezier(.3,.8,.2,1)", fill: "forwards" });
    a.onfinish = () => closeWin(w);
  }
  // The home bar: tap, or swipe up, to go back to the home screen.
  const homeBar = el('<div id="m-homebar" role="button" tabindex="0" aria-label="Swipe up or tap to go to the Home screen"><i></i></div>');
  document.body.append(homeBar);
  let gy = null, gw = null;
  const topWindow = () => $$(".window").sort((a, b) => b.style.zIndex - a.style.zIndex)[0];
  homeBar.addEventListener("pointerdown", (e) => {
    gw = topWindow(); if (!gw) return;
    gy = e.clientY; homeBar.setPointerCapture(e.pointerId);
    gw.style.transition = "none"; gw.style.transformOrigin = "50% 50%";
  });
  homeBar.addEventListener("pointermove", (e) => {
    if (gy === null || !gw) return;
    const dy = Math.max(0, gy - e.clientY), p = Math.min(dy / 320, 1);
    gw.style.transform = `translateY(${-dy * 0.6}px) scale(${1 - p * 0.42})`;
    gw.style.borderRadius = `${12 + p * 34}px`;
  });
  homeBar.addEventListener("pointerup", (e) => {
    if (gy === null || !gw) return;
    const dy = gy - e.clientY, w = gw; gy = null; gw = null;
    if (dy > 60 || Math.abs(dy) < 6) return goHome(w);
    w.animate([{ transform: w.style.transform, borderRadius: w.style.borderRadius }, { transform: "none", borderRadius: "0px" }], { duration: 220, easing: "ease-out" });
    w.style.transform = ""; w.style.borderRadius = ""; w.style.transition = "";
  });
  homeBar.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goHome(topWindow()); } });
  // The "‹ Home" title-bar button on phones also uses the animation.
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".window .back");
    if (b && isMobile()) { e.stopPropagation(); e.preventDefault(); goHome(b.closest(".window")); }
  }, true);

  /* ----- Spotlight search (phone home screen, and Ctrl/Cmd + K on a computer) ----- */
  function spotSources() {
    const out = [];
    Object.entries(APPS).filter(([id]) => ["notes", "photos", "preview", "safari", "messages", "mail", "calendar", "finder", "terminal", "settings"].includes(id) && !(isMobile() && id === "terminal")).forEach(([id, a]) => out.push({ g: "Apps", t: id === "preview" ? "CV / Resume" : a.name, s: "", ic: icon(id, 38), go: () => openApp(id) }));
    SITE.notes.forEach((n, i) => { const tx = stripHtml(n.html); out.push({ g: "Notes", t: n.title, s: tx.slice(0, 70), x: tx, ic: icon("notes", 38), go: () => openApp("notes", i) }); });
    SITE.campaigns.forEach((c, i) => out.push({ g: "Projects", t: c.title, s: `${c.type} · ${c.role || ""}`, x: [c.partners, c.desc, c.role].join(" "), ic: `<span class="spot-tile" style="${tileBg(c)}"></span>`, go: () => openDoc("c" + i) }));
    SITE.experience.forEach((e, i) => out.push({ g: "Experience", t: e.role, s: `${e.company} · ${e.dates}`, x: e.points.join(" "), ic: icon("finder", 38), go: () => openDoc("e" + i) }));
    [...new Set((SITE.eventPhotos || []).map((p) => p.event).filter(Boolean))].forEach((ev) => out.push({ g: "Photos", t: ev, s: "Event photos", ic: icon("photos", 38), go: () => openApp("photos") }));
    SYS_PANES.forEach(([k, n]) => out.push({ g: "Settings", t: n, s: "Settings", ic: icon("settings", 38), go: () => openApp("settings", k) }));
    socialList().forEach((x) => out.push({ g: "Links", t: x.name, s: x.url.replace(/^https?:\/\/(www\.)?/, ""), ic: socialIcon(x.key, 38), url: x.url }));
    out.push({ g: "Links", t: `Email ${SITE.short}`, s: SITE.email, ic: socialIcon("email", 38), url: "mailto:" + SITE.email });
    out.push({ g: "Links", t: "Download resume", s: "PDF document", ic: `<span class="fi" style="--fi:38px">${docIcon("#e2483d", "PDF")}</span>`, url: SITE.resume, dl: true });
    return out;
  }
  function openSpotlight() {
    if ($("#spot")) return;
    hideMenu(); hideNC();
    const all = spotSources();
    const ov = el(`<div id="spot" class="${isMobile() ? "mob" : "desk"}"><div class="spot-panel">
      <div class="spot-top"><label class="spot-field">${IOS_IC.search}<input placeholder="Search" aria-label="Search everything" autocomplete="off" spellcheck="false"></label><button class="spot-cancel">Cancel</button></div>
      <div class="spot-results"></div></div></div>`);
    const input = $("input", ov), res = $(".spot-results", ov);
    let shown = [];
    const row = (r, i) => r.url
      ? `<a class="spot-row" data-i="${i}" href="${esc(r.url)}" ${r.dl ? "download" : 'target="_blank" rel="noopener"'}>${r.ic}<span><b>${esc(r.t)}</b><small>${esc(r.s)}</small></span></a>`
      : `<button class="spot-row" data-i="${i}">${r.ic}<span><b>${esc(r.t)}</b><small>${esc(r.s)}</small></span></button>`;
    const draw = () => {
      const q = input.value.trim().toLowerCase();
      if (!q) {
        const apps = ["notes", "photos", "preview", "safari", "messages", "mail", "calendar", "finder", "settings"].filter((id) => APPS[id]);
        shown = all.filter((r) => r.g === "Links");
        res.innerHTML = `<h4 class="spot-h">Siri Suggestions</h4><div class="spot-apps">${apps.map((id) => `<button class="spot-app" data-app="${id}">${icon(id, 56)}<span>${esc(APPS[id].name)}</span></button>`).join("")}</div>
          <h4 class="spot-h">Suggested</h4><div class="spot-group">${shown.map(row).join("")}</div>`;
        return;
      }
      const hits = all.filter((r) => [r.t, r.s, r.x].join(" ").toLowerCase().includes(q));
      shown = [];
      const groups = ["Apps", "Notes", "Projects", "Experience", "Photos", "Settings", "Links"].map((g) => [g, hits.filter((r) => r.g === g).slice(0, 5)]).filter(([, l]) => l.length);
      res.innerHTML = groups.map(([g, l]) => `<h4 class="spot-h">${g}</h4><div class="spot-group">${l.map((r) => { shown.push(r); return row(r, shown.length - 1); }).join("")}</div>`).join("")
        || `<p class="spot-none">No results for “${esc(input.value)}”</p>`;
    };
    const close = () => ov.remove();
    ov.addEventListener("click", (e) => {
      if (e.target === ov || e.target.closest(".spot-cancel")) return close();
      const app = e.target.closest(".spot-app"); if (app) { close(); return openApp(app.dataset.app); }
      const r = e.target.closest(".spot-row"); if (!r) return;
      const item = shown[+r.dataset.i]; close();
      if (item && item.go) { e.preventDefault(); item.go(); }
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
      if (e.key === "Enter") { const first = $(".spot-row", res); if (first) first.click(); }
    });
    input.oninput = draw;
    document.body.append(ov); draw();
    setTimeout(() => input.focus(), 50);
  }
  const spotPill = el(`<button class="m-spot-pill" aria-label="Search">${IOS_IC.search}<span>Search</span></button>`);
  spotPill.onclick = openSpotlight;
  document.body.append(spotPill);
  const spotBtn = el(`<button class="mb-item mb-icon mb-hide mb-spot" aria-label="Spotlight search" title="Spotlight (Ctrl/Cmd + K)">${IOS_IC.search}</button>`);
  spotBtn.onclick = (e) => { e.stopPropagation(); openSpotlight(); };
  const ccAnchor = $('.mb-right [aria-label="Control centre"]');
  if (ccAnchor) ccAnchor.insertAdjacentElement("beforebegin", spotBtn);
  document.addEventListener("keydown", (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openSpotlight(); } });

  /* ----- Messages on a phone (iMessage style) ----- */
  function renderMessagesMobile(body) {
    iosWindow(body);
    const C = convos(); let query = "", busy = false;
    body.innerHTML = `<div class="ios ios-msgs"><div class="ios-scroll">
      <div class="ios-navrow"><span></span><button class="ios-icon-btn blue" data-a="compose" aria-label="New message">${IOS_IC.compose}</button></div>
      <h1 class="ios-large">Messages</h1>
      <label class="ios-search inline">${IOS_IC.search}<input placeholder="Search" aria-label="Search messages"></label>
      <div class="imm-pins"></div><div class="imm-list"></div></div></div>`;
    const root = $(".ios-msgs", body), pins = $(".imm-pins", body), list = $(".imm-list", body), search = $(".ios-search input", body);
    const preview = (c) => { const m = c.msgs[c.msgs.length - 1]; return m ? m.text : ""; };
    const match = (c) => !query || c.name.toLowerCase().includes(query) || c.msgs.some((m) => m.text.toLowerCase().includes(query));
    const drawList = () => {
      pins.innerHTML = C.filter((c) => c.pinned && match(c)).map((c) => `<button class="imm-pin" data-c="${c.id}">${c.unread ? `<span class="imm-peek">${esc(preview(c))}</span>` : ""}
        ${convAvatar(c, "imm-av")}<span class="imm-pin-name">${c.unread ? '<i class="udot"></i>' : ""}<span class="pn">${esc(c.name)}</span></span></button>`).join("");
      list.innerHTML = C.filter((c) => !c.pinned && match(c)).map((c) => `<button class="imm-row" data-c="${c.id}"><i class="udot ${c.unread ? "" : "off"}"></i>${convAvatar(c, "imm-row-av")}
        <div class="imm-txt"><div class="imm-top"><b>${esc(c.name)}</b><small>${fmtListDate(c.time)} ›</small></div><p>${esc(preview(c))}</p></div></button>`).join("")
        || (query && !pins.innerHTML ? `<p class="ios-empty">No results</p>` : "");
    };
    const openConvo = (id) => {
      const c = C[id]; c.unread = false; updateBadge(); drawList();
      const page = iosPush(root, `<div class="imc"><div class="imc-top"><button class="imc-back" data-a="pop" aria-label="Back">${IOS_IC.back}</button>
          <div class="imc-who">${convAvatar(c, "imc-av")}<span class="imc-name">${esc(c.name)} <i>›</i></span></div><span class="imc-sp"></span></div>
        <div class="imc-log" aria-live="polite"></div><div class="imc-quick"></div>
        <form class="imc-input"><button type="button" class="imc-plus" data-a="emoji" aria-label="Emoji">${IOS_IC.plus}</button>
          <label class="imc-field"><input placeholder="iMessage" aria-label="Message" autocomplete="off"><button class="imc-send" aria-label="Send" hidden>↑</button><span class="imc-mic">${IOS_IC.mic}</span></label></form></div>`,
        (pg) => pg.classList.add("imc-page"));
      const log = $(".imc-log", page), quick = $(".imc-quick", page), input = $(".imc-field input", page), sendBtn = $(".imc-send", page), mic = $(".imc-mic", page);
      let bar = null;
      const draw = () => {
        bar = null;
        const lastMe = c.msgs.map((m) => m.who).lastIndexOf("me");
        log.innerHTML = `<div class="imc-stamp">iMessage<br>${isToday(c.time) ? "Today " : ""}${fmtListDate(c.time)}</div>` + c.msgs.map((m, i) => {
          const nx = c.msgs[i + 1], tail = !nx || nx.who !== m.who;
          return `<div class="mrow ${m.who} ${m.react ? "reacted" : ""}" data-i="${i}">${c.group && m.who === "them" && (i === 0 || c.msgs[i - 1].who !== "them") ? `<div class="sender">${esc(SITE.short)}</div>` : ""}
            <div class="bub ${m.who} ${tail ? "tail" : ""}">${m.who === "them" ? linkify(m.text) : esc(m.text)}${m.react ? `<span class="tb-badge ${m.react.by}">${TAPBACKS[m.react.type]}</span>` : ""}</div>
            ${i === lastMe ? `<div class="read">${c.read ? "Read" : "Delivered"}</div>` : ""}</div>`;
        }).join("");
        quick.innerHTML = (c.chat || []).map((q) => `<button type="button">${esc(q.q)}</button>`).join("");
        log.scrollTop = log.scrollHeight;
      };
      const ask = (q) => {
        if (busy || !q.trim()) return;
        $(".emoji-pop", page)?.remove();
        const mine = { who: "me", text: q, react: null };
        c.msgs.push(mine); c.read = false; c.time = Date.now(); ping(660, 990); draw();
        const lower = q.toLowerCase();
        let hit = chatFind(c, lower);
        const answer = hit ? hit.a : (c.fallback || SITE.chatFallback);
        busy = true;
        setTimeout(() => { c.read = true; if (hit && Math.random() < 0.45) mine.react = { by: "them", type: ["heart", "like", "bang"][Math.floor(Math.random() * 3)] }; if (page.isConnected) draw(); }, 700);
        setTimeout(() => { if (page.isConnected) { log.append(el('<div class="mrow them"><div class="bub them tail typing"><i></i><i></i><i></i></div></div>')); log.scrollTop = log.scrollHeight; } }, 950);
        setTimeout(() => {
          c.msgs.push({ who: "them", text: answer, react: null }); c.time = Date.now(); busy = false;
          if (!page.isConnected) c.unread = true;
          updateBadge(); ping(); if (page.isConnected) draw(); else drawList();
        }, 1900 + Math.min(answer.length * 8, 900));
      };
      log.onclick = (e) => {
        const tb = e.target.closest(".tapbar button");
        if (tb) { const m = c.msgs[+tb.closest(".mrow").dataset.i], t = tb.dataset.r; m.react = m.react && m.react.by === "me" && m.react.type === t ? null : { by: "me", type: t }; return draw(); }
        const bub = e.target.closest(".bub:not(.typing)");
        if (!bub || e.target.closest("a")) { bar?.remove(); bar = null; return; }
        const rowEl = bub.closest(".mrow");
        if (bar && bar.parentNode === rowEl) { bar.remove(); bar = null; return; }
        bar?.remove();
        const m = c.msgs[+rowEl.dataset.i];
        bar = el(`<div class="tapbar ${rowEl.classList.contains("me") ? "right" : ""} ${rowEl.offsetTop - log.scrollTop < 70 ? "below" : ""}">${Object.keys(TAPBACKS).map((k) =>
          `<button type="button" data-r="${k}" class="${m.react && m.react.by === "me" && m.react.type === k ? "on" : ""}" aria-label="${k}">${TAPBACKS[k]}</button>`).join("")}</div>`);
        rowEl.append(bar);
      };
      quick.onclick = (e) => { const b = e.target.closest("button"); if (b) ask(b.textContent); };
      input.oninput = () => { const has = !!input.value.trim(); sendBtn.hidden = !has; mic.hidden = has; };
      $(".imc-input", page).onsubmit = (e) => { e.preventDefault(); ask(input.value); input.value = ""; input.oninput(); };
      $('[data-a="emoji"]', page).onclick = (e) => {
        e.stopPropagation();
        const ex = $(".emoji-pop", page); if (ex) return ex.remove();
        const pop = el(`<div class="emoji-pop">${"😀 😂 😍 🔥 👏 🙌 🤝 🚀 💯 🎉 ⚽ 🎬".split(" ").map((x) => `<button type="button">${x}</button>`).join("")}</div>`);
        pop.onclick = (ev) => { ev.stopPropagation(); const b = ev.target.closest("button"); if (b) { input.value += b.textContent; input.oninput(); input.focus(); pop.remove(); } };
        $(".imc-input", page).append(pop);
      };
      draw();
    };
    root.onclick = (e) => {
      const pop = e.target.closest('[data-a="pop"]'); if (pop) return iosPop(pop.closest(".ios-page"), drawList);
      if (e.target.closest('[data-a="compose"]')) return openConvo(0);
      const b = e.target.closest("[data-c]"); if (b && !b.closest(".ios-page")) openConvo(+b.dataset.c);
    };
    search.oninput = () => { query = search.value.trim().toLowerCase(); drawList(); };
    C[0].unread = false; updateBadge(); drawList();
  }

  /* ----- Settings on a phone (iPhone style) ----- */
  function renderSettingsMobile(body, arg) {
    iosWindow(body);
    body.innerHTML = `<div class="ios ios-set"><div class="ios-scroll"><h1 class="ios-large iset-title">Settings</h1><div class="iset-root"></div></div>
      <div class="ios-bottom"><label class="ios-search">${IOS_IC.search}<input placeholder="Search" aria-label="Search settings">${IOS_IC.mic}</label></div></div>`;
    const root = $(".ios-set", body), box = $(".iset-root", body), search = $(".ios-search input", body);
    let query = "", joinMsg = "";
    const tile = (color, svg) => `<span class="iset-ic" style="background:${color}">${svg.startsWith("<svg") ? svg : `<svg viewBox="0 0 24 24">${svg}</svg>`}</span>`;
    const sw = (key, on) => `<button class="toggle ios-toggle ${on ? "on" : ""}" data-tog="${key}" aria-label="${key}" aria-pressed="${!!on}"></button>`;
    const cell = (o) => `<${o.toggle !== undefined ? "div" : "button"} class="iset-cell" ${o.k ? `data-k="${o.k}"` : ""}>${o.ic || ""}<span class="iset-label">${esc(o.label)}</span>
      ${o.value ? `<span class="iset-val">${esc(o.value)}</span>` : ""}${o.badge ? `<span class="iset-badge">${o.badge}</span>` : ""}${o.toggle !== undefined ? sw(o.tkey, o.toggle) : '<span class="iset-chev">›</span>'}</${o.toggle !== undefined ? "div" : "button"}>`;
    const W = () => Object.assign({ network: `${SITE.short}-5G`, hotspot: `${SITE.short}'s iPhone`, others: [] }, SITE.wifi || {});
    const TITLES = { account: SITE.name, wifi: "Wi-Fi", bluetooth: "Bluetooth", battery: "Battery", general: "General", display: "Display & Brightness", wallpaper: "Wallpaper", focus: "Focus", social: "Social Links" };
    const drawRoot = () => {
      const q = query.toLowerCase();
      const groups = [
        [
          { k: "account", raw: `<button class="iset-cell iset-acct" data-k="account">${avatar()}<span class="iset-label"><b>${esc(SITE.name)}</b><small>ARSHAON · arshaon.com</small></span><span class="iset-chev">›</span></button>`, label: SITE.name },
        ],
        [
          { label: "Airplane Mode", ic: tile("#ff9500", IOS_IC.plane), toggle: !!prefs.airplane, tkey: "airplane" },
          { k: "wifi", label: "Wi-Fi", ic: tile("#0a84ff", SYS_IC.wifi), value: prefs.wifi ? W().network : "Off" },
          { k: "bluetooth", label: "Bluetooth", ic: tile("#0a84ff", SYS_IC.bluetooth), value: prefs.bt ? "On" : "Off" },
          { k: "battery", label: "Battery", ic: tile("#34c759", '<rect x="3" y="8" width="16" height="8" rx="2"/><path d="M21 11v2"/><rect x="5" y="10" width="10" height="4" rx="1" fill="#fff" stroke="none"/>') },
        ],
        [
          { k: "general", label: "General", ic: tile("#8e8e93", SYS_IC.general) },
          { k: "display", label: "Display & Brightness", ic: tile("#0a84ff", '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>') },
          { k: "wallpaper", label: "Wallpaper", ic: tile("#32ade6", SYS_IC.wallpaper) },
          { k: "focus", label: "Focus", ic: tile("#5e5ce6", SYS_IC.focus), value: prefs.focus ? "On" : "" },
          { k: "social", label: "Social Links", ic: tile("#ff375f", '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>') },
        ],
        ["notes", "messages", "photos", "calendar", "preview"].filter((id) => APPS[id]).map((id) => ({ k: "app:" + id, label: APPS[id].name, ic: icon(id, 30) })),
      ];
      box.innerHTML = groups.map((g) => g.filter((o) => !q || o.label.toLowerCase().includes(q))).filter((g) => g.length)
        .map((g) => `<div class="ios-group">${g.map((o) => o.raw || cell(o)).join("")}</div>`).join("") || `<p class="ios-empty">No results</p>`;
    };
    const pageHTML = (k) => {
      const m = macInfo(), w = W();
      if (k === "account") return `<div class="iset-hero">${avatar("big")}<h2>${esc(SITE.name)}</h2><p>ARSHAON · arshaon.com</p></div>
        <div class="ios-group">
          <a class="iset-cell" href="mailto:${esc(SITE.email)}"><span class="iset-label">Email</span><span class="iset-val">${esc(SITE.email)}</span></a>
          <a class="iset-cell" data-open="preview"><span class="iset-label">CV / Resume</span><span class="iset-val">Open PDF</span><span class="iset-chev">›</span></a>
          <a class="iset-cell" data-open="safari" data-arg="linkedin"><span class="iset-label">LinkedIn</span><span class="iset-val">ashikurrahmanshaon</span><span class="iset-chev">›</span></a>
        </div>`;
      if (k === "wifi") return `<div class="ios-group">${cell({ label: "Wi-Fi", toggle: prefs.wifi, tkey: "wifi" })}${prefs.wifi ? `<div class="iset-cell"><span class="iset-check">✓</span><span class="iset-label">${esc(w.network)}</span><span class="iset-val">🔒</span></div>` : ""}</div>
        ${prefs.wifi && w.others.length ? `<h4 class="iset-h">Other Networks</h4><div class="ios-group">${w.others.map((n) => `<button class="iset-cell" data-join="${esc(n)}"><span class="iset-label">${esc(n)}</span><span class="iset-val">🔒</span></button>`).join("")}</div>` : ""}
        <p class="iset-note">${esc(joinMsg)}</p>`;
      if (k === "bluetooth") return `<div class="ios-group">${cell({ label: "Bluetooth", toggle: prefs.bt, tkey: "bt" })}</div>
        <p class="iset-note">This iPhone is discoverable as “${esc(m.deviceName)}” while Bluetooth Settings is open.</p>
        ${prefs.bt ? `<h4 class="iset-h">My Devices</h4><div class="ios-group">${btDevices().map((d, i) => `<button class="iset-cell" data-bt="${i}"><span class="iset-label">${esc(d.name)}</span><span class="iset-val">${d.connected ? "Connected" : "Not Connected"}</span></button>`).join("")}</div>` : ""}`;
      if (k === "battery") return `<div class="ios-group iset-batt"><div class="iset-batt-big">${Math.round(batt.level * 100)}%</div><small>${batt.charging ? "Charging" : "On battery"}</small></div>
        <div class="ios-group">${cell({ label: "Low Power Mode", toggle: !!prefs.lowPower, tkey: "lowPower" })}</div>
        <p class="iset-note">Low Power Mode turns off animations on this website.</p>`;
      if (k === "general") return `<div class="iset-hero">${avatar("big")}<h2>${esc(SITE.name)}</h2><p>ARSHAON · arshaon.com</p></div>
        <div class="ios-group">
          <div class="iset-cell"><span class="iset-label">Name</span><span class="iset-val wrap">${esc(SITE.name)}</span></div>
          <div class="iset-cell"><span class="iset-label">Brand</span><span class="iset-val wrap">ARSHAON</span></div>
          <div class="iset-cell"><span class="iset-label">Role</span><span class="iset-val wrap">Founder &amp; Digital Strategist</span></div>
          <div class="iset-cell"><span class="iset-label">Location</span><span class="iset-val wrap">${esc(SITE.location)}</span></div>
        </div>
        <div class="ios-group"><div class="iset-cell"><span class="iset-label">Software Update</span><span class="iset-val">Up to date</span></div></div>`;
      if (k === "display") return `<h4 class="iset-h">Appearance</h4><div class="ios-group"><div class="iset-looks">${["light", "dark"].map((t) => `<button class="iset-look ${prefs.theme === t ? "on" : ""}" data-theme-set="${t}"><span class="iset-phone ${t}"></span><span>${t === "light" ? "Light" : "Dark"}</span><i>${prefs.theme === t ? "✓" : ""}</i></button>`).join("")}</div>
          ${cell({ label: "Automatic", toggle: prefs.theme === "auto", tkey: "autotheme" })}</div>
        <h4 class="iset-h">Accent Colour</h4><div class="ios-group"><div class="iset-accents">${Object.entries(ACCENTS).map(([a, c]) => `<button class="accent ${prefs.accent === a ? "on" : ""}" data-accent="${a}" style="background:${c}" aria-label="${a}"></button>`).join("")}</div></div>
        <h4 class="iset-h">Brightness</h4><div class="ios-group"><div class="cc-slider iset-slider">${SM_IC.sunS}<input type="range" min="0.4" max="1" step="0.01" value="${prefs.brightness}" data-range="brightness" aria-label="Brightness">${SM_IC.sunL}</div></div>`;
      if (k === "wallpaper" && usePhoneWalls()) return phoneWallPage();
      if (k === "wallpaper") { const id = currentWallId(), cur = wallById(id), all = allWalls();
        return `<div class="iset-wall-now"><span class="iset-wall-phone" style="background:${cur.css}"></span><span class="iset-wall-phone home" style="background:${cur.css}"></span></div>
          <h4 class="iset-h">Choose a Wallpaper</h4><div class="iset-walls">${Object.entries(all).map(([key, x]) => `<button class="iset-wall ${id === key ? "on" : ""}" data-wall="${key}"><span style="background:${x.thumb || x.css}"></span><small>${esc(x.name)}</small></button>`).join("")}</div>`; }
      if (k === "focus") return `<div class="ios-group">${cell({ label: "Do Not Disturb", ic: tile("#5e5ce6", SYS_IC.focus), toggle: prefs.focus, tkey: "focus" })}</div><p class="iset-note">Silences message sounds and shows a moon in the status bar.</p>`;
      if (k === "social") return socialList().length ? `<div class="ios-group">${socialList().map((x) => `<a class="iset-cell" href="${esc(x.url)}" target="_blank" rel="noopener">${socialIcon(x.key, 30)}<span class="iset-label">${esc(x.name)}<small>${esc(x.url.replace(/^https?:\/\/(www\.)?/, ""))}</small></span><span class="iset-chev">↗</span></a>`).join("")}</div>` : `<p class="ios-empty">No social links yet.</p>`;
      return "";
    };
    const openPage = (k, instant) => {
      const pg = iosPush(root, `${iosTop("Settings")}<div class="ios-page-body"><h1 class="ios-large iset-ptitle">${esc(TITLES[k] || "")}</h1><div class="iset-pbody">${pageHTML(k)}</div></div>`);
      pg.dataset.k = k; if (instant) pg.classList.add("in");
    };
    const refresh = () => { drawRoot(); $$(".ios-page", root).forEach((pg) => { const st = $(".ios-page-body", pg).scrollTop; $(".iset-pbody", pg).innerHTML = pageHTML(pg.dataset.k); $(".ios-page-body", pg).scrollTop = st; }); };
    root.onclick = (e) => {
      const t = e.target;
      const pop = t.closest('[data-a="pop"]'); if (pop) return iosPop(pop.closest(".ios-page"), drawRoot);
      const tg = t.closest("[data-tog]");
      if (tg) {
        const k = tg.dataset.tog;
        if (k === "airplane") {
          prefs.airplane = !prefs.airplane;
          if (prefs.airplane) { prefs.preWifi = prefs.wifi; prefs.preBt = prefs.bt; prefs.wifi = false; prefs.bt = false; }
          else { prefs.wifi = prefs.preWifi !== false; prefs.bt = prefs.preBt !== false; }
        } else if (k === "autotheme") { prefs.theme = prefs.theme === "auto" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : "auto"; applyTheme(); }
        else { prefs[k] = !prefs[k]; if ((k === "wifi" || k === "bt") && prefs[k]) prefs.airplane = false; }
        savePrefs(); applyMenuPrefs(); applyDisplay(); return refresh();
      }
      const th = t.closest("[data-theme-set]"); if (th) { prefs.theme = th.dataset.themeSet; applyTheme(); savePrefs(); return refresh(); }
      const ac = t.closest("[data-accent]"); if (ac) { prefs.accent = ac.dataset.accent; applyAccent(); savePrefs(); return refresh(); }
      const pw = t.closest("[data-pwall]"); if (pw) { prefs.phoneWall = pw.dataset.pwall; applyWall(); savePrefs(); return refresh(); }
      const wl = t.closest("[data-wall]"); if (wl) { prefs.wall = wl.dataset.wall; applyWall(); savePrefs(); return refresh(); }
      const bt = t.closest("[data-bt]"); if (bt) { const d = btDevices()[+bt.dataset.bt]; d.connected = !d.connected; return refresh(); }
      const jn = t.closest("[data-join]"); if (jn) { joinMsg = `“${jn.dataset.join}” is password protected. Nice try 😉`; return refresh(); }
      if (t.closest('[data-act="signout"]')) return lock();
      const c = t.closest("[data-k]"); if (!c) return;
      const k = c.dataset.k;
      if (k === "hire") return openApp("hire");
      if (k.startsWith("app:")) return openApp(k.slice(4));
      openPage(k);
    };
    root.oninput = (e) => {
      const r = e.target.closest("[data-range]");
      if (r) { prefs[r.dataset.range] = +r.value; applyDisplay(); savePrefs(); return; }
      if (e.target === search) { query = search.value.trim(); drawRoot(); }
    };
    drawRoot();
    const alias = { appearance: "display", menubar: "display", clock: "display", dock: "general", about: "general" };
    const start = alias[arg] || arg;
    if (start && TITLES[start] && start !== "account") openPage(start, true);
  }

  /* ----- Calendar on a phone (iPhone style) ----- */
  function renderCalendarMobile(body) {
    iosWindow(body);
    const today = new Date(), todayKey = iso(today);
    const hidden = Object.assign({ holiday: false, owner: false, mine: false }, prefs.calHidden || {});
    const first = new Date(today.getFullYear(), today.getMonth() - 6, 1), MONTHS_N = 19;
    const monthAt = (n) => new Date(first.getFullYear(), first.getMonth() + n, 1);
    const evs = (key) => eventsOn(key).filter((e) => !hidden[e.kind]);
    let sel = todayKey;
    body.innerHTML = `<div class="ios ios-cal">
      <div class="cm-head">
        <div class="cm-top"><button class="cm-glass cm-year" data-a="year">${IOS_IC.back}<span>${today.getFullYear()}</span></button>
          <div class="cm-glass cm-tools"><button data-a="list" aria-label="Upcoming events">${IOS_IC.list}</button><button data-a="search" aria-label="Search events">${IOS_IC.search}</button><button data-a="add" aria-label="Add event">${IOS_IC.plus}</button></div></div>
        <h1 class="ios-large cm-title"></h1>
        <div class="cm-wd">${"SMTWTFS".split("").map((d) => `<span>${d}</span>`).join("")}</div></div>
      <div class="cm-scroll"></div>
      <div class="cm-bottom"><button class="cm-glass cm-today" data-a="today">Today</button>
        <div class="cm-glass cm-tools"><button data-a="cals" aria-label="Calendars">${IOS_IC.cal}</button><button data-a="inbox" aria-label="Inbox">${IOS_IC.inbox}</button></div></div></div>`;
    const root = $(".ios-cal", body), scroller = $(".cm-scroll", body);
    const monthHTML = (n) => {
      const m = monthAt(n), y = m.getFullYear(), mo = m.getMonth(), days = new Date(y, mo + 1, 0).getDate(), lead = m.getDay();
      let cells = "";
      for (let i = 0; i < lead; i++) cells += '<span class="cm-blank"></span>';
      for (let d = 1; d <= days; d++) {
        const key = iso(new Date(y, mo, d)), dow = (lead + d - 1) % 7, ev = evs(key);
        cells += `<button class="cm-day ${dow === 0 || dow === 6 ? "wknd" : ""} ${key === todayKey ? "today" : ""} ${key === sel ? "sel" : ""}" data-d="${key}">
          <span class="cm-num">${d}</span>${ev.slice(0, 2).map((e) => `<span class="cm-chip ${e.kind}">${e.kind === "holiday" ? "★ " : ""}${esc(e.title)}</span>`).join("")}${ev.length > 2 ? `<span class="cm-more">+${ev.length - 2}</span>` : ""}</button>`;
      }
      return `<section class="cm-month" data-n="${n}" data-label="${m.toLocaleDateString("en-US", { month: "long" })}" data-year="${y}">
        <h3 class="cm-mlabel ${y === today.getFullYear() && mo === today.getMonth() ? "now" : ""}">${m.toLocaleDateString("en-US", { month: "short" })}</h3><div class="cm-grid">${cells}</div></section>`;
    };
    const drawMonths = () => { const st = scroller.scrollTop; scroller.innerHTML = Array.from({ length: MONTHS_N }, (_, n) => monthHTML(n)).join(""); scroller.scrollTop = st; };
    const updateTitle = () => {
      const secs = $$(".cm-month", scroller), top = scroller.scrollTop + 8;
      let cur = secs[0];
      secs.forEach((s) => { if (s.offsetTop <= top) cur = s; });
      if (!cur) return;
      $(".cm-title", body).textContent = cur.dataset.label;
      $(".cm-year span", body).textContent = cur.dataset.year;
    };
    const scrollToMonth = (y, mo, smooth) => {
      const n = (y - first.getFullYear()) * 12 + (mo - first.getMonth());
      const s = $(`.cm-month[data-n="${clamp(n, 0, MONTHS_N - 1)}"]`, scroller);
      if (s) scroller.scrollTo({ top: s.offsetTop, behavior: smooth ? "smooth" : "auto" });
      updateTitle();
    };
    scroller.onscroll = updateTitle;
    const longDate = (key) => new Date(key + "T00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const dayBody = (key) => {
      const list = evs(key);
      return `<h1 class="ios-large cm-daytitle">${new Date(key + "T00:00").toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })}</h1><p class="ios-sub">${longDate(key)}</p>
        <div class="ios-group">${list.length ? list.map((e) => `<div class="cm-ev ${e.kind}"><i></i><span class="cm-ev-time">${e.time ? esc(e.time) : "all-day"}</span><span class="cm-ev-t"><b>${esc(e.title)}</b>${e.note ? `<small>${esc(e.note)}</small>` : ""}</span>${e.kind === "mine" ? `<button class="cm-del" data-del="${e.i}" aria-label="Delete event">×</button>` : ""}</div>`).join("") : '<p class="cm-noev">No Events</p>'}</div>
        <h4 class="iset-h">New Event</h4><form class="ios-group cm-add"><input name="t" placeholder="Title" aria-label="Event title" required><input name="h" type="time" aria-label="Time"><button class="cm-add-btn">Add</button></form>
        <p class="iset-note">Events you add are saved on this device only.</p>`;
    };
    const openDay = (key, focus) => {
      sel = key; drawMonths();
      const m = new Date(key + "T00:00").toLocaleDateString("en-US", { month: "long" });
      const pg = iosPush(root, `${iosTop(m)}<div class="ios-page-body cm-daybody">${dayBody(key)}</div>`);
      pg.dataset.day = key;
      if (focus) setTimeout(() => { const i = $(".cm-add input", pg); if (i) i.focus(); }, 320);
    };
    const refreshDays = () => { drawMonths(); $$(".ios-page[data-day]", root).forEach((pg) => { $(".cm-daybody", pg).innerHTML = dayBody(pg.dataset.day); }); };
    const allEvents = () => { const out = []; for (let n = 0; n < MONTHS_N; n++) { const m = monthAt(n), days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate(); for (let d = 1; d <= days; d++) { const key = iso(new Date(m.getFullYear(), m.getMonth(), d)); evs(key).forEach((e) => out.push({ key, ...e })); } } return out; };
    const evRows = (list) => list.length ? `<div class="ios-group">${list.map((e) => `<button class="cm-ev ${e.kind}" data-open-day="${e.key}"><i></i><span class="cm-ev-time">${new Date(e.key + "T00:00").toLocaleDateString("en-US", { day: "numeric", month: "short" })}</span><span class="cm-ev-t"><b>${esc(e.title)}</b><small>${e.time ? esc(e.time) : "all-day"}</small></span></button>`).join("")}</div>` : '<p class="ios-empty">No events</p>';
    const yearPage = (y) => `<div class="cm-yearnav"><button data-yr="${y - 1}" ${y - 1 < first.getFullYear() ? "disabled" : ""}>‹</button><h1 class="ios-large">${y}</h1><button data-yr="${y + 1}" ${y + 1 > monthAt(MONTHS_N - 1).getFullYear() ? "disabled" : ""}>›</button></div>
      <div class="cm-years">${Array.from({ length: 12 }, (_, mo) => {
        const m = new Date(y, mo, 1), days = new Date(y, mo + 1, 0).getDate(), n = (y - first.getFullYear()) * 12 + (mo - first.getMonth()), inRange = n >= 0 && n < MONTHS_N;
        let g = ""; for (let i = 0; i < m.getDay(); i++) g += "<i></i>";
        for (let d = 1; d <= days; d++) g += `<i class="${iso(new Date(y, mo, d)) === todayKey ? "t" : ""}">${d}</i>`;
        return `<button class="cm-mini ${inRange ? "" : "off"}" ${inRange ? `data-goto="${y}-${mo}"` : "disabled"}><b class="${y === today.getFullYear() && mo === today.getMonth() ? "now" : ""}">${m.toLocaleDateString("en-US", { month: "short" })}</b><span>${g}</span></button>`;
      }).join("")}</div>`;
    root.onclick = (e) => {
      const t = e.target;
      const pop = t.closest('[data-a="pop"]'); if (pop) return iosPop(pop.closest(".ios-page"));
      const d = t.closest(".cm-day"); if (d) return openDay(d.dataset.d);
      const od = t.closest("[data-open-day]"); if (od) return openDay(od.dataset.openDay);
      const del = t.closest("[data-del]");
      if (del) { const pg = del.closest(".ios-page"), key = pg.dataset.day; myEvents[key].splice(+del.dataset.del, 1); if (!myEvents[key].length) delete myEvents[key]; saveMyEvents(); return refreshDays(); }
      const go = t.closest("[data-goto]");
      if (go) { const [y, mo] = go.dataset.goto.split("-").map(Number); iosPop(go.closest(".ios-page")); return scrollToMonth(y, mo, false); }
      const yr = t.closest("[data-yr]"); if (yr) { const pg = yr.closest(".ios-page"); $(".ios-page-body", pg).innerHTML = yearPage(+yr.dataset.yr); return; }
      const hc = t.closest("[data-hide]"); if (hc) { const k = hc.dataset.hide; hidden[k] = !hidden[k]; prefs.calHidden = { ...hidden }; savePrefs(); hc.classList.toggle("off", hidden[k]); return drawMonths(); }
      const a = t.closest("[data-a]")?.dataset.a; if (!a) return;
      if (a === "today") return scrollToMonth(today.getFullYear(), today.getMonth(), true);
      if (a === "add") return openDay(sel || todayKey, true);
      if (a === "year") return iosPush(root, `${iosTop("Back")}<div class="ios-page-body">${yearPage(+$(".cm-year span", body).textContent)}</div>`);
      if (a === "list") { const up = allEvents().filter((x) => x.key >= todayKey).slice(0, 40); return iosPush(root, `${iosTop("Back")}<div class="ios-page-body"><h1 class="ios-large">Upcoming</h1><p class="ios-sub">Holidays and events</p>${evRows(up)}</div>`); }
      if (a === "search") return iosPush(root, `${iosTop("Back")}<div class="ios-page-body"><label class="ios-search big">${IOS_IC.search}<input placeholder="Search events" aria-label="Search events"></label><div class="cm-sres"></div></div>`, (pg) => {
        const inp = $("input", pg), out = $(".cm-sres", pg), evAll = allEvents();
        const run = () => { const q = inp.value.trim().toLowerCase(); out.innerHTML = q ? evRows(evAll.filter((x) => [x.title, x.note].join(" ").toLowerCase().includes(q))) : '<p class="ios-empty">Search holidays and events</p>'; };
        inp.oninput = run; run(); setTimeout(() => inp.focus(), 300);
      });
      if (a === "cals") return iosPush(root, `${iosTop("Back")}<div class="ios-page-body"><h1 class="ios-large">Calendars</h1><p class="ios-sub">Tap to show or hide</p>
        <div class="ios-group">${[["holiday", "Holidays (UAE & Bangladesh)"], ["owner", `${SITE.short}'s events`], ["mine", "My events"]].map(([k, n]) => `<button class="iset-cell cm-cal ${hidden[k] ? "off" : ""}" data-hide="${k}"><i class="cm-dot ${k}"></i><span class="iset-label">${esc(n)}</span><span class="iset-check">✓</span></button>`).join("")}</div></div>`);
      if (a === "inbox") return iosPush(root, `${iosTop("Back")}<div class="ios-page-body"><h1 class="ios-large">Inbox</h1><p class="ios-sub">Invitations</p>
        <div class="ios-empty"><div style="font-size:44px">📭</div><p>No new invitations</p></div>
        <a class="cm-invite" href="mailto:${esc(SITE.email)}?subject=${encodeURIComponent("Hello " + SITE.short)}">Get in touch with ${esc(SITE.short)}</a></div>`);
    };
    root.addEventListener("submit", (e) => {
      const f = e.target.closest(".cm-add"); if (!f) return;
      e.preventDefault();
      const key = f.closest(".ios-page").dataset.day, title = f.t.value.trim(); if (!title) return;
      (myEvents[key] = myEvents[key] || []).push({ title, time: f.h.value }); saveMyEvents(); refreshDays();
    });
    drawMonths();
    requestAnimationFrame(() => scrollToMonth(today.getFullYear(), today.getMonth(), false));
    setTimeout(() => scrollToMonth(today.getFullYear(), today.getMonth(), false), 120);
  }

  /* =====================================================================
     LAUNCHPAD / APP LIBRARY: one icon that shows every app and link
     ===================================================================== */
  ICONS.launchpad = '<defs><linearGradient id="ic-lp-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4252"/><stop offset="1" stop-color="#171b24"/></linearGradient></defs>' +
    SQ("url(#ic-lp-bg)") + '<g filter="url(#ic-sh)">' +
    [[20, 20, "#ff5f57"], [42.5, 20, "#febc2e"], [65, 20, "#28c840"], [20, 42.5, "#32ade6"], [42.5, 42.5, "#bf5af2"], [65, 42.5, "#ff375f"], [20, 65, "#0a84ff"], [42.5, 65, "#ffd60a"], [65, 65, "#30d158"]]
    .map(([x, y, c]) => `<rect x="${x}" y="${y}" width="15" height="15" rx="4.2" fill="${c}" stroke="rgba(255,255,255,.35)" stroke-width=".8"/>`).join("") +
    '</g>' + GLOSS + '<rect x="1" y="1" width="98" height="98" rx="22" fill="none" stroke="rgba(255,255,255,.42)" stroke-width="1.4"/>';
  function lpItems() {
    const apps = Object.entries(APPS).filter(([id]) => ["finder", "safari", "messages", "mail", "photos", "notes", "calendar", "preview", "terminal", "settings", "trash"].includes(id)).map(([id, a]) => ({ name: id === "preview" ? "CV" : a.name, app: id, ic: (s) => icon(id, s) }));
    const links = socialList().map((x) => ({ name: x.name, url: x.url, ic: (s) => socialIcon(x.key, s) }));
    return { apps, links };
  }
  function closeLaunchpad() { const o = $("#lp"); if (o) o.remove(); }
  function openLaunchpad() {
    if ($("#lp")) return closeLaunchpad();
    hideMenu(); hideNC();
    const { apps, links } = lpItems(), mob = isMobile();
    const tile = (it, s) => it.url
      ? `<a class="lp-app" href="${esc(it.url)}" ${it.dl ? "download" : 'target="_blank" rel="noopener"'} title="${esc(it.name)}">${it.ic(s)}<span class="lp-label">${esc(it.name)}</span></a>`
      : `<button class="lp-app" data-app="${it.app}" title="${esc(it.name)}">${it.ic(s)}<span class="lp-label">${esc(it.name)}</span></button>`;
    // Phone App Library groups (any app not listed here is added to "More").
    const GROUPS = [["Portfolio", ["notes", "photos", "finder", "hire"]], ["Connect", ["messages", "mail", "calendar", "music"], true], ["Utilities", ["settings", "terminal", "trash"]]];
    const listed = GROUPS.flatMap((g) => g[1]), extra = apps.filter((a) => !listed.includes(a.app)).map((a) => a.app);
    if (extra.length) GROUPS.push(["More", extra]);
    const ov = el(`<div id="lp" class="${mob ? "mob" : "desk"}" role="dialog" aria-label="All apps"><div class="lp-inner">
      <label class="lp-search">${IOS_IC.search}<input placeholder="${mob ? "App Library" : "Search"}" aria-label="Search apps and links" autocomplete="off"></label>
      <div class="lp-body"></div></div></div>`);
    const body = $(".lp-body", ov), input = $("input", ov);
    const draw = () => {
      const q = input.value.trim().toLowerCase();
      if (q || !mob) {
        const list = [...apps, ...links].filter((it) => !q || it.name.toLowerCase().includes(q));
        body.innerHTML = list.length ? `<div class="lp-grid">${list.map((it) => tile(it, mob ? 60 : 84)).join("")}</div>` : '<p class="lp-none">No results</p>';
        return;
      }
      body.innerHTML = `<div class="lp-groups">${GROUPS.map(([name, ids, withLinks]) => {
        const items = ids.filter((id) => APPS[id]).map((id) => apps.find((a) => a.app === id)).concat(withLinks ? links : []);
        return items.length ? `<div class="lp-group"><div class="lp-box">${items.map((it) => tile(it, 52)).join("")}</div><b>${esc(name)}</b></div>` : "";
      }).join("")}</div>`;
    };
    ov.addEventListener("pointerdown", (e) => { const t = e.target.closest(".lp-app"); if (t) { const ic = $(".appicon, .fi", t) || t; launchRect = ic.getBoundingClientRect(); } });
    ov.addEventListener("click", (e) => {
      const b = e.target.closest(".lp-app");
      if (!b) { if (!e.target.closest(".lp-search")) closeLaunchpad(); return; }
      if (b.dataset.app) { e.preventDefault(); const r = launchRect; closeLaunchpad(); launchRect = r; openApp(b.dataset.app); }
      else closeLaunchpad();
    });
    input.oninput = draw;
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") { const first = $(".lp-app", body); if (first) first.click(); } });
    document.body.append(ov); draw();
    if (!mob) setTimeout(() => input.focus(), 50);
  }
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLaunchpad(); });
  // Launchpad in the Mac dock (right after Finder) and App Library on the phone home screen.
  const buildDockLp = buildDock;
  buildDock = () => {
    buildDockLp();
    const finder = $('#dock .dock-item[data-app="finder"]');
    const lp = el(`<button class="dock-item" data-lp aria-label="Launchpad"><span class="tip">Launchpad</span>${icon("launchpad", 50)}<span class="run"></span></button>`);
    lp.addEventListener("click", openLaunchpad);
    if (finder) finder.insertAdjacentElement("afterend", lp); else $("#dock").prepend(lp);
  };
  const buildDesktopLp = buildDesktop;
  buildDesktop = () => { buildDesktopLp(); updateBadge(); };
  const helpLp = MENUS.help;
  MENUS.help = () => [...helpLp(), "-", ["Show All Apps (Launchpad)", openLaunchpad]];

  /* =====================================================================
     MUSIC APP: plays Spotify / Apple Music / YouTube / SoundCloud playlists
     through the service's own official player (legal streaming embeds)
     ===================================================================== */
  const MUSIC_SERVICES = { "Spotify": "#1db954", "Apple Music": "#fa243c", "YouTube": "#ff0000", "SoundCloud": "#ff5500" };
  // Turns a normal share link (or a pasted embed code) into the official player address.
  function embedFor(raw) {
    let u = String(raw || "").trim();
    const m = u.match(/src=["']([^"']+)["']/i); if (m) u = m[1];
    let url; try { url = new URL(u); } catch { return null; }
    const h = url.hostname.replace(/^www\./, "");
    if (h.endsWith("spotify.com")) {
      const parts = url.pathname.split("/").filter(Boolean).filter((x) => !x.startsWith("intl-"));
      if (parts[0] === "embed") parts.shift();
      const [type, id] = parts; if (!type || !id) return null;
      return { service: "Spotify", src: `https://open.spotify.com/embed/${type}/${id}?utm_source=generator`, h: type === "track" ? 152 : 452, open: `https://open.spotify.com/${type}/${id}` };
    }
    if (h === "music.apple.com" || h === "embed.music.apple.com")
      return { service: "Apple Music", src: "https://embed.music.apple.com" + url.pathname + url.search, h: url.searchParams.get("i") ? 175 : 450, open: "https://music.apple.com" + url.pathname + url.search };
    if (h === "youtu.be") return { service: "YouTube", src: `https://www.youtube.com/embed/${encodeURIComponent(url.pathname.slice(1))}`, video: true, open: u };
    if (h.endsWith("youtube.com") || h.endsWith("youtube-nocookie.com")) {
      const list = url.searchParams.get("list"), v = url.searchParams.get("v");
      if (url.pathname.startsWith("/embed/")) return { service: "YouTube", src: u, video: true, open: u };
      if (v) return { service: "YouTube", src: `https://www.youtube.com/embed/${encodeURIComponent(v)}${list ? `?list=${encodeURIComponent(list)}` : ""}`, video: true, open: u };
      if (list) return { service: "YouTube", src: `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(list)}`, video: true, open: u };
      return null;
    }
    if (h.endsWith("soundcloud.com")) {
      if (h === "w.soundcloud.com") return { service: "SoundCloud", src: u, h: 450, open: u };
      return { service: "SoundCloud", src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(u)}&color=%23ff5500&visual=true&show_comments=false`, h: 450, open: u };
    }
    return null;
  }
  const playlists = () => (SITE.playlists || []).filter((p) => p && p.url).map((p, i) => ({ ...p, i, e: embedFor(p.url) }));
  const musicCover = (p) => p.cover ? `background-image:${cssUrl(p.cover)}` : `background:linear-gradient(135deg, ${MUSIC_SERVICES[p.e && p.e.service] || "#fa243c"}, #1c1c1e)`;
  const musicPlayer = (p) => !p.e
    ? `<div class="mu-bad"><b>This link isn't recognised.</b><p>Paste a <b>Share</b> link from Spotify, Apple Music, YouTube or SoundCloud into <code>playlists</code> in content.js.</p></div>`
    : `<div class="mu-player ${p.e.video ? "video" : ""}" ${p.e.video ? "" : `style="height:${p.e.h}px"`}><iframe src="${esc(p.e.src)}" title="${esc(p.name || "Music player")}" loading="lazy" allow="autoplay *; clipboard-write; encrypted-media *; fullscreen *; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>
      <p class="mu-note">Plays through ${esc(p.e.service)}. Listeners signed in to ${esc(p.e.service)} hear full songs; others may hear previews.</p>`;
  const musicEmpty = `<div class="empty"><div style="font-size:42px">🎵</div><h3>No playlists yet</h3><p>Add a Spotify, Apple Music, YouTube or SoundCloud share link under <code>playlists</code> in content.js.</p></div>`;
  ICONS.music = '<defs><linearGradient id="ic-music" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6b81"/><stop offset="1" stop-color="#fa243c"/></linearGradient></defs>' +
    SQ("url(#ic-music)") + '<path filter="url(#ic-sh)" d="M66 22v40a10.5 10.5 0 1 1-6-9.5V36l-23 5.5V70a10.5 10.5 0 1 1-6-9.5V30z" fill="#fff"/>' + GLOSS;
  APPS.music = { name: "Music", w: 920, h: 660, mobile: false, render: renderMusic };
  if ((SITE.playlists || []).length) DOCK.splice(DOCK.indexOf("photos") + 1, 0, "music");

  function renderMusic(body) {
    if (isMobile()) return renderMusicMobile(body);
    const list = playlists(); let cur = 0;
    if (!list.length) { body.innerHTML = musicEmpty; return; }
    body.innerHTML = `<div class="split mu show-main"><aside class="side mu-side"><h5>Playlists</h5><div class="mu-list"></div></aside><div class="main mu-main"></div></div>`;
    const side = $(".mu-list", body), main = $(".mu-main", body);
    const draw = () => {
      side.innerHTML = list.map((p, i) => `<button class="mu-row ${i === cur ? "active" : ""}" data-i="${i}"><span class="mu-thumb" style="${musicCover(p)}">${p.cover ? "" : "♪"}</span><span><b>${esc(p.name || "Playlist")}</b><small>${esc(p.e ? p.e.service : "Unknown link")}</small></span></button>`).join("");
      const p = list[cur];
      main.innerHTML = `<div class="mu-head"><span class="mu-cover" style="${musicCover(p)}">${p.cover ? "" : "♪"}</span><div class="mu-info">
          <span class="mu-kicker">${esc(p.e ? p.e.service : "Playlist")}</span><h1>${esc(p.name || "Playlist")}</h1>${p.note ? `<p>${esc(p.note)}</p>` : ""}
          <div class="mu-actions">${p.e && p.e.open ? `<a class="btn" href="${esc(p.e.open)}" target="_blank" rel="noopener">Open in ${esc(p.e.service)} ↗</a>` : ""}<button class="btn" data-stop>Stop music</button></div></div></div>
        ${musicPlayer(p)}`;
    };
    side.onclick = (e) => { const r = e.target.closest("[data-i]"); if (r && +r.dataset.i !== cur) { cur = +r.dataset.i; draw(); } };
    main.onclick = (e) => { if (e.target.closest("[data-stop]")) { const w = body.closest(".window"); w._reallyClose = true; closeWin(w); } };
    draw();
  }
  function renderMusicMobile(body) {
    iosWindow(body);
    const list = playlists();
    body.innerHTML = `<div class="ios ios-music"><div class="ios-scroll"><h1 class="ios-large">Music</h1><p class="ios-sub">${list.length ? `${list.length} playlist${list.length === 1 ? "" : "s"}` : ""}</p>
      ${list.length ? `<div class="mu-cards">${list.map((p) => `<button class="mu-card" data-i="${p.i}"><span class="mu-cover" style="${musicCover(p)}">${p.cover ? "" : "♪"}</span><b>${esc(p.name || "Playlist")}</b><small>${esc(p.e ? p.e.service : "Unknown link")}</small></button>`).join("")}</div>` : musicEmpty}</div></div>`;
    const root = $(".ios-music", body);
    root.onclick = (e) => {
      const pop = e.target.closest('[data-a="pop"]'); if (pop) return iosPop(pop.closest(".ios-page"));
      if (e.target.closest("[data-stop]")) { const w = body.closest(".window"); w._reallyClose = true; return closeWin(w); }
      const c = e.target.closest(".mu-card"); if (!c) return;
      const p = list.find((x) => x.i === +c.dataset.i);
      $$(".ios-page", root).forEach((x) => x.remove()); // only one player at a time
      iosPush(root, `${iosTop("Music")}<div class="ios-page-body"><div class="mu-mhead"><span class="mu-cover big" style="${musicCover(p)}">${p.cover ? "" : "♪"}</span>
        <h1>${esc(p.name || "Playlist")}</h1><p>${esc(p.e ? p.e.service : "")}${p.note ? ` · ${esc(p.note)}` : ""}</p>
        <div class="mu-actions">${p.e && p.e.open ? `<a class="btn" href="${esc(p.e.open)}" target="_blank" rel="noopener">Open in ${esc(p.e.service)} ↗</a>` : ""}<button class="btn" data-stop>Stop music</button></div></div>${musicPlayer(p)}</div>`);
    };
  }

  // Keep the music playing when the Music window is closed (like the Mac):
  // the window is hidden instead of removed. "Stop music" really closes it.
  const closeWinBase = closeWin;
  closeWin = (w) => {
    if (w && w.dataset.key === "music" && w.isConnected && !w._reallyClose && $("iframe", w)) {
      w.getAnimations().forEach((a) => a.cancel());
      w.style.transform = ""; w.style.borderRadius = ""; w.style.transition = "";
      w.classList.add("kept"); w.classList.remove("active", "minimized");
      topWin(); updateDock(); return;
    }
    closeWinBase(w);
  };
  topWin = () => {
    const open = $$(".window:not(.minimized):not(.kept)").sort((a, b) => b.style.zIndex - a.style.zIndex);
    if (open[0]) focusWin(open[0]); else $("#mb-app").textContent = "Finder";
  };
  const openWindowMu = openWindow;
  openWindow = (o) => { const ex = wins[o.key]; if (ex) ex.classList.remove("kept"); return openWindowMu(o); };
  // Control Centre: the music card opens the Music app.
  const ccPanelMu = ccPanel;
  ccPanel = () => {
    let h = ccPanelMu();
    const pl = playlists();
    if (!SITE.music && pl.length) {
      const playing = wins.music && $("iframe", wins.music);
      h = h.replace('class="cc-tile cc-music"', 'class="cc-tile cc-music cc-open-music" role="button" tabindex="0"')
        .replace("<b>Not Playing</b><small></small>", `<b>${esc(playing ? "Music is open" : pl[0].name || "Music")}</b><small>${esc(playing ? "Tap to show the player" : "Tap to open Music")}</small>`);
    }
    return h;
  };
  sm.addEventListener("click", (e) => { if (e.target.closest(".cc-open-music") && !e.target.closest("[data-sm]")) { closeStatus(); openApp("music"); } });

  /* =====================================================================
     TOP BAR ICONS (Mac style), PHONE DOCK, PROFILE APP and PHONE FILES APP
     ===================================================================== */
  // Mac-style menu bar icons: Wi-Fi, Spotlight search, Control Centre.
  const MB_SVG = {
    wifi: '<svg class="mb-wifi-svg" viewBox="0 0 18 14" aria-hidden="true"><path d="M1.4 4.5a11.2 11.2 0 0 1 15.2 0M4.5 7.8a6.8 6.8 0 0 1 9 0" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><circle cx="9" cy="11.2" r="1.45" fill="currentColor" stroke="none"/></svg>',
    search: '<svg class="mb-search-svg" viewBox="0 0 16 16" aria-hidden="true"><circle cx="6.8" cy="6.8" r="4.5" fill="none" stroke="currentColor" stroke-width="1.65"/><path d="M10.2 10.2L14 14" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>',
    cc: '<svg class="mb-cc-svg" viewBox="0 0 18 18" aria-hidden="true"><rect x="1.5" y="2.2" width="15" height="6.2" rx="3.1" fill="none" stroke="currentColor" stroke-width="1.35"/><circle cx="13.3" cy="5.3" r="1.95" fill="currentColor" stroke="none"/><path fill-rule="evenodd" clip-rule="evenodd" d="M4.6 9.8h8.8a3.1 3.1 0 1 1 0 6.2H4.6a3.1 3.1 0 1 1 0-6.2zm.3 5a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8z" fill="currentColor" stroke="none"/></svg>',
  };
  { const w = $('.mb-icon[title="Wi-Fi"]'); if (w) w.innerHTML = MB_SVG.wifi; }
  { const c = $('.mb-right [aria-label="Control centre"]'); if (c) c.innerHTML = MB_SVG.cc; }
  { const s = $(".mb-spot"); if (s) s.innerHTML = MB_SVG.search; }
  // 12-hour clock by default. Visitors can still switch to 24-hour in Settings.
  // (One-time reset, because the old default was 24-hour and may be saved in this browser.)
  try { if (!localStorage.getItem("arshaon-h12-default")) { prefs.h24 = false; localStorage.setItem("arshaon-h12-default", "1"); savePrefs(); } } catch { prefs.h24 = false; }

  // Phone dock: Notes, Messages, Photos, Music (Music replaces Preview).
  APPS.preview.mobile = false; APPS.music.mobile = false; APPS.safari.mobile = true;

  // Phone: Finder becomes "Files" with the Files icon.
  ICONS.files = SQ("#ffffff") + '<path d="M17 33a8 8 0 0 1 8-8h15l7 7h28a8 8 0 0 1 8 8v30a8 8 0 0 1-8 8H25a8 8 0 0 1-8-8z" fill="#1a7cf0"/><path d="M17 43h66v27a8 8 0 0 1-8 8H25a8 8 0 0 1-8-8z" fill="#45a9ff"/>' + GLOSS;
  const FL_IC = {
    recents: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    browse: '<svg viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
    cloud: '<svg viewBox="0 0 24 24"><path d="M7 18h10.5a4 4 0 0 0 .5-8 6 6 0 0 0-11.6 1.3A3.5 3.5 0 0 0 7 18z"/></svg>',
    phone: '<svg viewBox="0 0 24 24"><rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/></svg>',
    trash: '<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13z"/></svg>',
    folder: '<svg viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
    down: '<svg viewBox="0 0 24 24"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>',
    apps: '<svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/></svg>',
  };
  const FL_SHARED = '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2"/><path d="M3 19.5c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M15.8 14.2c2.9.1 5.2 2 5.2 5.3"/></svg>';
  function renderFilesMobile(body, arg) {
    iosWindow(body);
    const alias = { campaigns: "projects", apps: "applications", experience: "documents" };
    let tab = arg === "recents" ? "recents" : arg === "shared" ? "shared" : "browse";
    body.innerHTML = `<div class="ios ios-files"><div class="ios-scroll fl-view"></div>
      <div class="fl-tabbar"><button data-tab="recents">${FL_IC.recents}<span>Recents</span></button><button data-tab="shared">${FL_SHARED}<span>Shared</span></button><button data-tab="browse">${FL_IC.browse}<span>Browse</span></button></div></div>`;
    const root = $(".ios-files", body), view = $(".fl-view", body);
    const shortDate = (d) => d.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "2-digit" });
    const grid = (items) => items.length ? `<div class="fl-grid">${items.map((it, i) => `<button class="fl-item" data-i="${i}">${fdIcon(it, 64)}<b>${esc(it.name)}</b>
        <small>${it.children ? `${it.children().length} item${it.children().length === 1 ? "" : "s"}` : shortDate(fakeDate(it.name))}</small></button>`).join("")}</div>` : '<p class="ios-empty">This folder is empty</p>';
    const row = (place, label, ic) => `<button class="iset-cell fl-row" data-place="${place}"><span class="fl-ic">${ic}</span><span class="iset-label">${esc(label)}</span><span class="iset-chev">›</span></button>`;
    const titleOf = (p) => (FD_PLACES.find((x) => x[0] === p) || [p, p])[1];
    const draw = () => {
      $$("[data-tab]", root).forEach((b) => b.classList.toggle("on", b.dataset.tab === tab));
      const searchBox = `<button class="fl-search" data-a="search">${IOS_IC.search}<span>Search</span></button>`;
      if (tab === "recents") { root._items = fdItems("recents"); view.innerHTML = `<h1 class="ios-large">Recents</h1>${searchBox}${grid(root._items)}`; return; }
      if (tab === "shared") { root._items = [fdItems("downloads")[0], ...fdItems("projects")].filter(Boolean); view.innerHTML = `<h1 class="ios-large">Shared</h1>${searchBox}<h3 class="fl-h">Shared by ${esc(SITE.short)}</h3>${grid(root._items)}`; return; }
      root._items = [];
      const tag = (n, c) => `<button class="iset-cell fl-row" data-tag="${n}"><span class="fl-dot" style="background:${c}"></span><span class="iset-label">${n}</span></button>`;
      view.innerHTML = `<h1 class="ios-large">Browse</h1>${searchBox}
        <h3 class="fl-h">Locations</h3><div class="ios-group">${row("icloud", "iCloud Drive", FL_IC.cloud)}${row("onmymac", "On My iPhone", FL_IC.phone)}</div>
        <h3 class="fl-h">Favourites</h3><div class="ios-group">${row("desktop", "Desktop", FL_IC.folder)}${row("documents", "Documents", FL_IC.folder)}${row("downloads", "Downloads", FL_IC.down)}${row("applications", "Applications", FL_IC.apps)}</div>`;
    };
    const openFolder = (title, items, back) => iosPush(root, `${iosTop(back)}<div class="ios-page-body"><h1 class="ios-large fl-title">${esc(title)}</h1><p class="ios-sub">${items.length} item${items.length === 1 ? "" : "s"}</p>${grid(items)}</div>`,
      (pg) => { pg._items = items; pg._name = title; });
    const openSearch = () => iosPush(root, `${iosTop("Back")}<div class="ios-page-body"><label class="ios-search big">${IOS_IC.search}<input placeholder="Search files" aria-label="Search files"></label><div class="fl-res"></div></div>`, (pg) => {
      const inp = $("input", pg), out = $(".fl-res", pg), all = [], seen = new Set();
      const walk = (items, depth) => items.forEach((it) => { if (!seen.has(it.name + it.kind)) { seen.add(it.name + it.kind); all.push(it); } if (it.children && depth < 2) walk(it.children(), depth + 1); });
      FD_PLACES.forEach(([p]) => p !== "recents" && walk(fdItems(p), 0));
      const run = () => { const q = inp.value.trim().toLowerCase(); pg._items = q ? all.filter((it) => it.name.toLowerCase().includes(q)) : []; out.innerHTML = q ? grid(pg._items) : '<p class="ios-empty">Search all your files</p>'; };
      inp.oninput = run; run(); setTimeout(() => inp.focus(), 300);
    });
    root.onclick = (e) => {
      const t = e.target;
      const pop = t.closest('[data-a="pop"]'); if (pop) return iosPop(pop.closest(".ios-page"));
      const tb = t.closest("[data-tab]"); if (tb) { tab = tb.dataset.tab; $$(".ios-page", root).forEach((p) => p.remove()); return draw(); }
      if (t.closest('[data-a="search"]')) return openSearch();
      const pl = t.closest("[data-place]"); if (pl) { const lbl = $(".iset-label", pl).textContent; return openFolder(lbl, fdItems(pl.dataset.place), "Browse"); }
      const tg = t.closest("[data-tag]"); if (tg) return openFolder(tg.dataset.tag, tg.dataset.tag === "Red" ? SITE.campaigns.map((c, i) => [c, i]).filter(([c]) => c.featured).map(([c, i]) => ({ name: c.title, kind: "Project", ic: { doc: (c.colors || [])[0] || "#555", label: "PROJ" }, open: () => openDoc("c" + i) })) : [], "Browse");
      const it = t.closest(".fl-item"); if (!it) return;
      const pg = it.closest(".ios-page"), items = pg ? pg._items : root._items, item = items && items[+it.dataset.i];
      if (!item) return;
      if (item.children) return openFolder(item.name, item.children(), pg ? pg._name : (tab === "recents" ? "Recents" : "Browse"));
      if (item.open) item.open();
    };
    draw();
    if (arg) {
      const place = alias[arg] || arg;
      if (FD_PLACES.some((p) => p[0] === place)) {
        const pg = openFolder(titleOf(place), fdItems(place), "Browse"); pg.classList.add("in");
        if (arg === "experience") { const ex = fdItems("documents").find((x) => x.children && x.name === "Experience"); if (ex) openFolder("Experience", ex.children(), titleOf(place)).classList.add("in"); }
      }
    }
  }

  /* =====================================================================
     PHONE STATUS BAR (iPhone style): time on the left; signal, Wi-Fi and
     battery on the right. Tapping the right side opens Control Centre.
     ===================================================================== */
  const mTime = el('<span id="m-time" aria-label="Time"></span>');
  const mIcons = el(`<button id="m-icons" aria-label="Control Centre">
      <svg class="m-sig" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx=".9"/><rect x="5" y="5.5" width="3" height="6.5" rx=".9"/><rect x="10" y="3" width="3" height="9" rx=".9"/><rect x="15" y="0" width="3" height="12" rx=".9"/></svg>
      <svg class="m-wifi" viewBox="0 0 17 12"><path d="M8.5 11.6l2.2-2.3a3.2 3.2 0 0 0-4.4 0z"/><path d="M8.5 5.6a6 6 0 0 1 4.1 1.6l1.3-1.4a8 8 0 0 0-10.8 0l1.3 1.4a6 6 0 0 1 4.1-1.6z"/><path d="M8.5 1.9a9.8 9.8 0 0 1 6.8 2.7l1.3-1.4a11.8 11.8 0 0 0-16.2 0l1.3 1.4a9.8 9.8 0 0 1 6.8-2.7z"/></svg>
      <svg class="m-batt" viewBox="0 0 27 13"><rect x=".6" y=".6" width="22.8" height="11.8" rx="3.8" fill="none" stroke="currentColor" stroke-opacity=".38" stroke-width="1.1"/><rect class="m-batt-fill" x="2.2" y="2.2" width="19.6" height="8.6" rx="2.4"/><path d="M25 4.4v4.2a2.1 2.1 0 0 0 0-4.2z" opacity=".4"/></svg>
    </button>`);
  $(".mb-left").prepend(mTime);
  $(".mb-right").append(mIcons);
  const drawPhoneStatus = () => {
    const d = new Date();
    mTime.textContent = d.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: useH12() }).replace(/\s?[ap]m$/i, "");
    const f = $(".m-batt-fill", mIcons); if (f) f.setAttribute("width", Math.max(2, 19.6 * batt.level).toFixed(1));
    mIcons.classList.toggle("wifi-off", !prefs.wifi);
    mIcons.classList.toggle("airplane", !!prefs.airplane);
  };
  const tickBase = tick;
  tick = () => { tickBase(); drawPhoneStatus(); };
  mIcons.addEventListener("click", (e) => { e.stopPropagation(); if (smOpen === "cc") closeStatus(); else showStatus("cc", mIcons); });
  if (navigator.getBattery) navigator.getBattery().then((b) => { const u = () => drawPhoneStatus(); b.addEventListener("levelchange", u); setTimeout(u, 50); }).catch(() => {});
  drawPhoneStatus();

  /* =====================================================================
     STICKY NOTE on the desktop / widget on the phone home screen
     that sends visitors straight to the projects
     ===================================================================== */
  function stickyInfo() {
    const types = [...new Set(SITE.campaigns.map((c) => c.type))];
    return Object.assign({
      title: "Start here 👋",
      text: `${SITE.campaigns.length} projects across ${types.slice(0, -1).join(", ")}${types.length > 1 ? " and " : ""}${types[types.length - 1] || ""}.`,
      button: "See my projects →",
    }, Object.fromEntries(Object.entries(SITE.sticky || {}).filter(([, v]) => v !== "" && v != null)));
  }
  const stickyTypes = () => [...new Set(SITE.campaigns.map((c) => c.type))];
  function buildSticky() {
    if (SITE.sticky && SITE.sticky.show === false) return;
    const s = stickyInfo();
    const chips = stickyTypes().map((t) => `<button class="st-chip" data-proj-type="${esc(t)}">${esc(t)}</button>`).join("");
    // Desktop: a yellow sticky note you can drag around.
    const note = el(`<div class="sticky" role="complementary" aria-label="Start here">
        <button class="st-close" aria-label="Hide note">×</button>
        <h3>${esc(s.title)}</h3><p>${esc(s.text)}</p>
        <div class="st-chips">${chips}</div>
        <button class="st-go" data-proj-type="">${esc(s.button)}</button></div>`);
    document.body.append(note);
    let pos = null; try { pos = JSON.parse(sessionStorage.getItem("arshaon-sticky")); } catch {}
    const place = () => {
      const x = pos ? pos.x : 28, y = pos ? pos.y : ($("#weather") && !$("#weather").hidden ? 232 : 52);
      note.style.left = clamp(x, 4, innerWidth - note.offsetWidth - 4) + "px";
      note.style.top = clamp(y, 34, innerHeight - note.offsetHeight - 90) + "px";
    };
    place(); addEventListener("resize", place);
    note.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button") || e.button !== 0) return;
      const sx = e.clientX, sy = e.clientY, ox = note.offsetLeft, oy = note.offsetTop;
      note.setPointerCapture(e.pointerId); note.classList.add("dragging");
      const move = (ev) => { pos = { x: ox + ev.clientX - sx, y: oy + ev.clientY - sy }; place(); };
      const up = () => { note.classList.remove("dragging"); note.removeEventListener("pointermove", move); note.removeEventListener("pointerup", up); try { sessionStorage.setItem("arshaon-sticky", JSON.stringify(pos)); } catch {} };
      note.addEventListener("pointermove", move); note.addEventListener("pointerup", up);
    });
    note.addEventListener("click", (e) => {
      if (e.target.closest(".st-close")) { note.remove(); return; }
      const b = e.target.closest("[data-proj-type]"); if (!b) return;
      openApp("photos", b.dataset.projType ? "projects:" + b.dataset.projType : "projects");
    });
    // Phone: a widget at the top of the home screen.
    const home = $("#home"), card = $("#home .home-card");
    if (home) {
      const w = el(`<div class="m-sticky"><div class="m-st-head"><b>${esc(s.title)}</b><span>Projects</span></div><p>${esc(s.text)}</p>
          <div class="st-chips">${chips}</div><button class="st-go" data-proj-type="">${esc(s.button)}</button></div>`);
      w.addEventListener("click", (e) => {
        const b = e.target.closest("[data-proj-type]");
        const t = b ? b.dataset.projType : "";
        const ic = $(".m-st-head", w); launchRect = ic.getBoundingClientRect();
        openApp("photos", t ? "projects:" + t : "projects");
      });
      if (card) card.insertAdjacentElement("afterend", w); else home.prepend(w);
    }
  }
  const buildDesktopSt = buildDesktop;
  buildDesktop = () => { buildDesktopSt(); buildSticky(); };

  // Optional tab icon from content.js (SITE.favicon), e.g. "icons/favicon.png".
  if (SITE.favicon) {
    $$('link[rel~="icon"], link[rel="apple-touch-icon"]').forEach((l) => l.remove());
    const favHref = srcUrl(SITE.favicon);
    const l1 = document.createElement("link"); l1.rel = "icon"; l1.type = /\.svg(\?|$)/i.test(favHref) ? "image/svg+xml" : "image/png"; l1.href = favHref; document.head.append(l1);
    const l2 = document.createElement("link"); l2.rel = "shortcut icon"; l2.href = "/favicon.ico?v=apple3"; document.head.append(l2);
    const l3 = document.createElement("link"); l3.rel = "apple-touch-icon"; l3.href = "/icons/favicon.png?v=apple3"; document.head.append(l3);
  }
  if (SITE.siteTitle) document.title = SITE.siteTitle;

  /* =====================================================================
     STICKY NOTE v2: project & campaign counts and headline numbers
     ===================================================================== */
  function stickyCounts() {
    const all = SITE.campaigns, n = (k) => all.filter((c) => (c.kind || "Project") === k).length;
    return { total: all.length, campaigns: n("Campaign"), projects: n("Project"), flag: all.filter((c) => c.featured).length };
  }
  stickyInfo = function () {
    const k = stickyCounts(), types = stickyTypes();
    const clean = Object.fromEntries(Object.entries(SITE.sticky || {}).filter(([, v]) => v !== "" && v != null));
    return Object.assign({
      title: "Start here 👋",
      text: `${k.total} projects & campaigns across ${types.length} categories.`,
      button: "See all projects →",
    }, clean);
  };
  buildSticky = function () {
    if (SITE.sticky && SITE.sticky.show === false) return;
    $$(".sticky, .m-sticky").forEach((x) => x.remove());
    const s = stickyInfo(), k = stickyCounts();
    const count = (t) => SITE.campaigns.filter((c) => (t === FLAG ? c.featured : c.type === t)).length;
    const chipList = [...(k.flag ? [FLAG] : []), ...stickyTypes()];
    const chips = chipList.map((t) => `<button class="st-chip${t === FLAG ? " flag" : ""}" data-proj-type="${esc(t)}">${esc(t)} <i>${count(t)}</i></button>`).join("");
    const nums = (SITE.sticky && SITE.sticky.numbers || []).slice(0, 4);
    const numsHTML = nums.length ? `<div class="st-nums">${nums.map(([v, l]) => `<div><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join("")}</div>` : "";
    const countsHTML = `<div class="st-counts"><span><b>${k.campaigns}</b> campaigns</span><span><b>${k.projects}</b> projects</span>${k.flag ? `<span><b>${k.flag}</b> flagship</span>` : ""}</div>`;
    const note = el(`<div class="sticky" role="complementary" aria-label="Start here">
        <button class="st-close" aria-label="Hide note">×</button>
        <h3>${esc(s.title)}</h3><p>${esc(s.text)}</p>${countsHTML}${numsHTML}
        <div class="st-chips">${chips}</div>
        <button class="st-go" data-proj-type="">${esc(s.button)}</button></div>`);
    document.body.append(note);
    let pos = null; try { pos = JSON.parse(sessionStorage.getItem("arshaon-sticky")); } catch {}
    const place = () => {
      const x = pos ? pos.x : 28, y = pos ? pos.y : ($("#weather") && !$("#weather").hidden ? 232 : 52);
      note.style.left = clamp(x, 4, innerWidth - note.offsetWidth - 4) + "px";
      note.style.top = clamp(y, 34, Math.max(34, innerHeight - note.offsetHeight - 90)) + "px";
    };
    place(); addEventListener("resize", place);
    note.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button") || e.button !== 0) return;
      const sx = e.clientX, sy = e.clientY, ox = note.offsetLeft, oy = note.offsetTop;
      note.setPointerCapture(e.pointerId); note.classList.add("dragging");
      const move = (ev) => { pos = { x: ox + ev.clientX - sx, y: oy + ev.clientY - sy }; place(); };
      const up = () => { note.classList.remove("dragging"); note.removeEventListener("pointermove", move); note.removeEventListener("pointerup", up); try { sessionStorage.setItem("arshaon-sticky", JSON.stringify(pos)); } catch {} };
      note.addEventListener("pointermove", move); note.addEventListener("pointerup", up);
    });
    note.addEventListener("click", (e) => {
      if (e.target.closest(".st-close")) { note.remove(); return; }
      const b = e.target.closest("[data-proj-type]"); if (!b) return;
      openApp("photos", b.dataset.projType ? "projects:" + b.dataset.projType : "projects");
    });
    const home = $("#home"), card = $("#home .home-card");
    if (home) {
      const w = el(`<div class="m-sticky"><div class="m-st-head"><b>${esc(s.title)}</b><span>${k.total} total</span></div><p>${esc(s.text)}</p>${countsHTML}${numsHTML}
          <div class="st-chips">${chips}</div><button class="st-go" data-proj-type="">${esc(s.button)}</button></div>`);
      w.addEventListener("click", (e) => {
        const b = e.target.closest("[data-proj-type]");
        const t = b ? b.dataset.projType : "";
        launchRect = $(".m-st-head", w).getBoundingClientRect();
        openApp("photos", t ? "projects:" + t : "projects");
      });
      if (card) card.insertAdjacentElement("afterend", w); else home.prepend(w);
    }
  };

  /* =====================================================================
     PHONE WALLPAPERS (only used on phones; the computer keeps its own)
     ===================================================================== */
  const PH_WALLS = (SITE.phoneWallpapers || []).filter((x) => x && x.src);
  const wallOk = {};   // src -> address that actually loaded
  function findImage(src, done) {
    if (wallOk[src]) return done(wallOk[src]);
    const base = src.replace(/\.(jpe?g|png|webp|JPE?G|PNG|WEBP)$/, "");
    const tries = [...new Set([src, base + ".jpg", base + ".jpeg", base + ".png", base + ".webp", base + ".JPG", base + ".PNG"])];
    const next = () => {
      const s = tries.shift(); if (!s) return;
      const im = new Image();
      im.onload = () => { wallOk[src] = s; done(s); };
      im.onerror = next;
      im.src = srcUrl(s);
    };
    next();
  }
  function defaultPhoneWallId() {
    const d = SITE.defaultPhoneWallpaper; if (!d) return "p0";
    const i = PH_WALLS.findIndex((x) => x.src === d || x.name === d);
    return i >= 0 ? "p" + i : "p0";
  }
  const phoneWallId = () => prefs.phoneWall || defaultPhoneWallId();
  function phoneWallSrc(id) {
    if (id && id.startsWith("photo:")) return id.slice(6);
    const w = PH_WALLS[+String(id).slice(1)] || PH_WALLS[0];
    return w ? w.src : "";
  }
  const phoneCss = (src) => `#000 ${cssUrl(wallOk[src] || src)} center/cover no-repeat`;
  const usePhoneWalls = () => isMobile() && (PH_WALLS.length || String(prefs.phoneWall || "").startsWith("photo:"));
  const applyWallDesk = applyWall;
  applyWall = function () {
    if (!usePhoneWalls()) return applyWallDesk();
    const src = phoneWallSrc(phoneWallId());
    $("#wallpaper").style.background = phoneCss(src);
    $("#skyline").style.display = "none";
    findImage(src, () => { if (usePhoneWalls() && phoneWallSrc(phoneWallId()) === src) $("#wallpaper").style.background = phoneCss(src); });
  };
  function phoneWallPage() {
    const id = phoneWallId(), css = phoneCss(phoneWallSrc(id));
    return `<div class="iset-wall-now"><span class="iset-wall-phone" style="background:${css}"></span><span class="iset-wall-phone home" style="background:${css}"></span></div>
      <h4 class="iset-h">Choose a Wallpaper</h4><div class="iset-walls pw">${PH_WALLS.map((x, i) => `<button class="iset-wall ${id === "p" + i ? "on" : ""}" data-pwall="p${i}"><span data-pw-src="${esc(x.thumb || x.src)}" style="background:${phoneCss(x.thumb || x.src)}"></span><small>${esc(x.name || "Wallpaper " + (i + 1))}</small></button>`).join("")}</div>`;
  }
  // Thumbnails also try other file endings (.jpg / .png / ...) if needed.
  new MutationObserver(() => {
    $$("[data-pw-src]:not([data-pw-done])").forEach((sp) => {
      sp.dataset.pwDone = "1";
      const s = sp.dataset.pwSrc; findImage(s, () => { sp.style.background = phoneCss(s); });
    });
  }).observe(document.body, { childList: true, subtree: true });

  /* =====================================================================
     FINDER on the computer, FILES on the phone (switches live on resize)
     ===================================================================== */
  Object.defineProperty(APPS.finder, "name", { get: () => (isMobile() ? "Files" : "Finder"), configurable: true });
  let wasMobile = isMobile();
  addEventListener("resize", () => {
    const m = isMobile(); if (m === wasMobile) return; wasMobile = m;
    applyWall();
    $$('.dock-item[data-app="finder"], #home .home-app[data-app="finder"]').forEach((b) => {
      const ic = $(".appicon", b); if (ic) ic.outerHTML = icon("finder", b.classList.contains("home-app") ? 60 : prefs.dockSize || 50);
      const lab = $(".tip", b) || $("span:not(.appicon)", b); if (lab) lab.textContent = APPS.finder.name;
      b.setAttribute("aria-label", APPS.finder.name);
    });
    const w = $('.window[data-key="finder"] .title'); if (w) w.textContent = APPS.finder.name;
  });
  /* =====================================================================
     KEYBOARD SHORTCUTS (computer only). Press ? to see them all.
     ===================================================================== */
  const SHORTCUTS = [
    ["N", "Notes", () => openApp("notes")],
    ["P", "Photos (projects)", () => openApp("photos")],
    ["M", "Messages", () => openApp("messages")],
    ["E", "Mail (write to me)", () => openApp("mail")],
    ["R", "Recruiter quick view", () => openApp("hire")],
    ["F", "Finder", () => openApp("finder")],
    ["C", "Calendar", () => openApp("calendar")],
    ["U", "Music", () => APPS.music && openApp("music")],
    ["S", "Settings", () => openApp("settings")],
    ["T", "Terminal", () => openApp("terminal")],
    ["L", "Launchpad (all apps)", () => openLaunchpad()],
    ["/", "Search everything", () => openSpotlight()],
    ["W", "Close the front window", () => { const w = activeWin() || topWindow(); if (w) closeWin(w); }],
    ["]", "Next window", () => cycleWin(1)],
    ["[", "Previous window", () => cycleWin(-1)],
    ["J / ↓", "Next note (in Notes)", null],
    ["K / ↑", "Previous note (in Notes)", null],
    ["← / →", "Previous / next project (in a project)", null],
    ["⌘K / Ctrl+K", "Search everything", null],
    ["Esc", "Close menus, search and this list", null],
    ["?", "Show this list", () => showShortcuts()],
  ];
  function cycleWin(dir) {
    const ws = $$(".window:not(.minimized)").sort((a, b) => a.style.zIndex - b.style.zIndex); if (ws.length < 2) return;
    const top = ws[ws.length - 1];
    const target = dir > 0 ? ws[0] : ws[ws.length - 2];
    if (target !== top) focusWin(target);
  }
  function showShortcuts() {
    if ($("#kb")) return $("#kb").remove();
    const o = el(`<div id="kb" class="kb-over" role="dialog" aria-label="Keyboard shortcuts"><div class="kb-card">
        <div class="kb-head"><b>Keyboard shortcuts</b><button class="kb-x" aria-label="Close">×</button></div>
        <div class="kb-list">${SHORTCUTS.map(([k, d]) => `<div class="kb-row"><span>${esc(d)}</span><span class="kb-keys">${k.split(" / ").map((x) => `<kbd>${esc(x)}</kbd>`).join(" ")}</span></div>`).join("")}</div>
        <p class="kb-foot">Shortcuts work when you're not typing in a box.</p></div></div>`);
    o.addEventListener("click", (e) => { if (e.target === o || e.target.closest(".kb-x")) o.remove(); });
    document.body.append(o);
  }
  function moveNote(dir) {
    const w = activeWin() || topWindow(); if (!w || w.dataset.key !== "notes") return false;
    const rows = $$(".nt-row", w), i = rows.findIndex((r) => r.classList.contains("active"));
    const next = rows[Math.max(0, Math.min(rows.length - 1, i + dir))];
    if (next && next !== rows[i]) { next.click(); next.scrollIntoView({ block: "nearest" }); }
    return true;
  }
  document.addEventListener("keydown", (e) => {
    if (isMobile() || e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = document.activeElement?.tagName || "";
    if (/INPUT|TEXTAREA|SELECT/.test(tag) || document.activeElement?.isContentEditable) return;
    if (e.key === "Escape" && $("#kb")) { $("#kb").remove(); return; }
    if (!$("#lock").hidden || !$("#sleep").hidden || $("#spot") || $("#lp")) return;
    const k = e.key.length === 1 ? e.key.toUpperCase() : e.key;
    if (k === "J" || k === "ArrowDown") { if (moveNote(1)) e.preventDefault(); return; }
    if (k === "K" || k === "ArrowUp") { if (moveNote(-1)) e.preventDefault(); return; }
    const sc = SHORTCUTS.find(([key, , fn]) => fn && key === k);
    if (sc) { e.preventDefault(); hideMenu(); sc[2](); }
  });
  const helpKb = MENUS.help;
  MENUS.help = () => [["Keyboard Shortcuts", showShortcuts, "?"], ...helpKb()];

  /* =====================================================================
     VISITOR NOTES: "Send to Ashikur" delivers a note privately by email
     (through send-note.php on your hosting). Nothing is public.
     ===================================================================== */
  function sendBoxHTML(id) {
    if (SITE.noteInbox === false) return "";
    const m = myNotes.find((x) => x.id === id) || {};
    const sent = m.sent ? `✓ Saved privately for ${esc(SITE.short)} (${new Date(m.sent).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}). Only ${esc(SITE.short)} can read it.` : "✓ Auto-saved in your browser. Click below to save privately for " + esc(SITE.short) + " or email directly.";
    return `<div class="nt-send" data-note="${esc(id)}">
        <b>📨 Send this note privately to ${esc(SITE.short)}</b>
        <span class="nt-send-sub">Your note stays saved in your browser. Save it privately to ${esc(SITE.short)}'s inbox or send via Mail.</span>
        <div class="nt-send-row"><input type="email" placeholder="Your name or email (optional)" aria-label="Your email (optional)" autocomplete="email">
          <input class="nt-hp" tabindex="-1" autocomplete="off" aria-hidden="true">
          <button type="button" data-send-note>${m.sent ? "Save Privately Again" : "Save Privately"}</button>
          <button type="button" class="nt-email-btn" data-email-note>Open in Mail</button></div>
        <span class="nt-send-status" aria-live="polite">${sent}</span></div>`;
  }
  // Add the send box under every note a visitor writes (computer and phone).
  new MutationObserver(() => {
    $$(".nt-edit").forEach((ta) => {
      if (ta.dataset.sendBox) return; ta.dataset.sendBox = "1";
      const holder = ta.closest(".ios-note-page") || ta.closest(".window");
      const id = holder?.dataset.id || myNotes[0]?.id;
      const active = holder && $(".nt-row.active", holder);
      const noteId = active ? active.dataset.id : id;
      if (noteId && myNotes.some((x) => x.id === noteId)) ta.insertAdjacentHTML("afterend", sendBoxHTML(noteId));
    });
  }).observe(document.body, { childList: true, subtree: true });
  document.addEventListener("click", (e) => {
    const eb = e.target.closest("[data-email-note]"); if (!eb) return;
    const box = eb.closest(".nt-send"), m = myNotes.find((x) => x.id === box?.dataset.note);
    const txt = String(m?.text || "").trim();
    openApp("mail", txt ? txt.split(/\r?\n/)[0].slice(0, 80) : "Note for Ashikur");
    setTimeout(() => { const mb = $(".window[data-key='mail'] .ml-body"); if (mb && txt) mb.value = txt; }, 80);
  });
  document.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-send-note]"); if (!b) return;
    const box = b.closest(".nt-send"), m = myNotes.find((x) => x.id === box.dataset.note), st = $(".nt-send-status", box);
    if (!m || !String(m.text || "").trim()) { st.textContent = "Write something first 🙂"; return; }
    b.disabled = true; st.textContent = "Sending…";
    try {
      const r = await fetch(SITE.noteEndpoint || "send-note.php", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: m.text, email: $('input[type="email"]', box).value.trim(), website: $(".nt-hp", box).value }) });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "failed");
      m.sent = Date.now(); saveMyNotes(); gcEvent("note-sent", "Visitor sent a note");
      st.textContent = `✓ Sent! Only ${SITE.short} can read it.`; b.textContent = "Send again";
    } catch (err) {
      st.innerHTML = `Couldn't send right now. You can email it to <a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a> instead.`;
    }
    b.disabled = false;
  });
  /* =====================================================================
     YOUR PRIVATE INBOX: notes visitors sent you, shown only in YOUR
     Notes app. Open arshaon.com/#inbox and type the password from inbox.php.
     ===================================================================== */
  let INBOX = [];
  const inboxPass = () => { try { return sessionStorage.getItem("arshaon-inbox") || ""; } catch { return ""; } };
  async function inboxCall(pass, extra) {
    const r = await fetch(SITE.inboxEndpoint || "inbox.php", { method: "POST", headers: { "Content-Type": "application/json" }, cache: "no-store",
      body: JSON.stringify(Object.assign({ password: pass }, extra || {})) });
    return r.json();
  }
  function refreshNotesWin() {
    const w = $('.window[data-key="notes"]');
    if (w) { closeWin(w); setTimeout(() => openApp("notes"), 320); } else openApp("notes");
  }
  async function loadInbox(pass, show = true) {
    try {
      const j = await inboxCall(pass, { action: "list" });
      if (!j.ok) {
        try { sessionStorage.removeItem("arshaon-inbox"); } catch {}
        if (show) alert(j.error === "wrong password" ? "Wrong password." : "Inbox: " + j.error);
        return false;
      }
      try { sessionStorage.setItem("arshaon-inbox", pass); } catch {}
      INBOX = j.notes || [];
      if (show || $('.window[data-key="notes"]')) refreshNotesWin();
      return true;
    } catch (err) {
      if (show) alert("Couldn't reach the inbox. It only works on your live website (not on your computer's copy).");
      return false;
    }
  }
  function unlockInbox() {
    try { history.replaceState(null, "", location.pathname + location.search); } catch {}
    const p = inboxPass() || prompt("Inbox password");
    if (p) loadInbox(p, true);
  }
  const noteListBase = noteList;
  noteList = function () {
    const fmt = (d) => d.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: useH12() });
    const box = INBOX.slice().reverse().map((n) => {
      const lines = String(n.text || "").split(/\r?\n/), first = (lines[0] || "").trim() || (n.kind === "mail" ? "Message" : "Note");
      const when = new Date((n.time || 0) * 1000);
      const from = n.email ? `<a href="mailto:${esc(n.email)}">${esc(n.email)}</a>` : "someone who didn't leave an email";
      return {
        id: "x" + n.id, title: (n.kind === "mail" ? "✉️ " : "📥 ") + first, text: lines.slice(1).join(" ").trim() || first, pinned: false, when, own: false,
        html: `<h1>${n.kind === "mail" ? "✉️" : "📥"} ${esc(first)}</h1>
          <p class="inbox-meta">From ${from} · ${esc(fmt(when))}</p>
          <div class="inbox-text">${esc(n.text).replace(/\n/g, "<br>")}</div>
          <p class="inbox-actions">${n.email ? `<a class="btn blue" href="mailto:${esc(n.email)}?subject=${encodeURIComponent("Re: " + first)}">Reply by email</a>` : ""}
            <button class="btn" data-inbox-del="${esc(n.id)}">Delete</button><button class="btn" data-inbox-lock>Lock inbox</button></p>
          <p class="inbox-private">🔒 Only you can see this, because you unlocked your inbox. Visitors never see it.</p>`,
      };
    });
    return [...box, ...noteListBase()];
  };
  document.addEventListener("click", async (e) => {
    const del = e.target.closest("[data-inbox-del]");
    if (del) {
      if (!confirm("Delete this note for good?")) return;
      try { const j = await inboxCall(inboxPass(), { action: "delete", id: del.dataset.inboxDel }); if (j.ok) { INBOX = j.notes || []; refreshNotesWin(); } } catch {}
      return;
    }
    if (e.target.closest("[data-inbox-lock]")) {
      try { sessionStorage.removeItem("arshaon-inbox"); } catch {}
      INBOX = []; refreshNotesWin();
    }
  });
  addEventListener("hashchange", () => { if (location.hash === "#inbox") unlockInbox(); });
  setTimeout(() => {
    if (location.hash === "#inbox") unlockInbox();
    else if (inboxPass()) loadInbox(inboxPass(), false);
  }, 700);
  /* =====================================================================
     PHONE: "Work" widget + Experience screens (like an iPhone widget)
     ===================================================================== */
  const WK_COLORS = ["#111111", "#e31f26", "#6e3bd9", "#0a66c2", "#1e9e5a", "#ff9500", "#5856d6"];
  function wkInitials(name) {
    const n = String(name || "").trim();
    if (/^\d/.test(n)) return n.match(/^\d+/)[0];
    const words = n.split(/\s+/).filter((w) => /[A-Za-z]/.test(w));
    if (words[0] && /^[A-Z]{2,4}$/.test(words[0])) return words[0];          // "CMV Music" -> CMV
    if (words.length === 1) return words[0][0].toUpperCase();                 // "TikTok" -> T
    return words.slice(0, 3).map((w) => w[0]).join("").toUpperCase();        // "Dhaka Commerce College" -> DCC
  }
  function wkLogo(item, size) {
    const s = `--wk:${size}px`;
    if (item.logo) return `<span class="wk-logo wk-img" style="${s}"><img src="${esc(srcUrl(item.logo))}" alt=""></span>`;
    const name = item.company || item.school || "";
    if (/growth|ads|marketing/i.test(name)) {
      return `<span class="wk-logo wk-svg" style="${s};background:linear-gradient(145deg,#32ade6,#0066cc)"><svg viewBox="0 0 24 24" width="${Math.round(size * .58)}" height="${Math.round(size * .58)}" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></svg></span>`;
    }
    if (/saas|ai|product|tech/i.test(name)) {
      return `<span class="wk-logo wk-svg" style="${s};background:linear-gradient(145deg,#7c5dfa,#312e81)"><svg viewBox="0 0 24 24" width="${Math.round(size * .58)}" height="${Math.round(size * .58)}" fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"/><path d="M19 16l.9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9L19 16z"/></svg></span>`;
    }
    const bg = item.color || WK_COLORS[hashNum(name) % WK_COLORS.length];
    const ini = wkInitials(name);
    return `<span class="wk-logo" style="${s};background:${esc(bg)}"><b style="font-size:${Math.round(size * (ini.length > 2 ? .3 : .4))}px">${esc(ini)}</b></span>`;
  }
  function wkYears(dates) {
    const d = String(dates || ""), ys = (d.match(/\d{4}/g) || []).map(Number);
    if (!ys.length) return "";
    const now = /present|now|current/i.test(d), a = Math.min(...ys), b = Math.max(...ys);
    if (now) return `${a} – Now`;
    return a === b ? String(a) : `${a} – ${b}`;
  }
  // One line per company for the widget (e.g. two TikTok roles become "TikTok 2021 – Now").
  function wkCompanies() {
    const map = new Map();
    SITE.experience.forEach((e, i) => {
      if (e.hideInWidget) return;
      const k = e.company; if (!map.has(k)) map.set(k, { ...e, idx: i, all: [] });
      map.get(k).all.push(e);
    });
    const list = [...map.values()].map((c) => ({ ...c, years: wkYears(c.all.map((e) => e.dates).join(" ")) }));
    const sm = SITE.socialMedia;
    if (sm && sm.show !== false) list.splice(1, 0, { ...sm, social: true, years: wkYears(sm.dates) });
    return list;
  }
  function buildWorkWidget() {
    const home = $("#home"), card = $("#home .home-card");
    if (!home || SITE.workWidget === false || !SITE.experience?.length) return;
    $("#home .m-widgets")?.remove();
    const k = typeof stickyCounts === "function" ? stickyCounts() : { total: SITE.campaigns.length, campaigns: 0, projects: 0, flag: 0 };
    const rows = wkCompanies().slice(0, 4).map((c) => `<div class="wkw-row">${wkLogo(c, 30)}<span><b>${esc(c.company)}</b><small>${esc(c.years)}</small></span></div>`).join("");
    const row = el(`<div class="m-widgets${wkCompanies().length > 3 ? " wk4" : ""}">
        <div class="mw"><button class="mw-box mw-work" aria-label="Work experience"><span class="mw-head">Work <i>›</i></span>${rows}</button><span class="mw-label">Work</span></div>
        <div class="mw"><button class="mw-box mw-proj" aria-label="Open Resume and CV"><span class="mw-head">Start here 👋</span>
          <span class="mw-big">CV</span><span class="mw-sub">Resume &amp; Profile</span>
          <span class="mw-counts">Web · SaaS · AI · Growth</span>
          <span class="mw-go">View My CV →</span></button><span class="mw-label">Resume</span></div></div>`);
    $(".mw-work", row).onclick = (e) => { launchRect = e.currentTarget.getBoundingClientRect(); openWork(); };
    $(".mw-proj", row).onclick = (e) => { launchRect = e.currentTarget.getBoundingClientRect(); openApp("preview"); };
    if (card) card.insertAdjacentElement("afterend", row); else home.prepend(row);
  }
  const buildDesktopWk = buildDesktop;
  buildDesktop = () => { buildDesktopWk(); buildWorkWidget(); };

  function openWork(arg) {
    if (!isMobile()) return openApp("finder", "experience");
    $$(".window").forEach((w) => w.dataset.key !== "work" && closeWin(w));
    openWindow({ key: "work", title: "Experience", app: "Experience", w: 420, h: 760, render: (b) => renderWork(b, arg) });
  }
  function renderWork(body, arg) {
    const win = iosWindow(body);
    const edu = SITE.education || [];
    const row = (item, i, kind) => `<button class="wk-row" data-${kind}="${i}">${wkLogo(item, 46)}
        <span class="wk-txt"><b>${esc(item.company || item.school)}</b><small>${esc(item.role || item.degree || "")}</small><small>${esc(item.dates || "")}</small></span><span class="wk-chev">›</span></button>`;
    body.innerHTML = `<div class="ios ios-work"><div class="ios-scroll">
        <h1 class="wk-h">Experience</h1><div class="wk-list">${SITE.experience.map((e, i) => row(e, i, "exp")).join("")}</div>
        ${SITE.socialMedia && SITE.socialMedia.show !== false ? `<h1 class="wk-h">Social Media</h1><div class="wk-list">${row(SITE.socialMedia, 0, "sm")}</div>` : ""}
        ${edu.length ? `<h1 class="wk-h">Education</h1><div class="wk-list">${edu.map((e, i) => row(e, i, "edu")).join("")}</div>` : ""}
      </div><button class="ios-homebar" aria-label="Go to Home screen"></button></div>`;
    const root = $(".ios-work", body);
    const openDetail = (item) => {
      const pts = (item.points || []).length ? `<div class="wk-card"><ul>${item.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>` : "";
      const about = item.about ? `<div class="wk-card"><p>${esc(item.about)}</p></div>` : "";
      const link = item.link ? `<h4 class="wk-sec">Links</h4><a class="wk-link" href="${esc(item.link)}" target="_blank" rel="noopener">${wkLogo(item, 26)}<span>${esc(item.link.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""))}</span><i>↗</i></a>` : "";
      iosPush(root, `${iosTop("Experience")}<div class="ios-page-body wk-detail">
          <div class="wk-title">${wkLogo(item, 40)}<h1>${esc(item.company || item.school)}</h1></div>
          <b class="wk-role">${esc(item.role || item.degree || "")}</b><span class="wk-dates">${esc(item.dates || "")}</span>
          ${about}${pts}${link}</div>`);
    };
    root.onclick = (e) => {
      const t = e.target;
      if (t.closest(".ios-homebar")) return closeWin(win);
      const pop = t.closest('[data-a="pop"]'); if (pop) return iosPop(pop.closest(".ios-page"));
      const ex = t.closest("[data-exp]"); if (ex) return openDetail(SITE.experience[+ex.dataset.exp]);
      const ed = t.closest("[data-edu]"); if (ed) return openDetail(edu[+ed.dataset.edu]);
      if (t.closest("[data-sm]")) return openDetail(SITE.socialMedia);
    };
    if (arg !== undefined && SITE.experience[+arg]) openDetail(SITE.experience[+arg]);
  }
  /* =====================================================================
     DEFAULT WALLPAPER: a soft blue-purple glow (no picture needed)
     ===================================================================== */
  WALLS.glow = { name: "Glow", skyline: false,
    css: "radial-gradient(1100px 760px at 8% -10%, #4a2fd0 0%, transparent 60%), radial-gradient(1200px 820px at 105% 110%, #0a78d8 0%, transparent 62%), radial-gradient(900px 600px at 60% 40%, #1d2a8f 0%, transparent 70%), linear-gradient(160deg, #1a1166 0%, #0a1a55 45%, #083f8f 100%)" };

  /* =====================================================================
     MAIL: visitors write to you right here (no email app needed).
     The message goes to send-mail.php on your hosting, which emails you.
     ===================================================================== */
  ICONS.mail = SQ("url(#ic-mail)") + '<g filter="url(#ic-sh)"><rect x="16" y="27" width="68" height="46" rx="8" fill="#ffffff"/><path d="M18 70l22-19M82 70L60 51" stroke="#d0d7e2" stroke-width="2.2" stroke-linecap="round"/><path d="M17.5 29.5L50 54l32.5-24.5" fill="none" stroke="#2484ff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></g>' + GLOSS + '<rect x="1" y="1" width="98" height="98" rx="22" fill="none" stroke="rgba(255,255,255,.48)" stroke-width="1.4"/>';
  document.body.insertAdjacentHTML("afterbegin", '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="ic-mail" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5ab8ff"/><stop offset="1" stop-color="#0a64e0"/></linearGradient></defs></svg>');
  APPS.mail = { name: "Mail", title: "New Message", w: 760, h: 480, mobile: false, render: renderMail };
  if (DOCK.indexOf("mail") < 0) DOCK.splice(DOCK.indexOf("messages") + 1, 0, "mail");
  function renderMail(body, arg, win) {
    const ios = isMobile();
    if (ios) iosWindow(body);
    body.innerHTML = `<div class="ml ${ios ? "ml-ios ios" : ""}">
        ${ios ? `<div class="ml-top"><button class="ml-cancel" data-ml="cancel">Cancel</button><b>New Message</b><button class="ml-send" data-ml="send" aria-label="Send">${ML_ARROW}</button></div>` : ""}
        <div class="ml-row"><span>To:</span><b>${esc(SITE.email)}</b></div>
        <label class="ml-row"><span>From:</span><input type="email" class="ml-from" placeholder="your@email.com (optional, so I can reply)" autocomplete="email"></label>
        <label class="ml-row"><span>Subject:</span><input class="ml-subj" placeholder="Hello ${esc(SITE.short)}" maxlength="150"></label>
        <textarea class="ml-body" placeholder="Loved my portfolio? Write me feedback or ask me anything!" aria-label="Message"></textarea>
        <input class="nt-hp" tabindex="-1" autocomplete="off" aria-hidden="true">
        <div class="ml-status" aria-live="polite"></div></div>`;
    if (!ios && win && !$(".ml-send", win)) {
      const b = el(`<button class="ml-send ml-send-tb" data-ml="send" aria-label="Send">${ML_ARROW}</button>`);
      $(".titlebar", win).append(b);
      b.onclick = () => sendMail(body, win);
    }
    if (typeof arg === "string" && arg) $(".ml-subj", body).value = arg;
    body.onclick = (e) => {
      const a = e.target.closest("[data-ml]"); if (!a) return;
      if (a.dataset.ml === "cancel") return closeWin(body.closest(".window"));
      if (a.dataset.ml === "send") sendMail(body, body.closest(".window"));
    };
    setTimeout(() => { const t = $(".ml-body", body); if (t && !ios) t.focus(); }, 60);
  }
  const ML_ARROW = '<svg viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
  async function sendMail(body, win) {
    const st = $(".ml-status", body), msg = $(".ml-body", body).value.trim();
    const btns = win ? $$(".ml-send", win) : [];
    if (!msg) { st.textContent = "Write a message first 🙂"; $(".ml-body", body).focus(); return; }
    const from = $(".ml-from", body).value.trim();
    if (from && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from)) { st.textContent = "That email doesn't look right. Leave it empty or fix it."; return; }
    btns.forEach((b) => (b.disabled = true)); st.textContent = "Sending…";
    try {
      const r = await fetch(SITE.mailEndpoint || "send-mail.php", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: from, subject: $(".ml-subj", body).value.trim(), message: msg, website: $(".nt-hp", body).value }) });
      const j = await r.json(); if (!j.ok) throw new Error(j.error || "failed");
      st.innerHTML = `✓ Saved privately for ${esc(SITE.short)} (${esc(SITE.email)})! ${from ? "I'll reply to " + esc(from) + " soon." : ""}`;
      gcEvent("mail-sent", "Visitor sent a Mail message");
      $(".ml-body", body).value = ""; $(".ml-subj", body).value = "";
      try { ping(); } catch {}
    } catch {
      st.innerHTML = `Couldn't send right now. Please email <a href="mailto:${esc(SITE.email)}?subject=${encodeURIComponent($(".ml-subj", body).value || "Hello")}&body=${encodeURIComponent(msg)}" data-real-mail>${esc(SITE.email)}</a> instead.`;
    }
    btns.forEach((b) => (b.disabled = false));
  }
  
  // Open all links (LinkedIn, PDF, mailto, external URLs) right inside the Mac!
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a || a.hasAttribute("download") || a.hasAttribute("data-external-link") || a.hasAttribute("data-real-mail") || a.hasAttribute("data-open")) return;
    const href = (a.getAttribute("href") || "").trim();
    if (!href || href === "#" || href.startsWith("javascript:")) return;
    if (href.startsWith("mailto:")) {
      e.preventDefault(); e.stopPropagation(); hideNC?.(); hideMenu?.();
      if (isMobile()) launchRect = a.getBoundingClientRect();
      openApp("mail");
      return;
    }
    if (/\.pdf($|\?)/i.test(href)) {
      e.preventDefault(); e.stopPropagation(); hideNC?.(); hideMenu?.();
      if (isMobile()) launchRect = a.getBoundingClientRect();
      openApp("preview");
      return;
    }
    if (/^https?:\/\//i.test(href) || a.hasAttribute("data-in-mac")) {
      e.preventDefault(); e.stopPropagation(); hideNC?.(); hideMenu?.();
      if (a.classList.contains("dock-item") && !wins.safari) {
        a.classList.remove("bounce"); void a.offsetWidth; a.classList.add("bounce");
        a.addEventListener("animationend", () => a.classList.remove("bounce"), { once: true });
      }
      if (isMobile()) launchRect = a.getBoundingClientRect();
      openApp("safari", href);
    }
  }, true);

  // Every "email me" link on the site opens Mail instead of the visitor's email app.
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="mailto:"]'); if (!a || a.hasAttribute("data-real-mail")) return;
    const to = decodeURIComponent(a.getAttribute("href").slice(7).split("?")[0]).toLowerCase();
    if (to !== String(SITE.email).toLowerCase()) return;
    e.preventDefault(); e.stopPropagation(); hideNC?.(); hideMenu();
    if (isMobile()) { const r = a.getBoundingClientRect(); launchRect = r; }
    openApp("mail");
  }, true);

  /* =====================================================================
     WEATHER WIDGET (computer only), live from open-meteo.com (free)
     ===================================================================== */
  const WX = Object.assign({ show: true, city: "Dhaka", lat: 23.8103, lon: 90.4125 }, SITE.weather || {});
  const WX_CODES = [[0, "Clear", "☀️", "🌙"], [1, "Mostly Clear", "🌤️", "🌙"], [2, "Partly Cloudy", "⛅", "☁️"], [3, "Cloudy", "☁️", "☁️"],
    [48, "Foggy", "🌫️", "🌫️"], [57, "Drizzle", "🌦️", "🌧️"], [67, "Rain", "🌧️", "🌧️"], [77, "Snow", "🌨️", "🌨️"], [82, "Showers", "🌦️", "🌧️"], [99, "Thunderstorms", "⛈️", "⛈️"]];
  function buildWeather() {
    if (WX.show === false || $("#weather")) return;
    const w = el(`<div id="weather" class="wx" hidden><div class="wx-city">${esc(WX.city)} <svg viewBox="0 0 24 24"><path d="M21 3L3 10.5l7.5 3L13.5 21z" fill="currentColor"/></svg></div>
        <div class="wx-temp">--°</div><div class="wx-ic"></div><div class="wx-cond"></div><div class="wx-hl"></div></div>`);
    w.style.cursor = "pointer"; w.title = "Open Calendar"; w.onclick = () => openApp("calendar"); document.body.append(w);
    const load = async () => {
      try {
        const u = `https://api.open-meteo.com/v1/forecast?latitude=${WX.lat}&longitude=${WX.lon}&current=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`;
        const j = await (await fetch(u)).json();
        const c = j.current, code = c.weather_code, row = WX_CODES.find((x) => code <= x[0]) || WX_CODES[3];
        $(".wx-temp", w).textContent = Math.round(c.temperature_2m) + "°";
        $(".wx-ic", w).textContent = c.is_day ? row[2] : row[3];
        $(".wx-cond", w).textContent = row[1];
        $(".wx-hl", w).textContent = `H:${Math.round(j.daily.temperature_2m_max[0])}° L:${Math.round(j.daily.temperature_2m_min[0])}°`;
        w.classList.toggle("night", !c.is_day);
        if (w.hidden) { w.hidden = false; dispatchEvent(new Event("resize")); }
      } catch { /* no internet or blocked: keep the widget hidden */ }
    };
    load(); setInterval(load, 30 * 60 * 1000);
  }
  buildWeather();

  /* =====================================================================
     EDIT and GO menus (like macOS), with disabled items
     ===================================================================== */
  const editCmd = (c) => () => { try { document.execCommand(c); } catch {} };
  async function pasteText() {
    try { const t = await navigator.clipboard.readText(); document.execCommand("insertText", false, t); } catch {}
  }
  MENUS.edit = () => [["Undo", editCmd("undo"), "⌘Z"], ["Redo", editCmd("redo"), "⇧⌘Z"], "-", ["Cut", editCmd("cut"), "⌘X"], ["Copy", editCmd("copy"), "⌘C"],
    ["Paste", pasteText, "⌘V"], ["Select All", editCmd("selectAll"), "⌘A"], "-", ["Emoji & Symbols", null, "🌐E"]];
  const GO = [["Home", "home", "⇧⌘H", "h"], ["Applications", "applications", "⇧⌘A", "a"], ["Desktop", "desktop", "⇧⌘D", "d"], ["Documents", "documents", "⇧⌘O", "o"],
    ["Downloads", "downloads", "⌥⌘L", null], ["AirDrop", "airdrop", "", null], ["iCloud Drive", "icloud", "⇧⌘I", "i"]];
  MENUS.go = () => [["Back", null, "⌘["], ["Forward", null, "⌘]"], "-", ...GO.map(([n, p, k]) => [n, () => openApp("finder", p), k])];
  document.addEventListener("keydown", (e) => {
    if (isMobile() || !(e.metaKey || e.ctrlKey)) return;
    const k = e.key.toLowerCase();
    const g = e.shiftKey ? GO.find((x) => x[3] === k) : e.altKey && k === "l" ? GO[4] : e.altKey && e.code === "KeyL" ? GO[4] : null;
    if (!g) return;
    if (/INPUT|TEXTAREA/.test(document.activeElement?.tagName || "") && g[3] === "a") return;
    e.preventDefault(); openApp("finder", g[1]);
  });

  /* =====================================================================
     RIGHT-CLICK MENUS (computer): Mac-style, never the browser's own menu
     ===================================================================== */
  let userFolders = (() => { try { return JSON.parse(localStorage.getItem("arshaon-folders")) || []; } catch { return []; } })();
  const saveFolders = () => { try { localStorage.setItem("arshaon-folders", JSON.stringify(userFolders)); } catch {} };
  function folderItem(f) { return { name: f.name, icon: FOLDER, folder: f.id, open: () => openApp("finder", "desktop/" + f.name) }; }
  function addDeskIcon(item, x, y) {
    const i = deskItems.length; deskItems.push(item);
    $("#desk-icons").insertAdjacentHTML("beforeend", `<button class="dicon" data-i="${i}">${item.icon}<span>${esc(item.name)}</span></button>`);
    if (x != null) { iconPos[i] = { x: clamp(x - 44, 0, innerWidth - 90), y: clamp(y - 30, 30, innerHeight - 110) }; saveIconPos(); }
    placeIcons();
    return $(`.dicon[data-i="${i}"]`);
  }
  // Put saved folders back on the desktop after it's built.
  const buildDesktopF = buildDesktop;
  buildDesktop = () => { buildDesktopF(); if (!isMobile()) userFolders.forEach((f) => addDeskIcon(folderItem(f))); };
  function newFolder(x, y) {
    let n = "untitled folder", k = 2; const names = deskItems.map((d) => d.name);
    while (names.includes(n)) n = "untitled folder " + k++;
    const f = { id: "f" + Date.now(), name: n, made: Date.now() }; userFolders.push(f); saveFolders();
    const d = addDeskIcon(folderItem(f), x, y);
    $$(".dicon.sel").forEach((s) => s.classList.remove("sel")); d.classList.add("sel");
    renameIcon(d);
  }
  function renameIcon(d) {
    const it = deskItems[+d.dataset.i]; if (!it || !it.folder) return;
    const span = $("span", d), input = el(`<input class="dicon-edit" value="${esc(it.name)}" aria-label="Folder name">`);
    span.replaceWith(input); input.focus(); input.select();
    let finished = false;
    const done = (save) => {
      if (finished) return; finished = true;
      const v = input.value.trim(); if (save && v) { it.name = v; const f = userFolders.find((x) => x.id === it.folder); if (f) { f.name = v; saveFolders(); } it.open = () => openApp("finder", "desktop/" + v); }
      input.replaceWith(el(`<span>${esc(it.name)}</span>`));
    };
    input.onkeydown = (e) => { e.stopPropagation(); if (e.key === "Enter") done(true); if (e.key === "Escape") done(false); };
    input.onblur = () => done(true);
    input.onpointerdown = (e) => e.stopPropagation();
  }
  const trashDeskBase = trashDesk;
  trashDesk = (i) => {
    const it = deskItems[+i];
    trashDeskBase(i);
    if (it && it.folder) { userFolders = userFolders.filter((f) => f.id !== it.folder); saveFolders(); }
  };
  function getInfo({ name, kind, where, icon: ic, size, extra = "" }) {
    openWindow({ key: "info:" + name, title: `${name} Info`, app: "Finder", w: 300, h: 400, render: (b) => {
      b.innerHTML = `<div class="gi"><div class="gi-top">${ic || FOLDER}<div><b>${esc(name)}</b><small>${esc(kind)}${size ? " · " + esc(size) : ""}</small></div></div>
        <h6>General</h6><dl><dt>Kind:</dt><dd>${esc(kind)}</dd>${size ? `<dt>Size:</dt><dd>${esc(size)}</dd>` : ""}<dt>Where:</dt><dd>${esc(where || "Desktop")}</dd>
        <dt>Created:</dt><dd>${esc(fmtModified(fakeDate(name)))}</dd><dt>Modified:</dt><dd>${esc(fmtModified(fakeDate(name + "m")))}</dd>${extra}</dl></div>`;
    } });
  }
  function deskInfo(d) {
    const it = deskItems[+d.dataset.i]; if (!it) return;
    const kind = it.folder || it.icon === FOLDER ? "Folder" : /\.pdf$/i.test(it.name) ? "PDF Document" : /\.txt$/i.test(it.name) ? "Plain Text" : "Document";
    getInfo({ name: it.name, kind, icon: it.icon, size: kind === "Folder" ? (it.folder ? "Zero bytes" : "") : "" });
  }
  function showCtx(x, y, items) {
    hideCtx(); hideMenu();
    const m = el(`<div id="ctx" class="menu ctx" role="menu"></div>`);
    items.forEach((it) => {
      if (it === "-") return m.append(el("<hr>"));
      const [label, fn, key] = it;
      const b = el(`<button ${fn ? "" : "disabled"}><span>${esc(label)}</span><span class="k">${key || ""}</span></button>`);
      if (fn) b.onclick = () => { hideCtx(); fn(); };
      m.append(b);
    });
    document.body.append(m);
    m.style.left = clamp(x, 4, innerWidth - m.offsetWidth - 4) + "px";
    m.style.top = clamp(y, 30, innerHeight - m.offsetHeight - 4) + "px";
  }
  function hideCtx() { $("#ctx")?.remove(); }
  document.addEventListener("pointerdown", (e) => { if (!e.target.closest("#ctx")) hideCtx(); }, true);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") hideCtx(); });
  addEventListener("blur", hideCtx); addEventListener("resize", hideCtx);
  document.addEventListener("contextmenu", (e) => {
    if (isMobile()) return;
    e.preventDefault();
    const t = e.target, x = e.clientX, y = e.clientY;
    const field = t.closest("input, textarea, [contenteditable]");
    if (field) {
      field.focus();
      return showCtx(x, y, [["Cut", editCmd("cut")], ["Copy", editCmd("copy")], ["Paste", pasteText], "-", ["Select All", editCmd("selectAll")]]);
    }
    const sel = String(getSelection() || "").trim();
    const d = t.closest(".dicon");
    if (d) {
      $$(".dicon").forEach((s) => s.classList.toggle("sel", s === d));
      const it = deskItems[+d.dataset.i] || {};
      return showCtx(x, y, [["Open", () => it.open && it.open()], "-", ["Move to Bin", () => trashDesk(d.dataset.i)], "-",
        ["Get Info", () => deskInfo(d), "⌘I"], ["Rename", it.folder ? () => renameIcon(d) : null], "-", ["Clean Up", cleanUpIcons]]);
    }
    const row = t.closest(".window .fd-row");
    if (row) {
      row.click();
      const name = ($(".fd-name span:last-child", row) || $("span:last-child", row))?.textContent || "Item";
      const kind = $(".fd-kind", row)?.textContent || "Item";
      return showCtx(x, y, [["Open", () => row.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 2 }))], "-",
        ["Get Info", () => getInfo({ name, kind, where: $(".fd-title", row.closest(".window"))?.textContent || "Finder", icon: $(".fi, .appicon", row)?.outerHTML })], ["Rename", null], "-", ["Move to Bin", null]]);
    }
    const dock = t.closest(".dock-item");
    if (dock && dock.dataset.app) {
      const id = dock.dataset.app, open = !!wins[id];
      return showCtx(x, y, [["Open", () => openApp(id)], open ? ["Hide", () => { wins[id].classList.add("minimized"); topWin(); }] : ["Options", null], "-",
        [open ? "Quit" : "Show in Finder", open ? () => closeWin(wins[id]) : () => openApp("finder", "applications")]]);
    }
    if (t.closest(".window")) {
      return showCtx(x, y, [["Copy", sel ? editCmd("copy") : null, "⌘C"], ["Select All", editCmd("selectAll"), "⌘A"], "-",
        [sel ? `Look Up “${sel.slice(0, 18)}${sel.length > 18 ? "…" : ""}”` : "Look Up", null], "-", ["Get Info", null, "⌘I"]]);
    }
    if (t.closest(".menubar, .dock, #menu, .sticky, .wx, #nc, #spot, #lp")) return;
    // Empty desktop
    showCtx(x, y, [["New Folder", () => newFolder(x, y)], "-", ["Get Info", () => getInfo({ name: "Desktop", kind: "Folder", where: SITE.short, extra: `<dt>Items:</dt><dd>${$$(".dicon:not([hidden])").length}</dd>` })], "-",
      ["Change Wallpaper…", () => openApp("settings", "wallpaper")], "-", ["Use Stacks", null], ["Sort By", null], ["Clean Up", cleanUpIcons], ["Show View Options", null]]);
  });
  document.addEventListener("keydown", (e) => {
    if (isMobile() || !(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "i" || e.shiftKey) return;
    const d = $(".dicon.sel"); if (!d || /INPUT|TEXTAREA/.test(document.activeElement?.tagName || "")) return;
    e.preventDefault(); deskInfo(d);
  });

  /* =====================================================================
     FINDER: Home, iCloud Drive, On My Mac and AirDrop locations
     ===================================================================== */
  Object.assign(FD_IC, {
    applications: '<svg viewBox="0 0 24 24"><path d="M9.6 4L4.5 19.5M14.4 4l5.1 15.5M3.5 14.5h17M12 4v4"/></svg>',
    desktop: '<svg viewBox="0 0 24 24"><rect x="3" y="4.5" width="18" height="13" rx="2.2"/><path d="M3 13.5h18M9 20.5h6"/></svg>',
    documents: '<svg viewBox="0 0 24 24"><path d="M6.5 3h7l5 5v11.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5.5 19.5V4.5A1.5 1.5 0 0 1 7 3z"/><path d="M13.5 3v5h5"/></svg>',
    downloads: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v9M8 12.5l4 4 4-4"/></svg>',
    recents: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/></svg>',
    projects: '<svg viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9.5 12.5h5"/></svg>',
    trash: '<svg viewBox="0 0 24 24"><path d="M4.5 7h15M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/></svg>',
    home: '<svg viewBox="0 0 24 24"><path d="M4 11l8-7 8 7M6 9.5V20h4.5v-5.5h3V20H18V9.5"/></svg>',
    icloud: '<svg viewBox="0 0 24 24"><path d="M7 18h10.5a4 4 0 0 0 .5-8 6 6 0 0 0-11.6 1.3A3.5 3.5 0 0 0 7 18z"/></svg>',
    onmymac: '<svg viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
    airdrop: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="1.8"/><path d="M8.3 15.7a5.3 5.3 0 1 1 7.4 0M5.5 18.5a9.2 9.2 0 1 1 13 0"/></svg>',
    shared: '<svg viewBox="0 0 24 24"><path d="M12.5 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v2.5"/><circle cx="18" cy="14.6" r="1.9"/><path d="M14.3 20.5c.4-1.9 1.8-3 3.7-3s3.3 1.1 3.7 3"/></svg>',
    onedrive: '<svg viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 10h18"/></svg>',
    tags: '<svg viewBox="0 0 24 24"><circle cx="9" cy="12" r="5.5"/><circle cx="15" cy="12" r="5.5"/></svg>',
    share: '<svg viewBox="0 0 24 24"><path d="M12 15V3.5M8 7.5l4-4 4 4M7 11H5.5v9.5h13V11H17"/></svg>',
    tag: '<svg viewBox="0 0 24 24"><path d="M3.5 12.5V4h8.5l8.5 8.5-8.5 8.5z"/><circle cx="8" cy="8.5" r="1.4"/></svg>',
    more: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 12h.01M12 12h.01M16 12h.01" stroke-width="2.6"/></svg>',
  });
  FD_PLACES.splice(0, 0, ["home", SITE.short]);
  FD_PLACES.push(["icloud", "iCloud Drive"], ["onmymac", "On My Mac"], ["airdrop", "AirDrop"], ["shared", "Shared"], ["onedrive", "OneDrive"], ["tags", "All Tags…"],
    ...FD_TAGS.map(([n]) => ["tag-" + n.toLowerCase(), n]));
  const fdItemsBase = fdItems;
  fdItems = function (place) {
    const sub = (name, p) => ({ name, kind: "Folder", ic: "folder", children: () => fdItems(p) });
    if (place === "home") return [sub("Applications", "applications"), sub("Desktop", "desktop"), sub("Documents", "documents"), sub("Downloads", "downloads")];
    if (place === "icloud") return [sub("Desktop", "desktop"), sub("Documents", "documents"), sub("Downloads", "downloads")];
    if (place === "onmymac") return [sub("Applications", "applications"), sub("Downloads", "downloads")];
    if (place === "airdrop") return [];
    if (place === "onedrive") return [sub("Documents", "documents"), sub("Projects", "projects")];
    if (place === "shared") return [fdItemsBase("downloads")[0], ...fdItemsBase("projects")].filter(Boolean);
    if (place === "tags") return FD_TAGS.map(([n]) => sub(n, "tag-" + n.toLowerCase()));
    // Tags: Red = flagship projects, Blue = documents, Green = work experience.
    if (place === "tag-red") { const all = fdItemsBase("projects").flatMap((f) => f.children()), star = new Set(SITE.campaigns.filter((c) => c.featured).map((c) => c.title)); return all.filter((x) => star.has(x.name)); }
    if (place === "tag-blue") return fdItemsBase("documents").filter((x) => !x.children);
    if (place === "tag-green") return (fdItemsBase("documents").find((x) => x.children) || { children: () => [] }).children();
    if (place.startsWith("tag-")) return [];
    const list = fdItemsBase(place);
    if (place === "desktop") list.forEach((x) => { if (deskItems.some((d) => d.folder && d.name === x.name)) { x.kind = "Folder"; x.ic = "folder"; x.children = () => []; } });
    return list;
  };
  /* =====================================================================
     PHONE HOME SCREEN ORDER: Mail and LinkedIn sit on the second row
     (where Settings and Calendar used to be), Calendar takes Music's old spot,
     then Settings and Music follow.
     ===================================================================== */
  const buildDesktopOrder = buildDesktop;
  buildDesktop = () => {
    buildDesktopOrder();
    const grid = $("#home .home-grid"); if (!grid) return;
    const swap = (a, b) => { if (!a || !b || a === b) return; const mark = document.createComment(""); a.replaceWith(mark); b.replaceWith(a); mark.replaceWith(b); };
    const li = $("a.home-app", grid), cal = $('.home-app[data-app="calendar"]', grid);
    if (li && cal) cal.insertAdjacentElement("beforebegin", li);
    updateBadge();
  };
  /* =====================================================================
     PHONE: the phone's own Back button (or back swipe) works too.
     Inside an app it goes back one screen; on an app's first screen it
     goes to the Home screen. The home bar / app switch still work.
     ===================================================================== */
  let backIgnore = 0;
  const topPhoneWin = () => $$(".window").filter((w) => !w.classList.contains("minimized") && !w.classList.contains("kept")).sort((a, b) => b.style.zIndex - a.style.zIndex)[0];
  const openWindowBk = openWindow;
  openWindow = (opts) => {
    const existed = !!wins[opts.key];
    const w = openWindowBk(opts);
    if (isMobile() && !existed) { try { history.pushState({ arshaon: "app", key: opts.key }, ""); } catch {} }
    return w;
  };
  const closeWinBk = closeWin;
  closeWin = (w) => {
    closeWinBk(w);
    // Closed with the home bar or a button: tidy up the extra Back step.
    if (isMobile() && history.state && history.state.arshaon === "app" && !topPhoneWin()) { backIgnore++; try { history.back(); } catch { backIgnore--; } }
  };
  addEventListener("popstate", () => {
    if (backIgnore > 0) { backIgnore--; return; }
    if (!isMobile()) return;
    hideCtx();
    const w = topPhoneWin(); if (!w) return;
    const pages = $$(".ios-page.in", w);
    if (pages.length) {                       // a screen inside the app: go back one screen
      const pg = pages[pages.length - 1], back = $('[data-a="pop"]', pg);
      if (back) back.click(); else iosPop(pg);
      try { history.pushState({ arshaon: "app", key: w.dataset.key }, ""); } catch {}
      return;
    }
    goHome(w);                                // first screen: back to the Home screen
  });
  /* =====================================================================
     GUIDE (computer only): a small "Guide" button in the bottom-right corner,
     a short tour for first-time visitors and a fast track for recruiters.
     Tour texts can be changed in content.js (tour: { ... }).
     ===================================================================== */
  function endTour() { const o = $("#tour"); if (o) { o._off && o._off(); o.remove(); } }
  function startTour(steps) {
    if (isMobile()) return;
    endTour(); hideMenu(); hideNC(); hideCtx(); hideGuideTip();
    steps = steps.filter((s) => s);
    const ov = el(`<div id="tour" role="dialog" aria-label="Guided tour"><div class="tour-hole"></div>
      <div class="tour-card"><span class="tour-count"></span><h3></h3><p></p>
        <div class="tour-btns"><button class="tour-skip">Skip</button><i></i><button class="tour-back">Back</button><button class="tour-next">Next</button></div></div></div>`);
    const hole = $(".tour-hole", ov), card = $(".tour-card", ov);
    let i = 0, timer = 0;
    const place = () => {
      const s = steps[i], t = typeof s.target === "function" ? s.target() : $(s.target);
      if (!t) { card.style.left = (innerWidth - card.offsetWidth) / 2 + "px"; card.style.top = (innerHeight - card.offsetHeight) / 2 + "px"; hole.style.opacity = 0; return; }
      const r0 = t.getBoundingClientRect(), pad = s.pad == null ? 8 : s.pad;
      const r = { left: Math.max(6, r0.left - pad), top: Math.max(6, r0.top - pad), right: Math.min(innerWidth - 6, r0.right + pad), bottom: Math.min(innerHeight - 6, r0.bottom + pad) };
      hole.style.opacity = 1;
      Object.assign(hole.style, { left: r.left + "px", top: r.top + "px", width: r.right - r.left + "px", height: r.bottom - r.top + "px", borderRadius: (s.radius || 16) + "px" });
      const cw = card.offsetWidth, ch = card.offsetHeight, gap = 14, cx = clamp((r.left + r.right) / 2 - cw / 2, 12, innerWidth - cw - 12), cy = clamp((r.top + r.bottom) / 2 - ch / 2, 40, innerHeight - ch - 12);
      let x, y;
      if (innerHeight - r.bottom >= ch + gap + 8) { x = cx; y = r.bottom + gap; }            // below
      else if (r.top >= ch + gap + 36) { x = cx; y = r.top - ch - gap; }                      // above
      else if (innerWidth - r.right >= cw + gap + 8) { x = r.right + gap; y = cy; }           // right
      else if (r.left >= cw + gap + 8) { x = r.left - cw - gap; y = cy; }                     // left
      else { x = r.right - cw - 16; y = r.bottom - ch - 16; }                                 // inside
      card.style.left = x + "px"; card.style.top = y + "px";
    };
    const show = () => {
      const s = steps[i];
      clearTimeout(timer);
      $(".tour-count", card).textContent = `${i + 1} of ${steps.length}`;
      $("h3", card).textContent = s.title; $("p", card).textContent = s.text;
      $(".tour-back", card).hidden = i === 0;
      $(".tour-next", card).textContent = i === steps.length - 1 ? "Done" : "Next";
      if (s.before) s.before();
      place(); timer = setTimeout(() => { place(); timer = setTimeout(place, 350); }, s.before ? 380 : 60);
      $(".tour-next", card).focus({ preventScroll: true });
    };
    const key = (e) => {
      if (e.key === "Escape") { e.stopPropagation(); endTour(); }
      if (e.key === "ArrowRight") { e.preventDefault(); $(".tour-next", card).click(); }
      if (e.key === "ArrowLeft" && i > 0) { e.preventDefault(); i--; show(); }
    };
    ov.addEventListener("click", (e) => {
      if (e.target.closest(".tour-skip")) return endTour();
      if (e.target.closest(".tour-back")) { i = Math.max(0, i - 1); return show(); }
      if (e.target.closest(".tour-next")) { if (i >= steps.length - 1) return endTour(); i++; show(); }
    });
    document.addEventListener("keydown", key, true); addEventListener("resize", place);
    ov._off = () => { clearTimeout(timer); document.removeEventListener("keydown", key, true); removeEventListener("resize", place); };
    document.body.append(ov); show();
  }
  const tourText = (k, title, text) => { const t = (SITE.tour || {})[k] || []; return { title: t[0] || title, text: t[1] || text }; };
  function startVisitorTour() {
    try { localStorage.setItem("arshaon-guide-seen", "1"); } catch {}
    startTour([
      { target: '.window[data-key="notes"]', pad: 6, radius: 22, before: () => { openApp("notes"); const w = wins.notes; if (w) { w.classList.remove("minimized"); focusWin(w); } },
        ...tourText("notes", "Start with Notes", `This is my "about me". Pick a note on the left to read about my skills, career highlights and what I did at TikTok.`) },
      { target: "#dock", radius: 28,
        ...tourText("dock", "Every icon is an app", `Photos holds all ${SITE.campaigns.length} of my projects and campaigns. Messages lets you ask me anything. Hover over an icon to see its name.`) },
      { target: ".mb-hire", pad: 6, radius: 10,
        ...tourText("recruiters", "Short on time?", "For Recruiters is a 30-second summary with my resume, top results and recommendations. The magnifier on the right searches the whole site.") },
      { target: "#guide", pad: 6, radius: 22,
        ...tourText("guide", "That's it. Explore freely", "This Guide button is always here if you want the tour again, the recruiter fast track or the keyboard shortcuts.") },
    ]);
  }
  function startRecruiterTour() {
    try { localStorage.setItem("arshaon-guide-seen", "1"); } catch {}
    const sec = (k) => () => $(`.window[data-key="hire"] [data-sec="${k}"]`);
    const go = (k) => () => {
      openApp("hire"); const w = wins.hire; if (!w) return;
      w.classList.remove("minimized"); focusWin(w);
      const s = $(`[data-sec="${k}"]`, w), box = $(".wbody", w);
      if (s && box) box.scrollTop += s.getBoundingClientRect().top - box.getBoundingClientRect().top - Math.max(16, (box.clientHeight - s.offsetHeight) / 2);
      const b = $(`[data-step="${k}"]`, w); if (b) { hireSeen[k] = 1; try { localStorage.setItem("arshaon-fast", JSON.stringify(hireSeen)); } catch {} b.classList.add("done"); const n = $$("[data-step]", w), d = n.filter((x) => x.classList.contains("done")).length; $(".ht-prog", w).textContent = d >= n.length ? "All seen ✓" : `${d} of ${n.length} seen`; }
    };
    const has = (k) => { openApp("hire"); return wins.hire && $(`[data-sec="${k}"]`, wins.hire); };
    startTour([
      { target: sec("proof"), before: go("proof"), ...tourText("proof", "1. The proof, in numbers", "Scale first: years of experience, reach, partners and markets, then three reasons I'm worth a place on your shortlist.") },
      has("work") && { target: sec("work"), before: go("work"), ...tourText("work", "2. Flagship work", "Three case studies that show how I work. Click a card after the tour to open the full story with results.") },
      has("recs") && { target: sec("recs"), before: go("recs"), ...tourText("recs", "3. What colleagues say", "One click opens my LinkedIn recommendations, written by people I've worked with, so you don't have to take my word for it.") },
      { target: sec("contact"), before: go("contact"), ...tourText("contact", "4. Resume and contact", "One click to download my resume or email me. That's the whole fast track.") },
    ]);
  }
  function hideGuideTip() { const t = $("#guide-tip"); if (t) t.remove(); }
  function guideMenu() {
    hideGuideTip();
    const r = $("#guide").getBoundingClientRect();
    showCtx(r.right - 250, r.top - 190, [["Take the quick tour", startVisitorTour, "30 sec"], ["Recruiter fast track", startRecruiterTour, "2 min"],
      ["Recommendations on LinkedIn ↗", () => window.open(recsInfo().url, "_blank", "noopener")], "-",
      ["Keyboard Shortcuts", showShortcuts, "?"]]);
  }
  {
    const g = el(`<button id="guide" hidden></button>`);
    g.addEventListener("click", (e) => { e.stopPropagation(); if ($("#ctx")) hideCtx(); else guideMenu(); });
    document.body.append(g);
    // First visit: one small, self-dismissing hint above the Guide button.
    let seen = true; try { seen = !!localStorage.getItem("arshaon-guide-seen"); } catch {}
    if (false) setTimeout(() => {
      if (isMobile() || $("#tour") || !$("#lock").hidden) return;
      const tip = el(`<div id="guide-tip" role="status"><b>New here? 👋</b><span>Take a 30-second tour of this site.</span>
        <div><button class="gt-go">Start tour</button><button class="gt-rec">I'm a recruiter</button><button class="gt-x" aria-label="Dismiss">×</button></div></div>`);
      const done = () => { try { localStorage.setItem("arshaon-guide-seen", "1"); } catch {} hideGuideTip(); };
      tip.addEventListener("click", (e) => {
        if (e.target.closest(".gt-go")) { done(); startVisitorTour(); }
        else if (e.target.closest(".gt-rec")) { done(); startRecruiterTour(); }
        else if (e.target.closest(".gt-x")) done();
      });
      document.body.append(tip);
      setTimeout(done, 25000);
    }, 1800);
    const helpTour = MENUS.help;
    MENUS.help = () => [["Take the Quick Tour", startVisitorTour], ["Recruiter Fast Track", startRecruiterTour], ...helpTour()];
  }
  /* =====================================================================
     VISITOR STATS (GoatCounter): page views plus a few useful moments.
     Your dashboard: the address in SITE.goatcounter, without "/count".
     No cookies and nothing personal is collected.
     ===================================================================== */
  function gcSlug(t) { return String(t || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60); }
  function gcEvent(path, title) {
    try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path, title: title || path, event: true }); } catch {}
  }
  if (SITE.goatcounter && !/^(localhost|127\.|file)/.test(location.hostname || "file")) {
    const gs = document.createElement("script");
    gs.async = true; gs.src = "https://gc.zgo.at/count.js"; gs.dataset.goatcounter = SITE.goatcounter;
    document.head.append(gs);
  }
  const gcStart = Date.now();
  const openAppGc = openApp;
  openApp = (id, arg) => {
    // The first window opens by itself on arrival, so only count apps visitors open.
    if (Date.now() - gcStart > 2500 && APPS[id]) gcEvent("app/" + id, "Opened " + (APPS[id].name || id));
    return openAppGc(id, arg);
  };
  const openDocGc = openDoc;
  openDoc = (id) => {
    if (/^c\d+$/.test(id)) { const c = SITE.campaigns[+id.slice(1)]; if (c) gcEvent("project/" + gcSlug(c.title), "Project: " + c.title); }
    return openDocGc(id);
  };
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]"); if (!a) return;
    const href = a.getAttribute("href") || "";
    if (SITE.resume && href.includes(SITE.resume.split("/").pop())) gcEvent("resume-download", "Resume opened or downloaded");
    else if (/linkedin\.com/.test(href)) gcEvent("linkedin", "LinkedIn link clicked");
  }, true);
  init();
})();
