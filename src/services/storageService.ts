import { 
  UserProfile, 
  EnergyReading, 
  WasteRecord, 
  EcoChallenge, 
  EcoTip, 
  PointsTransaction, 
  NotificationItem 
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_ENERGY_READINGS, 
  INITIAL_WASTE_RECORDS, 
  INITIAL_ECO_CHALLENGES, 
  DAILY_TIPS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_NOTIFICATIONS 
} from '../data/seedData';
import { getTodayDateKey } from '../utils/period';

const STORAGE_KEYS = {
  CURRENT_USER: 'greenoffice_current_user',
  SESSION_USER: 'greenoffice_session_user',
  REMEMBERED_SESSION: 'greenoffice_remembered_session',
  USERS: 'greenoffice_users',
  ENERGY: 'greenoffice_energy_readings',
  WASTE: 'greenoffice_waste_records',
  CHALLENGES: 'greenoffice_challenges',
  TIPS: 'greenoffice_tips',
  TRANSACTIONS: 'greenoffice_transactions',
  NOTIFICATIONS: 'greenoffice_notifications',
  ENDORSEMENT: 'greenoffice_report_endorsement',
  TARGETS: 'greenoffice_targets',
};

class StorageService {
  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaultValue; // JANGAN auto-write ke storage
      return JSON.parse(data);
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      window.dispatchEvent(new Event('greenoffice-storage-update'));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }

  // --- USERS & AUTH ---
  isLoggedIn(): boolean {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.SESSION_USER) !== null
        || (
          localStorage.getItem(STORAGE_KEYS.REMEMBERED_SESSION) === 'true'
          && localStorage.getItem(STORAGE_KEYS.CURRENT_USER) !== null
        );
    } catch {
      return false;
    }
  }

  getCurrentUser(): UserProfile {
    try {
      const sessionUser = sessionStorage.getItem(STORAGE_KEYS.SESSION_USER);
      if (sessionUser) return JSON.parse(sessionUser) as UserProfile;

      if (localStorage.getItem(STORAGE_KEYS.REMEMBERED_SESSION) === 'true') {
        const rememberedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        if (rememberedUser) return JSON.parse(rememberedUser) as UserProfile;
      }
    } catch {
      return INITIAL_USERS[0];
    }
    return INITIAL_USERS[0];
  }

  setCurrentUser(user: UserProfile, remember = this.isRememberedSession()): void {
    try {
      if (remember) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEYS.REMEMBERED_SESSION, 'true');
        sessionStorage.removeItem(STORAGE_KEYS.SESSION_USER);
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        localStorage.removeItem(STORAGE_KEYS.REMEMBERED_SESSION);
        sessionStorage.setItem(STORAGE_KEYS.SESSION_USER, JSON.stringify(user));
      }
      window.dispatchEvent(new Event('greenoffice-storage-update'));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }

  private isRememberedSession(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.REMEMBERED_SESSION) === 'true';
    } catch {
      return false;
    }
  }

  getAllUsers(): UserProfile[] {
    // Users list boleh di-init otomatis karena bukan sesi
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      this.setItem(STORAGE_KEYS.USERS, INITIAL_USERS);
      return INITIAL_USERS;
    }
    try { return JSON.parse(raw); } catch { return INITIAL_USERS; }
  }

  login(email: string, password: string, remember = false): UserProfile | null {
    // Credential map untuk demo (email lowercase → password)
    const DEMO_PASSWORDS: Record<string, string> = {
      'admin@greenoffice.local': 'GreenOffice123!',
      'jilaa@cirebonkota.go.id': 'JilaaPass123!',
      'sekda@cirebonkota.go.id': 'Sekda123!',
    };

    const users = this.getAllUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      const expectedPass = DEMO_PASSWORDS[found.email.toLowerCase()];
      if (!expectedPass || password !== expectedPass) return null;
      this.setCurrentUser(found, remember);
      return found;
    }
    // Email tidak terdaftar
    return null;
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    try {
      localStorage.removeItem(STORAGE_KEYS.REMEMBERED_SESSION);
      sessionStorage.removeItem(STORAGE_KEYS.SESSION_USER);
    } catch (e) {
      console.warn('Storage logout error:', e);
    }
  }

  // --- ENERGY READINGS ---
  getEnergyReadings(): EnergyReading[] {
    return this.getItem<EnergyReading[]>(STORAGE_KEYS.ENERGY, INITIAL_ENERGY_READINGS);
  }

  addEnergyReading(reading: Omit<EnergyReading, 'id' | 'createdAt'>): EnergyReading {
    const list = this.getEnergyReadings();
    const newRecord: EnergyReading = {
      ...reading,
      id: `en-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newRecord);
    this.setItem(STORAGE_KEYS.ENERGY, list);

    // Auto notification
    this.addNotification({
      title: `Pencatatan ${reading.type === 'listrik' ? 'Listrik' : 'Air'} Baru`,
      message: `${reading.building} (${reading.value} ${reading.type === 'listrik' ? 'kWh' : 'm³'}) telah dicatat oleh ${reading.recordedBy}.`,
      category: reading.type === 'listrik' ? 'energi' : 'air',
      link: '/energi'
    });

    return newRecord;
  }

  updateEnergyReading(updated: EnergyReading): void {
    const list = this.getEnergyReadings().map(r => r.id === updated.id ? updated : r);
    this.setItem(STORAGE_KEYS.ENERGY, list);
  }

  deleteEnergyReading(id: string): void {
    const list = this.getEnergyReadings().filter(r => r.id !== id);
    this.setItem(STORAGE_KEYS.ENERGY, list);
  }

  setEnergyStatus(id: string, status: 'Disetujui' | 'Ditolak'): void {
    const list = this.getEnergyReadings().map(r => r.id === id ? { ...r, status } : r);
    this.setItem(STORAGE_KEYS.ENERGY, list);

    const record = list.find(r => r.id === id);
    if (record) {
      this.addNotification({
        title: `Data ${record.type === 'listrik' ? 'Listrik' : 'Air'} ${status}`,
        message: `Pencatatan ${record.building} (${record.value} ${record.type === 'listrik' ? 'kWh' : 'm³'}) telah ${status.toLowerCase()} oleh Admin Lingkungan.`,
        category: record.type === 'listrik' ? 'energi' : 'air',
        link: '/energi'
      });
    }
  }

  // --- WASTE RECORDS ---
  getWasteRecords(): WasteRecord[] {
    return this.getItem<WasteRecord[]>(STORAGE_KEYS.WASTE, INITIAL_WASTE_RECORDS);
  }

  addWasteRecord(record: Omit<WasteRecord, 'id' | 'createdAt'>): WasteRecord {
    const list = this.getWasteRecords();
    const newRecord: WasteRecord = {
      ...record,
      id: `wst-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newRecord);
    this.setItem(STORAGE_KEYS.WASTE, list);

    this.addNotification({
      title: 'Pencatatan Sampah Baru',
      message: `Setoran sampah ${record.category} (${record.amountKg} kg) dari ${record.department} dicatat.`,
      category: 'sampah',
      link: '/sampah'
    });

    return newRecord;
  }

  updateWasteRecord(updated: WasteRecord): void {
    const list = this.getWasteRecords().map(r => r.id === updated.id ? updated : r);
    this.setItem(STORAGE_KEYS.WASTE, list);
  }

  deleteWasteRecord(id: string): void {
    const list = this.getWasteRecords().filter(r => r.id !== id);
    this.setItem(STORAGE_KEYS.WASTE, list);
  }

  setWasteStatus(id: string, status: 'Disetujui' | 'Ditolak'): void {
    const list = this.getWasteRecords().map(r => r.id === id ? { ...r, status } : r);
    this.setItem(STORAGE_KEYS.WASTE, list);

    const record = list.find(r => r.id === id);
    if (record) {
      this.addNotification({
        title: `Setoran Sampah ${status}`,
        message: `Setoran sampah ${record.category} (${record.amountKg} kg) dari ${record.department} telah ${status.toLowerCase()} oleh Admin Lingkungan.`,
        category: 'sampah',
        link: '/sampah'
      });
    }
  }

  // --- REPORT ENDORSEMENT (PIMPINAN) ---
  getReportEndorsement(): { isEndorsed: boolean; endorsedBy?: string; endorsedDate?: string; notes?: string } {
    return this.getItem(STORAGE_KEYS.ENDORSEMENT, {
      isEndorsed: false,
    });
  }

  setReportEndorsement(endorsed: boolean, notes?: string): void {
    const user = this.getCurrentUser();
    const data = {
      isEndorsed: endorsed,
      endorsedBy: user.name,
      endorsedDate: getTodayDateKey(),
      notes: notes || 'Laporan telah ditelaah dan disahkan secara digital oleh Sekretaris Daerah Kota Cirebon.'
    };
    this.setItem(STORAGE_KEYS.ENDORSEMENT, data);

    if (endorsed) {
      this.addNotification({
        title: 'Pengesahan Laporan oleh Pimpinan',
        message: `Laporan Keberlanjutan telah disahkan oleh ${user.name} (Sekda Kota Cirebon).`,
        category: 'sistem',
        link: '/laporan'
      });
    }
  }

  // --- ECO CHALLENGES ---
  getChallenges(): EcoChallenge[] {
    return this.getItem<EcoChallenge[]>(STORAGE_KEYS.CHALLENGES, INITIAL_ECO_CHALLENGES);
  }

  completeChallenge(id: string): boolean {
    const list = this.getChallenges();
    const challenge = list.find(c => c.id === id);
    if (!challenge || challenge.completed) return false;

    challenge.completed = true;
    challenge.completedDate = new Date().toISOString().split('T')[0];
    this.setItem(STORAGE_KEYS.CHALLENGES, list);

    // Award Points
    this.addEcoPoints(challenge.points, `Tantangan Selesai: ${challenge.title}`, 'Tantangan');

    this.addNotification({
      title: `Selamat! +${challenge.points} Eco Points`,
      message: `Anda telah menyelesaikan tantangan: "${challenge.title}".`,
      category: 'poin',
      link: '/eco-points'
    });

    return true;
  }

  // --- DAILY TIPS ---
  getDailyTips(): EcoTip[] {
    const today = getTodayDateKey();
    return this.getItem<EcoTip[]>(STORAGE_KEYS.TIPS, DAILY_TIPS).map(tip => ({
      ...tip,
      completedToday: tip.completedDate === today,
    }));
  }

  completeDailyTip(id: string): boolean {
    const list = this.getDailyTips();
    const tip = list.find(t => t.id === id);
    if (!tip || tip.completedToday) return false;

    tip.completedToday = true;
    tip.completedDate = getTodayDateKey();
    this.setItem(STORAGE_KEYS.TIPS, list);

    this.addEcoPoints(tip.pointsReward, `Tips Harian Selesai: ${tip.title}`, 'Tips Harian');

    this.addNotification({
      title: `+${tip.pointsReward} Eco Points`,
      message: `Terima kasih telah mempraktikkan tips ramah lingkungan hari ini!`,
      category: 'poin',
      link: '/eco-points'
    });

    return true;
  }

  // --- ECO POINTS & TRANSACTIONS ---
  getTransactions(): PointsTransaction[] {
    return this.getItem<PointsTransaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  }

  addEcoPoints(amount: number, description: string, category: string): void {
    const user = this.getCurrentUser();
    user.ecoPoints += amount;

    // Recalculate level if milestone reached
    if (user.ecoPoints >= 3000) {
      user.level = 'Duta Keberlanjutan';
    } else if (user.ecoPoints >= 2000) {
      user.level = 'Pahlawan Hijau';
    } else {
      user.level = 'Peduli Lingkungan';
    }

    this.setCurrentUser(user);

    // Add transaction history
    const txs = this.getTransactions();
    txs.unshift({
      id: `tx-${Date.now()}`,
      date: getTodayDateKey(),
      description,
      points: amount,
      category,
    });
    this.setItem(STORAGE_KEYS.TRANSACTIONS, txs);
  }

  // --- NOTIFICATIONS ---
  getNotifications(): NotificationItem[] {
    return this.getItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }

  addNotification(notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): void {
    const list = this.getNotifications();
    list.unshift({
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Baru saja',
      read: false
    });
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, list);
  }

  markNotificationAsRead(id: string): void {
    const list = this.getNotifications().map(n => n.id === id ? { ...n, read: true } : n);
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, list);
  }

  markAllNotificationsAsRead(): void {
    const list = this.getNotifications().map(n => ({ ...n, read: true }));
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, list);
  }

  deleteNotification(id: string): void {
    const list = this.getNotifications().filter(n => n.id !== id);
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, list);
  }

  // Reset to default seed
  resetAllData(): void {
    const activeUser = this.getCurrentUser();
    const initialUser = INITIAL_USERS.find(user => user.id === activeUser.id) || activeUser;
    const remembered = this.isRememberedSession();
    this.setItem(STORAGE_KEYS.USERS, INITIAL_USERS);
    this.setItem(STORAGE_KEYS.ENERGY, INITIAL_ENERGY_READINGS);
    this.setItem(STORAGE_KEYS.WASTE, INITIAL_WASTE_RECORDS);
    this.setItem(STORAGE_KEYS.CHALLENGES, INITIAL_ECO_CHALLENGES);
    this.setItem(STORAGE_KEYS.TIPS, DAILY_TIPS);
    this.setItem(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    this.setItem(STORAGE_KEYS.ENDORSEMENT, {
      isEndorsed: false,
    });
    localStorage.removeItem(STORAGE_KEYS.TARGETS);
    this.setCurrentUser(initialUser, remembered);
  }
}

export const storageService = new StorageService();
