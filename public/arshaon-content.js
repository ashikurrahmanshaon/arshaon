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
  email: "arshaonx@gmail.com",
  linkedin: "https://www.linkedin.com/in/ashikurrahmanshaon/",
  resume: "Ashikur-Rahman-Shaon-Resume.pdf",
  favicon: "/icons/apple-favicon.svg?v=apple3",
  photo: "icons/ashikur.jpg",
  status: "Founder @ ARSHAON (arshaon.com)",
  noteEndpoint: "/api/note",
  mailEndpoint: "/api/mail",
  inboxEndpoint: "/api/inbox",

  /* ---------------- PERSONAL PHOTOS (Photos App) ---------------- */
  eventPhotos: [
    {
      src: "images/photos/ashikur-portrait.jpg",
      event: "Portraits",
      caption: "Ashikur Rahman Shaon — Founder at ARSHAON",
      date: "2026-01-15",
    },
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
      title: "👋 About Ashikur Rahman Shaon",
      pinned: true,
      date: "Pinned",
      html: `
        <h1>Ashikur Rahman Shaon</h1>
        <p><b>Digital Entrepreneur, Marketing Strategist &amp; Creative Technologist</b> — Founder of <b>ARSHAON</b> (<a data-open="safari" data-arg="arshaon">arshaon.com</a>).</p>
        <p>I build modern web platforms, scalable SaaS applications, AI automation workflows, and full-funnel digital growth systems across Meta Ads, Google Ads, and Technical SEO.</p>
        <h2>Quick Links</h2>
        <ul>
          <li><a data-open="preview">📄 My CV / Resume</a> — View, print, or download my A4 PDF Resume</li>
          <li><a data-open="photos" data-arg="library">📷 My Photos</a> — View my personal photo gallery</li>
          <li><a data-open="safari" data-arg="linkedin">🔗 LinkedIn Profile</a> — View my LinkedIn inside Mac</li>
          <li><a data-open="messages">💬 Messages</a> — Chat with me directly</li>
          <li><a data-open="mail">✉️ Mail</a> — Send me a message or email (<a href="mailto:arshaonx@gmail.com">arshaonx@gmail.com</a>)</li>
        </ul>
        <p><i>Want to leave me a private note? Click <b>+ Write a Note</b> on the left — your note saves in your browser and can be sent privately to my inbox or via email.</i></p>`,
    },
    {
      title: "💼 Experience & Core Skills",
      pinned: true,
      date: "Pinned",
      html: `
        <h1>Experience &amp; Core Skills</h1>
        <h2>Experience</h2>
        <ul>
          <li><b>Founder &amp; Lead Digital Strategist — ARSHAON</b> (2020 – Present)<br>Leading full-stack web &amp; SaaS product engineering, AI workflow automation, and performance marketing systems.</li>
          <li><b>Performance Marketing Specialist — ARSHAON Growth</b> (2019 – Present)<br>Scaling full-funnel acquisition across Meta Ads (Pixel + Server-Side CAPI), Google Ads (Search, PMax, YouTube), and Technical SEO.</li>
          <li><b>Creative Technologist &amp; AI Architect — ARSHAON Studio</b> (2021 – Present)<br>Building custom LLM automation pipelines, high-speed e-commerce storefronts, and interactive digital experiences.</li>
        </ul>
        <h2>Core Capabilities</h2>
        <ul>
          <li><b>Web &amp; SaaS:</b> Next.js, React, TypeScript, Tailwind CSS, E-Commerce Architecture</li>
          <li><b>Digital Growth:</b> Meta Ads, Server-Side CAPI, Google Ads, Technical SEO, GA4 &amp; GTM</li>
          <li><b>AI &amp; Automation:</b> Custom AI Agents, LLM APIs, Webhook &amp; CRM Workflows</li>
        </ul>`,
    },
    {
      title: "📬 Contact & Direct Reach",
      pinned: true,
      date: "Pinned",
      html: `
        <h1>Get in Touch</h1>
        <p>Available for strategic projects, SaaS product builds, AI automation, and growth partnerships.</p>
        <ul>
          <li><b>Email:</b> <a href="mailto:arshaonx@gmail.com">arshaonx@gmail.com</a></li>
          <li><b>LinkedIn:</b> <a data-open="safari" data-arg="linkedin">linkedin.com/in/ashikurrahmanshaon</a></li>
          <li><b>Website:</b> <a data-open="safari" data-arg="arshaon">arshaon.com</a></li>
          <li><b>Location:</b> Dhaka, Bangladesh</li>
        </ul>
        <p>You can also click <b>+ Write a Note</b> in this app to send a private message straight to me, or open the <a data-open="mail">Mail</a> app.</p>`,
    },
  ],

  /* ---------------- EXPERIENCE (Finder, Mobile Work Widget & CV Reference) ---------------- */
  workWidget: true,
  experience: [
    {
      role: "Founder & Lead Digital Strategist",
      company: "ARSHAON",
      dates: "2020 – Present",
      logo: "icons/ashikur.jpg",
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
    "Feel free to ask about my CV, skills, photos, or email me at arshaonx@gmail.com.",
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
      words: ["contact", "email", "hire", "reach", "message", "note", "talk", "linkedin"],
      a: "You can write a private note to me in the Notes app, send a message in the Mail app, check my LinkedIn (linkedin.com/in/ashikurrahmanshaon), or email arshaonx@gmail.com.",
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
  accountLabel: "arshaonx@gmail.com",
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
