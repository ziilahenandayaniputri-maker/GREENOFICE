import React, { useState, useEffect } from 'react';
import { X, Recycle, Check } from 'lucide-react';
import { WasteRecord, WasteCategory, RecordStatus } from '../../types';
import { BUILDING_LIST, DEPARTMENT_LIST } from '../../data/seedData';
import { useApp } from '../../context/AppContext';
import { getTodayDateKey } from '../../utils/period';

interface AddWasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  editRecord?: WasteRecord | null;
}

const CATEGORIES: WasteCategory[] = ['Organik', 'Anorganik', 'Kertas', 'Plastik', 'Logam', 'Residu'];

export const AddWasteModal: React.FC<AddWasteModalProps> = ({
  isOpen,
  onClose,
  editRecord,
}) => {
  const { addWasteRecord, updateWasteRecord, currentUser } = useApp();

  const [building, setBuilding] = useState(BUILDING_LIST[0]);
  const [department, setDepartment] = useState(DEPARTMENT_LIST[0]);
  const [category, setCategory] = useState<WasteCategory>('Organik');
  const [amountKg, setAmountKg] = useState<string>('');
  const [collectionDate, setCollectionDate] = useState(getTodayDateKey());
  const [responsibleStaff, setResponsibleStaff] = useState(currentUser.name);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<RecordStatus>('Menunggu');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editRecord) {
      setBuilding(editRecord.building);
      setDepartment(editRecord.department);
      setCategory(editRecord.category);
      setAmountKg(editRecord.amountKg.toString());
      setCollectionDate(editRecord.collectionDate);
      setResponsibleStaff(editRecord.responsibleStaff);
      setNotes(editRecord.notes || '');
      setStatus(editRecord.status);
    } else {
      setBuilding(BUILDING_LIST[0]);
      setDepartment(DEPARTMENT_LIST[0]);
      setCategory('Organik');
      setAmountKg('');
      setCollectionDate(getTodayDateKey());
      setResponsibleStaff(currentUser.name);
      setNotes('');
      setStatus(currentUser.role === 'admin' ? 'Disetujui' : 'Menunggu');
    }
    setErrors({});
  }, [editRecord, isOpen, currentUser]);

  if (!isOpen) return null;

  const validate = () => {
    const err: Record<string, string> = {};
    const val = parseFloat(amountKg);
    if (isNaN(val) || val <= 0) {
      err.amountKg = 'Berat sampah harus berupa angka lebih dari 0';
    }
    if (!responsibleStaff.trim()) {
      err.responsibleStaff = 'Nama petugas harus diisi';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const val = parseFloat(amountKg);

    if (editRecord) {
      updateWasteRecord({
        ...editRecord,
        building,
        department,
        category,
        amountKg: val,
        collectionDate,
        responsibleStaff,
        notes,
        status,
      });
    } else {
      addWasteRecord({
        building,
        department,
        category,
        amountKg: val,
        collectionDate,
        responsibleStaff,
        notes,
        status,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-100 text-emerald-700">
              <Recycle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {editRecord ? 'Ubah Data Sampah' : 'Catat Pengumpulan Sampah'}
              </h3>
              <p className="text-xs text-slate-500">Pilah Sampah Setda Kota Cirebon</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Category Chips */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Kategori Sampah</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    category === cat
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Amount in kg */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah Berat (kg) *</label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                placeholder="misal: 18.5"
                value={amountKg}
                onChange={(e) => setAmountKg(e.target.value)}
                className="w-full text-xs sm:text-sm bg-[#F1F8F9] border border-slate-200 rounded-xl px-3 py-2 pr-12 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                kg
              </span>
            </div>
            {errors.amountKg && <p className="text-[11px] text-rose-500 mt-1">{errors.amountKg}</p>}
          </div>

          {/* Building & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gedung</label>
              <select
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                className="w-full text-xs bg-[#F1F8F9] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                {BUILDING_LIST.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Departemen / Bagian</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full text-xs bg-[#F1F8F9] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                {DEPARTMENT_LIST.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Collection Date & Responsible Staff */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Pengumpulan</label>
              <input
                type="date"
                value={collectionDate}
                onChange={(e) => setCollectionDate(e.target.value)}
                className="w-full text-xs bg-[#F1F8F9] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Petugas Bertanggung Jawab *</label>
              <input
                type="text"
                value={responsibleStaff}
                onChange={(e) => setResponsibleStaff(e.target.value)}
                placeholder="Nama staf"
                className="w-full text-xs bg-[#F1F8F9] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
              {errors.responsibleStaff && <p className="text-[11px] text-rose-500 mt-1">{errors.responsibleStaff}</p>}
            </div>
          </div>

          {/* Status (Admin option or view) */}
          {currentUser.role === 'admin' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status Verifikasi</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as RecordStatus)}
                className="w-full text-xs bg-[#F1F8F9] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                <option value="Menunggu">Menunggu</option>
                <option value="Disetujui">Disetujui</option>
                <option value="Ditolak">Ditolak</option>
              </select>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Tambahan</label>
            <textarea
              rows={2}
              placeholder="Contoh: Disetor ke bank sampah mitra Dinas Lingkungan Hidup..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs sm:text-sm bg-[#F1F8F9] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#2E7D32] hover:bg-[#1B5E20] rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{editRecord ? 'Simpan Perubahan' : 'Catat Sampah'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
