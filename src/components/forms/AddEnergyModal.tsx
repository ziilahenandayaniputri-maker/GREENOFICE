import React, { useState, useEffect } from 'react';
import { X, Zap, Droplets, Check } from 'lucide-react';
import { EnergyReading, EnergyType, RecordStatus } from '../../types';
import { BUILDING_LIST } from '../../data/seedData';
import { useApp } from '../../context/AppContext';
import { getTodayDateKey } from '../../utils/period';

interface AddEnergyModalProps {
  isOpen: boolean;
  onClose: () => void;
  editRecord?: EnergyReading | null;
  defaultType?: EnergyType;
}

export const AddEnergyModal: React.FC<AddEnergyModalProps> = ({
  isOpen,
  onClose,
  editRecord,
  defaultType = 'listrik',
}) => {
  const { addEnergyReading, updateEnergyReading, currentUser } = useApp();

  const [type, setType] = useState<EnergyType>(defaultType);
  const [building, setBuilding] = useState(BUILDING_LIST[0]);
  const [room, setRoom] = useState('');
  const [meterNumber, setMeterNumber] = useState('');
  const [readingDate, setReadingDate] = useState(getTodayDateKey());
  const [value, setValue] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<RecordStatus>('Menunggu');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editRecord) {
      setType(editRecord.type);
      setBuilding(editRecord.building);
      setRoom(editRecord.room);
      setMeterNumber(editRecord.meterNumber);
      setReadingDate(editRecord.readingDate);
      setValue(editRecord.value.toString());
      setNotes(editRecord.notes || '');
      setStatus(editRecord.status);
    } else {
      setType(defaultType);
      setBuilding(BUILDING_LIST[0]);
      setRoom('');
      setMeterNumber(defaultType === 'listrik' ? 'MTR-EL-' + Math.floor(100 + Math.random() * 900) : 'MTR-WT-' + Math.floor(100 + Math.random() * 900));
      setReadingDate(getTodayDateKey());
      setValue('');
      setNotes('');
      setStatus(currentUser.role === 'admin' ? 'Disetujui' : 'Menunggu');
    }
    setErrors({});
  }, [editRecord, isOpen, defaultType, currentUser.role]);

  if (!isOpen) return null;

  const validate = () => {
    const err: Record<string, string> = {};
    if (!room.trim()) err.room = 'Ruangan / bagian wajib diisi';
    if (!readingDate) err.readingDate = 'Tanggal wajib diisi';
    const numVal = parseFloat(value);
    if (isNaN(numVal) || numVal <= 0) {
      err.value = 'Nilai konsumsi harus berupa angka positif';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const numVal = parseFloat(value);
    const costEstimate = type === 'listrik' ? numVal * 1450 : numVal * 5000;

    if (editRecord) {
      updateEnergyReading({
        ...editRecord,
        type,
        building,
        room,
        meterNumber,
        readingDate,
        value: numVal,
        costEstimate,
        notes,
        status,
      });
    } else {
      addEnergyReading({
        type,
        building,
        room,
        meterNumber,
        readingDate,
        value: numVal,
        costEstimate,
        notes,
        status,
        recordedBy: currentUser.name,
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
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              type === 'listrik' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'
            }`}>
              {type === 'listrik' ? <Zap className="w-5 h-5" /> : <Droplets className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {editRecord ? 'Ubah Data Konsumsi Energi' : 'Catat Penggunaan Energi'}
              </h3>
              <p className="text-xs text-slate-500">Sekretariat Daerah Kota Cirebon</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Energy Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Jenis Energi</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setType('listrik');
                  if (!editRecord) setMeterNumber('MTR-EL-' + Math.floor(100 + Math.random() * 900));
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  type === 'listrik'
                    ? 'bg-amber-50 border-amber-300 text-amber-800 ring-2 ring-amber-400/20'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Listrik (kWh)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('air');
                  if (!editRecord) setMeterNumber('MTR-WT-' + Math.floor(100 + Math.random() * 900));
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  type === 'air'
                    ? 'bg-sky-50 border-sky-300 text-sky-800 ring-2 ring-sky-400/20'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Droplets className="w-4 h-4 text-sky-500" />
                <span>Air (m³)</span>
              </button>
            </div>
          </div>

          {/* Building */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Gedung</label>
            <select
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              className="w-full text-xs sm:text-sm bg-[#F1F8F9] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              {BUILDING_LIST.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Room / Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Ruangan / Bagian *</label>
            <input
              type="text"
              placeholder="Contoh: Ruang Rapat Adipura, Lantai 2"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full text-xs sm:text-sm bg-[#F1F8F9] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            {errors.room && <p className="text-[11px] text-rose-500 mt-1">{errors.room}</p>}
          </div>

          {/* Meter Number & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Meteran</label>
              <input
                type="text"
                value={meterNumber}
                onChange={(e) => setMeterNumber(e.target.value)}
                className="w-full text-xs sm:text-sm bg-[#F1F8F9] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Pembacaan *</label>
              <input
                type="date"
                value={readingDate}
                onChange={(e) => setReadingDate(e.target.value)}
                className="w-full text-xs sm:text-sm bg-[#F1F8F9] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
              {errors.readingDate && <p className="text-[11px] text-rose-500 mt-1">{errors.readingDate}</p>}
            </div>
          </div>

          {/* Value in kWh or m³ */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Konsumsi ({type === 'listrik' ? 'kWh' : 'm³'}) *
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                placeholder={type === 'listrik' ? 'misal: 520' : 'misal: 32'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full text-xs sm:text-sm bg-[#F1F8F9] border border-slate-200 rounded-xl px-3 py-2 pr-12 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                {type === 'listrik' ? 'kWh' : 'm³'}
              </span>
            </div>
            {errors.value && <p className="text-[11px] text-rose-500 mt-1">{errors.value}</p>}
          </div>

          {/* Admin Role Status Override */}
          {currentUser.role === 'admin' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status Validasi</label>
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan / Keterangan</label>
            <textarea
              rows={2}
              placeholder="Catatan kondisi penggunaan alat atau ruangan..."
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
              <span>{editRecord ? 'Simpan Perubahan' : 'Simpan Data'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
