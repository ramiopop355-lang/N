const CACHE = "sigma-v3";
const OFFLINE_URL = "/offline.html";

const PRECACHE = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.json",
  "/favicon.svg",
  "/favicon.png",
  "/icon-512.png",
];

// ─── Install: precache الأصول الأساسية ──────────────────────────────────────
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// ─── Activate: حذف الكاشات القديمة ──────────────────────────────────────────
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

// ─── Fetch ───────────────────────────────────────────────────────────────────
self.addEventListener("fetch", (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // 1. تجاهل طلبات غير GET
  if (request.method !== "GET") return;

  // 2. تجاهل API و SSE و Chrome Extensions
  if (
    url.pathname.startsWith("/api/") ||
    url.protocol === "chrome-extension:" ||
    url.origin.includes("chrome-extension")
  ) return;

  // 3. الخطوط من Google: Stale-While-Revalidate
  if (url.origin === "https://fonts.googleapis.com" || url.origin === "https://fonts.gstatic.com") {
    e.respondWith(
      caches.open(CACHE).then(async (c) => {
        const cached = await c.match(request);
        const fetchPromise = fetch(request).then((res) => {
          if (res.ok) c.put(request, res.clone());
          return res;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }

  // 4. الملفات الثابتة (JS, CSS, صور, خطوط محلية): Cache First
  if (
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "font" ||
    request.destination === "image" ||
    url.pathname.match(/\.(js|css|woff2?|ttf|otf|png|svg|jpg|ico)$/)
  ) {
    e.respondWith(
      caches.open(CACHE).then(async (c) => {
        const cached = await c.match(request);
        if (cached) return cached;
        try {
          const res = await fetch(request);
          if (res.ok) c.put(request, res.clone());
          return res;
        } catch {
          return new Response("", { status: 408 });
        }
      })
    );
    return;
  }

  // 5. التنقل بين الصفحات: Network First → Cache → Offline Page
  if (request.mode === "navigate") {
    e.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) {
            caches.open(CACHE).then((c) => c.put(request, res.clone()));
          }
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const offline = await caches.match(OFFLINE_URL);
          return offline || new Response("لا يوجد اتصال بالإنترنت", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        })
    );
    return;
  }
});
