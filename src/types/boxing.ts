export type AttendanceStatus = 'present' | 'absent' | 'leave';

export type LeaveReason = 'sick' | 'personal' | 'injured' | 'competition' | 'school_duty' | 'other';

export type SessionType = 'morning' | 'evening';

export type WeightClass = 
  | '48 kg (มินิมัมเวต)'
  | '51 kg (ฟลายเวต)'
  | '54 kg (แบนตัมเวต)'
  | '57 kg (เฟเธอร์เวต)'
  | '60 kg (ไลต์เวต)'
  | '63.5 kg (ไลต์เวลเตอร์เวต)'
  | '67 kg (เวลเตอร์เวต)'
  | '71 kg (ไลต์มิดเดิลเวต)'
  | '75 kg (มิดเดิลเวต)'
  | '80 kg (ไลต์เฮฟวี่เวต)'
  | '+80 kg (เฮฟวี่เวต)';

export type AgeGroup = 'ยุวชน (ม.ต้น)' | 'เยาวชน (ม.ปลาย)' | 'ประชาชน/เยาวชนทีมชาติ';
export type Gender = 'ชาย' | 'หญิง';

export interface Athlete {
  id: string;
  studentId: string;
  name: string;
  nickname: string;
  gender: Gender;
  ageGroup: AgeGroup;
  weightClass: WeightClass;
  currentWeightKg: number;
  targetWeightKg: number;
  phone: string;
  avatarColor: string;
  notes?: string;
  joinedDate: string;
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  athleteId: string;
  session: SessionType;
  status: AttendanceStatus;
  leaveReason?: LeaveReason;
  leaveNote?: string;
  weightRecordedKg?: number;
  sparringRounds?: number;
  note?: string;
  recordedAt: string;
}

export interface TrainingProgram {
  date: string; // YYYY-MM-DD
  session: SessionType;
  coachName: string;
  focus: string; // e.g. "สปีดหมัดและฟุตเวิร์ก", "ลงนวมสปาริ่งเชิงกลยุทธ์", "คาร์ดิโอวิ่ง 8 กม. และชกลม"
  exercises: string[];
}
