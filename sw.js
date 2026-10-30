// Menyimpan halaman di HP supaya terbuka cepat (versi file: ubah angka v jika ingin memaksa penyegaran)
var C = 'dcha-v1', A = ['./', 'index.html', 'admin.html', 'member.html', 'style.css', 'app.js', 'config.js', 'qrcode.js', 'jsQR.js', 'manifest-admin.json', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(C).then(function (c) { return c.addAll(A); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.filter(function (x) { return x !== C; }).map(function (x) { return caches.delete(x); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== self.location.origin) return; // permintaan ke server Apps Script tidak disentuh
  e.respondWith(caches.open(C).then(function (c) {
    return c.match(r, { ignoreSearch: true }).then(function (hit) {
      var net = fetch(r).then(function (res) { if (res && res.ok) c.put(r, res.clone()); return res; }).catch(function () { return hit; });
      return hit || net; // tampil dari simpanan dulu, sambil memperbarui di belakang
    });
  }));
});
