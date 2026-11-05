export type UserRole = 'pegawai' | 'admin' | 'pimpinan';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  department: string;
  avatar: string;
  ecoPoints: number;
  level: string;
}

export type EnergyType = 'listrik' | 'air';
export type RecordStatus = 'Menunggu' | 'Disetujui' | 'Ditolak';

export interface EnergyReading {
  id: string;
  type: EnergyType;
  building: string;
  room: string;
  meterNumber: string;
  readingDate: string; // YYYY-MM-DD
  value: number; // kWh for listrik, m3 for air
  costEstimate?: number;
  notes?: string;
  status: RecordStatus;
  recordedBy: string;
  createdAt: string;
}

export type WasteCategory = 'Organik' | 'Anorganik' | 'Kertas' | 'Plastik' | 'Logam' | 'Residu';

export interface WasteRecord {
  id: string;
  building: string;
  department: string;
  category: WasteCategory;
  amountKg: number;
  collectionDate: string; // YYYY-MM-DD
  responsibleStaff: string;
  status: RecordStatus;
  notes?: string;
  createdAt: string;
}

export interface EcoChallenge {
  id: string;
  title: string;
  description: string;
  points: number;
  category: 'Energi' | 'Air' | 'Sampah' | 'Kebiasaan';
  deadlineDays: number;
  completed: boolean;
  completedDate?: string;
}

export interface EcoTip {
  id: string;
  title: string;
  description: string;
  category: string;
  pointsReward: number;
  completedToday?: boolean;
  completedDate?: string;
}

export interface PointsTransaction {
  id: string;
  date: string;
  description: string;
  points: number;
  category: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'energi' | 'air' | 'sampah' | 'poin' | 'sistem';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface SustainabilityTarget {
  month: string;
  electricityTargetKwh: number;
  waterTargetM3: number;
  wasteTargetKg: number;
  recyclingRatePercent: number;
}

export interface ReportEndorsement {
  isEndorsed: boolean;
  endorsedBy?: string;
  endorsedDate?: string;
  notes?: string;
}
