# GREENOFFICE — Sistem Informasi Pemantauan Energi dan Pengelolaan Sampah
### Sekretariat Daerah Kota Cirebon, Jawa Barat, Indonesia

**GREENOFFICE** adalah aplikasi web modern, responsif, dan ramah lingkungan yang dirancang khusus untuk memonitor efisiensi energi (listrik dan air), mencatat dan mengelola pemilahan sampah perkantoran, menyajikan analitik keberlanjutan berbasis data, serta mendorong budaya ramah lingkungan aparatur sipil negara melalui sistem gamifikasi **Eco Points**.

---

## 🌿 Fitur Utama

1. **Dashboard Eksekutif & Operasional**:
   - 4 Kartu Metrik Utama: *Pemakaian Listrik (1.240 kWh)*, *Penggunaan Air (86 m³)*, *Sampah Terkelola (248 kg)*, dan *Eco Points (1.250 pts)*.
   - Grafik garis interaktif konsumsi listrik/air vs target efisiensi bulanan.
   - Diagram donat komposisi sampah perkantoran (Organik 46%, Anorganik 32%, Kertas 15%, Residu 7%).
   - Tabel aktivitas terbaru dengan status badge verifikasi (*Menunggu*, *Disetujui*, *Ditolak*).
   - Maskot pixel-art ramah lingkungan khas Setda Kota Cirebon.

2. **Pemantauan Energi (Listrik & Air)**:
   - Pencatatan meteran digital dengan validasi form.
   - Filter berdasarkan gedung (*Gedung A Utama, Gedung B Sayap Timur, Gedung C Arsip, dll.*) dan periode (*Harian, Mingguan, Bulanan, Tahunan*).
   - Perhitungan otomatis estimasi beban biaya anggaran (Rp) dan reduksi emisi karbon (kg CO₂e).
   - Operasi CRUD lengkap (Tambah, Lihat, Ubah, Hapus dengan dialog konfirmasi).
   - Ekspor data tabel ke format CSV.

3. **Pengelolaan Sampah Terpadu**:
   - Tab *Pencatatan & Ringkasan* serta *Riwayat Lengkap*.
   - Kategori pemilahan: *Organik, Anorganik, Kertas, Plastik, Logam, dan Residu*.
   - Grafik batang volume sampah harian kantor.
   - Perhitungan persentase tingkat daur ulang (*Recycling Rate*).
   - CRUD dan ekspor data ke CSV.

4. **Laporan & Analitik Keberlanjutan**:
   - Filter periode (*Mingguan, Bulanan, Tahunan*) dan rentang tanggal.
   - Tabel KPI resmi kesesuaian target efisiensi Setda Kota Cirebon.
   - Grafik multi-series korelasi energi, air, dan sampah.
   - Fitur cetak dokumen resmi (*Browser Print*) lengkap dengan kop surat Setda Kota Cirebon dan kolom tanda tangan verifikator.

5. **Gamifikasi Eco Tips & Poin**:
   - Poin penghargaan untuk perilaku hemat energi dan pilah sampah.
   - Tips ramah lingkungan harian dengan tombol klaim poin instan.
   - Tantangan hijau dengan proteksi anti klaim ganda dan animasi selebrasi *confetti*.
   - Riwayat perolehan poin dan peringkat level pengguna.

6. **Pusat Notifikasi**:
   - Notifikasi dinamis saat ada pencatatan data baru, verifikasi status, atau pencapaian target.
   - Filter kategori (*Energi, Air, Sampah, Poin, Sistem*) dan tombol tandai semua dibaca.

7. **Multi-Role & Manajemen Hak Akses**:
   - **Pegawai**: Mencatat data pemakaian energi dan sampah, melihat riwayat, serta mengumpulkan Eco Points.
   - **Admin Lingkungan**: Mengelola dan memvalidasi data energi/sampah serta mengakses laporan analitik.
   - **Pimpinan (Sekda)**: Memantau ringkasan eksekutif dan KPI, serta mengesahkan laporan.
   - Menu dan halaman dibatasi berdasarkan peran. Untuk berpindah peran, keluar lalu masuk dengan akun demo sesuai peran.

---

## 🚀 Panduan Menjalankan Aplikasi

Aplikasi dibangun menggunakan **React 18 + TypeScript + Vite + Tailwind CSS**.

### 1. Prasyarat
- Node.js versi 18 atau lebih tinggi
- NPM / PNPM

### 2. Menjalankan Server Pengembangan
Aplikasi saat ini sudah aktif pada:
```bash
npm run dev
```
Buka browser pada alamat:
👉 **http://localhost:3000**

### 3. Membangun untuk Produksi
```bash
npm run build
```

---

## 🔑 Akun Demo (Development Credentials)

Gunakan akun berikut pada halaman login atau gunakan tombol *Pilihan Akun Demo* untuk pengisian otomatis:

| Peran | Email | Kata Sandi |
| :--- | :--- | :--- |
| **Admin Lingkungan** | `admin@greenoffice.local` | `GreenOffice123!` |
| **Pegawai (Jilaa Putri)** | `jilaa@cirebonkota.go.id` | `JilaaPass123!` |
| **Pimpinan (Sekda Kota Cirebon)** | `sekda@cirebonkota.go.id` | `Sekda123!` |

---

## ☁️ Status Integrasi Supabase

Integrasi Supabase **belum aktif**. Aplikasi saat ini menggunakan `localStorage` browser, sehingga data demo hanya tersimpan di browser yang digunakan. Berkas skema SQL dan variabel lingkungan saja belum menghubungkan aplikasi ke Supabase; integrasi memerlukan implementasi klien, autentikasi, dan kebijakan akses database.

Untuk menyiapkan konfigurasi saat implementasi Supabase dikerjakan:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
