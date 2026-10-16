import React, { useState, useMemo } from 'react';
import { Athlete, AttendanceRecord } from '../types/boxing';
import { calculateStats, formatThaiDate } from '../utils/storage';
import { 
  Download, 
  Printer, 
  RotateCcw, 
  FileSpreadsheet, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

interface ReportExportModalProps {
  athletes: Athlete[];
  records: AttendanceRecord[];
  onResetData: () => void;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  athletes,
  records,
  onResetData,
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'month' | 'all' | 'custom'>('month');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  // Records filtered
  const filteredRecords = useMemo(() => {
    if (filterPeriod === 'all') return records;
    const now = new Date();
    return records.filter(r => {
      const recDate = new Date(r.date + 'T00:00:00');
      const diff = Math.floor((now.getTime() - recDate.getTime()) / (1000 * 3600 * 24));
      return diff >= 0 && diff < 30; // 30 days
    });
  }, [records, filterPeriod]);

  // Overall stats
  const overallStats = useMemo(() => {
    return calculateStats(filteredRecords);
  }, [filteredRecords]);

  // Athlete row data
  const athleteRows = useMemo(() => {
    return athletes.map((ath, index) => {
      const athRecords = filteredRecords.filter(r => r.athleteId === ath.id);
      const athStats = calculateStats(athRecords, ath.id);
      return {
        index: index + 1,
        athlete: ath,
        ...athStats,
      };
    });
  }, [athletes, filteredRecords]);

  // Download CSV with Thai UTF-8 BOM
  const handleExportCSV = () => {
    const headers = [
      'ลำดับ',
      'รหัสนักเรียน',
      'ชื่อ-นามสกุล',
      'ชื่อเล่น',
      'เพศ',
      'รุ่นพิกัดน้ำหนัก',
      'น้ำหนักเป้าหมาย(กก.)',
      'น้ำหนักปัจจุบัน(กก.)',
      'จำนวนครั้งที่เข้า',
      'จำนวนครั้งที่ขาด',
      'จำนวนครั้งที่ลา',
      'อัตราการเข้าซ้อม(%)',
      'สถานะการประเมิน'
    ];

    const rows = athleteRows.map(row => [
      row.index,
      `"${row.athlete.studentId}"`,
      `"${row.athlete.name}"`,
      `"${row.athlete.nickname}"`,
      `"${row.athlete.gender}"`,
      `"${row.athlete.weightClass}"`,
      row.athlete.targetWeightKg,
      row.athlete.currentWeightKg,
      row.totalPresent,
      row.totalAbsent,
      row.totalLeave,
      `${row.presentRate}%`,
      row.presentRate >= 80 ? 'ผ่านเกณฑ์ดีเยี่ยม' : 'ต้องเฝ้าระวัง'
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `รายงานการเข้าฝึกซ้อมมวยสากล_รร.กีฬากรุงเทพ_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print friendly
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600">
            <FileSpreadsheet className="w-4 h-4" />
            <span>ระบบออกรายงานและส่งออกข้อมูล</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-0.5">
            สรุปรายงานการเข้าฝึกซ้อมนักกีฬามวยสากล
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            โรงเรียนกีฬากรุงเทพมหานคร สำหรับเสนอฝ่ายวิชาการและผู้ฝึกสอน
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="min-h-[44px] px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>ดาวน์โหลด CSV (Excel)</span>
          </button>

          <button
            onClick={handlePrint}
            className="min-h-[44px] px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-xs flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์รายงาน / บันทึก PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div id="printable-report" className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Document Header */}
        <div className="text-center pb-5 border-b border-slate-200 space-y-1">
          <div className="w-12 h-12 mx-auto rounded-full overflow-hidden border border-amber-500 bg-slate-900 mb-2">
            <img 
              src="/src/assets/images/boxing_team_crest_1792150820664.jpg" 
              alt="ตราสัญลักษณ์มวยสากล" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            แบบรายงานสรุปผลการเข้าฝึกซ้อมนักกีฬามวยสากลสมัครเล่น
          </h3>
          <p className="text-xs text-slate-600">
            โรงเรียนกีฬากรุงเทพมหานคร สำนักวัฒนธรรม กีฬา และการท่องเที่ยว
          </p>
          <p className="text-[11px] text-slate-400">
            ข้อมูลประจำช่วงเวลา: {filterPeriod === 'month' ? 'รอบ 30 วันล่าสุด' : 'ประวัติการฝึกซ้อมทั้งหมด'} · พิมพ์เมื่อ: {formatThaiDate(todayStr)}
          </p>
        </div>

        {/* Aggregate KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
          <div>
            <div className="text-xs text-slate-500 font-medium">นักกีฬาในแคมป์</div>
            <div className="text-xl font-bold text-slate-900 tabular-nums">{athletes.length} คน</div>
          </div>
          <div>
            <div className="text-xs text-emerald-700 font-medium">รวมครั้งที่เข้าซ้อม</div>
            <div className="text-xl font-bold text-emerald-700 tabular-nums">{overallStats.totalPresent} ครั้ง</div>
          </div>
          <div>
            <div className="text-xs text-rose-700 font-medium">รวมครั้งที่ขาดซ้อม</div>
            <div className="text-xl font-bold text-rose-700 tabular-nums">{overallStats.totalAbsent} ครั้ง</div>
          </div>
          <div>
            <div className="text-xs text-amber-700 font-medium">รวมครั้งที่ขอลา</div>
            <div className="text-xl font-bold text-amber-700 tabular-nums">{overallStats.totalLeave} ครั้ง</div>
          </div>
        </div>

        {/* Detailed Attendance Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
                <th className="p-2.5 text-center w-10">ที่</th>
                <th className="p-2.5">รหัสนักเรียน</th>
                <th className="p-2.5">ชื่อ - สกุล</th>
                <th className="p-2.5">ชื่อเล่น</th>
                <th className="p-2.5">รุ่นพิกัด</th>
                <th className="p-2.5 text-center text-emerald-700">เข้า (วัน)</th>
                <th className="p-2.5 text-center text-rose-700">ขาด (วัน)</th>
                <th className="p-2.5 text-center text-amber-700">ลา (วัน)</th>
                <th className="p-2.5 text-center font-bold">อัตรา (%)</th>
                <th className="p-2.5 text-center">การประเมิน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {athleteRows.map((row) => (
                <tr key={row.athlete.id} className="hover:bg-slate-50">
                  <td className="p-2.5 text-center text-slate-500 tabular-nums">{row.index}</td>
                  <td className="p-2.5 font-mono text-slate-600">{row.athlete.studentId}</td>
                  <td className="p-2.5 font-semibold text-slate-900">{row.athlete.name}</td>
                  <td className="p-2.5 text-slate-700 font-medium">"{row.athlete.nickname}"</td>
                  <td className="p-2.5 text-slate-600">{row.athlete.weightClass}</td>
                  <td className="p-2.5 text-center font-bold text-emerald-700 tabular-nums">{row.totalPresent}</td>
                  <td className="p-2.5 text-center font-bold text-rose-600 tabular-nums">{row.totalAbsent}</td>
                  <td className="p-2.5 text-center font-bold text-amber-700 tabular-nums">{row.totalLeave}</td>
                  <td className="p-2.5 text-center font-bold text-slate-900 tabular-nums">{row.presentRate}%</td>
                  <td className="p-2.5 text-center">
                    {row.presentRate >= 80 ? (
                      <span className="text-emerald-700 font-medium">ผ่านเกณฑ์</span>
                    ) : (
                      <span className="text-rose-600 font-bold">ต้องปรับปรุง</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Official Signatures Row */}
        <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs text-slate-600">
          <div>
            <div className="h-10"></div>
            <div className="border-t border-slate-300 pt-2 inline-block px-10">
              ลงชื่อ............................................................
              <div className="font-semibold text-slate-800 mt-1">ผู้ฝึกสอนมวยสากลผู้รับผิดชอบ</div>
              <div className="text-[11px] text-slate-500">โรงเรียนกีฬากรุงเทพมหานคร</div>
            </div>
          </div>

          <div>
            <div className="h-10"></div>
            <div className="border-t border-slate-300 pt-2 inline-block px-10">
              ลงชื่อ............................................................
              <div className="font-semibold text-slate-800 mt-1">หัวหน้ากลุ่มสาระสุขศึกษาและพลศึกษา</div>
              <div className="text-[11px] text-slate-500">โรงเรียนกีฬากรุงเทพมหานคร</div>
            </div>
          </div>
        </div>

      </div>

      {/* Data Management & Reset Section */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-slate-600">
          <span className="font-semibold text-slate-800">การจัดการข้อมูลในเครื่อง:</span> ข้อมูลถูกจัดเก็บอย่างปลอดภัยบนเบราว์เซอร์ของคุณ (LocalStorage)
        </div>

        <div>
          {showResetConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-rose-700 font-semibold">ยืนยันรีเซ็ตเป็นข้อมูลตัวอย่างตั้งต้น?</span>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 rounded-md"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  onResetData();
                  setShowResetConfirm(false);
                }}
                className="px-2.5 py-1 bg-rose-600 text-white rounded-md font-semibold"
              >
                รีเซ็ตข้อมูลทันที
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="text-slate-500 hover:text-rose-600 flex items-center gap-1 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>รีเซ็ตกลับเป็นข้อมูลตั้งต้น</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
