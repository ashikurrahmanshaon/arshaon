/* =====================================================================
   ARSHAON OS — CONTENT CONFIGURATION (arshaon.com)
   Owner: Ashikur Rahman Shaon (ARSHAON)
   Focused on: Information, CV / Resume, Personal Photos & Direct Contact
   ===================================================================== */

window.SITE = {
  name: "Ashikur Rahman Shaon",
  short: "Ashikur",
  siteTitle: "Ashikur Rahman Shaon — ARSHAON",
  title: "Digital Entrepreneur, Marketing Strategist & Creative Technologist",
  mobileTitle: "Founder · ARSHAON",
  location: "Dhaka, Bangladesh · arshaon.com",
  email: "info@arshaon.com",
  linkedin: "https://www.linkedin.com/in/ashikurrahmanshaon/",
  resume: "Ashikur-Rahman-Shaon-Resume.pdf",
  favicon: "/icons/apple-favicon.svg?v=appleblack1",
  photo: "icons/ashikur.jpg?v=20261116a",
  status: "Founder @ ARSHAON (arshaon.com)",
  noteEndpoint: "/api/note",
  mailEndpoint: "/api/mail",
  inboxEndpoint: "/api/inbox",

  /* ---------------- PERSONAL PHOTOS (Photos App — Only 2 Photos) ---------------- */
  eventPhotos: [
    {
      src: "images/photos/ashikur-lamborghini.jpg",
      event: "Lifestyle",
      caption: "Ashikur Rahman Shaon — Lamborghini Aventador",
      date: "2026-02-10",
    },
    {
      src: "images/photos/ashikur-bmw.jpg",
      event: "Lifestyle",
      caption: "Ashikur Rahman Shaon — Night Drive",
      date: "2026-03-05",
    },
  ],

  /* ---------------- NOTES APP (Concise Information About Ashikur) ---------------- */
  notes: [
    {
      title: "About Ashikur Rahman Shaon",
      pinned: true,
      date: "Pinned",
      html: `
        <div class="nt-hero-card">
          <div class="nt-hero-top">
            <img class="nt-hero-av" src="icons/ashikur.jpg?v=20261115f" alt="Ashikur Rahman Shaon">
            <div class="nt-hero-meta">
              <div class="nt-hero-badge"><span class="nt-dot"></span> Available for Strategic Projects</div>
              <h1>Ashikur Rahman Shaon <span class="nt-verified" title="Verified">✓</span></h1>
              <p class="nt-hero-role">Founder &amp; Digital Product Architect · <b>ARSHAON</b> (<a data-open="safari" data-arg="arshaon">arshaon.com</a>) · <a data-open="mail">info@arshaon.com</a></p>
            </div>
          </div>
          <p class="nt-hero-bio">I design and engineer high-speed web platforms, scalable SaaS applications, custom AI automation workflows, and full-funnel digital growth systems across Meta Ads, Google Ads, and Technical SEO.</p>
          <div class="nt-act-row">
            <button type="button" class="nt-act-btn primary" data-open="preview"><svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 1.8H4.2A1.4 1.4 0 0 0 2.8 3.2v9.6a1.4 1.4 0 0 0 1.4 1.4h7.6a1.4 1.4 0 0 0 1.4-1.4V5.5z"/><path d="M9.5 1.8v3.7h3.7M5.5 8.5h5M5.5 11.2h3.5"/></svg><span>View CV</span></button>
            <button type="button" class="nt-act-btn mail-pill" data-open="mail"><svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><rect x="1.8" y="3.2" width="12.4" height="9.6" rx="1.8"/><path d="M2.2 4l5.8 4.4L13.8 4"/></svg><span>info@arshaon.com</span></button>
            <button type="button" class="nt-act-btn" data-open="photos" data-arg="library"><svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><rect x="1.8" y="2.5" width="12.4" height="11" rx="2"/><circle cx="5.4" cy="6.1" r="1.2"/><path d="M2.2 11.8l3.5-3.4 2.4 2.3 2.1-2 3.8 3.5"/></svg><span>Photos</span></button>
            <button type="button" class="nt-act-btn" data-open="safari" data-arg="linkedin"><svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><path d="M6.8 9.2a3 3 0 0 0 4.2 0l2-2a3 3 0 0 0-4.2-4.2L7.7 4.1"/><path d="M9.2 6.8a3 3 0 0 0-4.2 0l-2 2a3 3 0 0 0 4.2 4.2l1.1-1.1"/></svg><span>LinkedIn</span></button>
            <button type="button" class="nt-act-btn" data-open="messages"><svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2.2c3.6 0 6.4 2.3 6.4 5.2s-2.8 5.2-6.4 5.2c-.8 0-1.6-.1-2.3-.3L2.6 13.8l.8-2.6C2.3 10.2 1.6 8.9 1.6 7.4c0-2.9 2.8-5.2 6.4-5.2z"/></svg><span>Messages</span></button>
          </div>
        </div>
        <h2>What I Build</h2>
        <div class="nt-bento">
          <div class="nt-bento-card">
            <span class="nt-bento-ic blue"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></span>
            <b>Web &amp; SaaS Engineering</b>
            <small>Next.js, React, TypeScript, Tailwind CSS &amp; high-converting digital storefronts.</small>
          </div>
          <div class="nt-bento-card">
            <span class="nt-bento-ic green"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></svg></span>
            <b>Performance Marketing</b>
            <small>Meta Ads (Pixel + Server-Side CAPI), Google Ads (Search, PMax) &amp; Technical SEO.</small>
          </div>
          <div class="nt-bento-card">
            <span class="nt-bento-ic purple"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"/><path d="M19 16l.9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9L19 16z"/></svg></span>
            <b>AI &amp; Automation</b>
            <small>Custom LLM agents, automated CRM pipelines, and intelligent business workflows.</small>
          </div>
        </div>
        <p class="nt-tip-box"><b>Leave a Private Note:</b> Click <b>Write a Note to Ashikur</b> in the sidebar to send a private note directly to my inbox.</p>`,
    },
    {
      title: "Experience & Core Skills",
      pinned: true,
      date: "Pinned",
      html: `
        <h1>Experience &amp; Core Skills</h1>
        <div class="nt-exp-list">
          <div class="nt-exp-item">
            <div class="nt-exp-head"><b>Founder &amp; Lead Digital Strategist — ARSHAON</b><span>2020 – Present</span></div>
            <p>Leading full-stack web &amp; SaaS product engineering, AI workflow automation, and performance marketing systems at <a data-open="safari" data-arg="arshaon">arshaon.com</a>.</p>
          </div>
          <div class="nt-exp-item">
            <div class="nt-exp-head"><b>Performance Marketing Specialist — Growth &amp; Ads</b><span>2019 – Present</span></div>
            <p>Scaling full-funnel acquisition across Meta Ads (Pixel + Server-Side CAPI), Google Ads (Search, PMax, YouTube), GA4 &amp; GTM attribution.</p>
          </div>
          <div class="nt-exp-item">
            <div class="nt-exp-head"><b>Full-Stack &amp; AI Product Architect — SaaS &amp; AI</b><span>2021 – Present</span></div>
            <p>Building custom LLM automation pipelines, high-speed e-commerce storefronts, and interactive digital experiences.</p>
          </div>
        </div>
        <h2>Core Capabilities</h2>
        <div class="nt-skill-chips">
          <span>Next.js &amp; React</span><span>TypeScript</span><span>Tailwind CSS</span><span>Full-Stack SaaS</span>
          <span>Meta Ads &amp; CAPI</span><span>Google Ads &amp; PMax</span><span>Technical SEO</span><span>GA4 &amp; GTM</span>
          <span>AI Workflow Automation</span><span>LLM Integrations</span><span>E-Commerce Systems</span>
        </div>`,
    },
    {
      title: "Contact & Direct Reach",
      pinned: true,
      date: "Pinned",
      html: `
        <h1>Get in Touch</h1>
        <p>Available for strategic projects, SaaS product builds, AI automation, and growth partnerships.</p>
        <div class="nt-bento">
          <div class="nt-bento-card">
            <span class="nt-bento-ic blue"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 6l8.5 6.5L20.5 6"/></svg></span>
            <b>Official Email</b>
            <small><a href="mailto:info@arshaon.com">info@arshaon.com</a></small>
          </div>
          <div class="nt-bento-card">
            <span class="nt-bento-ic linkedin"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></span>
            <b>LinkedIn Profile</b>
            <small><a data-open="safari" data-arg="linkedin">in/ashikurrahmanshaon</a></small>
          </div>
          <div class="nt-bento-card">
            <span class="nt-bento-ic amber"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 1 1 13 0c0 5.2-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg></span>
            <b>Location &amp; Web</b>
            <small><a data-open="safari" data-arg="arshaon">Dhaka, Bangladesh · arshaon.com</a></small>
          </div>
        </div>
        <div class="nt-act-row" style="margin-top:14px">
          <button type="button" class="nt-act-btn primary" data-open="mail"><svg viewBox="0 0 16 16" width="13.5" height="13.5" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><rect x="1.8" y="3.2" width="12.4" height="9.6" rx="1.8"/><path d="M2.2 4l5.8 4.4L13.8 4"/></svg><span>Email info@arshaon.com</span></button>
          <button type="button" class="nt-act-btn" data-open="messages"><svg viewBox="0 0 16 16" width="13.5" height="13.5" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2.2c3.6 0 6.4 2.3 6.4 5.2s-2.8 5.2-6.4 5.2c-.8 0-1.6-.1-2.3-.3L2.6 13.8l.8-2.6C2.3 10.2 1.6 8.9 1.6 7.4c0-2.9 2.8-5.2 6.4-5.2z"/></svg><span>Live Chat in Messages</span></button>
          <button type="button" class="nt-act-btn" data-open="preview"><svg viewBox="0 0 16 16" width="13.5" height="13.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 1.8H4.2A1.4 1.4 0 0 0 2.8 3.2v9.6a1.4 1.4 0 0 0 1.4 1.4h7.6a1.4 1.4 0 0 0 1.4-1.4V5.5z"/><path d="M9.5 1.8v3.7h3.7M5.5 8.5h5M5.5 11.2h3.5"/></svg><span>View My CV</span></button>
        </div>`,
    },
  ],

  /* ---------------- EXPERIENCE (Finder, Mobile Work Widget & CV Reference) ---------------- */
  workWidget: true,
  experience: [
    {
      role: "Founder & Lead Digital Strategist",
      company: "ARSHAON",
      dates: "2020 – Present",
      logo: "icons/ashikur.jpg?v=20261115f",
      color: "#0a84ff",
      link: "https://arshaon.com",
      about: "Full-stack digital product engineering, AI automation, and performance marketing under ARSHAON (arshaon.com).",
      points: [
        "Direct end-to-end digital strategy, modern web & SaaS development (Next.js, React, TypeScript), and brand positioning.",
        "Architect conversion-focused UI/UX, technical SEO, and server-side analytics attribution.",
      ],
    },
    {
      role: "Performance Marketing & Growth Specialist",
      company: "Growth & Ads",
      dates: "2019 – Present",
      color: "#0a84ff",
      link: "https://arshaon.com",
      about: "Full-funnel customer acquisition across Meta Ads, Google Ads, and Technical SEO.",
      points: [
        "Scale paid acquisition across Meta Ads (Pixel + Server-Side CAPI) and Google Ads (Search, PMax, YouTube).",
        "Implement Google Tag Manager (GTM), GA4 attribution, and conversion rate optimization.",
      ],
    },
    {
      role: "Full-Stack & AI Product Architect",
      company: "SaaS & AI",
      dates: "2021 – Present",
      color: "#111111",
      link: "https://arshaon.com",
      about: "Custom AI workflow automation, LLM integrations, and high-speed web & e-commerce platforms.",
      points: [
        "Build custom AI agents, webhook & CRM pipelines, and scalable Next.js / TypeScript web applications.",
        "Engineer ultra-fast, high-converting digital storefronts and interactive brand experiences.",
      ],
    },
  ],

  socialMedia: { show: false },
  education: [],

  /* ---------------- NO BLOATED FAKE CAMPAIGNS ---------------- */
  campaigns: [],

  /* ---------------- SKILLS ---------------- */
  skills: {
    "Web & SaaS Engineering": [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Full-Stack Web Apps",
      "E-Commerce Storefronts",
    ],
    "Digital Marketing & Growth": [
      "Meta Ads & CAPI",
      "Google Ads (Search & PMax)",
      "Technical SEO",
      "GA4 & Google Tag Manager",
      "Conversion Optimization",
    ],
    "AI & Automation": [
      "AI Workflow Automation",
      "LLM Integrations",
      "CRM & Webhook Pipelines",
    ],
    "Languages": ["Bengali (Native)", "English (Fluent)"],
  },

  /* ---------------- MESSAGES APP (Direct Chat with Ashikur) ---------------- */
  chatGreeting: [
    "Hi 👋 I'm Ashikur Rahman Shaon.",
    "Welcome to my workspace! You can ask about my background, skills, CV, photos, or how to get in touch.",
  ],
  chatFallback:
    "Feel free to ask about my CV, skills, photos, or email me at info@arshaon.com.",
  chat: [
    {
      q: "Tell me about yourself",
      words: ["about", "who are you", "arshaon", "what do you do", "intro", "bio", "yourself"],
      a: "I'm Ashikur Rahman Shaon — Founder of ARSHAON (arshaon.com). I specialize in full-stack web & SaaS development, AI automation, and performance marketing (Meta Ads, Google Ads & SEO).",
    },
    {
      q: "View or download your CV",
      words: ["cv", "resume", "pdf", "download", "print"],
      a: "You can open the Preview app from the Dock or double-click 'My CV.pdf' on the desktop to view, print, or download my CV.",
    },
    {
      q: "See your photos",
      words: ["photo", "picture", "gallery", "image", "lamborghini", "bmw", "portrait"],
      a: "Open the Photos app from the Dock to view my personal photos in full resolution!",
    },
    {
      q: "How can I contact you?",
      words: ["contact", "email", "info@arshaon.com", "hire", "reach", "message", "note", "talk", "linkedin", "mail"],
      a: "You can email me directly at info@arshaon.com (click the Mail app), write a private note in Notes, or connect with me on LinkedIn.",
    },
  ],
  chatExtra: [
    {
      words: ["hello", "hi", "hey", "salam", "assalamu"],
      a: "Hello! 👋 Welcome to arshaon.com. Feel free to check out my Notes, Photos, or CV!",
    },
  ],
  chatPrivate: [],
  conversations: [],

  /* ---------------- CALENDAR ---------------- */
  timezone: "Asia/Dhaka",
  calendarEvents: [],

  /* ---------------- CLEAN BIN ---------------- */
  trash: [],

  /* ---------------- SETTINGS / IDENTITY ---------------- */
  accountLabel: "info@arshaon.com",
  mac: {
    deviceName: "Ashikur Rahman Shaon",
    model: "ARSHAON",
    osName: "ARSHAON",
    osVersion: "",
  },
  wifi: {
    network: "ARSHAON-5G",
    hotspot: "Ashikur's iPhone",
    others: [],
  },
  bluetoothDevices: [],

  /* ---------------- WALLPAPERS ---------------- */
  wallpapers: [
    { name: "Sequoia", src: "images/wallpapers/sequoia-wallpaper.jpg", thumb: "images/wallpapers/sequoia-wallpaper-thumb.jpg" },
    { name: "Sonoma", src: "images/wallpapers/sonoma-wallpaper.jpg", thumb: "images/wallpapers/sonoma-wallpaper-thumb.jpg" },
    { name: "Mojave", src: "images/wallpapers/mojave-wallpaper.jpg", thumb: "images/wallpapers/mojave-wallpaper-thumb.jpg" },
    { name: "Sierra", src: "images/wallpapers/sierra-wallpaper.jpg", thumb: "images/wallpapers/sierra-wallpaper-thumb.jpg" },
    { name: "El Capitan", src: "images/wallpapers/elcapitan-wallpaper.jpg", thumb: "images/wallpapers/elcapitan-wallpaper-thumb.jpg" },
    { name: "Yosemite", src: "images/wallpapers/yosemite-wallpaper.jpg", thumb: "images/wallpapers/yosemite-wallpaper-thumb.jpg" },
    { name: "Tahoe", src: "images/wallpapers/tahoe-wallpaper.jpg", thumb: "images/wallpapers/tahoe-wallpaper-thumb.jpg" },
    { name: "Mountain Lion", src: "images/wallpapers/mountain-lion-wallpaper.jpg", thumb: "images/wallpapers/mountain-lion-wallpaper-thumb.jpg" },
    { name: "Lion", src: "images/wallpapers/lion-wallpaper.jpg", thumb: "images/wallpapers/lion-wallpaper-thumb.jpg" },
    { name: "Snow Leopard", src: "images/wallpapers/snow-leopard-wallpaper.jpg", thumb: "images/wallpapers/snow-leopard-wallpaper-thumb.jpg" },
    { name: "Leopard", src: "images/wallpapers/leopard-server-wallpaper.jpg", thumb: "images/wallpapers/leopard-server-wallpaper-thumb.jpg" },
  ],
  defaultWallpaper: "images/wallpapers/sequoia-wallpaper.jpg",

  goatcounter: "",

  /* ---------------- WEATHER WIDGET ---------------- */
  weather: { show: true, city: "Dhaka", lat: 23.8103, lon: 90.4125 },

  /* ---------------- PHONE WALLPAPERS (iOS) ---------------- */
  phoneWallpapers: [
    { name: "Midnight", src: "images/wallpapers/iphone wallpaper (1).jpg" },
    { name: "Sand", src: "images/wallpapers/iphone wallpaper (2).jpg" },
    { name: "Graphite", src: "images/wallpapers/iphone wallpaper (3).jpg" },
    { name: "Bronze", src: "images/wallpapers/iphone wallpaper (4).jpg" },
    { name: "Ocean", src: "images/wallpapers/iphone wallpaper (5).jpg" },
    { name: "Deep Blue", src: "images/wallpapers/iphone wallpaper (6).jpg" },
    { name: "Gold", src: "images/wallpapers/iphone wallpaper (7).jpg" },
    { name: "Rose", src: "images/wallpapers/iphone wallpaper (8).jpg" },
  ],
  defaultPhoneWallpaper: "images/wallpapers/iphone wallpaper (5).jpg",

  socials: [
    { name: "LinkedIn", url: "https://www.linkedin.com/in/ashikurrahmanshaon/" },
  ],

  playlists: [],
  folderCovers: {},
  newsStyle: "button",

  sticky: {
    show: false,
  },

  menuLogo: "",
  menuLogoText: "",

  icons: {
    finder: "icons/finder.png",
    files: "icons/files.png",
    launchpad: "icons/launchpad.png",
    safari: "icons/safari.png",
    notes: "icons/notes.png",
    messages: "icons/messages.png",
    mail: "icons/mail.png",
    photos: "icons/photos.png",
    music: "icons/music.png",
    calendar: "icons/calendar.png",
    preview: "icons/preview.png",
    terminal: "icons/terminal.png",
    settings: "icons/settings.png",
    linkedin: "icons/linkedin.png",
    trash: "icons/trash.png",
  },
};
