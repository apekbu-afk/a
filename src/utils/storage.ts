import { Athlete, AttendanceRecord, TrainingProgram, AttendanceStatus } from '../types/boxing';
import { INITIAL_ATHLETES, generateSeedAttendance, INITIAL_PROGRAMS } from '../data/initialData';

const STORAGE_KEYS = {
  ATHLETES: 'bss_boxing_athletes_v1',
  ATTENDANCE: 'bss_boxing_attendance_v1',
  PROGRAMS: 'bss_boxing_programs_v1',
};

export function getStoredAthletes(): Athlete[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATHLETES);
    if (!raw) {
      saveStoredAthletes(INITIAL_ATHLETES);
      return INITIAL_ATHLETES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load athletes from localStorage', err);
    return INITIAL_ATHLETES;
  }
}

export function saveStoredAthletes(athletes: Athlete[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ATHLETES, JSON.stringify(athletes));
  } catch (err) {
    console.error('Failed to save athletes to localStorage', err);
  }
}

export function getStoredAttendance(): AttendanceRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (!raw) {
      const seeded = generateSeedAttendance();
      saveStoredAttendance(seeded);
      return seeded;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load attendance from localStorage', err);
    return generateSeedAttendance();
  }
}

export function saveStoredAttendance(records: AttendanceRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save attendance to localStorage', err);
  }
}

export function getStoredPrograms(): Record<string, TrainingProgram> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRAMS);
    if (!raw) {
      saveStoredPrograms(INITIAL_PROGRAMS);
      return INITIAL_PROGRAMS;
    }
    return JSON.parse(raw);
  } catch (err) {
    return INITIAL_PROGRAMS;
  }
}

export function saveStoredPrograms(programs: Record<string, TrainingProgram>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(programs));
  } catch (err) {
    console.error('Failed to save programs to localStorage', err);
  }
}

export function resetAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.ATHLETES);
  localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
  localStorage.removeItem(STORAGE_KEYS.PROGRAMS);
}

// Calculate attendance summary
export interface AttendanceStats {
  totalSessions: number;
  totalPresent: number; // จำนวนวันที่เข้า / ครั้งที่เข้า
  totalAbsent: number;  // จำนวนวันที่ขาด / ครั้งที่ขาด
  totalLeave: number;   // จำนวนวันที่ลา / ครั้งที่ลา
  presentRate: number;  // อัตราการเข้าซ้อม %
  absentRate: number;   // %
  leaveRate: number;    // %
  uniqueTrainingDays: number;
}

export function calculateStats(records: AttendanceRecord[], athleteId?: string): AttendanceStats {
  const filtered = athleteId ? records.filter(r => r.athleteId === athleteId) : records;
  const total = filtered.length;

  let present = 0;
  let absent = 0;
  let leave = 0;
  const daysSet = new Set<string>();

  filtered.forEach(r => {
    daysSet.add(r.date);
    if (r.status === 'present') present++;
    else if (r.status === 'absent') absent++;
    else if (r.status === 'leave') leave++;
  });

  return {
    totalSessions: total,
    totalPresent: present,
    totalAbsent: absent,
    totalLeave: leave,
    presentRate: total > 0 ? Math.round((present / total) * 100) : 0,
    absentRate: total > 0 ? Math.round((absent / total) * 100) : 0,
    leaveRate: total > 0 ? Math.round((leave / total) * 100) : 0,
    uniqueTrainingDays: daysSet.size,
  };
}

// Format Thai Date
export function formatThaiDate(dateStr: string, includeDayOfWeek: boolean = true): string {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  if (isNaN(date.getTime())) return dateStr;

  const thaiMonths = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];
  const thaiDays = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

  const dayName = thaiDays[date.getDay()];
  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];
  const year = date.getFullYear() + 543;

  if (includeDayOfWeek) {
    return `วัน${dayName}ที่ ${day} ${month} ${year}`;
  }
  return `${day} ${month} ${year}`;
}

export function getLeaveReasonThai(reason?: string): string {
  switch (reason) {
    case 'sick':
      return 'ลาป่วย';
    case 'personal':
      return 'ลากิจ';
    case 'injured':
      return 'บาดเจ็บจากการซ้อม/ชก';
    case 'competition':
      return 'ไปแข่งขันระดับชาติ/จังหวัด';
    case 'school_duty':
      return 'ราชการ/กิจกรรมโรงเรียน';
    default:
      return 'ลาอื่นๆ';
  }
}

export function getSessionThai(session: string): string {
  return session === 'morning' ? 'รอบเช้า (05:30 - 07:15)' : 'รอบเย็น (16:00 - 18:30)';
}
