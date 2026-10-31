// Dashboard bersama untuk halaman Admin dan Pemilik
(function () {
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  function bar(items, o) {
    var W = 320, H = o.h || 110, n = items.length, gap = 4, bw = (W - gap * (n - 1)) / n, mx = Math.max.apply(null, items.map(function (i) { return i.v; }).concat([1]));
    var s = '<svg viewBox="0 0 ' + W + ' ' + (H + 18) + '" width="100%" role="img" aria-label="' + esc(o.judul) + '">';
    items.forEach(function (it, i) {
      var h = Math.round(it.v / mx * (H - 16)), x = i * (bw + gap), y = H - h;
      s += '<rect x="' + x.toFixed(1) + '" y="' + y + '" width="' + bw.toFixed(1) + '" height="' + (it.v ? Math.max(h, 2) : 0) + '" rx="3" fill="' + (it.v === mx && mx > 0 ? '#1D4ED8' : '#93B0EC') + '"><title>' + esc(it.l + ': ' + o.fmt(it.v)) + '</title></rect>';
      if (it.v && o.nilai) s += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (y - 3) + '" font-size="10" text-anchor="middle" fill="#4A5568">' + esc(o.nilai(it.v)) + '</text>';
      if (!o.jarang || i % o.jarang === 0) s += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (H + 13) + '" font-size="10" text-anchor="middle" fill="#4A5568">' + esc(it.l) + '</text>';
    });
    return s + '</svg>';
  }
  function dua(items, o) { // dua seri per kelompok
    var W = 320, H = 110, n = items.length, g = 14, gw = (W - g * (n - 1)) / n, bw = gw / 2 - 1, mx = Math.max.apply(null, items.map(function (i) { return Math.max(i.a, i.b); }).concat([1]));
    var s = '<svg viewBox="0 0 ' + W + ' ' + (H + 18) + '" width="100%" role="img" aria-label="' + esc(o.judul) + '">';
    items.forEach(function (it, i) {
      var x = i * (gw + g);
      [[it.a, '#1D4ED8', 0, 'baru'], [it.b, '#B42318', bw + 2, 'berhenti']].forEach(function (p) {
        var h = Math.round(p[0] / mx * (H - 16)), y = H - h;
        s += '<rect x="' + (x + p[2]).toFixed(1) + '" y="' + y + '" width="' + bw.toFixed(1) + '" height="' + (p[0] ? Math.max(h, 2) : 0) + '" rx="3" fill="' + p[1] + '"><title>' + esc(it.l + ' ' + p[3] + ': ' + p[0]) + '</title></rect>';
        if (p[0]) s += '<text x="' + (x + p[2] + bw / 2).toFixed(1) + '" y="' + (y - 3) + '" font-size="10" text-anchor="middle" fill="#4A5568">' + p[0] + '</text>';
      });
      s += '<text x="' + (x + gw / 2).toFixed(1) + '" y="' + (H + 13) + '" font-size="10" text-anchor="middle" fill="#4A5568">' + esc(it.l) + '</text>';
    });
    return s + '</svg>';
  }
  var BLN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  var rp = function (n) { return 'Rp' + Number(n || 0).toLocaleString('id-ID'); };
  var juta = function (n) { return n >= 1000000 ? (n / 1000000).toFixed(1).replace('.0', '') + 'jt' : Math.round(n / 1000) + 'rb'; };
  window.renderDash = function (el, d) {
    var h = '<div class="g2"><div class="kpi"><b>' + d.memberAktif + '</b><span>Member aktif</span></div><div class="kpi"><b>' + d.habis7Hari + '</b><span>Habis dalam 7 hari</span></div><div class="kpi"><b>' + d.hadirHariIni + '</b><span>Hadir hari ini</span></div><div class="kpi"><b>' + d.tamuHariIni + '</b><span>Tamu hari ini</span></div></div>';
    var p = d.pendapatanBulanIni;
    h += '<div class="ch"><h3>Pendapatan bulan ini</h3><p class="muted">Tamu harian ' + rp(p.tamu) + ' dan iuran member ' + rp(p.member) + '</p><b style="font-size:26px">' + rp(p.total) + '</b></div>';
    h += '<div class="ch"><h3>Jam paling ramai</h3><p class="muted">Jumlah kedatangan 30 hari terakhir</p>' + bar(d.jamRamai.map(function (x) { return { l: String(x.jam), v: x.jumlah }; }), { judul: 'Grafik jam ramai', fmt: function (v) { return v + ' kedatangan'; }, jarang: 2 }) + '</div>';
    var urut = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'], hm = {}; d.hariRamai.forEach(function (x) { hm[x.hari] = x.jumlah; });
    h += '<div class="ch"><h3>Hari paling ramai</h3><p class="muted">30 hari terakhir</p>' + bar(urut.map(function (n) { return { l: n.slice(0, 3), v: hm[n] || 0 }; }), { judul: 'Grafik hari ramai', fmt: function (v) { return v + ' kedatangan'; }, nilai: String }) + '</div>';
    h += '<div class="ch"><h3>Pendapatan 14 hari terakhir</h3><p class="muted">Member dan tamu</p>' + bar(d.pendapatan14Hari.map(function (x) { return { l: String(+x.tanggal.slice(8)), v: x.total }; }), { judul: 'Grafik pendapatan harian', fmt: rp, jarang: 2 }) + '</div>';
    h += '<div class="ch"><h3>Member baru dan yang berhenti</h3><div class="leg"><span><i style="background:#1D4ED8"></i>Baru</span><span><i style="background:#B42318"></i>Berhenti</span></div>' + dua(d.bulanan.map(function (x) { return { l: BLN[+x.bulan.slice(5) - 1], a: x.baru, b: x.berhenti }; }), { judul: 'Grafik member baru dan berhenti' }) + '<p class="muted" style="margin-top:8px">Berhenti = masa aktif habis dan belum diperpanjang.</p></div>';
    h += '<div class="ch"><h3>Tidak datang 14 hari</h3><p class="muted">Member aktif yang perlu disapa</p>';
    h += d.tidakDatang14Hari.length ? d.tidakDatang14Hari.map(function (m) { return '<div class="lr"><div>' + esc(m.nama) + '<small>' + esc(m.wa) + '</small></div><a target="_blank" rel="noopener" href="https://wa.me/' + esc(m.wa) + '?text=' + encodeURIComponent('Halo ' + m.nama + ', sudah beberapa hari tidak terlihat di D-CHA GYM. Ada kendala? Kami tunggu kedatangan Anda.') + '">Kirim WA</a></div>'; }).join('') : '<p class="muted">Semua member aktif datang dalam 14 hari terakhir.</p>';
    h += '</div><div class="ch"><h3>Tamu bulan ini</h3><p class="muted">Kontribusi per tamu</p>';
    h += d.tamuBulanIni.length ? d.tamuBulanIni.map(function (t) { return '<div class="lr"><div>' + esc(t.nama) + '<small>' + t.kunjungan + ' kunjungan</small></div><b>' + rp(t.total) + '</b></div>'; }).join('') : '<p class="muted">Belum ada tamu bulan ini.</p>';
    el.innerHTML = h + '</div>';
  };
})();
