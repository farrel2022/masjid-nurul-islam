/* =====================================================================
   KONTEN WEBSITE MASJID NURUL ISLAM
   Semua informasi yang sering berubah ada di file ini.
   Edit lewat cPanel > File Manager > klik kanan file ini > Edit.

   Aturan menulis:
   - Teks selalu di antara tanda kutip: "seperti ini"
   - Setiap baris data diakhiri koma
   - Tanggal ditulis tahun-bulan-tanggal: "2026-11-27"
   - Setelah menyimpan, muat ulang halaman website untuk melihat hasilnya

   SEBELUM WEBSITE DIUMUMKAN:
   1. Ganti semua data contoh dengan data asli dari takmir.
   2. Ubah modeContoh di bawah menjadi false agar label "Data contoh" hilang.
   ===================================================================== */

window.KONTEN = {

  modeContoh: true,

  /* ---------- IDENTITAS DAN KONTAK ---------- */
  masjid: {
    nama: "Masjid Nurul Islam",
    alamat: "Jl. Rungkut Asri Timur XIII/55, Rungkut Kidul, Rungkut, Surabaya 60293",
    whatsapp: "",            // format internasional tanpa + , contoh: "6281234567890"
    telepon: "",
    email: "",
    youtube: "https://www.youtube.com/@masjidnurisrungkut",   // alamat kanal YouTube lengkap
    instagram: "",           // alamat Instagram lengkap
    peta: "https://www.google.com/maps/search/?api=1&query=-7.3304994,112.7848221"
  },

  /* ---------- JADWAL SALAT ----------
     Dihitung otomatis dengan kriteria Kemenag RI untuk Kota Surabaya.
     koreksi: tambah/kurangi menit bila takmir memakai jadwal berbeda,
     contoh: koreksi: { subuh: 1, isya: -1 }                                */
  salat: {
    lat: -7.2575, lng: 112.7521, tz: 7,
    ihtiyat: { subuh: 2.2, syuruq: 2, duha: 2, zuhur: 2.9, asar: 2.2, magrib: 2, isya: 1.9 },
    koreksi: {}
  },

  /* ---------- DONASI ----------
     Biarkan kosong sampai rekening resmi ditetapkan takmir.
     Contoh isi: { bank: "Nama Bank", nomor: "1234567890", atasNama: "Masjid Nurul Islam" } */
  rekening: [],
  qris: "",                  // contoh: "assets/img/qris.png"
  programDonasi: ["Operasional masjid", "Kegiatan dakwah dan kajian", "Santunan dan kepedulian sosial", "Pendidikan dan kelas mengaji"],

  /* ---------- JADWAL KHATIB ---------- */
  jumat: [
    { tanggal: "2026-11-06", khatib: "Nama Khatib 1", tema: "Tema khutbah contoh", imam: "Nama Imam 1" },
    { tanggal: "2026-11-13", khatib: "Nama Khatib 2", tema: "Tema khutbah contoh", imam: "Nama Imam 2" },
    { tanggal: "2026-11-20", khatib: "Nama Khatib 3", tema: "Tema khutbah contoh", imam: "" },
    { tanggal: "2026-11-27", khatib: "Nama Khatib 4", tema: "", imam: "" },
    { tanggal: "2026-12-04", khatib: "Nama Khatib 5", tema: "", imam: "" }
  ],

  /* ---------- KAJIAN ----------
     kategori: "Rutin", "Umum", "Keluarga", atau "Anak & Remaja"               */
  kajian: [
    { judul: "Contoh kajian rutin ba'da Magrib", kategori: "Rutin", pemateri: "Nama Penceramah", waktu: "Setiap Senin, ba'da Magrib", lokasi: "Ruang utama masjid" },
    { judul: "Contoh pengajian umum", kategori: "Umum", pemateri: "Nama Penceramah", waktu: "Ahad pertama, 07.00", lokasi: "Serambi masjid" },
    { judul: "Contoh kajian keluarga", kategori: "Keluarga", pemateri: "Nama Penceramah", waktu: "Sabtu kedua, ba'da Isya", lokasi: "Ruang utama masjid" },
    { judul: "Contoh kajian remaja", kategori: "Anak & Remaja", pemateri: "Nama Pembimbing", waktu: "Jumat, ba'da Asar", lokasi: "Serambi masjid" }
  ],

  /* ---------- VIDEO ----------
     idYoutube: kode setelah "v=" pada alamat video YouTube                    */
  video: [
    { judul: "Khutbah Jumat: Semua Manusia Pasti Ingin Hidup Bahagia (Dr. H. Sumarkan Fahidin, M.Ag)", kategori: "Khutbah", tanggal: "", idYoutube: "18sfm3GV3Dg" },
    { judul: "Khutbah Jumat: 5 Kiat yang Harus Kita Perhatikan Betul-betul (Ir. H. Gunawan, M.Sc.)", kategori: "Khutbah", tanggal: "", idYoutube: "jaAOBVV9v-0" },
    { judul: "Khutbah Jumat: Ketika Manusia di Padang Mahsyar (Dr. H. Nasir Abadi, MA)", kategori: "Khutbah", tanggal: "", idYoutube: "8OesLZbVWOU" }
  ],

  /* ---------- AGENDA DAN PENGUMUMAN ---------- */
  agenda: [
    { tanggal: "2026-11-15", judul: "Contoh kerja bakti masjid", waktu: "07.00", tempat: "Lingkungan masjid" },
    { tanggal: "2026-11-22", judul: "Contoh rapat takmir", waktu: "19.30", tempat: "Ruang sekretariat" },
    { tanggal: "2026-12-06", judul: "Contoh pengajian warga", waktu: "07.00", tempat: "Serambi masjid" }
  ],
  pengumuman: [
    { tanggal: "2026-11-02", judul: "Contoh pengumuman takmir", isi: "Tulis isi pengumuman di sini, misalnya perubahan jadwal atau pemberitahuan kegiatan jamaah." }
  ],

  /* ---------- PROFIL DAN TATA KELOLA ---------- */
  profil: {
    sejarah: "Tuliskan sejarah singkat Masjid Nurul Islam di sini: tahun berdiri, siapa yang merintis, dan perkembangannya hingga sekarang.",
    visi: "Tuliskan visi masjid di sini.",
    misi: ["Tuliskan misi pertama.", "Tuliskan misi kedua.", "Tuliskan misi ketiga."],
    struktur: [
      { jabatan: "Ketua Takmir", nama: "Nama Pengurus" },
      { jabatan: "Sekretaris", nama: "Nama Pengurus" },
      { jabatan: "Bendahara", nama: "Nama Pengurus" },
      { jabatan: "Bidang Ibadah", nama: "Nama Pengurus" },
      { jabatan: "Bidang Pendidikan", nama: "Nama Pengurus" },
      { jabatan: "Bidang Sosial", nama: "Nama Pengurus" }
    ],
    sop: [
      { judul: "Peminjaman fasilitas masjid", isi: "Tuliskan langkah peminjaman di sini." },
      { judul: "Penerimaan dan pencatatan donasi", isi: "Tuliskan langkah pencatatan di sini." }
    ],
    tugas: [
      { jabatan: "Ketua Takmir", isi: "Tuliskan tugas dan tanggung jawab di sini." },
      { jabatan: "Bendahara", isi: "Tuliskan tugas dan tanggung jawab di sini." }
    ],
    fasilitas: ["Tuliskan fasilitas pertama", "Tuliskan fasilitas kedua", "Tuliskan fasilitas ketiga"]
  },

  /* ---------- MUAMALAH WARGA: LAYANAN ----------
     Empat kartu besar di halaman Muamalah Warga.
     ikon: jangan diubah. foto: boleh 1 sampai 3 foto, ganti dengan foto asli kegiatan
     (unggah ke folder assets/img lalu tulis alamatnya di sini).                   */
  muamalahLayanan: [
    { nama: "Pasar Berkah", ikon: "keranjang",
      ket: "Tempat warga menawarkan makanan, minuman, busana muslim, dan berbagai kebutuhan rumah tangga lainnya.",
      foto: ["assets/img/muamalah-pasar-1.webp", "assets/img/muamalah-pasar-2.webp", "assets/img/muamalah-pasar-3.webp"] },
    { nama: "Mitra Jasa", ikon: "perkakas",
      ket: "Wadah berbagai layanan jasa warga, seperti permak pakaian, servis listrik dan peralatan rumah tangga, perbaikan kendaraan, tukang bangunan, pijat kebugaran, dan jasa lainnya.",
      foto: ["assets/img/muamalah-jasa-1.webp", "assets/img/muamalah-jasa-2.webp", "assets/img/muamalah-jasa-3.webp"] },
    { nama: "Galeri Usaha", ikon: "toko",
      ket: "Ruang promosi dan pengenalan berbagai usaha warga melalui profil usaha, katalog produk, lokasi, dan kontak pemilik.",
      foto: ["assets/img/muamalah-galeri-1.webp", "assets/img/muamalah-galeri-2.webp", "assets/img/muamalah-galeri-3.webp"] },
    { nama: "Pengembangan UMKM & Unit Usaha Masjid", ikon: "grafik",
      ket: "Pembinaan UMKM warga serta pengembangan usaha produktif dan unit usaha milik masjid.",
      foto: ["assets/img/muamalah-umkm.webp"] }
  ],


  /* ---------- BURSA KERJA ---------- */
  lowongan: [
    { posisi: "Contoh posisi lowongan", usaha: "Nama usaha", lokasi: "Surabaya", tipe: "Lowongan", ket: "Tulis syarat singkat dan cara melamar.", whatsapp: "" },
    { posisi: "Contoh warga pencari kerja", usaha: "Keahlian yang dimiliki", lokasi: "Surabaya", tipe: "Pencari kerja", ket: "Tulis pengalaman singkat.", whatsapp: "" }
  ],

  /* ---------- PERPUSTAKAAN DIGITAL ----------
     jenis: "E-book", "Artikel Islam", "Materi Kajian", atau "Bacaan Anak"
     tautan: alamat file atau halaman. Unggah PDF ke folder assets/dokumen     */
  pustaka: [
    { judul: "Contoh judul e-book", jenis: "E-book", penulis: "Nama penulis", tautan: "" },
    { judul: "Contoh judul artikel", jenis: "Artikel Islam", penulis: "Nama penulis", tautan: "" },
    { judul: "Contoh materi kajian", jenis: "Materi Kajian", penulis: "Nama pemateri", tautan: "" },
    { judul: "Contoh bacaan anak", jenis: "Bacaan Anak", penulis: "Nama penulis", tautan: "" }
  ],

  /* ---------- NGAJI BERSAMA ----------
     persen: angka 0 sampai 100 untuk perkembangan program                     */
  ngaji: {
    program: [
      { nama: "One Day One Juz", ket: "Tilawah satu juz setiap hari.", persen: 60 },
      { nama: "Two Pages", ket: "Tilawah dua halaman setiap hari.", persen: 40 },
      { nama: "One Hadith", ket: "Mengkaji satu hadis setiap hari.", persen: 75 }
    ],
    kelompok: [
      { nama: "Contoh kelompok ngaji warga", pembimbing: "Nama Pembimbing", jadwal: "Selasa, ba'da Isya" },
      { nama: "Contoh kelas mengaji anak", pembimbing: "Nama Guru", jadwal: "Senin sampai Kamis, ba'da Asar" }
    ]
  },

  /* ---------- TRANSPARANSI KEUANGAN ----------
     Angka dalam rupiah, tanpa titik. Grafik dan ringkasan dihitung otomatis.  */
  keuangan: {
    saldoAwal: 25000000,
    aset: [
      { nama: "Contoh aset: sound system", nilai: 15000000 },
      { nama: "Contoh aset: karpet ruang utama", nilai: 30000000 }
    ],
    bulanan: [
      { bulan: "2026-05", masuk: 18000000, keluar: 12500000 },
      { bulan: "2026-06", masuk: 15500000, keluar: 14000000 },
      { bulan: "2026-07", masuk: 21000000, keluar: 13500000 },
      { bulan: "2026-08", masuk: 16500000, keluar: 19000000 },
      { bulan: "2026-09", masuk: 17000000, keluar: 12000000 },
      { bulan: "2026-10", masuk: 19500000, keluar: 15000000 }
    ],
    laporan: [
      { judul: "Contoh laporan Oktober 2026", file: "" },
      { judul: "Contoh laporan September 2026", file: "" }
    ]
  },

  /* ---------- PERINGATAN HARI BESAR ISLAM ---------- */
  phbi: [
    { nama: "Isra Mikraj", ket: "Tulis jadwal kegiatan di sini." },
    { nama: "Ramadan dan Idul Fitri", ket: "Tulis jadwal kegiatan di sini." },
    { nama: "Idul Adha", ket: "Tulis jadwal kegiatan dan kurban di sini." },
    { nama: "Maulid Nabi", ket: "Tulis jadwal kegiatan di sini." }
  ]
};
