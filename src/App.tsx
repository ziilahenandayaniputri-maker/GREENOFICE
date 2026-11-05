import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/AppContext';
import { MainLayout } from './components/layout/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { EnergyPage } from './pages/EnergyPage';
import { WastePage } from './pages/WastePage';
import { ReportsPage } from './pages/ReportsPage';
import { EcoPointsPage } from './pages/EcoPointsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';

const roleHome: Record<'pegawai' | 'admin' | 'pimpinan', string> = {
  pegawai: '/',
  admin: '/energi',
  pimpinan: '/laporan',
};

const RoleRoute: React.FC<{
  children: React.ReactNode;
  roles: Array<'pegawai' | 'admin' | 'pimpinan'>;
}> = ({ children, roles }) => {
  const { currentUser } = useApp();
  if (!roles.includes(currentUser.role)) {
    return <Navigate to={roleHome[currentUser.role]} replace />;
  }
  return <>{children}</>;
};

// Route guard: redirect ke /login jika belum login
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useApp();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Redirect ke / jika sudah login dan coba akses /login
const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useApp();
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public / Authentication */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />

          {/* Authenticated Application */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="energi" element={
              <RoleRoute roles={['pegawai', 'admin']}>
                <EnergyPage />
              </RoleRoute>
            } />
            <Route path="sampah" element={
              <RoleRoute roles={['pegawai', 'admin']}>
                <WastePage />
              </RoleRoute>
            } />
            <Route path="laporan" element={
              <RoleRoute roles={['admin', 'pimpinan']}>
                <ReportsPage />
              </RoleRoute>
            } />
            <Route path="eco-points" element={
              <RoleRoute roles={['pegawai']}>
                <EcoPointsPage />
              </RoleRoute>
            } />
            <Route path="notifikasi" element={<NotificationsPage />} />
            <Route path="profil" element={<ProfilePage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
