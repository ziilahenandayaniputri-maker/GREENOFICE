import { 
  UserProfile, 
  EnergyReading, 
  WasteRecord, 
  EcoChallenge, 
  EcoTip, 
  PointsTransaction, 
  NotificationItem,
  SustainabilityTarget 
} from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-1',
    name: 'Jilaa Putri',
    email: 'jilaa@cirebonkota.go.id',
    role: 'pegawai',
    roleTitle: 'Staf Bagian Umum',
    department: 'Bagian Umum & Perlengkapan',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    ecoPoints: 1250,
    level: 'Peduli Lingkungan'
  },
  {
    id: 'user-2',
    name: 'Ahmad Fauzi, S.T.',
    email: 'admin@greenoffice.local',
    role: 'admin',
    roleTitle: 'Admin Lingkungan & Energi',
    department: 'Subbag Rumah Tangga & Fasilitas',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    ecoPoints: 2180,
    level: 'Pahlawan Hijau'
  },
  {
    id: 'user-3',
    name: 'Drs. H. Mulyadi, M.Si.',
    email: 'sekda@cirebonkota.go.id',
    role: 'pimpinan',
    roleTitle: 'Sekretaris Daerah Kota Cirebon',
    department: 'Pimpinan Sekretariat Daerah',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    ecoPoints: 3400,
    level: 'Duta Keberlanjutan'
  }
];

export const INITIAL_ENERGY_READINGS: EnergyReading[] = [
  {
    id: 'en-1',
    type: 'listrik',
    building: 'Gedung A (Utama)',
    room: 'Ruang Rapat Adipura & Sayap Barat',
    meterNumber: 'MTR-EL-001',
    readingDate: '2025-05-26',
    value: 520,
    costEstimate: 754000,
    notes: 'Konsumsi normal setelah rapat paripurna koordinasi OPD',
    status: 'Menunggu',
    recordedBy: 'Jilaa Putri',
    createdAt: '2025-05-26T08:30:00Z'
  },
  {
    id: 'en-2',
    type: 'listrik',
    building: 'Gedung B (Sayap Timur)',
    room: 'Bagian Organisasi & Ruang Server',
    meterNumber: 'MTR-EL-002',
    readingDate: '2025-05-25',
    value: 420,
    costEstimate: 609000,
    notes: 'AC central beroperasi stabil pada 24°C',
    status: 'Disetujui',
    recordedBy: 'Budi Santoso',
    createdAt: '2025-05-25T16:00:00Z'
  },
  {
    id: 'en-3',
    type: 'listrik',
    building: 'Gedung C (Fasilitas & Arsip)',
    room: 'Ruang Arsip & Aula Graha',
    meterNumber: 'MTR-EL-003',
    readingDate: '2025-05-24',
    value: 300,
    costEstimate: 435000,
    notes: 'Lampu koridor efisien menggunakan sensor gerak LED',
    status: 'Disetujui',
    recordedBy: 'Rian Pratama',
    createdAt: '2025-05-24T17:15:00Z'
  },
  {
    id: 'en-4',
    type: 'air',
    building: 'Gedung B (Sayap Timur)',
    room: 'Toilet Lantai 1 & Pantry Bersama',
    meterNumber: 'MTR-WT-002',
    readingDate: '2025-05-24',
    value: 32,
    costEstimate: 160000,
    notes: 'Pemeriksaan keran air selesai, tidak ada kebocoran',
    status: 'Disetujui',
    recordedBy: 'Jilaa Putri',
    createdAt: '2025-05-24T15:20:00Z'
  },
  {
    id: 'en-5',
    type: 'air',
    building: 'Gedung A (Utama)',
    room: 'Toilet VIP & Taman Balai Kota',
    meterNumber: 'MTR-WT-001',
    readingDate: '2025-05-25',
    value: 30,
    costEstimate: 150000,
    notes: 'Penyiraman tanaman menggunakan penampungan air hujan',
    status: 'Disetujui',
    recordedBy: 'Ahmad Fauzi',
    createdAt: '2025-05-25T14:10:00Z'
  },
  {
    id: 'en-6',
    type: 'air',
    building: 'Gedung C (Fasilitas & Arsip)',
    room: 'Kantin Dharma Wanita & Musholla',
    meterNumber: 'MTR-WT-003',
    readingDate: '2025-05-26',
    value: 24,
    costEstimate: 120000,
    notes: 'Konsumsi wudhu & pantry terdata rapi',
    status: 'Menunggu',
    recordedBy: 'Siti Rahma',
    createdAt: '2025-05-26T09:45:00Z'
  }
];

export const INITIAL_WASTE_RECORDS: WasteRecord[] = [
  {
    id: 'wst-1',
    building: 'Gedung A (Utama)',
    department: 'Bagian Protokol & Komunikasi Pimpinan',
    category: 'Organik',
    amountKg: 114,
    collectionDate: '2025-05-26',
    responsibleStaff: 'Cecep Sunarya',
    status: 'Menunggu',
    notes: 'Sisa konsumsi jamuan tamu daerah & daun taman',
    createdAt: '2025-05-26T10:15:00Z'
  },
  {
    id: 'wst-2',
    building: 'Gedung B (Sayap Timur)',
    department: 'Bagian Perekonomian & SDA',
    category: 'Anorganik',
    amountKg: 18,
    collectionDate: '2025-05-25',
    responsibleStaff: 'Jilaa Putri',
    status: 'Disetujui',
    notes: 'Botol PET & wadah plastik dipilah ke bank sampah',
    createdAt: '2025-05-25T11:30:00Z'
  },
  {
    id: 'wst-3',
    building: 'Gedung B (Sayap Timur)',
    department: 'Bagian Hukum & Tata Usaha',
    category: 'Kertas',
    amountKg: 37,
    collectionDate: '2025-05-24',
    responsibleStaff: 'Jilaa Putri',
    status: 'Disetujui',
    notes: 'Kertas bekas draft dokumen naskah dinas siap daur ulang',
    createdAt: '2025-05-24T14:40:00Z'
  },
  {
    id: 'wst-4',
    building: 'Gedung A (Utama)',
    department: 'Subbag Rumah Tangga',
    category: 'Residu',
    amountKg: 17,
    collectionDate: '2025-05-24',
    responsibleStaff: 'Dedi Kurniawan',
    status: 'Disetujui',
    notes: 'Sampah residu tidak terpilah diteruskan ke TPA Kopiluhur',
    createdAt: '2025-05-24T16:00:00Z'
  },
  {
    id: 'wst-5',
    building: 'Gedung C (Fasilitas & Arsip)',
    department: 'Kantin & Dharma Wanita',
    category: 'Plastik',
    amountKg: 42,
    collectionDate: '2025-05-23',
    responsibleStaff: 'Cecep Sunarya',
    status: 'Disetujui',
    notes: 'Plastik kemasan bersih dipilah untuk ecobrick',
    createdAt: '2025-05-23T15:10:00Z'
  },
  {
    id: 'wst-6',
    building: 'Gedung A (Utama)',
    department: 'Bagian Pengadaan Barang & Jasa',
    category: 'Logam',
    amountKg: 20,
    collectionDate: '2025-05-22',
    responsibleStaff: 'Dedi Kurniawan',
    status: 'Disetujui',
    notes: 'Kaleng minuman & klip arsip besi tua',
    createdAt: '2025-05-22T13:25:00Z'
  }
];

export const INITIAL_ECO_CHALLENGES: EcoChallenge[] = [
  {
    id: 'ch-1',
    title: 'Hemat Listrik Selama Satu Minggu',
    description: 'Matikan lampu dan pendingin ruangan (AC) setiap selesai rapat atau saat meninggalkan ruangan.',
    points: 150,
    category: 'Energi',
    deadlineDays: 4,
    completed: true,
    completedDate: '2025-05-20'
  },
  {
    id: 'ch-2',
    title: 'Bawa Botol Minum Sendiri (Tumbler)',
    description: 'Hindari air minum kemasan sekali pakai selama 5 hari berturut-turut di lingkungan Setda.',
    points: 100,
    category: 'Sampah',
    deadlineDays: 2,
    completed: true,
    completedDate: '2025-05-22'
  },
  {
    id: 'ch-3',
    title: 'Pilah Sampah Kertas & Plastik',
    description: 'Setor minimal 2 kg sampah terpilah ke Bank Sampah Kantor Setda Kota Cirebon.',
    points: 120,
    category: 'Sampah',
    deadlineDays: 6,
    completed: false
  },
  {
    id: 'ch-4',
    title: 'Paperless Office Challenge',
    description: 'Gunakan tanda tangan elektronik dan berkas digital untuk disposisi surat masuk.',
    points: 200,
    category: 'Kebiasaan',
    deadlineDays: 10,
    completed: false
  },
  {
    id: 'ch-5',
    title: 'Tangga Sehat Tanpa Lift',
    description: 'Gunakan tangga manual untuk naik/turun 1–2 lantai demi penghematan daya lift.',
    points: 80,
    category: 'Energi',
    deadlineDays: 3,
    completed: false
  }
];

export const DAILY_TIPS: EcoTip[] = [
  {
    id: 'tip-1',
    title: 'Gunakan mode hemat energi pada komputer & printer.',
    description: 'Atur komputer masuk ke mode sleep otomatis setelah 10 menit tidak aktif dan matikan printer saat sore hari.',
    category: 'Energi',
    pointsReward: 25,
    completedToday: false
  },
  {
    id: 'tip-2',
    title: 'Matikan lampu dan AC saat ruangan tidak digunakan.',
    description: 'Pastikan saklar lampu dimatikan ketika waktu istirahat makan siang atau saat jam kantor berakhir.',
    category: 'Energi',
    pointsReward: 20,
    completedToday: true
  },
  {
    id: 'tip-3',
    title: 'Gunakan air secukupnya saat mencuci tangan.',
    description: 'Tutup keran saat sedang menggosok sabun untuk menghemat hingga 6 liter air bersih per menit.',
    category: 'Air',
    pointsReward: 20,
    completedToday: false
  },
  {
    id: 'tip-4',
    title: 'Pilah sampah berdasarkan kategori wadah.',
    description: 'Pisahkan sisa makanan (organik) dari kemasan plastik atau kertas agar proses daur ulang maksimal.',
    category: 'Sampah',
    pointsReward: 25,
    completedToday: false
  }
];

export const INITIAL_TRANSACTIONS: PointsTransaction[] = [
  {
    id: 'tx-1',
    date: '2025-05-26',
    description: 'Klaim Tantangan: Bawa Botol Minum Sendiri',
    points: 100,
    category: 'Tantangan'
  },
  {
    id: 'tx-2',
    date: '2025-05-25',
    description: 'Pencatatan data sampah terpilah (Gedung B)',
    points: 50,
    category: 'Pencatatan'
  },
  {
    id: 'tx-3',
    date: '2025-05-24',
    description: 'Selesaikan Tips Harian: Matikan lampu & AC istirahat',
    points: 20,
    category: 'Tips Harian'
  },
  {
    id: 'tx-4',
    date: '2025-05-20',
    description: 'Bonus Mingguan: Pengurangan energi listrik Gedung A',
    points: 150,
    category: 'Prestasi'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Laporan Energi Menunggu Verifikasi',
    message: 'Data konsumsi listrik Gedung A (520 kWh) tanggal 26 Mei telah dicatat dan siap ditinjau.',
    category: 'energi',
    timestamp: '15 menit yang lalu',
    read: false,
    link: '/energi'
  },
  {
    id: 'notif-2',
    title: 'Pengumpulan Sampah Disetujui',
    message: 'Setoran 18 kg sampah anorganik Bagian Umum berhasil divalidasi oleh Admin Lingkungan.',
    category: 'sampah',
    timestamp: '2 jam yang lalu',
    read: false,
    link: '/sampah'
  },
  {
    id: 'notif-3',
    title: 'Selamat! +100 Eco Points Didapat',
    message: 'Anda telah menyelesaikan tantangan membawa botol minum ramah lingkungan.',
    category: 'poin',
    timestamp: '1 hari yang lalu',
    read: true,
    link: '/eco-points'
  },
  {
    id: 'notif-4',
    title: 'Pencapaian Target Pengurangan Air',
    message: 'Penggunaan air di Gedung B turun 8% dari bulan lalu. Kerja hebat seluruh tim!',
    category: 'air',
    timestamp: '2 hari yang lalu',
    read: true,
    link: '/laporan'
  },
  {
    id: 'notif-5',
    title: 'Pemberitahuan Audit Lingkungan Triwulan',
    message: 'Persiapan evaluasi Green Building Setda Kota Cirebon dijadwalkan akhir pekan ini.',
    category: 'sistem',
    timestamp: '3 hari yang lalu',
    read: true,
    link: '/laporan'
  }
];

export const MONTHLY_ENERGY_CHART_DATA = [
  { month: 'Jan', listrik: 1420, target: 1350, air: 98, sampah: 280 },
  { month: 'Feb', listrik: 1380, target: 1300, air: 94, sampah: 265 },
  { month: 'Mar', listrik: 1310, target: 1280, air: 91, sampah: 260 },
  { month: 'Apr', listrik: 1290, target: 1250, air: 89, sampah: 252 },
  { month: 'Mei', listrik: 1240, target: 1200, air: 86, sampah: 248 },
  { month: 'Jun', listrik: 1210, target: 1180, air: 84, sampah: 240 },
  { month: 'Jul', listrik: 1190, target: 1150, air: 83, sampah: 235 },
  { month: 'Agu', listrik: 1180, target: 1150, air: 82, sampah: 230 },
  { month: 'Sep', listrik: 1220, target: 1160, air: 85, sampah: 238 },
  { month: 'Okt', listrik: 1250, target: 1170, air: 87, sampah: 242 },
];

export const BUILDING_LIST = [
  'Gedung A (Utama)',
  'Gedung B (Sayap Timur)',
  'Gedung C (Fasilitas & Arsip)',
  'Gedung Dharma Wanita',
  'Gedung Dewan Perwakilan Rakyat Daerah (DPRD)'
];

export const DEPARTMENT_LIST = [
  'Bagian Umum & Perlengkapan',
  'Bagian Protokol & Komunikasi Pimpinan',
  'Bagian Organisasi & Tata Laksana',
  'Bagian Hukum & Perundang-undangan',
  'Bagian Perekonomian & Sumber Daya Alam',
  'Bagian Kesejahteraan Rakyat',
  'Subbag Rumah Tangga & Fasilitas',
  'Pimpinan Sekretariat Daerah'
];
