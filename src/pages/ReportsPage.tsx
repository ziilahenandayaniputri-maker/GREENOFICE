import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Zap,
  Droplets,
  Recycle,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { BUILDING_LIST } from '../data/seedData';
import { CirebonCrest } from '../components/mascot/EcoMascot';
import {
  formatDateRange,
  getBucketKey,
  getDateRange,
  getLatestDate,
  getPeriodBuckets,
  Period,
} from '../utils/period';
import { downloadCsv } from '../utils/csv';

export const ReportsPage: React.FC = () => {
  const {
    energyReadings,
    wasteRecords,
    currentUser,
    reportEndorsement,
    setReportEndorsement,
  } = useApp();

  const [periodType, setPeriodType] = useState<Extract<Period, 'mingguan' | 'bulanan' | 'tahunan'>>('bulanan');
  const [selectedBuilding, setSelectedBuilding] = useState('semua');
  const [endorseNotes, setEndorseNotes] = useState('');
  const [showEndorseForm, setShowEndorseForm] = useState(false);

  const anchorDate = getLatestDate([
    ...energyReadings.map(reading => reading.readingDate),
    ...wasteRecords.map(record => record.collectionDate),
  ]);
  const dateRange = getDateRange(periodType, anchorDate);
  const filteredEnergy = energyReadings.filter(reading =>
    reading.readingDate >= dateRange.start
    && reading.readingDate <= dateRange.end
    && reading.status === 'Disetujui'
    && (selectedBuilding === 'semua' || reading.building === selectedBuilding)
  );
  const filteredWaste = wasteRecords.filter(record =>
    record.collectionDate >= dateRange.start
    && record.collectionDate <= dateRange.end
    && record.status === 'Disetujui'
    && (selectedBuilding === 'semua' || record.building === selectedBuilding)
  );

  const totalElectricity = filteredEnergy
    .filter(r => r.type === 'listrik')
    .reduce((a, c) => a + c.value, 0);
  const totalWater = filteredEnergy
    .filter(r => r.type === 'air')
    .reduce((a, c) => a + c.value, 0);
  const totalWaste = filteredWaste.reduce((a, c) => a + c.amountKg, 0);
  const residuWaste = filteredWaste
    .filter(r => r.category === 'Residu')
    .reduce((a, c) => a + c.amountKg, 0);
  const recycleRate =
    totalWaste > 0 ? Math.round(((totalWaste - residuWaste) / totalWaste) * 100) : 0;
  const rangeDays = Math.max(1, Math.round(
    (new Date(`${dateRange.end}T00:00:00`).getTime() - new Date(`${dateRange.start}T00:00:00`).getTime())
      / 86400000
  ) + 1);
  const periodScale = periodType === 'mingguan' ? 7 / 30 : periodType === 'tahunan' ? 12 : 1;
  const electricityTarget = Math.round(1300 * periodScale);
  const waterTarget = Math.round(95 * periodScale);
  const wasteTarget = Math.round(200 * periodScale);
  const residueTarget = Math.round(25 * rangeDays / 7);

  const handlePrint = () => window.print();

  const handleExportCSV = () => {
    const headers = ['Kategori', 'Parameter', 'Realisasi', 'Target', 'Status Capaian'];
    const rows = [
      ['Energi Listrik', `Konsumsi ${periodType}`, `${totalElectricity} kWh`, `${electricityTarget} kWh`,
        totalElectricity <= electricityTarget ? 'Memenuhi Target' : 'Melebihi Target'],
      ['Konsumsi Air', `Penggunaan ${periodType}`, `${totalWater} m3`, `${waterTarget} m3`,
        totalWater <= waterTarget ? 'Memenuhi Target' : 'Melebihi Target'],
      ['Pengelolaan Sampah', `Sampah ${periodType}`, `${totalWaste} kg`, `${wasteTarget} kg`,
        totalWaste >= wasteTarget ? 'Melampaui Target' : 'Dalam Proses'],
      ['Tingkat Daur Ulang', 'Persentase pemilahan vs residu', `${recycleRate}%`, '80%',
        recycleRate >= 80 ? 'Sangat Baik' : 'Perlu Peningkatan'],
    ];
    downloadCsv(
      `laporan_keberlanjutan_cirebon_${periodType}_${new Date().toISOString().slice(0, 10)}.csv`,
      [headers, ...rows]
    );
  };

  const buckets = getPeriodBuckets(periodType, dateRange);
  const trendData = buckets.map(bucket => {
    const energyInBucket = filteredEnergy.filter(reading =>
      getBucketKey(reading.readingDate, periodType) === bucket.key
    );
    const wasteInBucket = filteredWaste.filter(record =>
      getBucketKey(record.collectionDate, periodType) === bucket.key
    );
    return {
      month: bucket.label,
      listrik: energyInBucket.filter(reading => reading.type === 'listrik')
        .reduce((sum, reading) => sum + reading.value, 0),
      air: energyInBucket.filter(reading => reading.type === 'air')
        .reduce((sum, reading) => sum + reading.value, 0),
      sampah: wasteInBucket.reduce((sum, record) => sum + record.amountKg, 0),
    };
  });

  const printDate = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="space-y-6">

      {/* Print-Only Header */}
      <div className="hidden print:block mb-6 pb-4 border-b-2 border-slate-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CirebonCrest className="w-16 h-16" />
            <div>
              <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900">
                Pemerintah Kota Cirebon
              </h2>
              <h3 className="text-lg font-extrabold uppercase text-emerald-800">
                Sekretariat Daerah — GREENOFFICE
              </h3>
              <p className="text-xs text-slate-600">
                Jl. Siliwangi No. 84, Kejaksan, Kota Cirebon, Jawa Barat 45121
              </p>
            </div>
          </div>
          <div className="text-right text-xs">
            <p className="font-bold text-slate-900">LAPORAN KINERJA KEBERLANJUTAN</p>
            <p className="text-slate-600">Dicetak: {printDate}</p>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <span>Sekretariat Daerah Kota Cirebon</span>
            <span>•</span>
            <span>Laporan Manajemen & Evaluasi OPD</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-600" />
            Laporan & Analitik Keberlanjutan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Analisis efisiensi konsumsi daya, pemanfaatan air, dan reduksi sampah perkantoran
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-sm transition-all"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / PDF</span>
          </button>
        </div>
      </div>

      {/* Period & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-[#D9E9F0]">
        <div className="flex bg-[#F1F8F9] p-1 rounded-xl border border-slate-200/80">
          {(['mingguan', 'bulanan', 'tahunan'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriodType(p)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                periodType === p
                  ? 'bg-[#2E7D32] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#F1F8F9] px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>{formatDateRange(dateRange)}</span>
          </div>
          <select
            value={selectedBuilding}
            onChange={e => setSelectedBuilding(e.target.value)}
            className="text-xs bg-[#F1F8F9] px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-medium focus:outline-none"
          >
            <option value="semua">Semua Gedung</option>
            {BUILDING_LIST.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3 Metric Cards — data live */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#D9E9F0] shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Listrik</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">
                {totalElectricity.toLocaleString('id-ID')}
              </span>
              <span className="text-xs font-bold text-slate-400">kWh</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 mt-2 block">
              Realisasi data tervalidasi
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#D9E9F0] shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <Droplets className="w-4 h-4 text-sky-500" />
              <span>Air</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">
                {totalWater.toLocaleString('id-ID')}
              </span>
              <span className="text-xs font-bold text-slate-400">m³</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 mt-2 block">
              Realisasi data tervalidasi
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Droplets className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#D9E9F0] shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <Recycle className="w-4 h-4 text-emerald-600" />
              <span>Sampah</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">
                {totalWaste.toLocaleString('id-ID')}
              </span>
              <span className="text-xs font-bold text-slate-400">kg</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 mt-2 block">
              {recycleRate}% tingkat daur ulang tervalidasi
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Recycle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#D9E9F0] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Tren Pemakaian & Pengelolaan</h3>
            <p className="text-xs text-slate-500">
              Korelasi efisiensi energi listrik, air, dan sampah tahun berjalan
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-sky-700">
              <span className="w-3 h-1 bg-[#1976D2] rounded-full inline-block" /> Listrik
            </span>
            <span className="flex items-center gap-1.5 text-teal-700">
              <span className="w-3 h-1 bg-[#00897B] rounded-full inline-block" /> Air
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-3 h-1 bg-[#4CAF50] rounded-full inline-block" /> Sampah
            </span>
          </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF3F6" vertical={false} />
              <XAxis dataKey="month" stroke="#8CA0B3" fontSize={11} tickLine={false} />
              <YAxis stroke="#8CA0B3" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #D9E9F0',
                  fontSize: '12px',
                }}
              />
              <Line type="monotone" dataKey="listrik" name="Listrik (indeks)" stroke="#1976D2" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="air" name="Air (m³)" stroke="#00897B" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="sampah" name="Sampah (indeks)" stroke="#4CAF50" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* KPI Table */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#D9E9F0] shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4">
          Tabel Capaian Target Keberlanjutan Kantor (KPI)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Indikator Kinerja</th>
                <th className="py-3 px-3">Target Setda</th>
                <th className="py-3 px-3">Realisasi</th>
                <th className="py-3 px-3">Deviasi</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-3 font-bold text-slate-800">Efisiensi Konsumsi Listrik</td>
                <td className="py-3 px-3 text-slate-600">≤ {electricityTarget.toLocaleString('id-ID')} kWh</td>
                <td className="py-3 px-3 font-bold text-slate-900">
                  {totalElectricity.toLocaleString('id-ID')} kWh
                </td>
                <td className={`py-3 px-3 font-bold ${totalElectricity <= electricityTarget ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {totalElectricity <= electricityTarget ? '✓ Lebih Hemat' : '✗ Melebihi Target'}
                </td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${totalElectricity <= electricityTarget ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {totalElectricity <= electricityTarget ? 'Tercapai' : 'Belum Tercapai'}
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-3 font-bold text-slate-800">Konservasi & Efisiensi Air</td>
                <td className="py-3 px-3 text-slate-600">≤ {waterTarget.toLocaleString('id-ID')} m³</td>
                <td className="py-3 px-3 font-bold text-slate-900">
                  {totalWater.toLocaleString('id-ID')} m³
                </td>
                <td className={`py-3 px-3 font-bold ${totalWater <= waterTarget ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {totalWater <= waterTarget ? '✓ Lebih Hemat' : '✗ Melebihi Target'}
                </td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${totalWater <= waterTarget ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {totalWater <= waterTarget ? 'Tercapai' : 'Belum Tercapai'}
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-3 font-bold text-slate-800">Tingkat Pemilahan Sampah</td>
                <td className="py-3 px-3 text-slate-600">≥ 80%</td>
                <td className="py-3 px-3 font-bold text-slate-900">{recycleRate}%</td>
                <td className="py-3 px-3 font-bold text-emerald-600">
                  {recycleRate >= 80 ? '✓ Melampaui Target' : '✗ Belum Tercapai'}
                </td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${recycleRate >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {recycleRate >= 80 ? 'Sangat Baik' : 'Perlu Peningkatan'}
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-3 font-bold text-slate-800">Pengurangan Residu ke TPA</td>
                <td className="py-3 px-3 text-slate-600">≤ {residueTarget.toLocaleString('id-ID')} kg</td>
                <td className="py-3 px-3 font-bold text-slate-900">{residuWaste} kg</td>
                <td className={`py-3 px-3 font-bold ${residuWaste <= residueTarget ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {residuWaste <= residueTarget ? '✓ Memenuhi Target' : '✗ Melebihi Target'}
                </td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${residuWaste <= residueTarget ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {residuWaste <= residueTarget ? 'Tercapai' : 'Belum Tercapai'}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signature Box — print only */}
        <div className="mt-8 pt-6 border-t border-slate-200 hidden print:grid grid-cols-2 text-center text-xs">
          <div>
            <p className="text-slate-500 mb-16">Mengetahui,<br />Sekretaris Daerah Kota Cirebon</p>
            <p className="font-bold underline text-slate-900">Drs. H. Mulyadi, M.Si.</p>
            <p className="text-slate-500 text-[10px]">NIP. 19680512 199303 1 004</p>
          </div>
          <div>
            <p className="text-slate-500 mb-16">Cirebon, {printDate}<br />Admin Pengelola Lingkungan & Fasilitas</p>
            <p className="font-bold underline text-slate-900">Ahmad Fauzi, S.T.</p>
            <p className="text-slate-500 text-[10px]">NIP. 19840915 200801 1 009</p>
          </div>
        </div>
      </div>

      {/* Pengesahan Laporan — hanya pimpinan */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#D9E9F0] shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Pengesahan Laporan Keberlanjutan</h3>
            <p className="text-xs text-slate-500">
              Tanda tangan digital oleh Sekretaris Daerah Kota Cirebon
            </p>
          </div>
        </div>

        {reportEndorsement.isEndorsed ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-emerald-800">Laporan Telah Disahkan</p>
              <p className="text-xs text-emerald-700 mt-0.5">{reportEndorsement.notes}</p>
              <p className="text-[11px] text-emerald-600 mt-2 font-semibold">
                — {reportEndorsement.endorsedBy} · {reportEndorsement.endorsedDate}
              </p>
            </div>
            {currentUser.role === 'pimpinan' && (
              <button
                onClick={() => setReportEndorsement(false, '')}
                className="text-[11px] text-slate-500 hover:text-rose-600 font-semibold underline shrink-0"
              >
                Cabut
              </button>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <Lock className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-700">Laporan Belum Disahkan</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentUser.role === 'pimpinan'
                  ? 'Tekan tombol di bawah untuk mengesahkan laporan ini secara digital.'
                  : 'Menunggu pengesahan dari Sekretaris Daerah Kota Cirebon.'}
              </p>
            </div>
          </div>
        )}

        {/* Form pengesahan — hanya pimpinan */}
        {currentUser.role === 'pimpinan' && !reportEndorsement.isEndorsed && (
          <div className="mt-4 space-y-3">
            {showEndorseForm ? (
              <>
                <textarea
                  rows={2}
                  placeholder="Catatan pengesahan (opsional)..."
                  value={endorseNotes}
                  onChange={e => setEndorseNotes(e.target.value)}
                  className="w-full text-xs bg-[#F1F8F9] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setReportEndorsement(true, endorseNotes || undefined);
                      setShowEndorseForm(false);
                      setEndorseNotes('');
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Sahkan Laporan
                  </button>
                  <button
                    onClick={() => setShowEndorseForm(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Batal
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => setShowEndorseForm(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                Sahkan Laporan Ini
              </button>
            )}
          </div>
        )}

        {currentUser.role !== 'pimpinan' && (
          <p className="mt-3 text-[11px] text-slate-400 flex items-center gap-1.5">
            <Lock className="w-3 h-3" />
            Fitur pengesahan hanya tersedia untuk Sekretaris Daerah (Pimpinan).
          </p>
        )}
      </div>

    </div>
  );
};
