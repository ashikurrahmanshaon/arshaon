const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

if (process.argv.includes("--check")) {
  console.log("Build check complete — ARSHAON OS ready.");
  process.exit(0);
}

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");
const DATA_DIR = path.join(__dirname, "data");
const INBOX_FILE = path.join(DATA_DIR, "private-inbox.json");
const INBOX_PASS = process.env.INBOX_PASSWORD || "arshaon2026";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

const INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
  <meta name="theme-color" content="#0b0c12" />
  <title>Ashikur Rahman Shaon — ARSHAON OS</title>
  <meta name="description" content="The interactive portfolio of Ashikur Rahman Shaon (ARSHAON · arshaon.com) — Digital Entrepreneur, Marketing Strategist &amp; Creative Technologist. Explore my work on a tiny Apple computer in your browser." />
  <link rel="canonical" href="https://arshaon.com" />
  <link rel="icon" href="/icons/apple-favicon.svg?v=apple3" type="image/svg+xml" />
  <link rel="icon" href="/icons/favicon.png?v=apple3" type="image/png" sizes="64x64" />
  <link rel="shortcut icon" href="/favicon.ico?v=apple3" />
  <link rel="apple-touch-icon" href="/icons/favicon.png?v=apple3" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:url" content="https://arshaon.com" />
  <meta property="og:site_name" content="ARSHAON OS — Ashikur Rahman Shaon" />
  <meta property="og:title" content="Ashikur Rahman Shaon — ARSHAON OS" />
  <meta property="og:description" content="Explore the work of Ashikur Rahman Shaon (ARSHAON) on an interactive macOS &amp; iOS computer in your browser." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Ashikur Rahman Shaon — ARSHAON OS" />
  <meta name="twitter:description" content="Explore the work of Ashikur Rahman Shaon (ARSHAON) on an interactive macOS &amp; iOS computer in your browser." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/styles.css?v=20261115a" />
</head>
<body>
  <div id="wallpaper">
    <svg id="skyline" viewBox="0 0 1440 260" preserveAspectRatio="xMidYMax slice"></svg>
  </div>

  <header class="menubar">
    <div class="mb-left">
      <button class="mb-item mb-logo" data-menu="brand" aria-label="Apple Menu">
        <svg class="mb-apple-svg" viewBox="0 0 814 1000" width="12" height="14.5" fill="currentColor" style="display:block" aria-hidden="true">
          <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"></path>
        </svg>
      </button>
      <button class="mb-item mb-bold" id="mb-app" data-menu="app">Finder</button>
      <button class="mb-item mb-hide" data-menu="file">File</button>
      <button class="mb-item mb-hide" data-menu="edit">Edit</button>
      <button class="mb-item mb-hide" data-menu="view">View</button>
      <button class="mb-item mb-hide" data-menu="go">Go</button>
      <button class="mb-item mb-hide" data-menu="window">Window</button>
      <button class="mb-item mb-hide" data-menu="help">Help</button>
    </div>
    <div class="mb-right">
      <span class="mb-icon mb-hide" title="Battery">
        <span class="mb-batt-pct">100%</span>
        <svg class="mb-batt-svg" viewBox="0 0 25 12" aria-hidden="true">
          <rect x="0.75" y="0.75" width="20.5" height="10.5" rx="3" fill="none" stroke="currentColor" stroke-width="1.15" stroke-opacity="0.48"></rect>
          <rect class="mb-batt-fill" x="2.5" y="2.5" width="17" height="7" rx="1.6" fill="currentColor" stroke="none"></rect>
          <path d="M22.6 4.1c.95.25 1.55.95 1.55 1.9s-.6 1.65-1.55 1.9V4.1z" fill="currentColor" stroke="none" fill-opacity="0.48"></path>
        </svg>
      </span>
      <span class="mb-icon" title="Wi-Fi">
        <svg class="mb-wifi-svg" viewBox="0 0 18 14" aria-hidden="true">
          <path d="M1.4 4.5a11.2 11.2 0 0 1 15.2 0M4.5 7.8a6.8 6.8 0 0 1 9 0" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"></path>
          <circle cx="9" cy="11.2" r="1.45" fill="currentColor" stroke="none"></circle>
        </svg>
      </span>
      <button class="mb-item mb-icon" data-menu="control" aria-label="Control centre">
        <svg class="mb-cc-svg" viewBox="0 0 18 18" aria-hidden="true">
          <rect x="1.5" y="2.2" width="15" height="6.2" rx="3.1" fill="none" stroke="currentColor" stroke-width="1.35"></rect>
          <circle cx="13.3" cy="5.3" r="1.95" fill="currentColor" stroke="none"></circle>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M4.6 9.8h8.8a3.1 3.1 0 1 1 0 6.2H4.6a3.1 3.1 0 1 1 0-6.2zm.3 5a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8z" fill="currentColor" stroke="none"></path>
        </svg>
      </button>
      <button class="mb-item" id="clock" aria-label="Notification centre"></button>
    </div>
  </header>

  <div id="desk-icons"></div>
  <div id="home"></div>
  <div id="windows"></div>
  <nav class="dock" id="dock"></nav>
  <div id="menu" class="menu" hidden></div>
  <aside id="nc" class="nc" hidden></aside>

  <div id="lock" class="overlay lock" hidden>
    <div class="lock-time" id="lock-time"></div>
    <div class="lock-date" id="lock-date"></div>
    <div class="lock-user">
      <div class="avatar big" id="lock-avatar"></div>
      <div class="lock-name" id="lock-name"></div>
      <button class="lock-btn" id="lock-btn">Click to enter →</button>
    </div>
  </div>
  <div id="sleep" class="overlay sleep" hidden></div>
  <div id="boot" class="overlay boot" hidden>
    <div class="boot-logo"></div>
    <div class="boot-bar"><span></span></div>
    <div class="boot-hint" id="boot-hint"></div>
  </div>

  <script src="/arshaon-content.js?v=20261115a"></script>
  <script src="/arshaon-os.js?v=20261115a"></script>
</body>
</html>`;

function readInbox() {
  try {
    if (!fs.existsSync(INBOX_FILE)) return [];
    const raw = fs.readFileSync(INBOX_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeInbox(items) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(INBOX_FILE, JSON.stringify(items, null, 2), "utf8");
  } catch {}
}

function readJsonBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1e6) req.destroy();
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        resolve({});
      }
    });
    req.on("error", () => resolve({}));
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const rawPath = (req.url || "/").split("?")[0];
  let cleanPath = "/";
  try {
    cleanPath = decodeURIComponent(rawPath);
  } catch {
    cleanPath = rawPath;
  }

  // API endpoints for Notes, Mail, and Private Inbox
  if (req.method === "POST" && cleanPath === "/api/note") {
    const body = await readJsonBody(req);
    if (body && body.website) return sendJson(res, 200, { ok: true });
    const note = String((body && body.note) || "").trim();
    const email = String((body && body.email) || "").trim();
    if (!note) return sendJson(res, 400, { ok: false, error: "Please write a note first." });
    const items = readInbox();
    const item = {
      id: crypto.randomUUID ? crypto.randomUUID() : "n_" + Date.now(),
      kind: "note",
      email,
      text: note,
      time: Math.floor(Date.now() / 1000),
    };
    items.unshift(item);
    writeInbox(items.slice(0, 500));
    return sendJson(res, 200, { ok: true, id: item.id, receivedAt: new Date(item.time * 1000).toISOString() });
  }

  if (req.method === "POST" && cleanPath === "/api/mail") {
    const body = await readJsonBody(req);
    if (body && body.website) return sendJson(res, 200, { ok: true });
    const message = String((body && body.message) || "").trim();
    const subject = String((body && body.subject) || "").trim();
    const email = String((body && body.email) || "").trim();
    if (!message) return sendJson(res, 400, { ok: false, error: "Please write a message." });
    const fullText = subject ? `${subject}\n\n${message}` : message;
    const items = readInbox();
    const item = {
      id: crypto.randomUUID ? crypto.randomUUID() : "m_" + Date.now(),
      kind: "mail",
      email,
      subject,
      text: fullText,
      time: Math.floor(Date.now() / 1000),
    };
    items.unshift(item);
    writeInbox(items.slice(0, 500));
    return sendJson(res, 200, { ok: true, id: item.id, receivedAt: new Date(item.time * 1000).toISOString() });
  }

  if (req.method === "POST" && cleanPath === "/api/inbox") {
    const body = await readJsonBody(req);
    const pass = String((body && body.password) || "").trim();
    if (pass !== INBOX_PASS) return sendJson(res, 401, { ok: false, error: "wrong password" });
    let items = readInbox();
    if (body && body.action === "delete" && body.id) {
      items = items.filter((x) => x.id !== String(body.id));
      writeInbox(items);
    }
    return sendJson(res, 200, { ok: true, notes: items });
  }

  // Serve styles.css from src/styles/globals.css
  if (cleanPath === "/styles.css") {
    const cssPath = path.join(__dirname, "src", "styles", "globals.css");
    if (fs.existsSync(cssPath)) {
      res.writeHead(200, { "Content-Type": "text/css; charset=utf-8", "Cache-Control": "public, max-age=300" });
      return fs.createReadStream(cssPath).pipe(res);
    }
  }

  // Serve /icon.svg
  if (cleanPath === "/icon.svg") {
    const iconPath = path.join(PUBLIC_DIR, "icons", "apple-favicon.svg");
    if (fs.existsSync(iconPath)) {
      res.writeHead(200, { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=3600" });
      return fs.createReadStream(iconPath).pipe(res);
    }
  }

  // Serve static files from public/
  if (cleanPath !== "/") {
    const safeRel = path.normalize(cleanPath).replace(/^(\.\.(\/|\\|$))+/, "");
    const candidate = path.join(PUBLIC_DIR, safeRel);
    if (candidate.startsWith(PUBLIC_DIR) && fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      const ext = path.extname(candidate).toLowerCase();
      res.writeHead(200, {
        "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=3600",
      });
      return fs.createReadStream(candidate).pipe(res);
    }
  }

  // Default: serve index.html
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(INDEX_HTML);
});

server.listen(PORT, () => {
  console.log(`ARSHAON OS running on port ${PORT}`);
});
