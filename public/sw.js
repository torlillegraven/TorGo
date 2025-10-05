
// Simple offline cache
const CACHE = "teddy-travels-v1";
const ASSETS = ["/", "/manifest.webmanifest", "/favicon.ico", "/bear.svg", "/bear-trip.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }
  if (event.request.method === "GET" && url.origin === location.origin) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((resp) => {
          const clone = resp.clone();
          caches.open(CACHE).then((c) => c.put(event.request, clone));
          return resp;
        });
      })
    );
  }
});
