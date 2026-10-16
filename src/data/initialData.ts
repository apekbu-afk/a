import { Athlete, AttendanceRecord, TrainingProgram } from '../types/boxing';

export const INITIAL_ATHLETES: Athlete[] = [
  {
    id: 'ath-1',
    studentId: 'BSS-BX-01',
    name: 'นายธนากร สมบูรณ์สุข',
    nickname: 'แชมป์',
    gender: 'ชาย',
    ageGroup: 'เยาวชน (ม.ปลาย)',
    weightClass: '51 kg (ฟลายเวต)',
    currentWeightKg: 51.4,
    targetWeightKg: 51.0,
    phone: '081-234-5678',
    avatarColor: 'bg-amber-600',
    notes: 'แชมป์กีฬาเยาวชนแห่งชาติปี 66 หมัดแย็บขวารวดเร็ว',
    joinedDate: '2025-05-15',
  },
  {
    id: 'ath-2',
    studentId: 'BSS-BX-02',
    name: 'นายกิตติศักดิ์ ศรีวิชัย',
    nickname: 'โอ๊ต',
    gender: 'ชาย',
    ageGroup: 'เยาวชน (ม.ปลาย)',
    weightClass: '54 kg (แบนตัมเวต)',
    currentWeightKg: 54.2,
    targetWeightKg: 53.8,
    phone: '089-876-5432',
    avatarColor: 'bg-emerald-600',
    notes: 'มวยซ้าย (Southpaw) เชิงรับและสวนกลับคมกริบ',
    joinedDate: '2025-05-15',
  },
  {
    id: 'ath-3',
    studentId: 'BSS-BX-03',
    name: 'นายอนุชา พงษ์ศิริ',
    nickname: 'บาส',
    gender: 'ชาย',
    ageGroup: 'เยาวชน (ม.ปลาย)',
    weightClass: '57 kg (เฟเธอร์เวต)',
    currentWeightKg: 58.1,
    targetWeightKg: 57.0,
    phone: '082-345-6789',
    avatarColor: 'bg-blue-600',
    notes: 'กำลังคุมน้ำหนักรอบบ่าย มีพลังหมัดตัดลำตัวหนักหน่วง',
    joinedDate: '2025-05-15',
  },
  {
    id: 'ath-4',
    studentId: 'BSS-BX-04',
    name: 'นางสาวกานดา ประทุมทอง',
    nickname: 'ฟ้า',
    gender: 'หญิง',
    ageGroup: 'เยาวชน (ม.ปลาย)',
    weightClass: '48 kg (มินิมัมเวต)',
    currentWeightKg: 47.9,
    targetWeightKg: 48.0,
    phone: '086-456-7890',
    avatarColor: 'bg-rose-600',
    notes: 'ฟุตเวิร์กรวดเร็ว สมาธิสูง เตรียมตัวตัดเชือกชิงชนะเลิศ',
    joinedDate: '2025-06-01',
  },
  {
    id: 'ath-5',
    studentId: 'BSS-BX-05',
    name: 'นายธีรเดช เจริญสุข',
    nickname: 'ดิว',
    gender: 'ชาย',
    ageGroup: 'ยุวชน (ม.ต้น)',
    weightClass: '48 kg (มินิมัมเวต)',
    currentWeightKg: 47.5,
    targetWeightKg: 48.0,
    phone: '090-112-2334',
    avatarColor: 'bg-indigo-600',
    notes: 'ดาวรุ่ง ม.3 พัฒนาการต่อเนื่อง ขยันฝึกซ้อมเป็นเลิศ',
    joinedDate: '2025-08-10',
  },
  {
    id: 'ath-6',
    studentId: 'BSS-BX-06',
    name: 'นายสิทธิชัย ยอดเพชร',
    nickname: 'เพชร',
    gender: 'ชาย',
    ageGroup: 'เยาวชน (ม.ปลาย)',
    weightClass: '60 kg (ไลต์เวต)',
    currentWeightKg: 61.2,
    targetWeightKg: 60.0,
    phone: '095-223-3445',
    avatarColor: 'bg-violet-600',
    notes: 'แรงปลายดี อึดทน ซ้อมเตะเป้าและสปาริ่ง 6 ยกสม่ำเสมอ',
    joinedDate: '2025-05-15',
  },
  {
    id: 'ath-7',
    studentId: 'BSS-BX-07',
    name: 'นางสาวณิชา ปัญญารักษ์',
    nickname: 'พลอย',
    gender: 'หญิง',
    ageGroup: 'เยาวชน (ม.ปลาย)',
    weightClass: '54 kg (แบนตัมเวต)',
    currentWeightKg: 53.6,
    targetWeightKg: 54.0,
    phone: '083-445-5667',
    avatarColor: 'bg-pink-600',
    notes: 'ทักษะหมัดชุด 1-2-3 เยี่ยมยอด จิตใจกล้าหาญ',
    joinedDate: '2025-06-15',
  },
  {
    id: 'ath-8',
    studentId: 'BSS-BX-08',
    name: 'เด็กชายวรพล รุ่งโรจน์',
    nickname: 'กาย',
    gender: 'ชาย',
    ageGroup: 'ยุวชน (ม.ต้น)',
    weightClass: '51 kg (ฟลายเวต)',
    currentWeightKg: 50.8,
    targetWeightKg: 51.0,
    phone: '087-556-6778',
    avatarColor: 'bg-cyan-600',
    notes: 'นักเรียนใหม่ ม.2 พื้นฐานมวยสากลแน่น ฟิตเนสกำลังพัฒนา',
    joinedDate: '2025-09-01',
  },
  {
    id: 'ath-9',
    studentId: 'BSS-BX-09',
    name: 'นายพชร วงศ์ษา',
    nickname: 'น็อต',
    gender: 'ชาย',
    ageGroup: 'เยาวชน (ม.ปลาย)',
    weightClass: '63.5 kg (ไลต์เวลเตอร์เวต)',
    currentWeightKg: 64.0,
    targetWeightKg: 63.5,
    phone: '092-667-7889',
    avatarColor: 'bg-orange-600',
    notes: 'หมัดฮุกซ้ายทรงพลัง เชิงชกบู๊ดุดัน',
    joinedDate: '2025-05-15',
  },
  {
    id: 'ath-10',
    studentId: 'BSS-BX-10',
    name: 'นายศราวุธ แสนเก่ง',
    nickname: 'ตาว',
    gender: 'ชาย',
    ageGroup: 'ประชาชน/เยาวชนทีมชาติ',
    weightClass: '67 kg (เวลเตอร์เวต)',
    currentWeightKg: 67.2,
    targetWeightKg: 67.0,
    phone: '088-778-8990',
    avatarColor: 'bg-teal-600',
    notes: 'กัปตันทีมนักกีฬามวยสากล ร.ร.กีฬากรุงเทพ เป็นแบบอย่างรุ่นน้อง',
    joinedDate: '2024-05-10',
  },
];

// Helper to generate realistic historical attendance over past 14 days
export function generateSeedAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  // Generate for past 14 days
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const isWeekend = d.getDay() === 0; // Sunday off, Saturday half-day

    if (isWeekend) {
      continue; // No training on Sundays
    }

    const sessions: ('morning' | 'evening')[] = d.getDay() === 6 ? ['morning'] : ['morning', 'evening'];

    sessions.forEach(session => {
      INITIAL_ATHLETES.forEach((ath, idx) => {
        let status: 'present' | 'absent' | 'leave' = 'present';
        let leaveReason: 'sick' | 'personal' | 'injured' | 'competition' | 'school_duty' | 'other' | undefined = undefined;
        let leaveNote: string | undefined = undefined;

        // Controlled realistic patterns for athletes:
        // Athlete 1 (แชมป์): very diligent, 100% present
        // Athlete 2 (โอ๊ต): 1 sick leave
        // Athlete 3 (บาส): 2 absents, 1 leave
        // Athlete 4 (ฟ้า): 1 competition leave
        // Athlete 5 (ดิว): 1 injured leave
        // Athlete 6 (เพชร): 1 absent
        // Athlete 9 (น็อต): 2 absents
        // Others mostly present

        if (ath.id === 'ath-2' && i === 3) {
          status = 'leave';
          leaveReason = 'sick';
          leaveNote = 'เป็นไข้หวัด พักฟื้นตามแพทย์สั่ง';
        } else if (ath.id === 'ath-3' && (i === 2 || i === 7)) {
          status = 'absent';
        } else if (ath.id === 'ath-3' && i === 8) {
          status = 'leave';
          leaveReason = 'personal';
          leaveNote = 'ติดธุระด่วนทางครอบครัว';
        } else if (ath.id === 'ath-4' && (i === 5 || i === 6)) {
          status = 'leave';
          leaveReason = 'competition';
          leaveNote = 'ไปคัดตัวชิงแชมป์เยาวชนระดับภาค';
        } else if (ath.id === 'ath-5' && i === 4) {
          status = 'leave';
          leaveReason = 'injured';
          leaveNote = 'เจ็บข้อมือจากการสปาริ่ง พักตามใบรับรองแพทย์';
        } else if (ath.id === 'ath-6' && i === 9) {
          status = 'absent';
        } else if (ath.id === 'ath-9' && (i === 1 || i === 6)) {
          status = 'absent';
        } else if (ath.id === 'ath-8' && i === 4) {
          status = 'leave';
          leaveReason = 'school_duty';
          leaveNote = 'ร่วมกิจกรรมโรงเรียนกีฬากรุงเทพ';
        }

        records.push({
          id: `rec-${dateStr}-${session}-${ath.id}`,
          date: dateStr,
          athleteId: ath.id,
          session,
          status,
          leaveReason,
          leaveNote,
          weightRecordedKg: status === 'present' ? Number((ath.currentWeightKg + (Math.sin(i * 3 + idx) * 0.4)).toFixed(1)) : undefined,
          sparringRounds: status === 'present' && session === 'evening' ? (idx % 2 === 0 ? 4 : 3) : undefined,
          recordedAt: `${dateStr}T${session === 'morning' ? '07:15:00' : '18:30:00'}Z`
        });
      });
    });
  }

  return records;
}

export const INITIAL_PROGRAMS: Record<string, TrainingProgram> = {
  morning: {
    date: new Date().toISOString().split('T')[0],
    session: 'morning',
    coachName: 'อ.สมศักดิ์ จิตรเจริญ (โค้ชมวยสากล บก.กทม.)',
    focus: 'สมรรถภาพทางกาย คาร์ดิโอ และฟุตเวิร์กเคลื่อนที่รอบเวที',
    exercises: [
      'วิ่งรอบสนาม 5 กิโลเมตร (Pace 5.30)',
      'กระโดดเชือกเร่งสปีด 5 ยก ยกละ 3 นาที',
      'ชกลม (Shadow Boxing) เน้นออกหมัดแย็บและฟุตเวิร์ก 4 ยก',
      'เสริมสร้างกล้ามเนื้อแกนกลาง Core Abs 200 ครั้ง',
      'ยืดเหยียดกล้ามเนื้อ Cool-down & ตรวจเช็คน้ำหนักเช้า'
    ]
  },
  evening: {
    date: new Date().toISOString().split('T')[0],
    session: 'evening',
    coachName: 'อ.มานพ แสงสุวรรณ (หัวหน้าผู้ฝึกสอน)',
    focus: 'เทคนิคการชกเชิงรุก-รับ ล่อเป้า และลงนวมสปาริ่งคุมน้ำหนัก',
    exercises: [
      'วอร์มอัพและพันมือมาตรฐานสากล',
      'ล่อเป้าเทรนเนอร์ (Pad Work) หมัดชุด 1-2-3-4 จำนวน 4 ยก',
      'ลงนวมสปาริ่งเชิงกลยุทธ์ (Sparring) 3-4 ยก',
      'ชกกระสอบทรายหนัก (Heavy Bag) เน้นพาวเวอร์ 3 ยก',
      'ชั่งน้ำหนักเย็น บันทึกผล และสรุปประเมินประจำวัน'
    ]
  }
};
