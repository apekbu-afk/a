import React, { useState, useEffect } from 'react';
import { Athlete, AgeGroup, Gender, WeightClass } from '../types/boxing';
import { X, Check, UserPlus, Save } from 'lucide-react';

interface AthleteFormModalProps {
  athleteToEdit: Athlete | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (athlete: Athlete) => void;
}

const WEIGHT_CLASSES: WeightClass[] = [
  '48 kg (มินิมัมเวต)',
  '51 kg (ฟลายเวต)',
  '54 kg (แบนตัมเวต)',
  '57 kg (เฟเธอร์เวต)',
  '60 kg (ไลต์เวต)',
  '63.5 kg (ไลต์เวลเตอร์เวต)',
  '67 kg (เวลเตอร์เวต)',
  '71 kg (ไลต์มิดเดิลเวต)',
  '75 kg (มิดเดิลเวต)',
  '80 kg (ไลต์เฮฟวี่เวต)',
  '+80 kg (เฮฟวี่เวต)',
];

const AVATAR_COLORS = [
  'bg-amber-600',
  'bg-emerald-600',
  'bg-blue-600',
  'bg-rose-600',
  'bg-indigo-600',
  'bg-violet-600',
  'bg-orange-600',
  'bg-teal-600',
  'bg-cyan-600',
];

export const AthleteFormModal: React.FC<AthleteFormModalProps> = ({
  athleteToEdit,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [studentId, setStudentId] = useState('');
  const [gender, setGender] = useState<Gender>('ชาย');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('เยาวชน (ม.ปลาย)');
  const [weightClass, setWeightClass] = useState<WeightClass>('51 kg (ฟลายเวต)');
  const [currentWeightKg, setCurrentWeightKg] = useState<number>(51.0);
  const [targetWeightKg, setTargetWeightKg] = useState<number>(51.0);
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (athleteToEdit) {
      setName(athleteToEdit.name);
      setNickname(athleteToEdit.nickname);
      setStudentId(athleteToEdit.studentId);
      setGender(athleteToEdit.gender);
      setAgeGroup(athleteToEdit.ageGroup);
      setWeightClass(athleteToEdit.weightClass);
      setCurrentWeightKg(athleteToEdit.currentWeightKg);
      setTargetWeightKg(athleteToEdit.targetWeightKg);
      setPhone(athleteToEdit.phone || '');
      setNotes(athleteToEdit.notes || '');
      setAvatarColor(athleteToEdit.avatarColor || AVATAR_COLORS[0]);
    } else {
      setName('');
      setNickname('');
      setStudentId(`BSS-BX-${Math.floor(10 + Math.random() * 90)}`);
      setGender('ชาย');
      setAgeGroup('เยาวชน (ม.ปลาย)');
      setWeightClass('51 kg (ฟลายเวต)');
      setCurrentWeightKg(51.0);
      setTargetWeightKg(51.0);
      setPhone('');
      setNotes('');
      setAvatarColor(AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]);
    }
    setErrorMsg('');
  }, [athleteToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('กรุณากรอกชื่อ-นามสกุลนักกีฬา');
      return;
    }
    if (!nickname.trim()) {
      setErrorMsg('กรุณากรอกชื่อเล่น');
      return;
    }

    const athleteData: Athlete = {
      id: athleteToEdit ? athleteToEdit.id : `ath-${Date.now()}`,
      studentId: studentId.trim() || `BSS-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      nickname: nickname.trim(),
      gender,
      ageGroup,
      weightClass,
      currentWeightKg: Number(currentWeightKg) || 50,
      targetWeightKg: Number(targetWeightKg) || 50,
      phone: phone.trim(),
      avatarColor,
      notes: notes.trim(),
      joinedDate: athleteToEdit ? athleteToEdit.joinedDate : new Date().toISOString().split('T')[0],
    };

    onSave(athleteData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold">
              {athleteToEdit ? 'แก้ไขข้อมูลนักกีฬา' : 'เพิ่มนักกีฬามวยสากลใหม่'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Name & Nickname */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-700">ชื่อ - นามสกุล *</label>
              <input
                type="text"
                placeholder="เช่น นายธนากร สมบูรณ์สุข"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">ชื่อเล่น *</label>
              <input
                type="text"
                placeholder="เช่น แชมป์"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          {/* Student ID & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">รหัสประจำตัวนักเรียนกีฬา</label>
              <input
                type="text"
                placeholder="เช่น BSS-BX-01"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">เพศ</label>
              <div className="flex gap-2 pt-0.5">
                {(['ชาย', 'หญิง'] as Gender[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                      gender === g
                        ? 'bg-amber-400 text-slate-950 border-amber-500'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Age Group */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">ระดับรุ่นการแข่งขัน</label>
            <select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            >
              <option value="ยุวชน (ม.ต้น)">ยุวชน (ม.ต้น)</option>
              <option value="เยาวชน (ม.ปลาย)">เยาวชน (ม.ปลาย)</option>
              <option value="ประชาชน/เยาวชนทีมชาติ">ประชาชน / เยาวชนทีมชาติ</option>
            </select>
          </div>

          {/* Weight Class */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">รุ่นพิกัดน้ำหนัก (Weight Class)</label>
            <select
              value={weightClass}
              onChange={(e) => setWeightClass(e.target.value as WeightClass)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            >
              {WEIGHT_CLASSES.map((wc) => (
                <option key={wc} value={wc}>{wc}</option>
              ))}
            </select>
          </div>

          {/* Current Weight & Target Weight */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">น้ำหนักปัจจุบัน (กก.)</label>
              <input
                type="number"
                step="0.1"
                value={currentWeightKg}
                onChange={(e) => setCurrentWeightKg(parseFloat(e.target.value) || 0)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg tabular-nums focus:outline-hidden focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">พิกัดเป้าหมาย (กก.)</label>
              <input
                type="number"
                step="0.1"
                value={targetWeightKg}
                onChange={(e) => setTargetWeightKg(parseFloat(e.target.value) || 0)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg tabular-nums focus:outline-hidden focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">เบอร์โทรศัพท์ / ผู้ปกครอง</label>
            <input
              type="tel"
              placeholder="081-xxx-xxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Notes & Bio */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">จุดเด่น / เชิงชก / หมายเหตุ</label>
            <textarea
              rows={2}
              placeholder="เช่น มวยซ้าย Southpaw, หมัดแย็บขวารวดเร็ว, แชมป์กีฬาเยาวชน"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg shadow-xs flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{athleteToEdit ? 'บันทึกการแก้ไข' : 'บันทึกนักกีฬา'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
