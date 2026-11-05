import React, { useState } from 'react';
import { 
  Zap, 
  Droplets, 
  Plus, 
  Download, 
  Search, 
  Edit2, 
  Trash2, 
  Building,
  CheckCircle,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Eye
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { AddEnergyModal } from '../components/forms/AddEnergyModal';
import { EnergyReading } from '../types';
import { BUILDING_LIST } from '../data/seedData';
import { getBucketKey, getDateRange, getLatestDate, getPeriodBuckets, Period } from '../utils/period';
import { downloadCsv } from '../utils/csv';

export const EnergyPage: React.FC = () => {
  const { energyReadings, deleteEnergyReading, setEnergyStatus, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'listrik' | 'air'>('listrik');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeView, setTimeView] = useState<'harian' | 'mingguan' | 'bulanan' | 'tahunan'>('bulanan');
  const dateRange = getDateRange(
    timeView,
    getLatestDate(energyReadings.map(reading => reading.readingDate))
  );
  const periodReadings = energyReadings.filter(item =>
    item.type === activeTab
    && item.readingDate >= dateRange.start
    && item.readingDate <= dateRange.end
    && (selectedBuilding === 'semua' || item.building === selectedBuilding)
  );

  // Modal & Dialog state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<EnergyReading | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filtered readings
  const filteredReadings = periodReadings.filter((item) => {
    const matchesSearch = 
      item.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meterNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.recordedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Calculate Building Breakdown matching the reference image card ("Detail Per Gedung")
  const buildingBreakdown = BUILDING_LIST.slice(0, 3).map(building => ({
    name: building,
    total: periodReadings
      .filter(reading => reading.building === building)
      .reduce((sum, reading) => sum + reading.value, 0),
  }));

  const totalCurrentValue = periodReadings.reduce((acc, curr) => acc + curr.value, 0);
  const periodBuckets = getPeriodBuckets(timeView, dateRange);
  const chartData = periodBuckets.map(bucket => ({
    date: bucket.label,
    actual: periodReadings
      .filter(reading => getBucketKey(reading.readingDate, timeView as Period) === bucket.key)
      .reduce((sum, reading) => sum + reading.value, 0),
    target: timeView === 'tahunan'
      ? activeTab === 'listrik' ? 1300 : 95
      : (activeTab === 'listrik' ? 1300 : 95) / 30,
  }));

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['ID', 'Jenis', 'Gedung', 'Ruangan', 'Nomor Meteran', 'Tanggal', 'Konsumsi', 'Satuan', 'Estimasi Biaya (Rp)', 'Status', 'Petugas'];
    const rows = filteredReadings.map(r => [
      r.id,
      r.type === 'listrik' ? 'Listrik' : 'Air',
      r.building,
      r.room,
      r.meterNumber,
      r.readingDate,
      r.value,
      r.type === 'listrik' ? 'kWh' : 'm3',
      r.costEstimate || 0,
      r.status,
      r.recordedBy
    ]);

    downloadCsv(
      `greenoffice_energi_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`,
      [headers, ...rows]
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <span>Sekretariat Daerah Kota Cirebon</span>
            <span>•</span>
            <span>Subbag Fasilitas & Rumah Tangga</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Zap className="w-6 h-6 text-emerald-600" />
            Pemantauan Energi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitoring konsumsi listrik dan air secara real-time pada seluruh gedung Setda
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-sm transition-all"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Ekspor CSV</span>
          </button>

          {/* Hanya pegawai & admin yang bisa mencatat data baru */}
          {currentUser.role !== 'pimpinan' && (
            <button
              onClick={() => {
                setEditingRecord(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Catat Pemakaian</span>
            </button>
          )}
        </div>
      </div>

      {/* Type Toggle & Range Selector matching reference */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-[#D9E9F0]">
        
        {/* Toggle Listrik / Air */}
        <div className="flex bg-[#F1F8F9] p-1 rounded-xl border border-slate-200/80">
          <button
            onClick={() => setActiveTab('listrik')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'listrik'
                ? 'bg-[#2E7D32] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Listrik (kWh)</span>
          </button>
          <button
            onClick={() => setActiveTab('air')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'air'
                ? 'bg-[#0288D1] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Air (m³)</span>
          </button>
        </div>

        {/* Time View Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Periode:</span>
          <div className="flex bg-[#F1F8F9] p-1 rounded-xl border border-slate-200/80 text-xs font-semibold">
            {(['harian', 'mingguan', 'bulanan', 'tahunan'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setTimeView(view)}
                className={`px-3 py-1 rounded-lg capitalize transition-all ${
                  timeView === view ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Card 1: Total Pemakaian */}
        <div className="bg-white rounded-2xl p-5 border border-[#D9E9F0] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">
              Total {activeTab === 'listrik' ? 'Konsumsi Listrik' : 'Penggunaan Air'}
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-slate-900">
                {totalCurrentValue.toLocaleString('id-ID')}
              </span>
              <span className="text-xs font-bold text-slate-400">
                {activeTab === 'listrik' ? 'kWh' : 'm³'}
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-400 mt-2 block">
              Total pada periode terpilih
            </span>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            activeTab === 'listrik' ? 'bg-amber-50 text-amber-600' : 'bg-sky-50 text-sky-600'
          }`}>
            {activeTab === 'listrik' ? <Zap className="w-6 h-6" /> : <Droplets className="w-6 h-6" />}
          </div>
        </div>

        {/* Card 2: Estimasi Anggaran Operasional */}
        <div className="bg-white rounded-2xl p-5 border border-[#D9E9F0] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Estimasi Beban Biaya</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xs font-bold text-slate-400">Rp</span>
              <span className="text-2xl font-black text-slate-900">
                {(activeTab === 'listrik' ? totalCurrentValue * 1450 : totalCurrentValue * 5000).toLocaleString('id-ID')}
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-400 mt-2 block">
              Tarif kantor pemerintah daerah
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Efisiensi Emisi CO2 */}
        <div className="bg-white rounded-2xl p-5 border border-[#D9E9F0] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Estimasi Emisi Operasional</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-emerald-700">
                {activeTab === 'listrik' ? Math.round(totalCurrentValue * 0.79).toLocaleString('id-ID') : '—'}
              </span>
              <span className="text-xs font-bold text-slate-400">kg CO₂e</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 mt-2 block">
              {activeTab === 'listrik' ? 'Estimasi faktor 0,79 kg CO₂e/kWh' : 'Faktor emisi air belum dikonfigurasi'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Visual Chart & Detail Per Gedung Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-[#D9E9F0] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Grafik Pemakaian {activeTab === 'listrik' ? 'Listrik' : 'Air'}
              </h3>
              <p className="text-xs text-slate-500">Realisasi per tanggal pada periode terpilih</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-3 h-1 bg-[#1976D2] rounded-full inline-block"></span> Aktual
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-3 h-1 bg-[#4CAF50] rounded-full inline-block"></span> Target
              </span>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF3F6" vertical={false} />
                <XAxis dataKey="date" stroke="#8CA0B3" fontSize={11} tickLine={false} />
                <YAxis stroke="#8CA0B3" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val: number) => [`${val.toLocaleString('id-ID')} ${activeTab === 'listrik' ? 'kWh' : 'm³'}`, '']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #D9E9F0',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke={activeTab === 'listrik' ? '#1976D2' : '#0288D1'}
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#1976D2', strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#4CAF50"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detail Per Gedung Card matching Reference Image */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#D9E9F0] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Detail Per Gedung</h3>
            <p className="text-xs text-slate-500 mb-4">Konsumsi energi terbagi per blok kantor Setda</p>
            
            <div className="space-y-3">
              {buildingBreakdown.map((item) => (
                <div 
                  key={item.name}
                  className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/70 hover:bg-[#F1F8F9] transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{item.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {item.total.toLocaleString('id-ID')} {activeTab === 'listrik' ? 'kWh' : 'm³'}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400">Periode ini</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400">
              Ringkasan sesuai periode terpilih
            </span>
          </div>
        </div>

      </div>

      {/* Data Table Section */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#D9E9F0] shadow-sm">
        
        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              Riwayat Pencatatan {activeTab === 'listrik' ? 'Listrik' : 'Air'}
            </h3>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              {filteredReadings.length} Data
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari meteran, ruangan..."
                className="text-xs bg-[#F1F8F9] pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* Building Filter */}
            <select
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              className="text-xs bg-[#F1F8F9] px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-medium focus:outline-none"
            >
              <option value="semua">Semua Gedung</option>
              {BUILDING_LIST.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Gedung & Ruangan</th>
                <th className="py-3 px-3">No. Meteran</th>
                <th className="py-3 px-3">Tanggal</th>
                <th className="py-3 px-3">Konsumsi</th>
                <th className="py-3 px-3">Est. Biaya</th>
                <th className="py-3 px-3">Dicatat Oleh</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReadings.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3">
                    <p className="font-bold text-slate-900">{r.building}</p>
                    <p className="text-[11px] text-slate-500">{r.room}</p>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 font-semibold">
                    {r.meterNumber}
                  </td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                    {r.readingDate}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {r.value.toLocaleString('id-ID')} {r.type === 'listrik' ? 'kWh' : 'm³'}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    Rp {(r.costEstimate || 0).toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {r.recordedBy}
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Admin: Approve / Reject untuk data Menunggu */}
                      {currentUser.role === 'admin' && r.status === 'Menunggu' && (
                        <>
                          <button
                            onClick={() => setEnergyStatus(r.id, 'Disetujui')}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Setujui data"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEnergyStatus(r.id, 'Ditolak')}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Tolak data"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      {/* Pegawai hanya dapat mengubah catatannya sendiri */}
                      {(currentUser.role === 'admin' || r.recordedBy === currentUser.name) && (
                        <>
                          <button
                            onClick={() => {
                              setEditingRecord(r);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit data"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingId(r.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus data"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      {/* Pimpinan: hanya bisa lihat */}
                      {currentUser.role === 'pimpinan' && (
                        <span className="p-1.5 text-slate-300" title="View only">
                          <Eye className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Add / Edit Modal */}
      <AddEnergyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRecord(null);
        }}
        editRecord={editingRecord}
        defaultType={activeTab}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingId}
        title="Hapus Data Pembacaan Energi?"
        message="Data pembacaan meteran ini akan dihapus secara permanen dan memengaruhi grafik laporan efisiensi energi."
        confirmLabel="Hapus Data"
        onConfirm={() => {
          if (deletingId) {
            deleteEnergyReading(deletingId);
            setDeletingId(null);
          }
        }}
        onCancel={() => setDeletingId(null)}
      />

    </div>
  );
};
