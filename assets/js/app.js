(function () {
  'use strict';
  var K = window.KONTEN || {}, M = K.masjid || {};
  var halaman = document.body.dataset.halaman;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var kurangGerak = matchMedia('(prefers-reduced-motion:reduce)').matches;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ik(n, c) { return '<svg class="' + (c || 'ik') + '" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; }
  function tgl(s) { var p = s.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2] || 1); }
  function iso(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  var fmt = function (o) { return new Intl.DateTimeFormat('id-ID', o); };
  var fTgl = fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  var fTglP = fmt({ day: 'numeric', month: 'long', year: 'numeric' });
  var fBln = fmt({ month: 'long', year: 'numeric' }), fBlnS = fmt({ month: 'short' }), fHari = fmt({ weekday: 'short' });
  function rp(n) { return 'Rp ' + Math.round(n).toLocaleString('id-ID'); }
  function jt(n) { return (n / 1e6).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' jt'; }
  function hm(m) { return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2); }

  function waUrl(pesan, nomor) {
    var n = String(nomor || M.whatsapp || '').replace(/\D/g, '');
    return n ? 'https://wa.me/' + n + '?text=' + encodeURIComponent(pesan || '') : '';
  }
  function tautanWA(pesan, label, nomor) {
    var u = waUrl(pesan, nomor);
    return u ? '<a class="tautan-wa" href="' + u + '" target="_blank" rel="noopener">' + ik('wa') + esc(label || 'Tanya lewat WhatsApp') + '</a>' : '';
  }
  var contoh = K.modeContoh ? '<p class="ctoh anim-masuk">' + ik('label') + 'Data contoh, belum informasi resmi takmir.</p>' : '';
  var toastEl;
  function toast(t) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.textContent = t; toastEl.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(function () { toastEl.classList.remove('on'); }, 2400);
  }
  function kosong(t) { return '<p class="kosong">' + esc(t) + '</p>'; }

  /* ---------- Hijriah ---------- */
  var BLN_H = ['Muharam', 'Safar', 'Rabiulawal', 'Rabiulakhir', 'Jumadilawal', 'Jumadilakhir', 'Rajab', 'Syakban', 'Ramadan', 'Syawal', 'Zulkaidah', 'Zulhijah'];
  var fH; try { fH = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'numeric', year: 'numeric' }); } catch (e) { fH = null; }
  function hijri(d) {
    if (!fH) return null; var o = {};
    fH.formatToParts(d).forEach(function (p) { o[p.type] = parseInt(p.value, 10); });
    return o.month ? { h: o.day, b: o.month, t: o.year } : null;
  }
  function teksHijri(d) { var h = hijri(d); return h ? h.h + ' ' + BLN_H[h.b - 1] + ' ' + h.t + ' H' : ''; }

  /* ---------- Waktu salat ---------- */
  var NAMA = { imsak: 'Imsak', subuh: 'Subuh', syuruq: 'Syuruq', duha: 'Duha', zuhur: 'Zuhur', asar: 'Asar', magrib: 'Magrib', isya: 'Isya' };
  var WAJIB = ['subuh', 'zuhur', 'asar', 'magrib', 'isya'];
  function jadwal(d) { return window.WaktuSalat.hitung(d, K.salat); }
  /* jam dinding Surabaya (WIB), apa pun zona waktu pengunjung */
  function kiniWIB() { var n = new Date(); return new Date(n.getTime() + (n.getTimezoneOffset() + (K.salat.tz * 60)) * 60000); }
  function berikut(n) {
    var j = jadwal(n), detik = n.getHours() * 3600 + n.getMinutes() * 60 + n.getSeconds();
    for (var i = 0; i < WAJIB.length; i++) if (j[WAJIB[i]] * 60 > detik) return { k: WAJIB[i], m: j[WAJIB[i]], sisa: j[WAJIB[i]] * 60 - detik, j: j };
    var bsk = new Date(n); bsk.setDate(n.getDate() + 1); var jb = jadwal(bsk);
    return { k: 'subuh', m: jb.subuh, sisa: 86400 - detik + jb.subuh * 60, j: j, besok: true };
  }
  function sisaTeks(s) { var h = Math.floor(s / 3600), m = Math.ceil((s % 3600) / 60); if (m === 60) { h++; m = 0; } return (h ? h + ' jam ' : '') + m + ' menit lagi'; }

  function ringkas() {
    var w = $('#waktu-ringkas'); if (!w) return;
    function up() {
      var b = berikut(kiniWIB());
      $('[data-w=nama]', w).textContent = NAMA[b.k]; $('[data-w=jam]', w).textContent = hm(b.m);
      $('[data-w=sisa]', w).textContent = sisaTeks(b.sisa);
    }
    up(); setInterval(up, 20000);
  }

  /* ---------- Halaman Jadwal Salat ---------- */
  function hJadwal(el) {
    var n = kiniWIB();
    el.innerHTML =
      '<section class="kartu salat-utama anim-masuk" aria-live="off">' +
            '<svg class="busur-hari" viewBox="0 -34 360 218" role="img" aria-label="Posisi matahari hari ini">' +
      '<defs><linearGradient id="gsun" x1="0" x2="1"><stop offset="0" stop-color="#cda03c"/><stop offset="1" stop-color="#f7dd8e"/></linearGradient>' +
      '<radialGradient id="gglow"><stop offset="0" stop-color="#f7dd8e" stop-opacity=".65"/><stop offset="1" stop-color="#f7dd8e" stop-opacity="0"/></radialGradient></defs>' +
      '<path class="bh-dasar" id="bh-p" d="M24 150A156 136 0 0 1 336 150"/><path class="bh-jalan" id="bh-j" d="M24 150A156 136 0 0 1 336 150"/>' +
      '<line class="bh-ufuk" x1="0" x2="360" y1="150" y2="150"/><g id="bh-tanda"></g>' +
      '<text class="bh-tgl" x="180" y="82">' + esc(fTgl.format(n)) + '</text><text class="bh-tgl2" x="180" y="104">' + esc(teksHijri(n)) + '</text>' +
      '<g class="bh-surya" id="bh-s"><circle r="22" fill="url(#gglow)"/><circle r="8" fill="#f7dd8e"/></g></svg>' +
      '<div class="salat-besar"><small id="sb-l">Salat berikutnya</small><strong id="sb-n"></strong><div class="hitung" id="sb-h" role="timer"></div></div>' +
      '</section>' +
      '<div class="hari-list" id="hari"></div>' +
      '<p class="catatan">Dihitung dengan kriteria Kemenag RI untuk Kota Surabaya, selisih bisa sekitar 1 menit dari jadwal cetak. Waktu Duha adalah awal waktu. Takmir dapat menetapkan koreksi.</p>' +
      '<div class="tab-bar" role="tablist"><button class="chip" role="tab" aria-selected="true" data-t="bln">Jadwal bulanan</button><button class="chip" role="tab" aria-selected="false" data-t="ram">Imsakiyah Ramadan</button></div>' +
      '<div id="tab-isi" class="form"></div>';
    var j = jadwal(n), tp = $('#bh-p'), L = tp.getTotalLength(), jl = $('#bh-j'), sur = $('#bh-s');
    jl.style.strokeDasharray = L; jl.style.strokeDashoffset = L;
    function posisi(m) { var f = Math.max(0, Math.min(1, (m - j.syuruq) / (j.magrib - j.syuruq))); return { f: f, p: tp.getPointAtLength(L * f) }; }
    var tanda = ''; [['syuruq'], ['zuhur'], ['asar'], ['magrib']].forEach(function (a) {
      var k = a[0], q = posisi(j[k]).p;
      var dy = (k === 'syuruq' || k === 'magrib') ? 18 : -13;
      tanda += '<circle class="bh-m" cx="' + q.x + '" cy="' + q.y + '" r="3.6"/><text class="bh-t" x="' + Math.max(22, Math.min(338, q.x)) + '" y="' + (q.y + dy + ((k === 'syuruq' || k === 'magrib') ? 0 : -9)) + '">' + NAMA[k] + '</text><text class="bh-t2" x="' + Math.max(22, Math.min(338, q.x)) + '" y="' + (q.y + dy + ((k === 'syuruq' || k === 'magrib') ? 13 : 3)) + '">' + hm(j[k]) + '</text>';
    });
    $('#bh-tanda').innerHTML = tanda;
    var hari = $('#hari'); hari.innerHTML = ['imsak', 'subuh', 'syuruq', 'duha', 'zuhur', 'asar', 'magrib', 'isya'].map(function (k, i) {
      return '<div class="hari-sel anim-masuk" style="--i:' + i + '" data-k="' + k + '"><span>' + NAMA[k] + '</span><b>' + hm(j[k]) + '</b></div>';
    }).join('');
    function tik() {
      var w = kiniWIB(), b = berikut(w), s = b.sisa;
      $('#sb-n').textContent = NAMA[b.k] + ' ' + hm(b.m);
      $('#sb-h').textContent = ('0' + Math.floor(s / 3600)).slice(-2) + ':' + ('0' + Math.floor(s % 3600 / 60)).slice(-2) + ':' + ('0' + s % 60).slice(-2);
      $$('.hari-sel').forEach(function (c) { c.dataset.on = (c.dataset.k === b.k) ? 'true' : 'false'; });
      var m = w.getHours() * 60 + w.getMinutes() + w.getSeconds() / 60, q = posisi(m);
      var siang = m >= j.syuruq && m <= j.magrib;
      jl.style.strokeDashoffset = L * (1 - q.f);
      sur.style.opacity = siang ? 1 : .35;
      sur.style.transform = 'translate(' + q.p.x + 'px,' + q.p.y + 'px)';
    }
    tik(); requestAnimationFrame(function () { requestAnimationFrame(tik); }); setInterval(tik, 1000);

    var tampil = new Date(n.getFullYear(), n.getMonth(), 1), isi = $('#tab-isi');
    function bulanan() {
      var y = tampil.getFullYear(), m = tampil.getMonth(), hrs = new Date(y, m + 1, 0).getDate(), bar = '', hIni = iso(n);
      for (var d = 1; d <= hrs; d++) {
        var dt = new Date(y, m, d), q = jadwal(dt);
        bar += '<tr' + (iso(dt) === hIni ? ' class="ini" aria-current="date"' : '') + '><td>' + d + ' ' + fHari.format(dt) + '</td>' + ['imsak', 'subuh', 'syuruq', 'duha', 'zuhur', 'asar', 'magrib', 'isya'].map(function (k) { return '<td>' + hm(q[k]) + '</td>'; }).join('') + '</tr>';
      }
      isi.innerHTML = '<div class="nav-bln"><button class="btn-ikon" data-g="-1" aria-label="Bulan sebelumnya">' + ik('kiri') + '</button><strong>' + fBln.format(tampil) + '</strong><button class="btn-ikon" data-g="1" aria-label="Bulan berikutnya">' + ik('kanan') + '</button></div>' +
        '<div class="tabel-w anim-masuk"><table><thead><tr><th>Tanggal</th><th>Imsak</th><th>Subuh</th><th>Syuruq</th><th>Duha</th><th>Zuhur</th><th>Asar</th><th>Magrib</th><th>Isya</th></tr></thead><tbody>' + bar + '</tbody></table></div>';
      $$('[data-g]', isi).forEach(function (b) { b.onclick = function () { tampil = new Date(tampil.getFullYear(), tampil.getMonth() + (+b.dataset.g), 1); bulanan(); }; });
    }
    function ramadan() {
      var d = new Date(n), awal = null;
      for (var i = 0; i < 400; i++) { var h = hijri(d); if (!h) break; if (h.b === 9) { awal = new Date(d); awal.setDate(d.getDate() - h.h + 1); break; } d.setDate(d.getDate() + 1); }
      if (!awal) { isi.innerHTML = kosong('Browser ini belum mendukung kalender Hijriah. Coba perbarui browser Anda.'); return; }
      var bar = '', hk = hijri(awal), hIni = iso(n);
      for (var r = 0; r < 30; r++) {
        var x = new Date(awal); x.setDate(awal.getDate() + r); var hh = hijri(x); if (hh.b !== 9) break; var q = jadwal(x);
        bar += '<tr' + (iso(x) === hIni ? ' class="ini"' : '') + '><td>' + (r + 1) + ' Ramadan</td><td>' + fTglP.format(x) + '</td><td>' + hm(q.imsak) + '</td><td>' + hm(q.subuh) + '</td><td>' + hm(q.zuhur) + '</td><td>' + hm(q.asar) + '</td><td><b>' + hm(q.magrib) + '</b></td><td>' + hm(q.isya) + '</td></tr>';
      }
      isi.innerHTML = '<p class="catatan">Perkiraan Ramadan ' + hk.t + ' H mulai ' + fTglP.format(awal) + '. Awal puasa resmi mengikuti sidang isbat, sehingga tanggal dapat bergeser. Waktu berbuka sama dengan waktu Magrib.</p><div class="tabel-w anim-masuk"><table><thead><tr><th>Puasa</th><th>Masehi</th><th>Imsak</th><th>Subuh</th><th>Zuhur</th><th>Asar</th><th>Berbuka</th><th>Isya</th></tr></thead><tbody>' + bar + '</tbody></table></div>';
    }
    $$('[role=tab]', el).forEach(function (t) {
      t.onclick = function () { $$('[role=tab]', el).forEach(function (x) { x.setAttribute('aria-selected', x === t); }); t.dataset.t === 'bln' ? bulanan() : ramadan(); };
    });
    bulanan();
  }

  /* ---------- Khatib ---------- */
  function tglBlok(d) { return '<div class="j-tgl"><b>' + d.getDate() + '</b><span>' + fBlnS.format(d) + '</span></div>'; }
  function hKhatib(el) {
    var hari = iso(kiniWIB()), L = (K.jumat || []).filter(function (x) { return x.tanggal >= hari; }).sort(function (a, b) { return a.tanggal < b.tanggal ? -1 : 1; });
    el.innerHTML = contoh + (L.length ? '<div class="lini">' + L.map(function (x, i) {
      var d = tgl(x.tanggal);
      return '<article class="kartu j-item anim-masuk' + (i === 0 ? ' j-depan' : '') + '" style="--i:' + i + '">' + tglBlok(d) + '<div>' + (i === 0 ? '<span class="lencana">Jumat terdekat</span>' : '') + '<h3>' + esc(x.khatib) + '</h3><p>' + (x.tema ? esc(x.tema) : 'Tema khutbah belum ditentukan') + '</p>' + (x.imam ? '<p>Imam: ' + esc(x.imam) + '</p>' : '') + '</div></article>';
    }).join('') + '</div>' : kosong('Jadwal khatib bulan depan belum diumumkan.'));
  }

  /* ---------- Saringan kategori ---------- */
  function saring(el, data, kunci, kartuFn, kosongT) {
    var kat = ['Semua'].concat(data.map(function (x) { return x[kunci]; }).filter(function (v, i, a) { return v && a.indexOf(v) === i; }));
    el.innerHTML = contoh + (kat.length > 2 ? '<div class="chips" role="group" aria-label="Saring kategori">' + kat.map(function (k, i) { return '<button class="chip" aria-pressed="' + (i === 0) + '">' + esc(k) + '</button>'; }).join('') + '</div>' : '') + '<div class="kisi" id="hasil"></div>';
    var hsl = $('#hasil', el);
    function gambar(k) {
      var L = data.filter(function (x) { return k === 'Semua' || x[kunci] === k; });
      hsl.innerHTML = L.length ? L.map(function (x, i) { return kartuFn(x, i); }).join('') : kosong(kosongT);
    }
    $$('.chip', el).forEach(function (b) { b.onclick = function () { $$('.chip', el).forEach(function (o) { o.setAttribute('aria-pressed', o === b); }); gambar(b.textContent); }; });
    gambar('Semua');
  }
  function hKajian(el) {
    saring(el, K.kajian || [], 'kategori', function (x, i) {
      return '<article class="kartu item anim-masuk" style="--i:' + i + '"><span class="lencana">' + esc(x.kategori) + '</span><h3>' + esc(x.judul) + '</h3>' +
        '<div class="meta">' + ik('mik') + esc(x.pemateri) + '</div><div class="meta">' + ik('jam') + esc(x.waktu) + '</div><div class="meta">' + ik('pin') + esc(x.lokasi) + '</div></article>';
    }, 'Belum ada kajian di kategori ini.');
  }

  /* ---------- Video ---------- */
  function hVideo(el) {
    var L = K.video || [];
    el.innerHTML = contoh + (L.length ? '<div class="kisi">' + L.map(function (v, i) {
      var isi = '<span class="vid-gbr">' + (v.idYoutube ? '<img loading="lazy" alt="" src="https://i.ytimg.com/vi/' + encodeURIComponent(v.idYoutube) + '/hqdefault.jpg">' : '') + '<span class="vid-play">' + ik('play') + '</span></span><span class="vid-tx"><span class="lencana">' + esc(v.kategori) + '</span><h3>' + esc(v.judul) + '</h3><span class="catatan">' + (v.tanggal ? fTglP.format(tgl(v.tanggal)) : '') + '</span></span>';
      return v.idYoutube ? '<button class="kartu vid anim-masuk" style="--i:' + i + '" data-yt="' + esc(v.idYoutube) + '" aria-label="Putar ' + esc(v.judul) + '">' + isi + '</button>' : '<div class="kartu vid anim-masuk" style="--i:' + i + '">' + isi + '</div>';
    }).join('') + '</div>' : kosong('Video belum tersedia.')) +
      (M.youtube ? '<a class="tombol" href="' + esc(M.youtube) + '" target="_blank" rel="noopener">' + ik('yt') + 'Buka kanal YouTube masjid</a>' : '');
    $$('[data-yt]', el).forEach(function (b) {
      b.onclick = function () {
        var l = document.createElement('div'); l.className = 'layar'; l.setAttribute('role', 'dialog'); l.setAttribute('aria-label', 'Pemutar video');
        l.innerHTML = '<div class="layar-isi"><iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(b.dataset.yt) + '?autoplay=1&rel=0" allow="autoplay;encrypted-media;picture-in-picture" allowfullscreen title="Pemutar video"></iframe></div>';
        function tutup() { l.remove(); document.removeEventListener('keydown', esck); b.focus(); }
        function esck(e) { if (e.key === 'Escape') tutup(); }
        l.onclick = function (e) { if (e.target === l) tutup(); }; document.addEventListener('keydown', esck); document.body.appendChild(l);
      };
    });
  }

  /* ---------- Agenda ---------- */
  function hAgenda(el) {
    var A = K.agenda || [], P = K.pengumuman || [], n = kiniWIB(), tampil = new Date(n.getFullYear(), n.getMonth(), 1), hIni = iso(n);
    var depan = A.filter(function (x) { return x.tanggal >= hIni; }).sort(function (a, b) { return a.tanggal < b.tanggal ? -1 : 1; });
    el.innerHTML = contoh + '<section class="kartu kal anim-masuk" id="kal"></section><h2 class="h-sub">Kegiatan mendatang</h2><div class="lini">' +
      (depan.length ? depan.map(function (x, i) { return '<article class="kartu ag anim-masuk" id="a-' + x.tanggal + '" style="--i:' + i + '">' + tglBlok(tgl(x.tanggal)) + '<div class="form" style="gap:3px"><h3 style="font:700 17.5px/1.2 \'El Messiri\'">' + esc(x.judul) + '</h3><div class="meta">' + ik('jam') + esc(x.waktu) + '</div><div class="meta">' + ik('pin') + esc(x.tempat) + '</div></div></article>'; }).join('') : kosong('Belum ada agenda mendatang.')) + '</div>' +
      '<h2 class="h-sub">Pengumuman takmir</h2>' + (P.length ? P.map(function (x, i) { return '<article class="kartu item anim-masuk" style="--i:' + i + '"><span class="catatan">' + fTglP.format(tgl(x.tanggal)) + '</span><h3>' + esc(x.judul) + '</h3><p>' + esc(x.isi) + '</p></article>'; }).join('') : kosong('Belum ada pengumuman.'));
    function kal() {
      var y = tampil.getFullYear(), m = tampil.getMonth(), awal = new Date(y, m, 1).getDay(), hrs = new Date(y, m + 1, 0).getDate(), s = '';
      ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].forEach(function (h) { s += '<div class="kal-h">' + h + '</div>'; });
      for (var i = 0; i < awal; i++) s += '<div></div>';
      for (var d = 1; d <= hrs; d++) {
        var t = iso(new Date(y, m, d)), ada = A.some(function (x) { return x.tanggal === t; }), jm = new Date(y, m, d).getDay() === 5;
        s += ada ? '<button class="kal-t ada' + (t === hIni ? ' ini' : '') + '" data-a="' + t + '" aria-label="Agenda ' + d + ' ' + fBln.format(tampil) + '">' + d + '</button>' : '<div class="kal-t' + (t === hIni ? ' ini' : '') + (jm ? ' jumat' : '') + '">' + d + '</div>';
      }
      var w = $('#kal', el);
      w.innerHTML = '<div class="nav-bln"><button class="btn-ikon" data-g="-1" aria-label="Bulan sebelumnya">' + ik('kiri') + '</button><strong>' + fBln.format(tampil) + '</strong><button class="btn-ikon" data-g="1" aria-label="Bulan berikutnya">' + ik('kanan') + '</button></div><div class="kal-kisi">' + s + '</div>';
      $$('[data-g]', w).forEach(function (b) { b.onclick = function () { tampil = new Date(y, m + (+b.dataset.g), 1); kal(); }; });
      $$('[data-a]', w).forEach(function (b) { b.onclick = function () { var c = document.getElementById('a-' + b.dataset.a); if (c) { c.scrollIntoView({ behavior: kurangGerak ? 'auto' : 'smooth', block: 'center' }); c.classList.remove('anim-masuk'); void c.offsetWidth; c.classList.add('anim-masuk'); } }; });
    }
    kal();
  }

  /* ---------- Profil ---------- */
  function hProfil(el) {
    var P = K.profil || {};
    var bag = {
      'Sejarah': '<p class="teks">' + esc(P.sejarah) + '</p>',
      'Visi & misi': '<h3 class="h-sub" style="margin:0">Visi</h3><p class="teks">' + esc(P.visi) + '</p><h3 class="h-sub">Misi</h3><ol class="misi">' + (P.misi || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>',
      'Struktur': '<div class="struktur">' + (P.struktur || []).map(function (x, i) { return '<div class="kartu item anim-masuk" style="--i:' + i + '"><h3>' + esc(x.jabatan) + '</h3><p>' + esc(x.nama) + '</p></div>'; }).join('') + '</div>',
      'SOP': '<div class="kisi">' + (P.sop || []).map(function (x, i) { return '<div class="kartu item anim-masuk" style="--i:' + i + '"><h3>' + esc(x.judul) + '</h3><p>' + esc(x.isi) + '</p></div>'; }).join('') + '</div>',
      'Tugas pengurus': '<div class="kisi">' + (P.tugas || []).map(function (x, i) { return '<div class="kartu item anim-masuk" style="--i:' + i + '"><h3>' + esc(x.jabatan) + '</h3><p>' + esc(x.isi) + '</p></div>'; }).join('') + '</div>',
      'Fasilitas & kontak': '<ul class="misi">' + (P.fasilitas || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul><div class="meta" style="margin-top:12px">' + ik('pin') + esc(M.alamat) + '</div><a class="tombol tombol-garis" style="margin-top:12px" href="kontak.html">' + ik('telepon') + 'Lihat kontak dan lokasi</a>'
    };
    var kunci = Object.keys(bag);
    el.innerHTML = contoh + '<div class="chips" role="tablist">' + kunci.map(function (k, i) { return '<button class="chip" role="tab" aria-selected="' + (i === 0) + '">' + esc(k) + '</button>'; }).join('') + '</div><div id="pf"></div>';
    var pf = $('#pf', el);
    function buka(k) { pf.innerHTML = '<div class="anim-masuk">' + bag[k] + '</div>'; }
    $$('.chip', el).forEach(function (b) { b.onclick = function () { $$('.chip', el).forEach(function (o) { o.setAttribute('aria-selected', o === b); }); buka(b.textContent); }; });
    buka(kunci[0]);
  }

  /* ---------- Akordeon layanan ---------- */
  function akordeon(L, konteks) {
    return '<div class="lini">' + L.map(function (x, i) {
      var id = 'ak' + i;
      return '<div class="kartu ak anim-masuk" style="--i:' + i + '" data-buka="false"><button class="ak-kepala" aria-expanded="false" aria-controls="' + id + '">' + ik(x.ik) + '<strong>' + esc(x.j) + '</strong>' + ik('kanan', 'ik ak-p') + '</button><div class="ak-tubuh" id="' + id + '"><div class="ak-dalam"><div><p>' + esc(x.d) + '</p>' + tautanWA("Assalamu'alaikum, saya ingin bertanya tentang " + x.j + ' di Masjid Nurul Islam.') + (M.whatsapp ? '' : '<a class="tautan-wa" href="kontak.html">' + ik('telepon') + 'Hubungi pengurus</a>') + '</div></div></div></div>';
    }).join('') + '</div>';
  }
  function ikatAk(el) {
    $$('.ak-kepala', el).forEach(function (b) {
      b.onclick = function () { var k = b.parentNode, on = k.dataset.buka !== 'true'; k.dataset.buka = on; b.setAttribute('aria-expanded', on); };
    });
    var a = $('.ak', el); if (a) { a.dataset.buka = 'true'; $('.ak-kepala', a).setAttribute('aria-expanded', 'true'); }
  }
  function kartuUsaha(judul, lencana, sub, ket, nomor, i) {
    return '<article class="kartu item anim-masuk" style="--i:' + i + '"><span class="lencana">' + esc(lencana) + '</span><h3>' + esc(judul) + '</h3>' + (sub ? '<div class="meta">' + sub + '</div>' : '') + '<p>' + esc(ket) + '</p>' + tautanWA("Assalamu'alaikum, saya melihat " + judul + ' di website Masjid Nurul Islam.', 'Hubungi lewat WhatsApp', nomor || '-') + '</article>';
  }
  function hMuamalah(el) {
    var LY = K.muamalahLayanan || [];
    el.innerHTML = (LY.length ? '<div class="mu-daftar">' + LY.map(function (x, i) {
      var foto = (x.foto || []).slice(0, 3);
      return '<article class="kartu mu anim-masuk" style="--i:' + i + '"><div class="mu-tx"><span class="mu-ikon">' + ik(esc(x.ikon || 'toko')) + '</span><span class="mu-gr"></span>' +
        '<div><h2><span class="mu-no">' + (i + 1) + '.</span> ' + esc(x.nama) + '</h2><p>' + esc(x.ket) + '</p></div></div>' +
        (foto.length ? '<div class="mu-foto" aria-hidden="true">' + foto.map(function (f) { return '<span class="mu-f"><img src="' + esc(f) + '" alt="" loading="lazy" decoding="async"></span>'; }).join('') + '</div>' : '') +
        '</article>';
    }).join('') + '</div>' : '') + '<h2 class="h-sub">Direktori usaha warga</h2><div class="form" id="mu-dir"></div>';
    saring($('#mu-dir', el), K.muamalah || [], 'jenis', function (x, i) { return kartuUsaha(x.nama, x.jenis, '', x.ket, x.whatsapp, i); }, 'Belum ada usaha di kategori ini.');
    el.insertAdjacentHTML('beforeend', '<section class="kartu item anim-masuk"><h3>Promosikan usaha Anda</h3><p>Warga dapat mendaftarkan usaha, jasa, atau produk untuk ditampilkan di Pasar Berkah.</p><div>' + (M.whatsapp ? tautanWA("Assalamu'alaikum, saya ingin mendaftarkan usaha di Pasar Berkah Masjid Nurul Islam.", 'Daftarkan usaha') : '<a class="tautan-wa" href="kontak.html">' + ik('telepon') + 'Hubungi pengurus</a>') + '</div></section>');
  }
  function hKerja(el) {
    saring(el, K.lowongan || [], 'tipe', function (x, i) { return kartuUsaha(x.posisi, x.tipe, ik('koper') + esc(x.usaha) + ', ' + esc(x.lokasi), x.ket, x.whatsapp, i); }, 'Belum ada informasi di kategori ini.');
    el.insertAdjacentHTML('beforeend', '<section class="kartu item anim-masuk"><h3>Punya lowongan atau sedang mencari kerja?</h3><p>Kirim informasinya ke pengurus agar dapat ditampilkan di halaman ini.</p><div>' + (M.whatsapp ? tautanWA("Assalamu'alaikum, saya ingin mengirim informasi untuk Bursa Kerja Masjid Nurul Islam.", 'Kirim informasi') : '<a class="tautan-wa" href="kontak.html">' + ik('telepon') + 'Hubungi pengurus</a>') + '</div></section>');
  }
  function hPustaka(el) {
    saring(el, K.pustaka || [], 'jenis', function (x, i) {
      return '<article class="kartu item anim-masuk" style="--i:' + i + '"><span class="lencana">' + esc(x.jenis) + '</span><h3>' + esc(x.judul) + '</h3><p>' + esc(x.penulis) + '</p>' + (x.tautan ? '<a class="tautan-wa" href="' + esc(x.tautan) + '" target="_blank" rel="noopener">' + ik('unduh') + 'Buka bacaan</a>' : '<span class="catatan">Berkas segera tersedia</span>') + '</article>';
    }, 'Belum ada bacaan di kategori ini.');
  }
  function hLayanan(el, L, atas) { el.innerHTML = (atas || '') + akordeon(L); ikatAk(el); }
  var hKeluarga = function (el) {
    hLayanan(el, [
      { ik: 'hati', j: 'Konsultasi pernikahan', d: 'Ruang bertanya dan berkonsultasi seputar kehidupan pernikahan bersama pembimbing dari masjid.' },
      { ik: 'keluarga', j: 'Konsultasi keluarga', d: 'Pendampingan untuk persoalan keluarga, pengasuhan, dan hubungan antaranggota keluarga.' },
      { ik: 'toga', j: 'Bimbingan pranikah', d: 'Bimbingan bagi calon pengantin sebagai bekal sebelum memasuki pernikahan.' }
    ]);
  };
  var hDuka = function (el) {
    hLayanan(el, [
      { ik: 'bunga', j: 'Pengurusan jenazah', d: 'Membantu keluarga mengurus jenazah, mulai dari memandikan, mengafani, hingga menyalatkan.' },
      { ik: 'ambulans', j: 'Ambulans', d: 'Layanan ambulans untuk warga yang membutuhkan. Hubungi pengurus untuk ketersediaan.' },
      { ik: 'pin', j: 'Pemakaman', d: 'Membantu koordinasi proses pemakaman bersama keluarga.' },
      { ik: 'hati-tangan', j: 'Pendampingan keluarga berduka', d: 'Mendampingi dan menguatkan keluarga yang ditinggalkan, termasuk koordinasi takziah dan doa bersama.' }
    ], '<p class="teks anim-masuk">Innalillahi wa inna ilaihi raji\'un. Bila ada keluarga yang wafat, sampaikan kepada pengurus agar dapat segera dibantu.</p>');
  };
  function hSosial(el) {
    hLayanan(el, [
      { ik: 'kalender', j: 'Peringatan Hari Besar Islam', d: 'Kegiatan PHBI seperti Idul Fitri, Idul Adha, Maulid Nabi, dan hari besar lainnya.' },
      { ik: 'tangan-koin', j: 'Zakat', d: 'Penyaluran zakat melalui masjid untuk warga yang berhak menerima.' },
      { ik: 'dompet', j: 'Infak dan sedekah', d: 'Salurkan infak dan sedekah untuk program masjid dan warga yang membutuhkan.' },
      { ik: 'tim', j: 'Kepedulian sosial', d: 'Program santunan dan bantuan bagi warga sekitar.' }
    ]);
    var P = K.phbi || [];
    el.insertAdjacentHTML('beforeend', '<h2 class="h-sub">Kegiatan PHBI</h2>' + contoh + '<div class="kisi">' + P.map(function (x, i) { return '<article class="kartu item anim-masuk" style="--i:' + i + '"><h3>' + esc(x.nama) + '</h3><p>' + esc(x.ket) + '</p></article>'; }).join('') + '</div><a class="tombol" href="donasi.html">' + ik('hati-tangan') + 'Salurkan donasi</a>');
  }
  function hNgaji(el) {
    var N = K.ngaji || { program: [], kelompok: [] };
    el.innerHTML = contoh + '<h2 class="h-sub" style="margin:0">Ngaji harian dan perkembangannya</h2><div class="kisi">' + N.program.map(function (x, i) {
      return '<article class="kartu item anim-masuk" style="--i:' + i + '"><h3>' + esc(x.nama) + '</h3><p>' + esc(x.ket) + '</p><div class="prog" role="progressbar" aria-valuenow="' + x.persen + '" aria-valuemin="0" aria-valuemax="100" aria-label="Perkembangan ' + esc(x.nama) + '"><i style="--p:' + x.persen + '%"></i></div><span class="prog-angka">' + x.persen + '% target tercapai</span></article>';
    }).join('') + '</div><h2 class="h-sub">Kelompok dan kelas mengaji</h2><div class="kisi">' + N.kelompok.map(function (x, i) {
      return '<article class="kartu item anim-masuk" style="--i:' + i + '"><h3>' + esc(x.nama) + '</h3><div class="meta">' + ik('toga') + esc(x.pembimbing) + '</div><div class="meta">' + ik('jam') + esc(x.jadwal) + '</div></article>';
    }).join('') + '</div>' + (M.whatsapp ? tautanWA("Assalamu'alaikum, saya ingin bergabung dengan Ngaji Bersama Masjid Nurul Islam.", 'Daftar ikut mengaji') : '<a class="tombol tombol-garis" href="kontak.html">' + ik('telepon') + 'Tanya cara bergabung</a>');
  }

  /* ---------- Keuangan ---------- */
  function hitungNaik(node, sampai) {
    if (kurangGerak) { node.textContent = rp(sampai); return; }
    var t0 = performance.now(), D = 1300;
    (function f(t) { var p = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - p, 3); node.textContent = rp(sampai * e); if (p < 1) requestAnimationFrame(f); })(t0);
  }
  function hKeuangan(el) {
    var U = K.keuangan || {}, B = U.bulanan || [], W_M = '#bb8710', W_K = '#3d94d4';
    var tM = B.reduce(function (a, x) { return a + x.masuk; }, 0), tK = B.reduce(function (a, x) { return a + x.keluar; }, 0), saldo = (U.saldoAwal || 0) + tM - tK;
    var maks = Math.max.apply(null, B.map(function (x) { return Math.max(x.masuk, x.keluar); }).concat([1]));
    var step = Math.pow(10, Math.floor(Math.log10(maks))) ; if (maks / step < 2) step /= 2; else if (maks / step > 5) step *= 2;
    var atas = Math.ceil(maks / step) * step, gridY = ''; for (var v = 0; v <= atas; v += step) gridY += '<div style="bottom:' + (v / atas * 100) + '%"><span>' + (v / 1e6) + ' jt</span></div>';
    var fB = fmt({ month: 'long', year: 'numeric' });
    el.innerHTML = contoh + '<div class="stat-kisi">' +
      '<div class="kartu stat anim-masuk"><span>Saldo per ' + (B.length ? fB.format(tgl(B[B.length - 1].bulan)) : '-') + '</span><b data-n="' + saldo + '">' + rp(saldo) + '</b></div>' +
      '<div class="kartu stat anim-masuk" style="--i:1"><span><i style="background:' + W_M + '"></i>Penerimaan ' + B.length + ' bulan</span><b data-n="' + tM + '">' + rp(tM) + '</b></div>' +
      '<div class="kartu stat anim-masuk" style="--i:2"><span><i style="background:' + W_K + '"></i>Penggunaan ' + B.length + ' bulan</span><b data-n="' + tK + '">' + rp(tK) + '</b></div></div>' +
      '<section class="kartu grafik anim-masuk" style="--i:3"><h3>Penerimaan dan penggunaan dana per bulan</h3><div class="legenda"><span><i style="background:' + W_M + '"></i>Penerimaan</span><span><i style="background:' + W_K + '"></i>Penggunaan</span></div>' +
      '<div class="batang-w" id="bw"><div class="sumbu-y" aria-hidden="true">' + gridY + '</div>' + B.map(function (x, i) {
        return '<button class="bln" data-i="' + i + '" aria-label="' + fB.format(tgl(x.bulan)) + ': penerimaan ' + rp(x.masuk) + ', penggunaan ' + rp(x.keluar) + '"><span class="bln-pasang"><i style="--t:' + (x.masuk / atas * 100) + '%;--i:' + i + ';background:' + W_M + '"></i><i style="--t:' + (x.keluar / atas * 100) + '%;--i:' + i + ';background:' + W_K + '"></i></span><span class="bln-l">' + fBlnS.format(tgl(x.bulan)) + '</span></button>';
      }).join('') + '<div class="tip" id="tip" aria-hidden="true"></div></div></section>' +
      '<h2 class="h-sub">Rincian bulanan</h2><div class="tabel-w"><table class="t-angka"><thead><tr><th>Bulan</th><th>Penerimaan</th><th>Penggunaan</th><th>Selisih</th></tr></thead><tbody>' + B.slice().reverse().map(function (x) { var s = x.masuk - x.keluar; return '<tr><td>' + fB.format(tgl(x.bulan)) + '</td><td>' + rp(x.masuk) + '</td><td>' + rp(x.keluar) + '</td><td>' + (s < 0 ? '−' : '+') + rp(Math.abs(s)) + '</td></tr>'; }).join('') + '</tbody></table></div>' +
      '<h2 class="h-sub">Aset masjid</h2><div class="tabel-w"><table class="t-angka"><thead><tr><th>Aset</th><th>Nilai</th></tr></thead><tbody>' + (U.aset || []).map(function (x) { return '<tr><td style="white-space:normal">' + esc(x.nama) + '</td><td>' + rp(x.nilai) + '</td></tr>'; }).join('') + '</tbody></table></div>' +
      '<h2 class="h-sub">Unduh laporan</h2><div class="lini">' + (U.laporan || []).map(function (x) {
        return x.file ? '<a class="kartu kontak-baris" href="' + esc(x.file) + '" target="_blank" rel="noopener">' + ik('dokumen') + '<span>' + esc(x.judul) + '</span>' + ik('unduh') + '</a>' : '<div class="kartu kontak-baris">' + ik('dokumen') + '<span>' + esc(x.judul) + '<small>Berkas belum diunggah</small></span></div>';
      }).join('') + '</div>';
    $$('[data-n]', el).forEach(function (b) { hitungNaik(b, +b.dataset.n); });
    var bw = $('#bw', el), tip = $('#tip', el);
    $$('.bln', el).forEach(function (b) {
      function on() {
        var x = B[+b.dataset.i]; tip.innerHTML = '<strong>' + fB.format(tgl(x.bulan)) + '</strong><br>Penerimaan ' + rp(x.masuk) + '<br>Penggunaan ' + rp(x.keluar);
        tip.style.opacity = 1; var r = b.getBoundingClientRect(), a = bw.getBoundingClientRect(), w = tip.offsetWidth;
        tip.style.transform = 'translate(' + Math.max(0, Math.min(a.width - w, r.left - a.left + r.width / 2 - w / 2)) + 'px,-6px)';
      }
      function off() { tip.style.opacity = 0; }
      b.onmouseenter = on; b.onfocus = on; b.onclick = on; b.onmouseleave = off; b.onblur = off;
    });
  }

  /* ---------- Donasi ---------- */
  function hDonasi(el) {
    var R = (K.rekening || []).filter(function (x) { return x.nomor; }), prog = K.programDonasi || [], nominal = [50000, 100000, 250000, 500000];
    var rekHtml = R.length ? R.map(function (x) { return '<div class="rek"><div class="rek-tx"><span>' + esc(x.bank) + '</span><b>' + esc(x.nomor) + '</b><span>a.n. ' + esc(x.atasNama) + '</span></div><button class="btn-ikon" data-salin="' + esc(x.nomor) + '" aria-label="Salin nomor rekening">' + ik('salin') + '</button></div>'; }).join('')
      : '<div class="ctoh">' + ik('perisai') + '<span>Rekening resmi belum dicantumkan. Mohon tidak mentransfer ke rekening yang tidak tertulis di halaman ini.</span></div>';
    el.innerHTML = '<section class="kartu panel form anim-masuk"><h2 class="h-sub" style="margin:0">Tentukan donasi Anda</h2><div class="nominal" role="group" aria-label="Pilih nominal">' + nominal.map(function (n) { return '<button class="chip" type="button" aria-pressed="false" data-n="' + n + '">' + rp(n) + '</button>'; }).join('') + '</div>' +
      '<label class="bidang">Nominal lain<input id="d-n" inputmode="numeric" placeholder="Rp 0" autocomplete="off"></label>' +
      '<label class="bidang">Program<select id="d-p">' + prog.map(function (p) { return '<option>' + esc(p) + '</option>'; }).join('') + '</select></label></section>' +
      '<section class="kartu panel form anim-masuk" style="--i:1"><h2 class="h-sub" style="margin:0">Transfer ke rekening masjid</h2>' + rekHtml + (K.qris ? '<img class="qris" loading="lazy" src="' + esc(K.qris) + '" alt="Kode QRIS donasi Masjid Nurul Islam">' : '') + '</section>' +
      '<section class="kartu panel form anim-masuk" style="--i:2"><h2 class="h-sub" style="margin:0">Konfirmasi donasi</h2><p class="catatan">Setelah transfer, kirim konfirmasi agar donasi tercatat dalam laporan keuangan masjid.</p><button class="tombol" id="d-k">' + ik('wa') + 'Konfirmasi lewat WhatsApp</button></section>' +
      '<a class="kartu kontak-baris anim-masuk" style="--i:3" href="keuangan.html">' + ik('grafik') + '<span>Lihat laporan penggunaan dana masjid</span></a>';
    var inp = $('#d-n', el);
    $$('.nominal .chip', el).forEach(function (b) { b.onclick = function () { $$('.nominal .chip', el).forEach(function (o) { o.setAttribute('aria-pressed', o === b); }); inp.value = (+b.dataset.n).toLocaleString('id-ID'); }; });
    inp.oninput = function () { var v = inp.value.replace(/\D/g, ''); inp.value = v ? (+v).toLocaleString('id-ID') : ''; $$('.nominal .chip', el).forEach(function (o) { o.setAttribute('aria-pressed', +o.dataset.n === +v); }); };
    $$('[data-salin]', el).forEach(function (b) {
      b.onclick = function () { var t = b.dataset.salin; (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { toast('Nomor rekening disalin'); }, function () { toast(t); }); };
    });
    $('#d-k', el).onclick = function () {
      var n = inp.value ? 'Rp ' + inp.value : '(nominal)', u = waUrl("Assalamu'alaikum, saya ingin mengonfirmasi donasi sebesar " + n + ' untuk program ' + $('#d-p', el).value + ' Masjid Nurul Islam.');
      if (u) window.open(u, '_blank', 'noopener'); else toast('Nomor WhatsApp masjid belum tersedia');
    };
  }

  /* ---------- Kontak ---------- */
  function hKontak(el) {
    var baris = function (ikon, lbl, nilai, url) {
      var isi = ik(ikon) + '<span><small>' + lbl + '</small>' + esc(nilai) + '</span>';
      return url ? '<a class="kartu kontak-baris anim-masuk" href="' + esc(url) + '" target="_blank" rel="noopener">' + isi + '</a>' : '<div class="kartu kontak-baris anim-masuk">' + isi + '</div>';
    };
    var q = encodeURIComponent('-7.3304994,112.7848221');
    el.innerHTML = '<div class="lini">' + baris('pin', 'Alamat', M.alamat, M.peta) +
      baris('wa', 'WhatsApp CS masjid', M.whatsapp ? '+' + M.whatsapp : 'Nomor segera tersedia', M.whatsapp ? waUrl("Assalamu'alaikum.") : '') +
      (M.telepon ? baris('telepon', 'Telepon', M.telepon, 'tel:' + M.telepon) : '') + (M.email ? baris('surat', 'Email', M.email, 'mailto:' + M.email) : '') +
      (M.youtube ? baris('yt', 'YouTube', 'Kanal resmi masjid', M.youtube) : '') + (M.instagram ? baris('ig', 'Instagram', 'Akun resmi masjid', M.instagram) : '') + '</div>' +
      '<iframe class="peta anim-masuk" title="Peta lokasi Masjid Nurul Islam" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=' + q + '&z=16&output=embed"></iframe>' +
      '<a class="tombol" href="' + esc(M.peta) + '" target="_blank" rel="noopener">' + ik('pin') + 'Buka petunjuk arah</a>' +
      '<form class="kartu panel form anim-masuk" id="f-k"><h2 class="h-sub" style="margin:0">Kirim pertanyaan</h2><label class="bidang">Nama<input id="k-n" required autocomplete="name"></label><label class="bidang">Keperluan<select id="k-p"><option>Informasi umum</option><option>Layanan keluarga</option><option>Peduli duka</option><option>Muamalah warga</option><option>Bursa kerja</option><option>Donasi</option></select></label><label class="bidang">Pesan<textarea id="k-m" rows="3" required></textarea></label><button class="tombol">' + ik('wa') + 'Kirim lewat WhatsApp</button></form>';
    $('#f-k', el).onsubmit = function (e) {
      e.preventDefault();
      var u = waUrl("Assalamu'alaikum, saya " + $('#k-n').value + '. Keperluan: ' + $('#k-p').value + '.\n' + $('#k-m').value);
      if (u) window.open(u, '_blank', 'noopener'); else toast('Nomor WhatsApp masjid belum tersedia');
    };
  }

  /* ---------- Halaman ---------- */
  var RUTE = { 'jadwal-salat': hJadwal, 'jadwal-khatib': hKhatib, kajian: hKajian, video: hVideo, agenda: hAgenda, profil: hProfil, muamalah: hMuamalah, keluarga: hKeluarga, 'peduli-duka': hDuka, 'bursa-kerja': hKerja, perpustakaan: hPustaka, ngaji: hNgaji, sosial: hSosial, keuangan: hKeuangan, donasi: hDonasi, kontak: hKontak };
  var wadah = $('#data');
  if (wadah && RUTE[halaman]) { RUTE[halaman](wadah); }
  ringkas();
  $$('[data-tahun]').forEach(function (e) { e.textContent = new Date().getFullYear(); });

  /* Tombol WA di beranda */
  $$('[data-wa]').forEach(function (a) { var u = waUrl(a.dataset.wa); if (u) { a.href = u; a.target = '_blank'; a.rel = 'noopener'; } });

  /* Muncul saat digulir */
  var rv = $$('.rv');
  if ('IntersectionObserver' in window && !kurangGerak) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('tampak'); io.unobserve(e.target); (function (t) { setTimeout(function () { t.classList.add('selesai'); }, 900); })(e.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: .08 });
    rv.forEach(function (x) { io.observe(x); });
  } else rv.forEach(function (x) { x.classList.add('tampak', 'selesai'); });

  /* Foto masjid bergerak pelan saat digulir */
  var img = $('.hero-img');
  if (img && !kurangGerak) {
    var jalan = false;
    window.addEventListener('scroll', function () {
      if (jalan) return; jalan = true;
      requestAnimationFrame(function () { var y = Math.min(window.scrollY, 500); img.style.transform = 'translate3d(0,' + (y * .045) + 'px,0)'; jalan = false; });
    }, { passive: true });
  }

  /* Cahaya kartu mengikuti kursor */
  if (matchMedia('(hover:hover)').matches && !kurangGerak) {
    document.addEventListener('pointermove', function (e) {
      var k = e.target.closest && e.target.closest('.kartu');
      if (pointerKartu && pointerKartu !== k) pointerKartu.style.setProperty('--terang', 0);
      pointerKartu = k; if (!k) return;
      var r = k.getBoundingClientRect(); k.style.setProperty('--mx', (e.clientX - r.left) + 'px'); k.style.setProperty('--my', (e.clientY - r.top) + 'px'); k.style.setProperty('--terang', 1);
    }, { passive: true });
  }
  var pointerKartu = null;
})();
