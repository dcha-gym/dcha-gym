// Fungsi bersama semua halaman
window.api = function (d) {
  return fetch(CFG.API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(d) })
    .then(function (r) { return r.json(); });
};
window.ping = function () { return fetch(CFG.API + '?aksi=ping').then(function (r) { return r.json(); }); };
var BLN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
window.fmtTgl = function (s) { if (!s) return '-'; var p = s.split('-'); return +p[2] + ' ' + BLN[+p[1] - 1] + ' ' + p[0]; };
window.rp = function (n) { return 'Rp' + Number(n || 0).toLocaleString('id-ID'); };
window.hariIni = function () { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); };
