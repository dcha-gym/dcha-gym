// Layar ganti PIN (dipakai halaman Admin dan Pemilik)
window.bukaGantiPin = function (o) {
  var ov = document.createElement('div'); ov.className = 'ov';
  ov.innerHTML = '<div class="panel"><b>' + (o.wajib ? 'Ganti PIN sementara Anda' : 'Ganti PIN') + '</b><p class="muted" style="margin:0">' + (o.wajib ? 'PIN Anda masih sementara. Buat PIN baru 6 angka yang hanya Anda yang tahu.' : 'PIN baru harus 6 angka dan tidak mudah ditebak (bukan 123456 atau angka kembar).') + '</p>' +
    '<div class="f"><label for="pl">' + (o.wajib ? 'PIN sementara' : 'PIN lama') + '</label><input id="pl" type="password" inputmode="numeric" maxlength="6" autocomplete="current-password"></div>' +
    '<div class="f"><label for="pb">PIN baru (6 angka)</label><input id="pb" type="password" inputmode="numeric" maxlength="6" autocomplete="new-password"></div>' +
    '<div class="f"><label for="pu">Ulangi PIN baru</label><input id="pu" type="password" inputmode="numeric" maxlength="6" autocomplete="new-password"></div>' +
    '<p class="gal" id="pe"></p><button id="ps">Simpan PIN baru</button>' + (o.wajib ? '' : '<button class="sec" id="pt">Batal</button>') + '</div>';
  document.body.appendChild(ov);
  var q = function (i) { return ov.querySelector('#' + i); };
  if (q('pt')) q('pt').onclick = function () { ov.remove(); };
  q('ps').onclick = function () {
    var l = q('pl').value.trim(), b = q('pb').value.trim(), u = q('pu').value.trim(), e = q('pe');
    if (!/^\d{6}$/.test(l)) { e.textContent = (o.wajib ? 'PIN sementara' : 'PIN lama') + ' harus 6 angka.'; return; }
    if (!/^\d{6}$/.test(b)) { e.textContent = 'PIN baru harus tepat 6 angka.'; return; }
    if (b !== u) { e.textContent = 'Ulangan PIN baru tidak sama.'; return; }
    q('ps').disabled = true; e.textContent = '';
    o.kirim('gantiPin', { pinLama: l, pinBaru: b }).then(function (r) {
      q('ps').disabled = false;
      if (!r.ok) { e.textContent = r.pesan || 'Gagal mengganti PIN.'; return; }
      ov.remove(); o.toast('PIN berhasil diganti.'); if (o.sukses) o.sukses();
    }).catch(function () { q('ps').disabled = false; e.textContent = 'Tidak ada koneksi. Coba lagi.'; });
  };
};
