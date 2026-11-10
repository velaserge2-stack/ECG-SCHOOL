/* ECG School · service worker
 *
 * - Páginas (index, login): red primero; sin conexión, la copia guardada.
 * - Archivos estáticos propios y bibliotecas de CDN: caché y actualización en segundo plano.
 * - Módulos descargados de Supabase Storage (GET /storage/v1/object/…): red primero y copia
 *   para abrirlos sin conexión. Esa caché se borra al cerrar sesión (mensaje 'clear-modules').
 * - Nunca se guardan respuestas de autenticación (/auth/v1) ni de la base de datos (/rest/v1).
 *
 * Al publicar cambios del marco, sube VERSION para renovar la caché.
 */
'use strict';
var VERSION = 'v2-2026-11-10';
var SHELL = 'ecg-shell-' + VERSION;
var MODULES = 'ecg-modules';
var PRECACHE = [
  './', './index.html', './login.html', './config.js', './manifest.webmanifest',
  './lib/ecg-db.js', './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png',
  './icons/apple-touch-icon.png', './icons/favicon-32.png',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(SHELL).then(function (c) {
    // Cada recurso por separado: si uno falla (p. ej. CDN caído), el resto se guarda igual.
    return Promise.all(PRECACHE.map(function (u) {
      return c.add(new Request(u, { cache: 'reload' })).catch(function () {});
    }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf('ecg-shell-') === 0 && k !== SHELL; })
      .map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('message', function (e) {
  var d = e.data || {};
  if (d.type === 'clear-modules') e.waitUntil(caches.delete(MODULES));
  if (d.type === 'skip-waiting') self.skipWaiting();
});

function networkFirst(req, cacheName, fallbackUrl) {
  return fetch(req).then(function (res) {
    if (res && res.ok) { var copy = res.clone(); caches.open(cacheName).then(function (c) { c.put(req, copy); }); }
    return res;
  }).catch(function () {
    return caches.match(req, { ignoreSearch: req.mode === 'navigate' }).then(function (hit) {
      return hit || (fallbackUrl ? caches.match(fallbackUrl) : undefined) || Response.error();
    });
  });
}
function staleWhileRevalidate(req, cacheName) {
  return caches.open(cacheName).then(function (c) {
    return c.match(req).then(function (hit) {
      var net = fetch(req).then(function (res) {
        if (res && (res.ok || res.type === 'opaque')) c.put(req, res.clone());
        return res;
      }).catch(function () { return hit; });
      return hit || net;
    });
  });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);

  if (/\/auth\/v1\/|\/rest\/v1\//.test(url.pathname)) return; // siempre a la red, sin guardar

  if (/\/storage\/v1\/object\//.test(url.pathname)) {
    e.respondWith(networkFirst(req, MODULES));
    return;
  }
  if (req.mode === 'navigate' && url.origin === self.location.origin) {
    var fb = /login\.html$/.test(url.pathname) ? './login.html' : './index.html';
    e.respondWith(networkFirst(req, SHELL, fb));
    return;
  }
  if (url.origin === self.location.origin || /cdn\.jsdelivr\.net|fonts\.(googleapis|gstatic)\.com/.test(url.hostname)) {
    e.respondWith(staleWhileRevalidate(req, SHELL));
  }
});
