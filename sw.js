const CACHE = "finanzas-fecccb4c";
const SHELL = ["./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png", "favicon.ico", "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) {  // Chart.js: primero la copia guardada
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
    return;
  }
  // lo nuestro: primero internet (datos frescos); sin internet, la última copia
  e.respondWith(fetch(e.request).then(r => {
    const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
