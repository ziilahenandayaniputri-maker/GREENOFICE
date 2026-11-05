import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  UserProfile, 
  EnergyReading, 
  WasteRecord, 
  EcoChallenge, 
  EcoTip, 
  PointsTransaction, 
  NotificationItem 
} from '../types';
import { storageService } from '../services/storageService';

interface AppContextType {
  currentUser: UserProfile;
  energyReadings: EnergyReading[];
  wasteRecords: WasteRecord[];
  challenges: EcoChallenge[];
  tips: EcoTip[];
  transactions: PointsTransaction[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  reportEndorsement: { isEndorsed: boolean; endorsedBy?: string; endorsedDate?: string; notes?: string };
  isLoggedIn: boolean;
  login: (email: string, password: string, remember: boolean) => UserProfile | null;
  logout: () => void;
  addEnergyReading: (reading: Omit<EnergyReading, 'id' | 'createdAt'>) => void;
  updateEnergyReading: (reading: EnergyReading) => void;
  deleteEnergyReading: (id: string) => void;
  setEnergyStatus: (id: string, status: 'Disetujui' | 'Ditolak') => void;
  addWasteRecord: (record: Omit<WasteRecord, 'id' | 'createdAt'>) => void;
  updateWasteRecord: (record: WasteRecord) => void;
  deleteWasteRecord: (id: string) => void;
  setWasteStatus: (id: string, status: 'Disetujui' | 'Ditolak') => void;
  setReportEndorsement: (endorsed: boolean, notes?: string) => void;
  completeChallenge: (id: string) => boolean;
  completeDailyTip: (id: string) => boolean;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  resetAllDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(storageService.getCurrentUser());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(storageService.isLoggedIn());
  const [energyReadings, setEnergyReadings] = useState<EnergyReading[]>(storageService.getEnergyReadings());
  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>(storageService.getWasteRecords());
  const [challenges, setChallenges] = useState<EcoChallenge[]>(storageService.getChallenges());
  const [tips, setTips] = useState<EcoTip[]>(storageService.getDailyTips());
  const [transactions, setTransactions] = useState<PointsTransaction[]>(storageService.getTransactions());
  const [notifications, setNotifications] = useState<NotificationItem[]>(storageService.getNotifications());
  const [reportEndorsement, setReportEndorsementState] = useState(storageService.getReportEndorsement());

  const syncStateFromStorage = () => {
    setIsLoggedIn(storageService.isLoggedIn());
    setCurrentUser(storageService.getCurrentUser());
    setEnergyReadings(storageService.getEnergyReadings());
    setWasteRecords(storageService.getWasteRecords());
    setChallenges(storageService.getChallenges());
    setTips(storageService.getDailyTips());
    setTransactions(storageService.getTransactions());
    setNotifications(storageService.getNotifications());
    setReportEndorsementState(storageService.getReportEndorsement());
  };

  useEffect(() => {
    const handleStorageUpdate = () => {
      syncStateFromStorage();
    };

    window.addEventListener('greenoffice-storage-update', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener('greenoffice-storage-update', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const login = (email: string, password: string, remember: boolean) => {
    const user = storageService.login(email, password, remember);
    if (user) syncStateFromStorage();
    return user;
  };

  const logout = () => {
    storageService.logout();
    setIsLoggedIn(false);
    setCurrentUser(storageService.getCurrentUser());
  };

  const addEnergyReading = (reading: Omit<EnergyReading, 'id' | 'createdAt'>) => {
    storageService.addEnergyReading(reading);
    syncStateFromStorage();
  };

  const updateEnergyReading = (reading: EnergyReading) => {
    storageService.updateEnergyReading(reading);
    syncStateFromStorage();
  };

  const deleteEnergyReading = (id: string) => {
    storageService.deleteEnergyReading(id);
    syncStateFromStorage();
  };

  const setEnergyStatus = (id: string, status: 'Disetujui' | 'Ditolak') => {
    storageService.setEnergyStatus(id, status);
    syncStateFromStorage();
  };

  const addWasteRecord = (record: Omit<WasteRecord, 'id' | 'createdAt'>) => {
    storageService.addWasteRecord(record);
    syncStateFromStorage();
  };

  const updateWasteRecord = (record: WasteRecord) => {
    storageService.updateWasteRecord(record);
    syncStateFromStorage();
  };

  const deleteWasteRecord = (id: string) => {
    storageService.deleteWasteRecord(id);
    syncStateFromStorage();
  };

  const setWasteStatus = (id: string, status: 'Disetujui' | 'Ditolak') => {
    storageService.setWasteStatus(id, status);
    syncStateFromStorage();
  };

  const setReportEndorsement = (endorsed: boolean, notes?: string) => {
    storageService.setReportEndorsement(endorsed, notes);
    syncStateFromStorage();
  };

  const completeChallenge = (id: string) => {
    const result = storageService.completeChallenge(id);
    syncStateFromStorage();
    return result;
  };

  const completeDailyTip = (id: string) => {
    const result = storageService.completeDailyTip(id);
    syncStateFromStorage();
    return result;
  };

  const markNotificationAsRead = (id: string) => {
    storageService.markNotificationAsRead(id);
    syncStateFromStorage();
  };

  const markAllNotificationsAsRead = () => {
    storageService.markAllNotificationsAsRead();
    syncStateFromStorage();
  };

  const deleteNotification = (id: string) => {
    storageService.deleteNotification(id);
    syncStateFromStorage();
  };

  const resetAllDemoData = () => {
    storageService.resetAllData();
    syncStateFromStorage();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        energyReadings,
        wasteRecords,
        challenges,
        tips,
        transactions,
        notifications,
        unreadNotificationCount,
        reportEndorsement,
        login,
        logout,
        addEnergyReading,
        updateEnergyReading,
        deleteEnergyReading,
        setEnergyStatus,
        addWasteRecord,
        updateWasteRecord,
        deleteWasteRecord,
        setWasteStatus,
        setReportEndorsement,
        completeChallenge,
        completeDailyTip,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        resetAllDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
