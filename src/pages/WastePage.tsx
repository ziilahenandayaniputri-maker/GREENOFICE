import React, { useState } from 'react';
import { 
  Recycle, 
  Plus, 
  Download, 
  Search, 
  Edit2, 
  Trash2, 
  Calendar,
  Layers,
  CheckCircle2,
  XCircle,
  TrendingUp,
  FileSpreadsheet,
  Eye
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { AddWasteModal } from '../components/forms/AddWasteModal';
import { WasteRecord, WasteCategory } from '../types';
import { BUILDING_LIST } from '../data/seedData';
import { getBucketKey, getDateRange, getLatestDate, getPeriodBuckets } from '../utils/period';
import { downloadCsv } from '../utils/csv';

export const WastePage: React.FC = () => {
  const { wasteRecords, deleteWasteRecord, setWasteStatus, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'pencatatan' | 'riwayat'>('pencatatan');
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WasteRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Totals
  const totalWaste = wasteRecords.reduce((acc, curr) => acc + curr.amountKg, 0);
  
  const organikTotal = wasteRecords
    .filter(r => r.category === 'Organik')
    .reduce((acc, curr) => acc + curr.amountKg, 0);

  const anorganikTotal = wasteRecords
    .filter(r => r.category === 'Anorganik' || r.category === 'Plastik' || r.category === 'Logam')
    .reduce((acc, curr) => acc + curr.amountKg, 0);

  const kertasTotal = wasteRecords
    .filter(r => r.category === 'Kertas')
    .reduce((acc, curr) => acc + curr.amountKg, 0);

  const residuTotal = wasteRecords
    .filter(r => r.category === 'Residu')
    .reduce((acc, curr) => acc + curr.amountKg, 0);

  const daurUlangPercent = totalWaste > 0 ? Math.round(((totalWaste - residuTotal) / totalWaste) * 100) : 0;

  // Filtered records
  const filteredRecords = wasteRecords.filter((r) => {
    const matchesCat = selectedCategory === 'semua' || r.category === selectedCategory;
    const matchesBuilding = selectedBuilding === 'semua' || r.building === selectedBuilding;
    const matchesSearch = 
      r.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.responsibleStaff.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.notes && r.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesBuilding && matchesSearch;
  });

  // Pie chart data
  const pieData = [
    { name: 'Organik', value: organikTotal, color: '#2E7D32' },
    { name: 'Anorganik', value: anorganikTotal, color: '#42A5F5' },
    { name: 'Kertas', value: kertasTotal, color: '#FFB74D' },
    { name: 'Residu', value: residuTotal, color: '#90A4AE' },
  ];
  const wasteRange = getDateRange('mingguan', getLatestDate(wasteRecords.map(record => record.collectionDate)));
  const dailyWasteData = getPeriodBuckets('mingguan', wasteRange).map(bucket => {
    const records = wasteRecords.filter(record =>
      getBucketKey(record.collectionDate, 'mingguan') === bucket.key
    );
    return {
      day: bucket.label,
      organik: records.filter(record => record.category === 'Organik')
        .reduce((sum, record) => sum + record.amountKg, 0),
      anorganik: records.filter(record => ['Anorganik', 'Plastik', 'Logam'].includes(record.category))
        .reduce((sum, record) => sum + record.amountKg, 0),
      kertas: records.filter(record => record.category === 'Kertas')
        .reduce((sum, record) => sum + record.amountKg, 0),
      residu: records.filter(record => record.category === 'Residu')
        .reduce((sum, record) => sum + record.amountKg, 0),
    };
  });

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['ID', 'Gedung', 'Departemen', 'Kategori', 'Berat (kg)', 'Tanggal Pengumpulan', 'Petugas', 'Status', 'Catatan'];
    const rows = filteredRecords.map(r => [
      r.id,
      r.building,
      r.department,
      r.category,
      r.amountKg,
      r.collectionDate,
      r.responsibleStaff,
      r.status,
      r.notes || ''
    ]);

    downloadCsv(
      `greenoffice_sampah_${new Date().toISOString().slice(0, 10)}.csv`,
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
            <span>Pengolahan Sampah Terpadu & Bank Sampah</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Recycle className="w-6 h-6 text-emerald-600" />
            Pengelolaan Sampah
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pencatatan pemilahan sampah organik, anorganik, dan residu perkantoran
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

          {/* Hanya pegawai & admin yang bisa mencatat pemilahan baru */}
          {currentUser.role !== 'pimpinan' && (
            <button
              onClick={() => {
                setEditingRecord(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Catat Pemilahan</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs matching Reference Image (Pencatatan vs Riwayat) */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-[#D9E9F0] w-fit">
        <button
          onClick={() => setActiveTab('pencatatan')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'pencatatan'
              ? 'bg-[#2E7D32] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Pencatatan & Ringkasan
        </button>
        <button
          onClick={() => setActiveTab('riwayat')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'riwayat'
              ? 'bg-[#2E7D32] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Riwayat Lengkap ({wasteRecords.length})
        </button>
      </div>

      {/* 4 Category Metric Cards matching reference image */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Organik */}
        <div className="bg-white rounded-2xl p-4 border border-[#D9E9F0] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Organik</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-slate-900">{organikTotal}</span>
            <span className="text-xs text-slate-500 ml-1 font-semibold">kg</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md w-fit">
            Kompos & Biopori
          </span>
        </div>

        {/* Anorganik */}
        <div className="bg-white rounded-2xl p-4 border border-[#D9E9F0] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Anorganik</span>
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-slate-900">{anorganikTotal}</span>
            <span className="text-xs text-slate-500 ml-1 font-semibold">kg</span>
          </div>
          <span className="text-[11px] text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded-md w-fit">
            Plastik & Logam
          </span>
        </div>

        {/* Kertas */}
        <div className="bg-white rounded-2xl p-4 border border-[#D9E9F0] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Kertas</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-slate-900">{kertasTotal}</span>
            <span className="text-xs text-slate-500 ml-1 font-semibold">kg</span>
          </div>
          <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md w-fit">
            Daur Ulang Dokumen
          </span>
        </div>

        {/* Residu */}
        <div className="bg-white rounded-2xl p-4 border border-[#D9E9F0] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Residu</span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-slate-900">{residuTotal}</span>
            <span className="text-xs text-slate-500 ml-1 font-semibold">kg</span>
          </div>
          <span className="text-[11px] text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded-md w-fit">
            TPA Kopiluhur
          </span>
        </div>
      </div>

      {/* Visual Charts: Donut + Bar Chart matching Reference Image */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Waste Composition Donut Chart */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#D9E9F0] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Komposisi Sampah</h3>
            <p className="text-xs text-slate-500">Persentase kategori pemilahan</p>
          </div>

          <div className="relative h-56 w-full flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
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
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-black text-slate-900">{totalWaste} kg</span>
              <span className="text-[10px] text-slate-400 font-semibold">Terkumpul</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 text-[11px] font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800 text-[11px]">
                  {Math.round((item.value / (totalWaste || 1)) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Grafik Sampah (kg) Bar Chart matching reference image */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-[#D9E9F0] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Grafik Sampah Harian (kg)</h3>
              <p className="text-xs text-slate-500">Volume pengumpulan harian per jenis sampah</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-slate-600">
                <span className="w-3 h-3 rounded bg-[#2E7D32]"></span> Organik
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-600">
                <span className="w-3 h-3 rounded bg-[#42A5F5]"></span> Anorganik
              </span>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyWasteData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF3F6" vertical={false} />
                <XAxis dataKey="day" stroke="#8CA0B3" fontSize={11} tickLine={false} />
                <YAxis stroke="#8CA0B3" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val: number) => [`${val} kg`, '']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #D9E9F0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="organik" name="Organik" fill="#2E7D32" radius={[4, 4, 0, 0]} />
                <Bar dataKey="anorganik" name="Anorganik" fill="#42A5F5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="kertas" name="Kertas" fill="#FFB74D" radius={[4, 4, 0, 0]} />
                <Bar dataKey="residu" name="Residu" fill="#90A4AE" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Tingkat Daur Ulang: <strong className="text-emerald-700 font-bold">{daurUlangPercent}%</strong></span>
            <span>Target Kota Bersih Adipura: &gt;80%</span>
          </div>
        </div>

      </div>

      {/* Waste Records Table */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#D9E9F0] shadow-sm">
        
        {/* Table Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              Daftar Pencatatan Sampah Terpilah
            </h3>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              {filteredRecords.length} Data
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
                placeholder="Cari bagian, petugas..."
                className="text-xs bg-[#F1F8F9] pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-[#F1F8F9] px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-medium focus:outline-none"
            >
              <option value="semua">Semua Kategori</option>
              {(['Organik', 'Anorganik', 'Kertas', 'Plastik', 'Logam', 'Residu'] as const).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

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
                <th className="py-3 px-3">Gedung & Departemen</th>
                <th className="py-3 px-3">Kategori</th>
                <th className="py-3 px-3">Berat (kg)</th>
                <th className="py-3 px-3">Tanggal Setor</th>
                <th className="py-3 px-3">Petugas</th>
                <th className="py-3 px-3">Catatan</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3">
                    <p className="font-bold text-slate-900">{r.building}</p>
                    <p className="text-[11px] text-slate-500">{r.department}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-bold text-[11px] ${
                      r.category === 'Organik' ? 'bg-emerald-100 text-emerald-800' :
                      r.category === 'Anorganik' ? 'bg-sky-100 text-sky-800' :
                      r.category === 'Kertas' ? 'bg-amber-100 text-amber-800' :
                      r.category === 'Plastik' ? 'bg-teal-100 text-teal-800' :
                      r.category === 'Logam' ? 'bg-purple-100 text-purple-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {r.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-black text-slate-900 text-sm">
                    {r.amountKg} kg
                  </td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                    {r.collectionDate}
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-medium">
                    {r.responsibleStaff}
                  </td>
                  <td className="py-3 px-3 text-slate-500 max-w-xs truncate">
                    {r.notes || '-'}
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
                            onClick={() => setWasteStatus(r.id, 'Disetujui')}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Setujui data"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setWasteStatus(r.id, 'Ditolak')}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Tolak data"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      {/* Pegawai hanya dapat mengubah catatannya sendiri */}
                      {(currentUser.role === 'admin' || r.responsibleStaff === currentUser.name) && (
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
      <AddWasteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRecord(null);
        }}
        editRecord={editingRecord}
      />

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deletingId}
        title="Hapus Data Sampah Terpilah?"
        message="Catatan sampah ini akan dihapus dari sistem bank sampah kantor dan memengaruhi total pelaporan daur ulang."
        confirmLabel="Hapus Data"
        onConfirm={() => {
          if (deletingId) {
            deleteWasteRecord(deletingId);
            setDeletingId(null);
          }
        }}
        onCancel={() => setDeletingId(null)}
      />

    </div>
  );
};
