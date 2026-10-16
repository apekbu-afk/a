import React, { useMemo } from 'react';
import { Athlete, AttendanceRecord } from '../types/boxing';
import { calculateStats, formatThaiDate, getSessionThai, getLeaveReasonThai } from '../utils/storage';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Scale, 
  Phone, 
  Calendar, 
  Dumbbell, 
  Award, 
  Swords, 
  AlertTriangle 
} from 'lucide-react';

interface AthleteDetailModalProps {
  athlete: Athlete | null;
  records: AttendanceRecord[];
  onClose: () => void;
  onEditAthlete: (athlete: Athlete) => void;
}

export const AthleteDetailModal: React.FC<AthleteDetailModalProps> = ({
  athlete,
  records,
  onClose,
  onEditAthlete,
}) => {
  if (!athlete) return null;

  // Filter athlete's specific attendance records sorted by date descending
  const athleteRecords = useMemo(() => {
    return records
      .filter(r => r.athleteId === athlete.id)
      .sort((a, b) => new Date(b.date + 'T' + (b.session === 'evening' ? '18:00' : '06:00')).getTime() - 
                      new Date(a.date + 'T' + (a.session === 'evening' ? '18:00' : '06:00')).getTime());
  }, [records, athlete.id]);

  const stats = useMemo(() => {
    return calculateStats(athleteRecords, athlete.id);
  }, [athleteRecords, athlete.id]);

  const weightDiff = Number((athlete.currentWeightKg - athlete.targetWeightKg).toFixed(1));

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header Strip with Boxer Identity */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full ${athlete.avatarColor} text-white font-bold text-2xl flex items-center justify-center shadow-md border-2 border-amber-400`}>
              {athlete.nickname.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  {athlete.name}
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-400 text-slate-950">
                  "{athlete.nickname}"
                </span>
              </div>
              <div className="text-xs text-slate-300 flex items-center gap-2 mt-1 flex-wrap">
                <span>รหัส: {athlete.studentId}</span>
                <span>·</span>
                <span>{athlete.gender}</span>
                <span>·</span>
                <span>{athlete.ageGroup}</span>
                <span>·</span>
                <span>เข้าแคมป์: {formatThaiDate(athlete.joinedDate, false)}</span>
              </div>
            </div>
          </div>

          {/* Quick Contact & Boxing Bio */}
          {athlete.notes && (
            <p className="mt-3 text-xs text-slate-300 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60">
              💡 {athlete.notes}
            </p>
          )}
        </div>

        {/* Content Body: Scrollable */}
        <div className="p-5 overflow-y-auto space-y-5">
          
          {/* Weight Control Strip (Crucial for Boxing) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900">{athlete.weightClass}</div>
                <div className="text-slate-500">
                  พิกัดเป้าหมาย {athlete.targetWeightKg} กก. · ชั่งล่าสุด <strong className="text-slate-900 tabular-nums">{athlete.currentWeightKg}</strong> กก.
                </div>
              </div>
            </div>

            <div className="text-right">
              {weightDiff > 0 ? (
                <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded-md border border-rose-200">
                  เกินเป้า +{weightDiff} กก. (ต้องคุมอาหาร/รีดเหงื่อ)
                </span>
              ) : weightDiff < 0 ? (
                <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-200">
                  ต่ำกว่าเป้า {weightDiff} กก.
                </span>
              ) : (
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                  ✓ พอดีพิกัดเป๊ะ
                </span>
              )}
            </div>
          </div>

          {/* STATS SUMMARY (เข้า, ขาด, ลา, % อัตราเข้าซ้อม) */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              สถิติการฝึกซ้อมสะสม
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              
              {/* เข้า */}
              <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-emerald-700 text-xs font-semibold mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>เข้าซ้อม</span>
                </div>
                <div className="text-2xl font-bold text-emerald-800 tabular-nums">
                  {stats.totalPresent}
                </div>
                <div className="text-[10px] text-emerald-600 mt-0.5">
                  คิดเป็น {stats.presentRate}%
                </div>
              </div>

              {/* ขาด */}
              <div className={`border rounded-xl p-3 text-center ${
                stats.totalAbsent > 0 ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-100'
              }`}>
                <div className={`flex items-center justify-center gap-1 text-xs font-semibold mb-1 ${
                  stats.totalAbsent > 0 ? 'text-rose-700' : 'text-slate-500'
                }`}>
                  <XCircle className="w-3.5 h-3.5" />
                  <span>ขาดซ้อม</span>
                </div>
                <div className={`text-2xl font-bold tabular-nums ${stats.totalAbsent > 0 ? 'text-rose-700' : 'text-slate-700'}`}>
                  {stats.totalAbsent}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  คิดเป็น {stats.absentRate}%
                </div>
              </div>

              {/* ลา */}
              <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-amber-700 text-xs font-semibold mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>ขอลา</span>
                </div>
                <div className="text-2xl font-bold text-amber-800 tabular-nums">
                  {stats.totalLeave}
                </div>
                <div className="text-[10px] text-amber-600 mt-0.5">
                  คิดเป็น {stats.leaveRate}%
                </div>
              </div>

              {/* รวมรอบ */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                <div className="text-slate-500 text-xs font-semibold mb-1">
                  รวมบันทึก
                </div>
                <div className="text-2xl font-bold text-slate-800 tabular-nums">
                  {stats.totalSessions}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {stats.uniqueTrainingDays} วันฝึกซ้อม
                </div>
              </div>

            </div>
          </div>

          {/* ATTENDANCE HISTORY LOGS */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                ประวัติการเช็คชื่อย้อนหลัง ({athleteRecords.length} รายการ)
              </h3>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              {athleteRecords.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  ยังไม่มีประวัติการเช็คชื่อสำหรับนักกีฬาคนนี้
                </div>
              ) : (
                athleteRecords.map((r) => (
                  <div key={r.id} className="p-3 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <span>{formatThaiDate(r.date, false)}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-600 font-normal">{r.session === 'morning' ? 'รอบเช้า (05:30)' : 'รอบเย็น (16:00)'}</span>
                      </div>
                      
                      {/* Reason or notes */}
                      {r.status === 'leave' && (
                        <div className="text-amber-700 mt-0.5 text-[11px] font-medium">
                          เหตุผล: {getLeaveReasonThai(r.leaveReason)} {r.leaveNote && `(${r.leaveNote})`}
                        </div>
                      )}

                      {r.status === 'present' && (r.weightRecordedKg || r.sparringRounds || r.note) && (
                        <div className="text-slate-500 mt-0.5 text-[11px] flex items-center gap-2">
                          {r.weightRecordedKg && <span>ชั่ง: {r.weightRecordedKg} กก.</span>}
                          {r.sparringRounds && <span>· ลงนวม: {r.sparringRounds} ยก</span>}
                          {r.note && <span>· {r.note}</span>}
                        </div>
                      )}
                    </div>

                    {/* Status badge */}
                    <div className="shrink-0">
                      {r.status === 'present' && (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold border border-emerald-100 text-[11px]">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>เข้าซ้อม</span>
                        </span>
                      )}
                      {r.status === 'absent' && (
                        <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md font-semibold border border-rose-200 text-[11px]">
                          <XCircle className="w-3 h-3" />
                          <span>ขาดซ้อม</span>
                        </span>
                      )}
                      {r.status === 'leave' && (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-semibold border border-amber-200 text-[11px]">
                          <Clock className="w-3 h-3" />
                          <span>ลา</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onEditAthlete(athlete);
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-white transition-colors"
          >
            แก้ไขข้อมูลนักกีฬา
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
