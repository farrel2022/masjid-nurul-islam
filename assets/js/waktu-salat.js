/* Perhitungan waktu salat di browser (tanpa layanan luar).
   Parameter mengikuti kriteria Kemenag RI: Subuh -20 derajat, Isya -18 derajat, Asar bayangan 1x,
   ditambah ihtiyat. Hasil dicocokkan dengan jadwal Bimas Islam Kota Surabaya. */
(function (root) {
  var rad = Math.PI / 180;
  function jd(y, m, d) {
    if (m <= 2) { y -= 1; m += 12; }
    var A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
  }
  function sun(j) {
    var D = j - 2451545, g = (357.529 + 0.98560028 * D) * rad, q = 280.459 + 0.98564736 * D;
    var L = (q + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * rad, e = (23.439 - 0.00000036 * D) * rad;
    var RA = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L)) / rad / 15;
    var q24 = ((q / 15) % 24 + 24) % 24, eq = q24 - ((RA % 24 + 24) % 24);
    if (eq > 12) eq -= 24; if (eq < -12) eq += 24;
    return { dec: Math.asin(Math.sin(e) * Math.sin(L)), eq: eq };
  }
  function hitung(tanggal, cfg) {
    var y = tanggal.getFullYear(), m = tanggal.getMonth() + 1, d = tanggal.getDate();
    var lat = cfg.lat * rad, lng = cfg.lng, tz = cfg.tz;
    var j0 = jd(y, m, d) + 0.5 - tz / 24 - lng / 360;
    var noonS = sun(j0), noon = 12 + tz - lng / 15 - noonS.eq;
    function hour(alt, t0) {
      var s = sun(j0 + (t0 - 12) / 24);
      var cosH = (Math.sin(alt * rad) - Math.sin(lat) * Math.sin(s.dec)) / (Math.cos(lat) * Math.cos(s.dec));
      return { H: Math.acos(cosH) / rad / 15, s: s };
    }
    function pagi(alt) { var t = noon - 6; for (var i = 0; i < 3; i++) { var h = hour(alt, t); t = 12 + tz - lng / 15 - h.s.eq - h.H; } return t; }
    function sore(alt) { var t = noon + 6; for (var i = 0; i < 3; i++) { var h = hour(alt, t); t = 12 + tz - lng / 15 - h.s.eq + h.H; } return t; }
    function asarAlt(t) { var s = sun(j0 + (t - 12) / 24); return Math.atan(1 / (1 + Math.tan(Math.abs(lat - s.dec)))) / rad; }
    var asar = noon + 3; for (var i = 0; i < 3; i++) asar = sore(asarAlt(asar));
    var ih = cfg.ihtiyat;
    function bulat(t, n) { return Math.ceil((t + n / 60) * 60 - 0.0001); } // menit dari tengah malam
    var subuh = bulat(pagi(-20), ih.subuh);
    var hasil = {
      imsak: subuh - 10,
      subuh: subuh,
      syuruq: Math.floor(pagi(-1.25) * 60) - ih.syuruq,
      duha: bulat(pagi(4.5), ih.duha),
      zuhur: bulat(noon, ih.zuhur),
      asar: bulat(asar, ih.asar),
      magrib: bulat(sore(-1), ih.magrib),
      isya: bulat(sore(-18), ih.isya)
    };
    var kor = cfg.koreksi || {};
    Object.keys(kor).forEach(function (k) { if (hasil[k] != null) hasil[k] += kor[k]; });
    return hasil;
  }
  root.WaktuSalat = { hitung: hitung };
})(typeof window !== 'undefined' ? window : globalThis);
