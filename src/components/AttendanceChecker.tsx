import React, { useState, useMemo } from 'react';
import { Athlete, AttendanceRecord, AttendanceStatus, LeaveReason, SessionType } from '../types/boxing';
import { formatThaiDate, getSessionThai, getLeaveReasonThai } from '../utils/storage';
import { 
  Check, 
  X, 
  Clock, 
  CheckCheck, 
  Calendar, 
  Save, 
  Scale, 
  Swords, 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';

interface AttendanceCheckerProps {
  athletes: Athlete[];
  records: AttendanceRecord[];
  onSaveAttendance: (updatedRecords: AttendanceRecord[]) => void;
  onSelectAthlete: (athlete: Athlete) => void;
}

export const AttendanceChecker: React.FC<AttendanceCheckerProps> = ({
  athletes,
  records,
  onSaveAttendance,
  onSelectAthlete,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedSession, setSelectedSession] = useState<SessionType>('evening');
  const [activeReasonModalAthleteId, setActiveReasonModalAthleteId] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Current session's existing records
  const currentSessionRecords = useMemo(() => {
    return records.filter(r => r.date === selectedDate && r.session === selectedSession);
  }, [records, selectedDate, selectedSession]);

  // Map athleteId -> record
  const recordMap = useMemo(() => {
    const map = new Map<string, AttendanceRecord>();
    currentSessionRecords.forEach(r => map.set(r.athleteId, r));
    return map;
  }, [currentSessionRecords]);

  // Status counts for this session
  const sessionStats = useMemo(() => {
    let present = 0;
    let absent = 0;
    let leave = 0;
    athletes.forEach(ath => {
      const rec = recordMap.get(ath.id);
      if (rec?.status === 'present') present++;
      else if (rec?.status === 'absent') absent++;
      else if (rec?.status === 'leave') leave++;
    });
    return {
      present,
      absent,
      leave,
      unmarked: athletes.length - (present + absent + leave),
      total: athletes.length,
    };
  }, [athletes, recordMap]);

  // Set status for a single athlete
  const handleSetStatus = (athlete: Athlete, status: AttendanceStatus) => {
    const now = new Date().toISOString();
    const existing = recordMap.get(athlete.id);

    let updatedList = [...records];
    const targetId = `rec-${selectedDate}-${selectedSession}-${athlete.id}`;

    if (status === 'leave' && !existing?.leaveReason) {
      // Open leave dialog to specify reason
      setActiveReasonModalAthleteId(athlete.id);
    }

    const updatedRecord: AttendanceRecord = {
      id: targetId,
      date: selectedDate,
      athleteId: athlete.id,
      session: selectedSession,
      status,
      leaveReason: status === 'leave' ? (existing?.leaveReason || 'personal') : undefined,
      leaveNote: status === 'leave' ? existing?.leaveNote : undefined,
      weightRecordedKg: status === 'present' ? (existing?.weightRecordedKg || athlete.currentWeightKg) : undefined,
      sparringRounds: status === 'present' && selectedSession === 'evening' ? (existing?.sparringRounds || 3) : undefined,
      note: existing?.note,
      recordedAt: now,
    };

    const index = updatedList.findIndex(r => r.date === selectedDate && r.session === selectedSession && r.athleteId === athlete.id);
    if (index >= 0) {
      updatedList[index] = updatedRecord;
    } else {
      updatedList.push(updatedRecord);
    }

    onSaveAttendance(updatedList);
    triggerToast(`บันทึกสถานะ ${athlete.nickname}: ${status === 'present' ? 'เข้าซ้อม' : status === 'absent' ? 'ขาดซ้อม' : 'ขอลา'}`);
  };

  // Mark all athletes present in 1 tap
  const handleMarkAllPresent = () => {
    const now = new Date().toISOString();
    const updatedList = [...records];

    athletes.forEach(ath => {
      const targetId = `rec-${selectedDate}-${selectedSession}-${ath.id}`;
      const existing = updatedList.find(r => r.date === selectedDate && r.session === selectedSession && r.athleteId === ath.id);

      const record: AttendanceRecord = {
        id: targetId,
        date: selectedDate,
        athleteId: ath.id,
        session: selectedSession,
        status: 'present',
        weightRecordedKg: existing?.weightRecordedKg || ath.currentWeightKg,
        sparringRounds: selectedSession === 'evening' ? (existing?.sparringRounds || 3) : undefined,
        note: existing?.note,
        recordedAt: now,
      };

      const idx = updatedList.findIndex(r => r.date === selectedDate && r.session === selectedSession && r.athleteId === ath.id);
      if (idx >= 0) {
        updatedList[idx] = record;
      } else {
        updatedList.push(record);
      }
    });

    onSaveAttendance(updatedList);
    triggerToast('เช็คชื่อ "มาซ้อมครบทุกคน" เรียบร้อยแล้ว!');
  };

  // Update specific fields (weight, sparring rounds, note)
  const handleUpdateField = (athleteId: string, field: keyof AttendanceRecord, value: any) => {
    const existing = recordMap.get(athleteId);
    if (!existing) return;

    const updatedList = records.map(r => {
      if (r.date === selectedDate && r.session === selectedSession && r.athleteId === athleteId) {
        return { ...r, [field]: value };
      }
      return r;
    });

    onSaveAttendance(updatedList);
  };

  // Save leave reason from modal
  const handleSaveLeaveReason = (athleteId: string, reason: LeaveReason, note: string) => {
    const now = new Date().toISOString();
    const targetId = `rec-${selectedDate}-${selectedSession}-${athleteId}`;
    const updatedList = [...records];

    const record: AttendanceRecord = {
      id: targetId,
      date: selectedDate,
      athleteId,
      session: selectedSession,
      status: 'leave',
      leaveReason: reason,
      leaveNote: note,
      recordedAt: now,
    };

    const idx = updatedList.findIndex(r => r.date === selectedDate && r.session === selectedSession && r.athleteId === athleteId);
    if (idx >= 0) {
      updatedList[idx] = record;
    } else {
      updatedList.push(record);
    }

    onSaveAttendance(updatedList);
    setActiveReasonModalAthleteId(null);
    triggerToast('บันทึกเหตุผลการลาเรียบร้อย');
  };

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => {
      setSaveToast(null);
    }, 2200);
  };

  // Change date by 1 day
  const handleShiftDate = (days: number) => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const activeAthleteForModal = athletes.find(a => a.id === activeReasonModalAthleteId);
  const currentRecordForModal = activeAthleteForModal ? recordMap.get(activeAthleteForModal.id) : null;

  return (
    <div className="space-y-5 pb-24 md:pb-8">
      
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Control Panel: Date and Session Switcher */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
        
        {/* Date Selector Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleShiftDate(-1)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
              title="วันก่อนหน้า"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg">
              <Calendar className="w-4 h-4 text-amber-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-sm font-semibold text-slate-900 focus:outline-hidden"
              />
            </div>

            <button
              onClick={() => handleShiftDate(1)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
              title="วันถัดไป"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {selectedDate !== todayStr && (
              <button
                onClick={() => setSelectedDate(todayStr)}
                className="px-2.5 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors"
              >
                กลับมาวันนี้
              </button>
            )}
          </div>

          {/* Session Switcher (Morning / Evening) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setSelectedSession('morning')}
              className={`px-3 py-2 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                selectedSession === 'morning'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>รอบเช้า</span>
              <span className="text-[10px] text-slate-400 font-normal">(05:30)</span>
            </button>

            <button
              onClick={() => setSelectedSession('evening')}
              className={`px-3 py-2 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                selectedSession === 'evening'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>รอบเย็น</span>
              <span className="text-[10px] text-slate-400 font-normal">(16:00)</span>
            </button>
          </div>

        </div>

        {/* Real-time Session Status Bar & Quick Actions */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Status Counts */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs flex-wrap">
            <span className="font-semibold text-slate-700">ผลการเช็คชื่อรอบนี้:</span>
            
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md font-medium">
              <Check className="w-3.5 h-3.5" />
              <span>เข้า: <strong className="tabular-nums">{sessionStats.present}</strong></span>
            </span>

            <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-1 rounded-md font-medium">
              <X className="w-3.5 h-3.5" />
              <span>ขาด: <strong className="tabular-nums">{sessionStats.absent}</strong></span>
            </span>

            <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-1 rounded-md font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>ลา: <strong className="tabular-nums">{sessionStats.leave}</strong></span>
            </span>

            {sessionStats.unmarked > 0 && (
              <span className="text-slate-400 text-xs">
                (ยังไม่ระบุ {sessionStats.unmarked} คน)
              </span>
            )}
          </div>

          {/* Quick Action: Mark All Present */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllPresent}
              className="min-h-[44px] px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center gap-1.5 active:scale-95 transition-all whitespace-nowrap"
            >
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              <span>มาซ้อมครบทุกคน</span>
            </button>
          </div>

        </div>

      </div>

      {/* ATHLETE ROLL CALL CARDS */}
      <div className="space-y-3">
        {athletes.map((ath) => {
          const record = recordMap.get(ath.id);
          const currentStatus = record?.status;

          return (
            <div
              key={ath.id}
              className={`bg-white rounded-xl border transition-all shadow-xs p-3.5 sm:p-4 ${
                currentStatus === 'present'
                  ? 'border-emerald-200 ring-1 ring-emerald-100'
                  : currentStatus === 'absent'
                  ? 'border-rose-200 ring-1 ring-rose-100'
                  : currentStatus === 'leave'
                  ? 'border-amber-200 ring-1 ring-amber-100'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                
                {/* Left: Athlete Info (clickable to view profile) */}
                <div 
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => onSelectAthlete(ath)}
                >
                  <div className={`w-11 h-11 rounded-full ${ath.avatarColor} text-white font-bold flex items-center justify-center shrink-0 shadow-xs`}>
                    {ath.nickname.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors">
                        {ath.name}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        "{ath.nickname}"
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 flex-wrap">
                      <span>{ath.weightClass}</span>
                      <span>·</span>
                      <span>เป้าหมาย {ath.targetWeightKg} กก.</span>
                      <span>·</span>
                      <span>{ath.ageGroup}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Three Big Tap Buttons: [เข้า] [ขาด] [ลา] */}
                <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-end">
                  
                  {/* BUTTON 1: เข้าซ้อม (Present) */}
                  <button
                    onClick={() => handleSetStatus(ath, 'present')}
                    className={`min-h-[44px] flex-1 sm:flex-initial px-3.5 py-2 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                      currentStatus === 'present'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>เข้าซ้อม</span>
                  </button>

                  {/* BUTTON 2: ขาดซ้อม (Absent) */}
                  <button
                    onClick={() => handleSetStatus(ath, 'absent')}
                    className={`min-h-[44px] flex-1 sm:flex-initial px-3.5 py-2 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                      currentStatus === 'absent'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200'
                    }`}
                  >
                    <X className="w-4 h-4" />
                    <span>ขาดซ้อม</span>
                  </button>

                  {/* BUTTON 3: ขอลา (Leave) */}
                  <button
                    onClick={() => {
                      handleSetStatus(ath, 'leave');
                      setActiveReasonModalAthleteId(ath.id);
                    }}
                    className={`min-h-[44px] flex-1 sm:flex-initial px-3.5 py-2 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                      currentStatus === 'leave'
                        ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                        : 'bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-700 border border-slate-200'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>ขอลา</span>
                  </button>

                </div>

              </div>

              {/* Sub-bar: If 'leave', show reason; If 'present', show optional weight & sparring inputs */}
              {currentStatus === 'leave' && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs bg-amber-50/60 p-2 rounded-lg">
                  <div className="flex items-center gap-1.5 text-amber-900">
                    <span className="font-semibold">{getLeaveReasonThai(record?.leaveReason)}:</span>
                    <span className="text-amber-800">{record?.leaveNote || 'ไม่ได้ระบุรายละเอียดเพิ่มเติม'}</span>
                  </div>
                  <button
                    onClick={() => setActiveReasonModalAthleteId(ath.id)}
                    className="text-amber-700 underline font-medium hover:text-amber-900 text-[11px]"
                  >
                    แก้ไขเหตุผล
                  </button>
                </div>
              )}

              {currentStatus === 'present' && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  
                  {/* Weight check */}
                  <div className="flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-slate-400" />
                    <span>น้ำหนักวันนี้:</span>
                    <input
                      type="number"
                      step="0.1"
                      value={record?.weightRecordedKg || ath.currentWeightKg}
                      onChange={(e) => handleUpdateField(ath.id, 'weightRecordedKg', parseFloat(e.target.value) || 0)}
                      className="w-16 px-1.5 py-0.5 text-center text-xs font-semibold bg-slate-50 border border-slate-200 rounded-md tabular-nums focus:outline-hidden focus:border-amber-400"
                    />
                    <span className="text-[11px] text-slate-400">กก.</span>
                  </div>

                  {/* Sparring rounds (Evening) */}
                  {selectedSession === 'evening' && (
                    <div className="flex items-center gap-1.5">
                      <Swords className="w-3.5 h-3.5 text-slate-400" />
                      <span>ลงนวม:</span>
                      <select
                        value={record?.sparringRounds || 3}
                        onChange={(e) => handleUpdateField(ath.id, 'sparringRounds', parseInt(e.target.value))}
                        className="px-1.5 py-0.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden"
                      >
                        <option value="0">0 ยก</option>
                        <option value="2">2 ยก</option>
                        <option value="3">3 ยก</option>
                        <option value="4">4 ยก</option>
                        <option value="5">5 ยก</option>
                        <option value="6">6 ยก</option>
                      </select>
                    </div>
                  )}

                  {/* Quick coach note */}
                  <div className="flex items-center gap-1.5 flex-1 min-w-[180px]">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="บันทึกเพิ่มเติม (เช่น เทคนิค, พลังหมัด)"
                      value={record?.note || ''}
                      onChange={(e) => handleUpdateField(ath.id, 'note', e.target.value)}
                      className="w-full text-xs px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-amber-400"
                    />
                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* LEAVE REASON MODAL / BOTTOM SHEET */}
      {activeAthleteForModal && (
        <LeaveReasonModal
          athlete={activeAthleteForModal}
          initialReason={currentRecordForModal?.leaveReason || 'sick'}
          initialNote={currentRecordForModal?.leaveNote || ''}
          onClose={() => setActiveReasonModalAthleteId(null)}
          onSave={(reason, note) => handleSaveLeaveReason(activeAthleteForModal.id, reason, note)}
        />
      )}

    </div>
  );
};

// Modal for specifying leave reason
interface LeaveReasonModalProps {
  athlete: Athlete;
  initialReason: LeaveReason;
  initialNote: string;
  onClose: () => void;
  onSave: (reason: LeaveReason, note: string) => void;
}

const LeaveReasonModal: React.FC<LeaveReasonModalProps> = ({
  athlete,
  initialReason,
  initialNote,
  onClose,
  onSave,
}) => {
  const [reason, setReason] = useState<LeaveReason>(initialReason);
  const [note, setNote] = useState<string>(initialNote);

  const reasonsList: { id: LeaveReason; label: string; desc: string }[] = [
    { id: 'sick', label: 'ลาป่วย', desc: 'มีไข้ ไม่สบาย พักฟื้นตามแพทย์หรือครูฝึก' },
    { id: 'injured', label: 'บาดเจ็บจากการซ้อม/ชก', desc: 'เจ็บกล้ามเนื้อ ข้อมือ ใบหน้า หรือแผลจากการแข่งขัน' },
    { id: 'competition', label: 'ไปแข่งขัน/รับใช้ชาติ', desc: 'ไปแข่งขันกีฬาเยาวชนแห่งชาติ กีฬาจังหวัด หรือทีมชาติ' },
    { id: 'personal', label: 'ลากิจส่วนตัว', desc: 'มีกิจจำเป็นทางครอบครัวที่แจ้งล่วงหน้า' },
    { id: 'school_duty', label: 'ราชการ/กิจกรรมโรงเรียน', desc: 'ปฏิบัติภารกิจวิชาการหรือกิจกรรมโรงเรียนกีฬากรุงเทพ' },
    { id: 'other', label: 'ลาอื่นๆ', desc: 'สาเหตุอื่นๆ โปรดระบุในบันทึก' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl p-5 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">บันทึกเหตุผลการลาฝึกซ้อม</h3>
            <p className="text-xs text-slate-500">
              {athlete.name} ({athlete.nickname}) · {athlete.weightClass}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Reason Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">เลือกประเภทการลา</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {reasonsList.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setReason(r.id)}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  reason === r.id
                    ? 'border-amber-500 bg-amber-50/70 text-slate-900 ring-1 ring-amber-400'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-bold text-xs">{r.label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{r.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail Note */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">รายละเอียดเพิ่มเติม (ถ้ามี)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="เช่น มีใบรับรองแพทย์, ไปแข่งคัดตัวภาคกลาง, ลากิจ 1 วัน"
            className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={() => onSave(reason, note)}
            className="flex-1 py-2.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg shadow-xs"
          >
            บันทึกการลา
          </button>
        </div>

      </div>
    </div>
  );
};
