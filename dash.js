// Dashboard bersama untuk halaman Admin dan Pemilik
(function () {
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  function bar(items, o) {
    var W = 320, H = o.h || 110, n = items.length, gap = 4, bw = (W - gap * (n - 1)) / n, mx = Math.max.apply(null, items.map(function (i) { return i.v; }).concat([1]));
    var s = '<svg viewBox="0 0 ' + W + ' ' + (H + 18) + '" width="100%" role="img" aria-label="' + esc(o.judul) + '">';
    items.forEach(function (it, i) {
      var h = Math.round(it.v / mx * (H - 16)), x = i * (bw + gap), y = H - h;
      s += '<rect x="' + x.toFixed(1) + '" y="' + y + '" width="' + bw.toFixed(1) + '" height="' + (it.v ? Math.max(h, 2) : 0) + '" rx="3" fill="' + (it.v === mx && mx > 0 ? '#D4F51C' : '#D71920') + '"><title>' + esc(it.l + ': ' + o.fmt(it.v)) + '</title></rect>';
      if (it.v && o.nilai) s += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (y - 3) + '" font-size="10" text-anchor="middle" fill="#B4B4BC">' + esc(o.nilai(it.v)) + '</text>';
      if (!o.jarang || i % o.jarang === 0) s += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (H + 13) + '" font-size="10" text-anchor="middle" fill="#B4B4BC">' + esc(it.l) + '</text>';
    });
    return s + '</svg>';
  }
  function dua(items, o) { // dua seri per kelompok
    var W = 320, H = 110, n = items.length, g = 14, gw = (W - g * (n - 1)) / n, bw = gw / 2 - 1, mx = Math.max.apply(null, items.map(function (i) { return Math.max(i.a, i.b); }).concat([1]));
    var s = '<svg viewBox="0 0 ' + W + ' ' + (H + 18) + '" width="100%" role="img" aria-label="' + esc(o.judul) + '">';
    items.forEach(function (it, i) {
      var x = i * (gw + g);
      [[it.a, '#D4F51C', 0, 'baru'], [it.b, '#D71920', bw + 2, 'berhenti']].forEach(function (p) {
        var h = Math.round(p[0] / mx * (H - 16)), y = H - h;
        s += '<rect x="' + (x + p[2]).toFixed(1) + '" y="' + y + '" width="' + bw.toFixed(1) + '" height="' + (p[0] ? Math.max(h, 2) : 0) + '" rx="3" fill="' + p[1] + '"><title>' + esc(it.l + ' ' + p[3] + ': ' + p[0]) + '</title></rect>';
        if (p[0]) s += '<text x="' + (x + p[2] + bw / 2).toFixed(1) + '" y="' + (y - 3) + '" font-size="10" text-anchor="middle" fill="#B4B4BC">' + p[0] + '</text>';
      });
      s += '<text x="' + (x + gw / 2).toFixed(1) + '" y="' + (H + 13) + '" font-size="10" text-anchor="middle" fill="#B4B4BC">' + esc(it.l) + '</text>';
    });
    return s + '</svg>';
  }
  var BLN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  var rp = function (n) { return 'Rp' + Number(n || 0).toLocaleString('id-ID'); };
  var juta = function (n) { return n >= 1000000 ? (n / 1000000).toFixed(1).replace('.0', '') + 'jt' : Math.round(n / 1000) + 'rb'; };
  function heatKartu(H) {
    var n = H.nilai[0].length, bins = [], mx = 1, tot = 0, puncak = null, jamTot = [];
    for (var j = 0; j < n; j += 2) bins.push(j);
    var mat = H.nilai.map(function (r, di) { return bins.map(function (j, bi) { var v = (r[j] || 0) + (r[j + 1] || 0); if (v > mx) mx = v; tot += v; jamTot[bi] = (jamTot[bi] || 0) + v; if (!puncak || v > puncak.v) puncak = { v: v, di: di, bi: bi }; return v; }); });
    if (!tot) return '<div class="ch"><h3>Kapan gym paling ramai</h3><p class="muted">Belum ada data kedatangan 30 hari terakhir.</p></div>';
    var jm = function (bi) { var a = H.jamAwal + bins[bi]; return a + '.00 sampai ' + (a + 2) + '.00'; };
    var sepi = -1; jamTot.forEach(function (v, bi) { if (v > 0 && (sepi < 0 || v < jamTot[sepi])) sepi = bi; });
    var g = '<div class="heat"><span></span>' + bins.map(function (j) { return '<span style="text-align:center">' + (H.jamAwal + j) + '</span>'; }).join('');
    mat.forEach(function (r, di) {
      g += '<span>' + esc(H.hari[di].slice(0, 3)) + '</span>' + r.map(function (v, bi) { return '<i role="img" aria-label="' + esc(H.hari[di] + ' ' + jm(bi) + ': ' + v + ' kedatangan') + '" title="' + esc(H.hari[di] + ' ' + jm(bi) + ': ' + v + ' kedatangan') + '" style="background:rgba(215,25,32,' + (v ? (0.18 + 0.82 * v / mx).toFixed(2) : '0.07') + ')"></i>'; }).join('');
    });
    g += '</div>';
    return '<div class="ch"><h3>Kapan gym paling ramai</h3><p class="muted">Jumlah kedatangan 30 hari terakhir (data sejak ' + esc(H.dari ? H.dari.split('-').reverse().join('/') : '-') + ')</p>' + g + '<p style="margin:10px 0 0;font-size:14px"><b style="color:#D4F51C">Puncak:</b> ' + esc(H.hari[puncak.di]) + ' ' + jm(puncak.bi) + ' (' + puncak.v + ' kedatangan). <span class="muted">Paling sepi: ' + (sepi >= 0 ? jm(sepi) : '-') + '.</span></p></div>';
  }
  window.renderDash = function (el, d, opt) {
    opt = opt || {}; var mb = d.member, h = '';
    var kpi = function (a, b, f, w) { var isi = '<b' + (w ? ' style="color:' + w + '"' : '') + '>' + a + '</b><span>' + b + '</span>'; return opt.bukaMember && f ? '<button class="kpi kb" data-mem="' + f + '">' + isi + '</button>' : '<div class="kpi">' + isi + '</div>'; };
    if (mb) {
      var pa = mb.total ? Math.round(mb.aktif * 100 / mb.total) : 0, sg = mb.segmen;
      h += '<div class="g2">' + kpi(mb.total, 'Total terdaftar', 'semua') + kpi(mb.aktif, 'Aktif', 'aktif', '#D4F51C') + kpi(mb.tidakAktif, 'Tidak aktif', 'tidak', '#FF6B70') + kpi(mb.baruBulanIni, 'Baru bulan ini', '') + '</div>';
      h += '<div style="display:flex;height:14px;border-radius:7px;overflow:hidden;background:#323238"><span style="flex:' + mb.aktif + ';background:#D4F51C"></span><span style="flex:' + mb.tidakAktif + ';background:#D71920"></span></div><div class="muted" style="font-size:13px">' + pa + '% member aktif, ' + (mb.total ? 100 - pa : 0) + '% tidak aktif</div>';
      h += '<div class="ch"><h3>Kerutinan member aktif</h3><p class="muted">Jumlah kedatangan 30 hari terakhir</p><div style="display:flex;height:12px;border-radius:6px;overflow:hidden;margin-bottom:10px;background:#323238"><span style="flex:' + sg.rutin + ';background:#D4F51C"></span><span style="flex:' + sg.jarang + ';background:#B4B4BC"></span><span style="flex:' + sg.tidakPernah + ';background:#D71920"></span></div><div class="leg" style="flex-wrap:wrap"><span><i style="background:#D4F51C"></i>Rutin (8 kali atau lebih) ' + sg.rutin + '</span><span><i style="background:#B4B4BC"></i>Jarang (1 sampai 7) ' + sg.jarang + '</span><span><i style="background:#D71920"></i>Tidak datang ' + sg.tidakPernah + '</span></div></div>';
      h += '<div class="g2"><div class="kpi"><b>' + d.hadirHariIni + '</b><span>Hadir hari ini</span></div><div class="kpi"><b>' + d.tamuHariIni + '</b><span>Tamu hari ini</span></div>' + kpi(mb.segera7, 'Habis dalam 7 hari', 'segera') + '<div class="kpi"><b>' + mb.tidakDatang14 + '</b><span>Aktif, tidak datang 14 hari</span></div></div>';
    } else {
      h += '<div class="g2"><div class="kpi"><b>' + d.memberAktif + '</b><span>Member aktif</span></div><div class="kpi"><b>' + d.habis7Hari + '</b><span>Habis dalam 7 hari</span></div><div class="kpi"><b>' + d.hadirHariIni + '</b><span>Hadir hari ini</span></div><div class="kpi"><b>' + d.tamuHariIni + '</b><span>Tamu hari ini</span></div></div>';
    }
    var p = d.pendapatanBulanIni, pr = p.produk || 0;
    h += '<div class="ch"><h3>Pendapatan bulan ini</h3><b style="font-size:26px">' + rp(p.total) + '</b><div style="display:flex;height:12px;border-radius:6px;overflow:hidden;margin:10px 0;background:#323238"><span style="flex:' + p.member + ';background:#D4F51C"></span><span style="flex:' + p.tamu + ';background:#D71920"></span><span style="flex:' + pr + ';background:#B4B4BC"></span></div><div class="leg" style="flex-wrap:wrap"><span><i style="background:#D4F51C"></i>Iuran member ' + rp(p.member) + '</span><span><i style="background:#D71920"></i>Tamu harian ' + rp(p.tamu) + '</span><span><i style="background:#B4B4BC"></i>Produk ' + rp(pr) + '</span></div></div>';
    if (d.produkTerlaris && d.produkTerlaris.length) h += '<div class="ch"><h3>Produk terlaris bulan ini</h3><p class="muted">Jumlah terjual</p>' + d.produkTerlaris.map(function (t) { return '<div class="lr"><div>' + esc(t.nama) + '<small>' + rp(t.total) + '</small></div><b>' + t.qty + ' pcs</b></div>'; }).join('') + '</div>';
    if (d.heat) h += heatKartu(d.heat);
    else {
      h += '<div class="ch"><h3>Jam paling ramai</h3><p class="muted">Jumlah kedatangan 30 hari terakhir</p>' + bar(d.jamRamai.map(function (x) { return { l: String(x.jam), v: x.jumlah }; }), { judul: 'Grafik jam ramai', fmt: function (v) { return v + ' kedatangan'; }, jarang: 2 }) + '</div>';
    }
    h += '<div class="ch"><h3>Pendapatan 14 hari terakhir</h3><p class="muted">Semua sumber</p>' + bar(d.pendapatan14Hari.map(function (x) { return { l: String(+x.tanggal.slice(8)), v: x.total }; }), { judul: 'Grafik pendapatan harian', fmt: rp, jarang: 2 }) + '</div>';
    h += '<div class="ch"><h3>Member baru dan yang berhenti</h3><div class="leg"><span><i style="background:#D4F51C"></i>Baru</span><span><i style="background:#D71920"></i>Berhenti</span></div>' + dua(d.bulanan.map(function (x) { return { l: BLN[+x.bulan.slice(5) - 1], a: x.baru, b: x.berhenti }; }), { judul: 'Grafik member baru dan berhenti' }) + '<p class="muted" style="margin-top:8px">Berhenti = masa aktif habis dan belum diperpanjang. Member lama yang diimpor tidak dihitung sebagai baru.</p></div>';
    h += '<div class="ch"><h3>Aktif tetapi tidak datang 14 hari</h3><p class="muted">Perlu disapa sebelum masa aktifnya habis</p>';
    h += d.tidakDatang14Hari.length ? d.tidakDatang14Hari.map(function (m) { return '<div class="lr"><div>' + esc(m.nama) + '<small>' + esc(m.wa) + '</small></div><a target="_blank" rel="noopener" href="https://wa.me/' + esc(m.wa) + '?text=' + encodeURIComponent('Halo ' + m.nama + ', sudah beberapa hari tidak terlihat di D-CHA GYM. Ada kendala? Kami tunggu kedatangan Anda.') + '">Kirim WA</a></div>'; }).join('') : '<p class="muted">Semua member aktif datang dalam 14 hari terakhir.</p>';
    h += '</div><div class="ch"><h3>Tamu bulan ini</h3><p class="muted">Kontribusi per tamu</p>';
    h += d.tamuBulanIni.length ? d.tamuBulanIni.map(function (t) { return '<div class="lr"><div>' + esc(t.nama) + '<small>' + t.kunjungan + ' kunjungan</small></div><b>' + rp(t.total) + '</b></div>'; }).join('') : '<p class="muted">Belum ada tamu bulan ini.</p>';
    el.innerHTML = h + '</div>';
    if (opt.bukaMember) el.onclick = function (e) { var b = e.target.closest('[data-mem]'); if (b) opt.bukaMember(b.getAttribute('data-mem') || 'semua'); };
  };
})();
