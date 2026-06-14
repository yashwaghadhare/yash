'use strict';

var CACHE = 'yw-v1';

var PRECACHE = [
  './',
  './index.html',
  './assets/css/main.css',
  './assets/js/main.js',
  './assets/img/img1.png',
  './assets/img/img11.png',
  './assets/img/fevicon.ico',
];

/* ── Install: precache all local assets ── */
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (cache) { return cache.addAll(PRECACHE); })
      .then(function () { return self.skipWaiting(); })
  );
});

/* ── Activate: delete old cache versions ── */
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE; })
            .map(function (k) { return caches.delete(k); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

/* ── Fetch ── */
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  if (!req.url.startsWith('http')) return;

  var isLocal = new URL(req.url).origin === self.location.origin;
  var acceptsHTML = (req.headers.get('Accept') || '').indexOf('text/html') !== -1;

  if (isLocal && acceptsHTML) {
    /* HTML: network-first so fresh content is always picked up,
       cache used only when offline */
    e.respondWith(
      fetch(req)
        .then(function (res) {
          var clone = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, clone); });
          return res;
        })
        .catch(function () { return caches.match(req); })
    );
    return;
  }

  if (isLocal) {
    /* Local assets (CSS, JS, images): cache-first, update cache in background */
    e.respondWith(
      caches.open(CACHE).then(function (cache) {
        return cache.match(req).then(function (cached) {
          var fresh = fetch(req).then(function (res) {
            if (res.ok) cache.put(req, res.clone());
            return res;
          });
          return cached || fresh;
        });
      })
    );
    return;
  }

  /* External CDN (Three.js, Typed, fonts, devicons):
     cache-first after first load — they never change at a fixed version URL */
  e.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) return cached;
      return fetch(req).then(function (res) {
        if (res.status === 200 || res.type === 'opaque') {
          var clone = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, clone); });
        }
        return res;
      });
    })
  );
});
