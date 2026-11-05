import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CityIllustration } from '../components/mascot/CityIllustration';
import { CirebonCrest } from '../components/mascot/EcoMascot';

export const LoginPage: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email atau Username wajib diisi');
      return;
    }
    if (!password) {
      setError('Kata sandi wajib diisi');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const user = login(email, password, rememberMe);
      setIsLoading(false);
      if (!user) {
        setError('Email atau kata sandi tidak valid. Silakan coba lagi atau gunakan akun demo di bawah.');
        return;
      }
      // Redirect berdasarkan role
      if (user.role === 'admin') {
        navigate('/energi');       // Admin → halaman verifikasi data energi & sampah
      } else if (user.role === 'pimpinan') {
        navigate('/laporan');      // Pimpinan → halaman laporan & KPI
      } else {
        navigate('/');             // Pegawai → dashboard biasa
      }
    }, 400);
  };

  const handleDemoSelect = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F1F8F9] selection:bg-emerald-200">
      
      {/* LEFT SECTION: Eco Illustration, Cirebon City Landmark & Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-8 xl:p-12 relative overflow-hidden bg-gradient-to-br from-emerald-50 via-[#E1F5FE]/60 to-emerald-100/70 border-r border-[#D9E9F0]">
        
        {/* Top Branding */}
        <div className="z-20">
          <div className="flex items-center gap-3">
            <CirebonCrest className="w-12 h-12" />
            <div>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                Sekretariat Daerah Kota Cirebon
              </p>
              <h1 className="text-2xl font-black text-[#2E7D32] tracking-tight flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                GREENOFFICE
              </h1>
            </div>
          </div>

          <div className="mt-8 max-w-md">
            <h2 className="text-3xl font-extrabold text-[#0F2942] leading-tight">
              Sistem Informasi Pemantauan Energi dan Pengelolaan Sampah
            </h2>
            <p className="text-sm font-medium text-emerald-800 mt-3 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-emerald-500 inline-block"></span>
              Kantor Lebih Hijau, Untuk Masa Depan yang Lebih Baik
            </p>
          </div>
        </div>

        {/* Center / Bottom Illustration */}
        <div className="relative w-full h-[420px] z-10">
          <CityIllustration />
        </div>

        {/* Footer Note */}
        <div className="z-20 text-[11px] text-slate-500 flex items-center justify-between border-t border-emerald-200/50 pt-3">
          <span>Pemerintah Daerah Kota Cirebon • Jawa Barat</span>
          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
            <Sparkles className="w-3 h-3 text-amber-500" /> Eco-Smart City
          </span>
        </div>

      </div>

      {/* RIGHT SECTION: Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-[#D9E9F0] shadow-card relative">
          
          {/* Mobile Header Branding */}
          <div className="lg:hidden text-center mb-6">
            <div className="inline-flex items-center justify-center mb-2">
              <CirebonCrest className="w-12 h-12" />
            </div>
            <h2 className="text-xl font-extrabold text-[#2E7D32]">GREENOFFICE</h2>
            <p className="text-xs text-slate-500 font-medium">Sekretariat Daerah Kota Cirebon</p>
          </div>

          {/* Heading */}
          <div className="text-center sm:text-left mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Masuk ke Akun Anda
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Silakan login untuk mengakses sistem monitoring energi & sampah
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Email / Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Username / Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@greenoffice.local"
                  className="w-full bg-[#F1F8F9] hover:bg-[#E8F3F6] focus:bg-white text-xs sm:text-sm text-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#F1F8F9] hover:bg-[#E8F3F6] focus:bg-white text-xs sm:text-sm text-slate-900 pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <span>Ingat saya</span>
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Silakan hubungi Administrator Subbag Rumah Tangga Setda.'); }} className="text-emerald-700 hover:text-emerald-800 font-medium">
                Lupa password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#2E7D32] hover:bg-[#1B5E20] active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Masuk</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
              Pilihan Akun Demo (Klik untuk Isi Cepat)
            </p>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => handleDemoSelect('admin@greenoffice.local', 'GreenOffice123!')}
                className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-200 transition-all flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-800">Admin Lingkungan</span>
                  <span className="text-[11px] text-slate-500 block">admin@greenoffice.local</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                  Admin
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect('jilaa@cirebonkota.go.id', 'JilaaPass123!')}
                className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200/80 hover:border-sky-200 transition-all flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-800">Pegawai (Jilaa Putri)</span>
                  <span className="text-[11px] text-slate-500 block">jilaa@cirebonkota.go.id</span>
                </div>
                <span className="text-[10px] bg-sky-100 text-sky-800 font-semibold px-2 py-0.5 rounded-full">
                  Pegawai
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect('sekda@cirebonkota.go.id', 'Sekda123!')}
                className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200/80 hover:border-amber-200 transition-all flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-800">Pimpinan (Sekretaris Daerah)</span>
                  <span className="text-[11px] text-slate-500 block">sekda@cirebonkota.go.id</span>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                  Pimpinan
                </span>
              </button>
            </div>
          </div>

          {/* Contact Admin */}
          <div className="mt-5 text-center">
            <p className="text-xs text-slate-500">
              Belum punya akun?{' '}
              <a href="mailto:admin@greenoffice.local" className="text-emerald-700 font-semibold hover:underline">
                Hubungi admin
              </a>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
