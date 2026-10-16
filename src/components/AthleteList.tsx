import React, { useState, useMemo } from 'react';
import { Athlete, AttendanceRecord } from '../types/boxing';
import { calculateStats } from '../utils/storage';
import { 
  Search, 
  Plus, 
  Filter, 
  Scale, 
  Phone, 
  ChevronRight, 
  Edit3, 
  Trash2, 
  AlertCircle,
  Award,
  Users
} from 'lucide-react';

interface AthleteListProps {
  athletes: Athlete[];
  records: AttendanceRecord[];
  onSelectAthlete: (athlete: Athlete) => void;
  onEditAthlete: (athlete: Athlete) => void;
  onDeleteAthlete: (athleteId: string) => void;
  onAddNewAthlete: () => void;
}

export const AthleteList: React.FC<AthleteListProps> = ({
  athletes,
  records,
  onSelectAthlete,
  onEditAthlete,
  onDeleteAthlete,
  onAddNewAthlete,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState<'all' | 'ชาย' | 'หญิง'>('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter athletes
  const filteredAthletes = useMemo(() => {
    return athletes.filter((ath) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = 
        ath.name.toLowerCase().includes(q) ||
        ath.nickname.toLowerCase().includes(q) ||
        ath.studentId.toLowerCase().includes(q) ||
        ath.weightClass.toLowerCase().includes(q);

      if (!matchQuery) return false;
      if (selectedGender !== 'all' && ath.gender !== selectedGender) return false;
      if (selectedAgeGroup !== 'all' && ath.ageGroup !== selectedAgeGroup) return false;

      return true;
    });
  }, [athletes, searchQuery, selectedGender, selectedAgeGroup]);

  return (
    <div className="space-y-4 pb-24 md:pb-8">
      
      {/* Top Controls: Search, Filters & Add Button */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาชื่อ, ชื่อเล่น, รหัสนักเรียน, รุ่นน้ำหนัก..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:bg-white transition-all"
            />
          </div>

          {/* Add New Athlete Action */}
          <button
            onClick={onAddNewAthlete}
            className="min-h-[44px] px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มนักกีฬาใหม่</span>
          </button>

        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-100 text-xs">
          <span className="text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>ตัวกรอง:</span>
          </span>

          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value as any)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium text-xs focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">เพศทั้งหมด</option>
            <option value="ชาย">ชาย</option>
            <option value="หญิง">หญิง</option>
          </select>

          <select
            value={selectedAgeGroup}
            onChange={(e) => setSelectedAgeGroup(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium text-xs focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">ระดับรุ่นทั้งหมด</option>
            <option value="ยุวชน (ม.ต้น)">ยุวชน (ม.ต้น)</option>
            <option value="เยาวชน (ม.ปลาย)">เยาวชน (ม.ปลาย)</option>
            <option value="ประชาชน/เยาวชนทีมชาติ">เยาวชนทีมชาติ/ประชาชน</option>
          </select>

          <span className="text-slate-400 ml-auto">
            พบ {filteredAthletes.length} จาก {athletes.length} คน
          </span>
        </div>
      </div>

      {/* ATHLETE LIST CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredAthletes.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-400">
            <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-medium">ไม่พบข้อมูลนักกีฬาที่ตรงกับการค้นหา</p>
            <p className="text-xs text-slate-400 mt-1">ลองเปลี่ยนคำค้นหาหรือรีเซ็ตตัวกรอง</p>
          </div>
        ) : (
          filteredAthletes.map((ath) => {
            const stats = calculateStats(records, ath.id);
            const isWarning = stats.totalAbsent >= 2 || (stats.totalSessions > 0 && stats.presentRate < 75);
            const isTop = stats.presentRate >= 85 && stats.totalSessions >= 5;

            return (
              <div
                key={ath.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-sm transition-all p-4 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Avatar & Main info */}
                  <div className="flex items-start justify-between gap-3">
                    <div 
                      className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                      onClick={() => onSelectAthlete(ath)}
                    >
                      <div className={`w-11 h-11 rounded-full ${ath.avatarColor} text-white font-bold flex items-center justify-center shrink-0 shadow-xs`}>
                        {ath.nickname.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors truncate">
                            {ath.name}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900">
                            "{ath.nickname}"
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                          <span>{ath.studentId}</span>
                          <span>·</span>
                          <span>{ath.gender}</span>
                          <span>·</span>
                          <span>{ath.ageGroup}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons (Edit & Delete) */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditAthlete(ath);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="แก้ไขข้อมูลนักกีฬา"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmId(ath.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="ลบนักกีฬา"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Boxing Weight & Division info */}
                  <div className="mt-3 py-2 px-3 bg-slate-50 rounded-lg flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-medium text-slate-700">
                      <span>🥊 {ath.weightClass}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Scale className="w-3.5 h-3.5 text-slate-400" />
                      <span>ปัจจุบัน <strong className="text-slate-900 tabular-nums">{ath.currentWeightKg}</strong> กก.</span>
                      <span className="text-slate-400">/ เป้า {ath.targetWeightKg}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Detailed Attendance Summary Badges */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  
                  {/* Attendance numbers: เข้า, ขาด, ลา */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100">
                      เข้า: {stats.totalPresent}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-semibold border ${
                      stats.totalAbsent > 0 ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-50 text-slate-500 border-slate-100'
                    }`}>
                      ขาด: {stats.totalAbsent}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-semibold border border-amber-100">
                      ลา: {stats.totalLeave}
                    </span>
                  </div>

                  {/* Detailed Click */}
                  <button
                    onClick={() => onSelectAthlete(ath)}
                    className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-amber-600 transition-colors"
                  >
                    <span>{stats.presentRate}%</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                </div>

                {/* Delete Confirmation Alert */}
                {deleteConfirmId === ath.id && (
                  <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs space-y-2 animate-in fade-in">
                    <div className="flex items-center gap-1.5 text-rose-800 font-semibold">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>ต้องการลบข้อมูลนักกีฬา {ath.name} หรือไม่?</span>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2.5 py-1 text-slate-600 hover:bg-white rounded-md font-medium"
                      >
                        ยกเลิก
                      </button>
                      <button
                        onClick={() => {
                          onDeleteAthlete(ath.id);
                          setDeleteConfirmId(null);
                        }}
                        className="px-2.5 py-1 bg-rose-600 text-white rounded-md font-semibold hover:bg-rose-700"
                      >
                        ยืนยันการลบ
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
