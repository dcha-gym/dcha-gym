// Daftar dan detail member (dipakai halaman Admin dan Pemilik)
window.MemberUI = function (c) {
  var el = c.el, esc = c.esc, S = { filter: 'semua', q: '', rows: [], hit: { semua: 0, aktif: 0, segera: 0, tidak: 0 }, lagi: false, jumlah: 0, detail: null, panel: '' }, tmr = 0;
  var FIL = [['semua', 'Semua'], ['aktif', 'Aktif'], ['segera', 'Segera habis'], ['tidak', 'Tidak aktif']];
  function hari(n) { return Math.round((new Date(hariIni() + 'T00:00:00') - new Date(n + 'T00:00:00')) / 86400000); }
  function terakhir(t) { if (!t) return 'Belum ada kunjungan tercatat'; var n = hari(t); return n <= 0 ? 'Terakhir datang: hari ini' : n === 1 ? 'Terakhir datang: kemarin' : 'Terakhir datang: ' + n + ' hari lalu'; }
  function chip(aktif, sisa) { return !aktif ? '<span class="chp x">HABIS</span>' : sisa <= 7 ? '<span class="chp w">SISA ' + sisa + ' HARI</span>' : '<span class="chp a">AKTIF</span>'; }
  function sub(r) { return !r.aktif ? 'Habis sejak ' + c.fmtTgl(r.tglHabis) : terakhir(r.terakhir); }
  var SIL = '<svg viewBox="0 0 132 165" role="img" aria-label="Foto belum tersedia"><rect width="132" height="165" fill="#222226"/><circle cx="66" cy="62" r="26" fill="#5A5A62"/><path d="M18 165c0-34 20-54 48-54s48 20 48 54z" fill="#5A5A62"/></svg>';

  function muat(tambah) {
    c.kirim('memberList', { q: S.q, filter: S.filter, offset: tambah ? S.rows.length : 0 }).then(function (r) {
      if (!r.ok) return c.toast(c.msg(r), true);
      S.hit = r.hit; S.rows = tambah ? S.rows.concat(r.rows) : r.rows; S.lagi = r.lagi; S.jumlah = r.jumlah; gambar();
    }).catch(c.jaringan);
  }
  function kerangka() {
    el.innerHTML = '<div class="f"><label for="mq">Cari nama, nomor WA, atau ID member</label><input id="mq" type="search" value="' + esc(S.q) + '" placeholder="Contoh: sari, 0812..., atau M0003"></div><div id="mchips" class="chips"></div><p class="muted" id="mcount" style="margin:0"></p><div id="mlist"></div>';
  }
  function gambar() {
    if (S.detail) { gambarDetail(); return; }
    if (!el.querySelector('#mlist')) kerangka();
    var n = S.hit;
    el.querySelector('#mchips').innerHTML = FIL.map(function (f) { return '<button class="chb' + (S.filter === f[0] ? ' on' : '') + '" data-a="f" data-v="' + f[0] + '">' + f[1] + ' ' + n[f[0]] + '</button>'; }).join('');
    el.querySelector('#mcount').textContent = S.jumlah + ' hasil';
    el.querySelector('#mlist').innerHTML = S.rows.length ? S.rows.map(function (r) {
      return '<button class="mr" data-a="detail" data-id="' + esc(r.id) + '"><span class="mav">' + esc(String(r.nama).charAt(0).toUpperCase()) + '</span><span class="mi"><b>' + esc(r.nama) + '</b><small>' + esc(sub(r)) + (r.foto ? '' : ' - foto belum ada') + '</small></span>' + chip(r.aktif, r.sisa) + '</button>';
    }).join('') + (S.lagi ? '<button class="sec" data-a="lagi" style="width:100%;margin-top:8px">Tampilkan lebih banyak</button>' : '') : '<p class="muted">Tidak ada member yang cocok.</p>';
  }
  function buka(id) {
    c.kirim('memberDetail', { id: id }).then(function (r) { if (!r.ok) return c.toast(c.msg(r), true); S.detail = r; S.panel = ''; gambar(); window.scrollTo(0, 0); }).catch(c.jaringan);
  }
  function baris(a, b, k) { return '<div class="row"><span>' + esc(a) + '</span><span' + (k ? ' class="' + k + '"' : '') + '>' + esc(b) + '</span></div>'; }
  function gambarDetail() {
    var d = S.detail, h = '<button class="sec" data-a="kembali" style="align-self:flex-start;min-height:44px;padding:0 14px">&lsaquo; Member</button>';
    h += '<div class="dh"><div class="dfoto">' + (d.foto ? '<img alt="Foto ' + esc(d.nama) + '" src="' + esc(d.foto) + '">' : SIL) + '</div><div><div class="nama" style="font-size:22px">' + esc(d.nama) + '</div>' + chip(d.aktif, d.sisa) + '<p class="muted" style="margin:6px 0 0">' + esc(d.id) + ' - ' + esc(d.wa) + '</p></div></div>';
    h += '<div class="panel">' + baris('Daftar sejak', c.fmtTgl(d.tglDaftar)) + baris(d.aktif ? 'Berlaku sampai' : 'Berakhir', c.fmtTgl(d.tglHabis)) + baris('Kunjungan terakhir', d.terakhir ? terakhir(d.terakhir).replace('Terakhir datang: ', '') : 'Belum ada') + baris('Kunjungan 30 hari', d.c30 + ' kali', 'lm') + '</div>';
    h += '<div class="panel"><b>Riwayat kunjungan</b>' + (d.riwayat.length ? d.riwayat.map(function (x) { return baris(x.hari + ', ' + c.fmtTgl(x.tanggal), x.masuk + (x.keluar ? ' - ' + x.keluar : '')); }).join('') : '<p class="muted" style="margin:0">Belum ada.</p>') + '<b style="margin-top:6px">Pembayaran iuran</b>' + (d.bayar.length ? d.bayar.map(function (x) { return baris(c.fmtTgl(x.tanggal) + ' (' + x.jenis + ')', c.rp(x.jumlah) + ' ' + x.metode); }).join('') : '<p class="muted" style="margin:0">Belum ada pembayaran tercatat sejak aplikasi dipakai.</p>') + '</div>';
    if (S.panel) h += S.panel;
    if (c.aksi && c.aksi.perpanjang) h += '<button data-a="perp">Perpanjang</button>';
    h += '<a class="btn" style="display:flex;align-items:center;justify-content:center;background:transparent!important;border:1px solid var(--muted)" target="_blank" rel="noopener" href="https://wa.me/' + esc(d.wa) + '?text=' + encodeURIComponent('Halo ' + d.nama + ', ') + '">Kirim WhatsApp</a>';
    if (c.aksi && c.aksi.fotoLengkap && !d.foto) h += '<button class="sec" data-a="foto">Lengkapi foto wajah</button>';
    if (c.bisaLink) h += '<button class="sec" data-a="link">' + (d.link ? 'Buat link kartu baru' : 'Buat dan kirim link kartu') + '</button>';
    el.innerHTML = h;
  }
  el.oninput = function (e) {
    if (e.target.id !== 'mq') return; S.q = e.target.value; clearTimeout(tmr); tmr = setTimeout(function () { muat(false); }, 450);
  };
  el.onclick = function (e) {
    var b = e.target.closest('[data-a]'); if (!b) return; var a = b.getAttribute('data-a');
    if (a === 'f') { S.filter = b.getAttribute('data-v'); muat(false); }
    if (a === 'detail') buka(b.getAttribute('data-id'));
    if (a === 'lagi') muat(true);
    if (a === 'kembali') { S.detail = null; kerangka(); gambar(); }
    if (a === 'perp') c.aksi.perpanjang({ id: S.detail.id, nama: S.detail.nama, foto: !!S.detail.foto, link: S.detail.link });
    if (a === 'foto') c.aksi.fotoLengkap(S.detail.id);
    if (a === 'link') {
      var d = S.detail; if (d.link && !confirm('Buat link kartu baru untuk ' + d.nama + '? Link dan QR lama langsung mati.')) return;
      c.kirim('aksesBaru', { id: d.id }).then(function (r) {
        if (!r.ok) return c.toast(c.msg(r), true); var l = c.linkKartu(r.token); d.link = true;
        S.panel = '<div class="panel"><b>Link kartu baru untuk ' + esc(r.nama) + '</b><p class="muted" style="margin:0">Link dan QR lama sudah mati. Kirim link ini ke member.</p><input id="lkm" type="text" readonly value="' + esc(l) + '"><a class="btn" style="display:flex;align-items:center;justify-content:center" target="_blank" rel="noopener" href="' + esc(c.waUrl(r.wa, r.nama, l)) + '">Kirim lewat WhatsApp</a></div>'; gambarDetail();
      }).catch(c.jaringan);
    }
  };
  return {
    buka: function () { S.detail = null; S.panel = ''; kerangka(); S.rows = []; gambar(); muat(false); },
    pilihFilter: function (f) { S.detail = null; S.q = ''; S.filter = f; kerangka(); gambar(); muat(false); },
    detailId: function () { return S.detail ? S.detail.id : ''; },
    segarkan: function () { if (S.detail) buka(S.detail.id); }
  };
};
