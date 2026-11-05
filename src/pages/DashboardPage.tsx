import React, { useState } from 'react';
import { 
  Zap, 
  Droplets, 
  Recycle, 
  Sparkles, 
  Plus, 
  ArrowRight,
  TrendingDown,
  Lightbulb,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/ui/MetricCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { EcoMascot } from '../components/mascot/EcoMascot';
import { AddEnergyModal } from '../components/forms/AddEnergyModal';
import { AddWasteModal } from '../components/forms/AddWasteModal';
import { getBucketKey, getDateRange, getLatestDate, getPeriodBuckets, Period } from '../utils/period';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { 
    currentUser, 
    energyReadings, 
    wasteRecords, 
    tips, 
    completeDailyTip 
  } = useApp();
  const navigate = useNavigate();

  // State for Chart Filters
  const [energyChartType, setEnergyChartType] = useState<'listrik' | 'air'>('listrik');
  const [chartPeriod, setChartPeriod] = useState<Extract<Period, 'harian' | 'mingguan' | 'bulanan'>>('bulanan');

  // Modals
  const [isEnergyModalOpen, setIsEnergyModalOpen] = useState(false);
  const [isWasteModalOpen, setIsWasteModalOpen] = useState(false);
  const [quickActionMenuOpen, setQuickActionMenuOpen] = useState(false);

  // Compute live values from state
  const totalElectricity = energyReadings
    .filter(r => r.type === 'listrik')
    .reduce((acc, curr) => acc + curr.value, 0);

  const totalWater = energyReadings
    .filter(r => r.type === 'air')
    .reduce((acc, curr) => acc + curr.value, 0);

  const totalWaste = wasteRecords
    .reduce((acc, curr) => acc + curr.amountKg, 0);

  // Compute Waste Composition
  const wasteByCategory = wasteRecords.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + r.amountKg;
    return acc;
  }, {} as Record<string, number>);

  const wastePieData = [
    { name: 'Organik', value: wasteByCategory['Organik'] || 0, color: '#2E7D32' },
    {
      name: 'Anorganik',
      value: (wasteByCategory['Anorganik'] || 0) + (wasteByCategory['Plastik'] || 0) + (wasteByCategory['Logam'] || 0),
      color: '#42A5F5',
    },
    { name: 'Kertas', value: wasteByCategory['Kertas'] || 0, color: '#FFB74D' },
    { name: 'Residu', value: wasteByCategory['Residu'] || 0, color: '#90A4AE' },
  ];

  const chartRange = getDateRange(
    chartPeriod,
    getLatestDate(energyReadings.map(reading => reading.readingDate))
  );
  const chartReadings = energyReadings.filter(reading =>
    reading.readingDate >= chartRange.start && reading.readingDate <= chartRange.end
  );
  const dailyTarget = (energyChartType === 'listrik' ? 1300 : 95) / 30;
  const chartData = getPeriodBuckets(chartPeriod, chartRange).map(bucket => ({
    date: bucket.label,
    actual: chartReadings
      .filter(reading =>
        reading.type === energyChartType
        && getBucketKey(reading.readingDate, chartPeriod) === bucket.key
      )
      .reduce((sum, reading) => sum + reading.value, 0),
    target: dailyTarget,
  }));

  // Combined Recent Activity from both energy & waste
  const recentActivities = [
    ...energyReadings.map(r => ({
      id: r.id,
      kind: 'energy' as const,
      typeLabel: r.type === 'listrik' ? 'Energi Listrik' : 'Penggunaan Air',
      location: `${r.building} - ${r.room}`,
      amount: `${r.value.toLocaleString('id-ID')} ${r.type === 'listrik' ? 'kWh' : 'm³'}`,
      date: r.readingDate,
      status: r.status,
      link: '/energi',
    })),
    ...wasteRecords.map(w => ({
      id: w.id,
      kind: 'waste' as const,
      typeLabel: `Sampah ${w.category}`,
      location: `${w.building} (${w.department})`,
      amount: `${w.amountKg} kg`,
      date: w.collectionDate,
      status: w.status,
      link: '/sampah',
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const dailyTip = tips[0] || {
    id: 'tip-1',
    title: 'Matikan lampu dan pendingin saat ruangan tidak digunakan.',
    category: 'Energi',
    pointsReward: 25,
    completedToday: false
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Welcome Section matching Reference Image */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-emerald-50/80 via-white to-sky-50/80 p-5 sm:p-6 rounded-3xl border border-[#D9E9F0] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#0F2942]">
              Selamat Datang, {currentUser.name}!
            </h1>
            <span className="inline-block animate-bounce text-lg">🌱</span>
          </div>
          <p className="text-xs sm:text-sm text-[#5A7184] mt-1 font-medium">
            Mari bersama wujudkan lingkungan kerja yang lebih hijau dan berkelanjutan di Sekretariat Daerah Kota Cirebon.
          </p>
        </div>

        {/* Quick Action Button — hanya untuk pegawai & admin */}
        <div className="relative shrink-0">
          {currentUser.role !== 'pimpinan' && (
            <>
              <button
                onClick={() => setQuickActionMenuOpen(!quickActionMenuOpen)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Catat Data</span>
              </button>

              {/* Quick Action Dropdown */}
              {quickActionMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-30">
                  <button
                    onClick={() => {
                      setIsEnergyModalOpen(true);
                      setQuickActionMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4 text-amber-500" /> Catat Pemakaian Energi
                  </button>
                  <button
                    onClick={() => {
                      setIsWasteModalOpen(true);
                      setQuickActionMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2"
                  >
                    <Recycle className="w-4 h-4 text-emerald-600" /> Catat Setoran Sampah
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 2. Metric Summary Cards (4 Cards from reference image) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pemakaian Listrik */}
        <MetricCard
          title="Pemakaian Listrik"
          value={totalElectricity.toLocaleString('id-ID')}
          unit="kWh"
          footerNote="Total dari semua pencatatan"
          icon={Zap}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
          onClick={() => navigate('/energi')}
        />

        {/* Penggunaan Air */}
        <MetricCard
          title="Penggunaan Air"
          value={totalWater.toLocaleString('id-ID')}
          unit="m³"
          footerNote="Total dari semua pencatatan"
          icon={Droplets}
          iconBgColor="bg-sky-50"
          iconColor="text-sky-600"
          onClick={() => navigate('/energi')}
        />

        {/* Sampah Terkelola */}
        <MetricCard
          title="Sampah Terkelola"
          value={totalWaste.toLocaleString('id-ID')}
          unit="kg"
          footerNote="Total dari semua pencatatan"
          icon={Recycle}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
          onClick={() => navigate('/sampah')}
        />

        {/* Eco Points */}
        <MetricCard
          title="Eco Points"
          value={currentUser.ecoPoints.toLocaleString('id-ID')}
          unit="pts"
          footerNote={`Level: ${currentUser.level}`}
          icon={Sparkles}
          iconBgColor="bg-orange-50"
          iconColor="text-orange-600"
          onClick={() => navigate('/eco-points')}
        />
      </div>

      {/* 3. Charts Section matching Reference Image */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Grafik Pemakaian Energi (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-[#D9E9F0] shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-[#0F2942]">
                Grafik Pemakaian Energi
              </h3>
              <p className="text-xs text-slate-500">
                Perbandingan konsumsi aktual terhadap target efisiensi
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Type Switcher */}
              <div className="flex bg-[#F1F8F9] p-1 rounded-xl border border-slate-200 text-xs">
                <button
                  onClick={() => setEnergyChartType('listrik')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    energyChartType === 'listrik'
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Listrik
                </button>
                <button
                  onClick={() => setEnergyChartType('air')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    energyChartType === 'air'
                      ? 'bg-white text-sky-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Air
                </button>
              </div>

              {/* Period Select */}
              <select
                value={chartPeriod}
                onChange={(e) => setChartPeriod(e.target.value as Extract<Period, 'harian' | 'mingguan' | 'bulanan'>)}
                className="text-xs bg-[#F1F8F9] border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none"
              >
                <option value="harian">Harian</option>
                <option value="mingguan">Mingguan</option>
                <option value="bulanan">Bulanan</option>
              </select>
            </div>
          </div>

          {/* Recharts LineChart */}
          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF3F6" vertical={false} />
                <XAxis dataKey="date" stroke="#8CA0B3" fontSize={11} tickLine={false} />
                <YAxis stroke="#8CA0B3" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #D9E9F0',
                    fontSize: '12px',
                    boxShadow: '0 8px 20px -4px rgba(0,0,0,0.1)'
                  }}
                  formatter={(val: number) => [`${val.toLocaleString('id-ID')} ${energyChartType === 'listrik' ? 'kWh' : 'm³'}`, '']}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="actual"
                  name={energyChartType === 'listrik' ? 'Konsumsi Listrik (kWh)' : 'Konsumsi Air (m³)'}
                  stroke={energyChartType === 'listrik' ? '#1976D2' : '#0288D1'}
                  strokeWidth={3}
                  dot={{ r: 4, fill: energyChartType === 'listrik' ? '#1976D2' : '#0288D1', strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  name="Target Efisiensi"
                  stroke="#4CAF50"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Komposisi Sampah (Donut Chart) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#D9E9F0] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-[#0F2942]">Komposisi Sampah</h3>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Semua Data
              </span>
            </div>
            <p className="text-xs text-slate-500">Distribusi pemilahan jenis sampah kantor</p>
          </div>

          <div className="relative h-56 w-full flex items-center justify-center my-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={wastePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {wastePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`${val} kg`, '']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    border: '1px solid #D9E9F0',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text displaying total */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-black text-[#0F2942]">
                {totalWaste} kg
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Total Sampah</span>
            </div>
          </div>

          {/* Custom Legend matching reference */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
            {wastePieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 font-medium text-[11px]">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800 text-[11px]">
                  {Math.round((item.value / (totalWaste || 1)) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Bottom Row: Recent Activities & Eco Tips Mascot Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Aktivitas Terbaru (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-[#D9E9F0] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#0F2942]">Aktivitas Terbaru</h3>
              <p className="text-xs text-slate-500">Pencatatan konsumsi energi dan pengumpulan sampah terkini</p>
            </div>
            <button
              onClick={() => navigate('/energi')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
            >
              Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Jenis</th>
                  <th className="py-2.5 px-3">Lokasi / Kategori</th>
                  <th className="py-2.5 px-3">Jumlah</th>
                  <th className="py-2.5 px-3">Tanggal</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentActivities.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 font-semibold ${
                        act.kind === 'energy' ? 'text-sky-700' : 'text-emerald-700'
                      }`}>
                        {act.kind === 'energy' ? <Zap className="w-3.5 h-3.5" /> : <Recycle className="w-3.5 h-3.5" />}
                        {act.typeLabel}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium max-w-[200px] truncate">
                      {act.location}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {act.amount}
                    </td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                      {act.date}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={act.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mascot & Tips Card matching right column of reference */}
        <div className="flex flex-col gap-4">
          
          {/* Mascot Motivational Card */}
          <div className="bg-gradient-to-br from-emerald-50 via-[#E1F5FE]/50 to-emerald-100/70 rounded-3xl p-5 border border-emerald-200/80 flex items-center justify-between shadow-sm relative overflow-hidden">
            <div className="z-10 max-w-[170px]">
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest bg-emerald-200/60 px-2 py-0.5 rounded-full">
                Green Reminder
              </span>
              <h4 className="text-sm font-bold text-slate-900 mt-2 leading-tight">
                Jaga energi, kurangi sampah, selamatkan bumi!
              </h4>
              <p className="text-[11px] text-slate-600 mt-1">
                Langkah kecil kita di Setda berdampak besar bagi Cirebon.
              </p>
            </div>
            <div className="z-10">
              <EcoMascot size="lg" />
            </div>
          </div>

          {/* Daily Eco Tip Card */}
          <div className="bg-white rounded-3xl p-5 border border-[#D9E9F0] shadow-sm flex flex-col justify-between flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Tips Hari Ini</h4>
                  <span className="text-[10px] text-emerald-600 font-semibold">+{dailyTip.pointsReward} Eco Points</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-700 font-medium my-3 leading-relaxed">
              {dailyTip.title}
            </p>

            <button
              onClick={() => completeDailyTip(dailyTip.id)}
              disabled={dailyTip.completedToday}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                dailyTip.completedToday
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{dailyTip.completedToday ? 'Selesai Dipraktikkan Hari Ini' : 'Tandai Selesai'}</span>
            </button>
          </div>

        </div>

      </div>

      {/* Modals */}
      <AddEnergyModal
        isOpen={isEnergyModalOpen}
        onClose={() => setIsEnergyModalOpen(false)}
      />

      <AddWasteModal
        isOpen={isWasteModalOpen}
        onClose={() => setIsWasteModalOpen(false)}
      />

    </div>
  );
};
