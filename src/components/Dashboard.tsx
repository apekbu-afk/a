import React, { useState, useMemo } from 'react';
import { Athlete, AttendanceRecord } from '../types/boxing';
import { calculateStats, formatThaiDate, getLeaveReasonThai } from '../utils/storage';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  Award, 
  Calendar, 
  ChevronRight, 
  Filter, 
  Flame,
  UserCheck,
  ChevronDown
} from 'lucide-react';

interface DashboardProps {
  athletes: Athlete[];
  records: AttendanceRecord[];
  onSelectAthlete: (athlete: Athlete) => void;
  onGoToAttendance: () => void;
}

type DateRangeFilter = 'today' | 'week' | 'month' | 'all';

export const Dashboard: React.FC<DashboardProps> = ({
  athletes,
  records,
  onSelectAthlete,
  onGoToAttendance,
}) => {
  const [timeRange, setTimeRange] = useState<DateRangeFilter>('month');
  const [selectedGender, setSelectedGender] = useState<'all' | 'ชาย' | 'หญิง'>('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all');
  const [statusFilterTab, setStatusFilterTab] = useState<'all' | 'top' | 'warning'>('all');

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter records based on selected time range
  const filteredRecords = useMemo(() => {
    const today = new Date();
    return records.filter((r) => {
      const recordDate = new Date(r.date + 'T00:00:00');
      
      // Filter athlete criteria
      const ath = athletes.find(a => a.id === r.athleteId);
      if (!ath) return false;
      if (selectedGender !== 'all' && ath.gender !== selectedGender) return false;
      if (selectedAgeGroup !== 'all' && ath.ageGroup !== selectedAgeGroup) return false;

      // Filter date range
      if (timeRange === 'today') {
        return r.date === todayStr;
      } else if (timeRange === 'week') {
        const diffDays = Math.floor((today.getTime() - recordDate.getTime()) / (1000 * 3600 * 24));
        return diffDays >= 0 && diffDays < 7;
      } else if (timeRange === 'month') {
        const diffDays = Math.floor((today.getTime() - recordDate.getTime()) / (1000 * 3600 * 24));
        return diffDays >= 0 && diffDays < 30;
      }
      return true;
    });
  }, [records, athletes, timeRange, selectedGender, selectedAgeGroup, todayStr]);

  // General statistics
  const stats = useMemo(() => {
    return calculateStats(filteredRecords);
  }, [filteredRecords]);

  // Today's specific statistics
  const todayRecords = useMemo(() => {
    return records.filter(r => r.date === todayStr);
  }, [records, todayStr]);

  const todayStats = useMemo(() => {
    let present = 0;
    let absent = 0;
    let leave = 0;
    todayRecords.forEach(r => {
      if (r.status === 'present') present++;
      if (r.status === 'absent') absent++;
      if (r.status === 'leave') leave++;
    });
    return {
      present,
      absent,
      leave,
      totalChecked: todayRecords.length,
      totalAthletes: athletes.length,
    };
  }, [todayRecords, athletes]);

  // Individual athlete stats calculation
  const athleteStatsList = useMemo(() => {
    return athletes.map((ath) => {
      const athRecords = filteredRecords.filter(r => r.athleteId === ath.id);
      const athStats = calculateStats(athRecords, ath.id);
      return {
        athlete: ath,
        ...athStats,
      };
    });
  }, [athletes, filteredRecords]);

  // Sorted lists for tabs
  const displayedAthletes = useMemo(() => {
    let list = [...athleteStatsList];
    if (statusFilterTab === 'top') {
      list = list.filter(item => item.presentRate >= 85).sort((a, b) => b.presentRate - a.presentRate);
    } else if (statusFilterTab === 'warning') {
      list = list.filter(item => item.totalAbsent >= 2 || (item.totalSessions > 0 && item.presentRate < 75)).sort((a, b) => b.totalAbsent - a.totalAbsent);
    } else {
      list.sort((a, b) => b.totalPresent - a.totalPresent);
    }
    return list;
  }, [athleteStatsList, statusFilterTab]);

  // Breakdown of leave reasons
  const leaveReasonCounts = useMemo(() => {
    const counts = {
      sick: 0,
      personal: 0,
      injured: 0,
      competition: 0,
      other: 0,
    };
    filteredRecords.forEach(r => {
      if (r.status === 'leave') {
        const reason = r.leaveReason || 'other';
        if (reason === 'sick') counts.sick++;
        else if (reason === 'personal') counts.personal++;
        else if (reason === 'injured') counts.injured++;
        else if (reason === 'competition') counts.competition++;
        else counts.other++;
      }
    });
    return counts;
  }, [filteredRecords]);

  // Last 7 days history breakdown for the visual bar chart
  const last7DaysData = useMemo(() => {
    const days: { date: string; label: string; present: number; absent: number; leave: number; total: number }[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'][d.getDay()];
      
      const dayRecs = records.filter(r => r.date === dateStr);
      let p = 0, a = 0, l = 0;
      dayRecs.forEach(r => {
        if (r.status === 'present') p++;
        if (r.status === 'absent') a++;
        if (r.status === 'leave') l++;
      });
      days.push({
        date: dateStr,
        label: `${dayName} ${d.getDate()}`,
        present: p,
        absent: a,
        leave: l,
        total: p + a + l,
      });
    }
    return days;
  }, [records]);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      
      {/* Hero Banner: Bangkok Sports School Boxing Camp */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white shadow-md border border-slate-800">
        <div className="absolute inset-0">
          <img 
            src="/src/assets/images/boxing_training_gym_1792150835884.jpg" 
            alt="โรงยิมมวยสากล ร.ร.กีฬากรุงเทพ" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
        </div>

        <div className="relative p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="max-w-xl space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <Flame className="w-4 h-4 text-amber-400 shrink-0" />
              <span>ศูนย์ฝึกกีฬามวยสากลสมัครเล่น โรงเรียนกีฬากรุงเทพมหานคร</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              ระบบบันทึกและสถิติการเข้าฝึกซ้อม
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              ติดตามสถิติการเข้าฝึกซ้อม ขาดซ้อม และการลาของนักกีฬา พร้อมสรุปข้อมูลเพื่อการรายงานฝ่ายพัฒนากีฬา
            </p>
            <div className="pt-2 text-xs text-slate-400 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatThaiDate(todayStr)}</span>
              <span>·</span>
              <span>นักกีฬาทั้งหมด {athletes.length} คน</span>
            </div>
          </div>

          {/* Quick CTA to Check Attendance */}
          <div className="shrink-0 bg-slate-800/80 border border-slate-700/80 backdrop-blur-md rounded-xl p-3.5 flex flex-col sm:flex-row md:flex-col gap-2.5 items-stretch">
            <div className="text-xs text-slate-300">
              <div className="font-semibold text-white">สถานะการเช็คชื่อวันนี้</div>
              <div className="text-[11px] text-slate-400">
                บันทึกแล้ว {todayStats.totalChecked} รายการ (เข้า {todayStats.present} · ขาด {todayStats.absent} · ลา {todayStats.leave})
              </div>
            </div>
            <button
              onClick={onGoToAttendance}
              className="px-4 py-2 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-98"
            >
              <UserCheck className="w-4 h-4" />
              <span>เช็คชื่อฝึกซ้อมวันนี้</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar (Segmented Buttons) */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Time Range Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto no-scrollbar">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                timeRange === 'today' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              วันนี้
            </button>
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                timeRange === 'week' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              สัปดาห์นี้ (7 วัน)
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                timeRange === 'month' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              30 วันล่าสุด
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                timeRange === 'all' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ประวัติทั้งหมด
            </button>
          </div>

          {/* Demographic Filters */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>กรอง:</span>
            </span>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-amber-400"
            >
              <option value="all">เพศทั้งหมด (ชาย/หญิง)</option>
              <option value="ชาย">เฉพาะชาย</option>
              <option value="หญิง">เฉพาะหญิง</option>
            </select>

            <select
              value={selectedAgeGroup}
              onChange={(e) => setSelectedAgeGroup(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-amber-400"
            >
              <option value="all">ระดับรุ่นทั้งหมด</option>
              <option value="ยุวชน (ม.ต้น)">ยุวชน (ม.ต้น)</option>
              <option value="เยาวชน (ม.ปลาย)">เยาวชน (ม.ปลาย)</option>
              <option value="ประชาชน/เยาวชนทีมชาติ">เยาวชนทีมชาติ/ประชาชน</option>
            </select>
          </div>

        </div>
      </div>

      {/* CORE STAT METRICS: จำนวนวันที่เข้า, จำนวนวันที่ขาด, จำนวนวันที่ลา */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Metric 1: จำนวนวันที่เข้า */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">จำนวนวันที่เข้าซ้อม</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                {stats.totalPresent}
              </span>
              <span className="text-xs font-medium text-slate-500">ครั้ง/เซสชั่น</span>
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <span className="tabular-nums font-semibold">{stats.presentRate}%</span>
              <span className="text-slate-400">ของคาบซ้อมทั้งหมด</span>
            </div>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, stats.presentRate)}%` }} 
            />
          </div>
        </div>

        {/* Metric 2: จำนวนวันที่ขาด */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">จำนวนวันที่ขาดซ้อม</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-bold text-rose-600 tabular-nums">
                {stats.totalAbsent}
              </span>
              <span className="text-xs font-medium text-slate-500">ครั้ง/เซสชั่น</span>
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600 font-medium">
              <span className="tabular-nums font-semibold">{stats.absentRate}%</span>
              <span className="text-slate-400">ขาดโดยไม่แจ้งล่วงหน้า</span>
            </div>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-rose-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, stats.absentRate)}%` }} 
            />
          </div>
        </div>

        {/* Metric 3: จำนวนวันที่ลา */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">จำนวนวันที่ลา</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-bold text-amber-600 tabular-nums">
                {stats.totalLeave}
              </span>
              <span className="text-xs font-medium text-slate-500">ครั้ง/เซสชั่น</span>
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-amber-600 font-medium">
              <span className="tabular-nums font-semibold">{stats.leaveRate}%</span>
              <span className="text-slate-400">มีใบลา/แจ้งโค้ช</span>
            </div>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-amber-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, stats.leaveRate)}%` }} 
            />
          </div>
        </div>

        {/* Metric 4: อัตราความพร้อมเข้าฝึกซ้อมเฉลี่ย */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">อัตราความสม่ำเสมอ</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                {stats.presentRate}%
              </span>
              <span className="text-xs font-medium text-slate-500">
                (เกณฑ์มาตรฐาน 80%)
              </span>
            </div>
            <div className="mt-1.5 text-xs text-slate-500">
              รวมบันทึก {stats.totalSessions} รายการ ({stats.uniqueTrainingDays} วันฝึกซ้อม)
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
            <span>สถานะ: {stats.presentRate >= 80 ? 'อยู่ในเกณฑ์ดีเยี่ยม' : 'ต้องเร่งปรับปรุง'}</span>
          </div>
        </div>

      </div>

      {/* Visual Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left 2 Cols: 7-Day Attendance Trend Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">แนวโน้มการเข้าฝึกซ้อม 7 วันล่าสุด</h2>
              <p className="text-xs text-slate-500">สรุปจำนวนครั้งที่เข้า ขาด และลา ในแต่ละวัน</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
                <span>เข้า</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" />
                <span>ขาด</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" />
                <span>ลา</span>
              </span>
            </div>
          </div>

          {/* Bar Chart Representation */}
          <div className="pt-2">
            <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 border-b border-slate-200 pb-2">
              {last7DaysData.map((d, idx) => {
                const maxVal = Math.max(1, ...last7DaysData.map(item => item.total));
                const presentHeight = (d.present / maxVal) * 100;
                const absentHeight = (d.absent / maxVal) * 100;
                const leaveHeight = (d.leave / maxVal) * 100;

                return (
                  <div key={idx} className="flex flex-col items-center h-full justify-end group">
                    <div className="text-[10px] text-slate-400 mb-1 tabular-nums group-hover:text-slate-900 font-medium">
                      {d.total > 0 ? `${d.present}/${d.total}` : '-'}
                    </div>
                    <div className="w-full max-w-[32px] flex flex-col-reverse rounded-t-sm overflow-hidden bg-slate-100">
                      {d.present > 0 && (
                        <div 
                          className="bg-emerald-500 w-full transition-all duration-300"
                          style={{ height: `${Math.max(4, presentHeight)}%` }}
                          title={`เข้า ${d.present} คน`}
                        />
                      )}
                      {d.leave > 0 && (
                        <div 
                          className="bg-amber-400 w-full transition-all duration-300"
                          style={{ height: `${Math.max(4, leaveHeight)}%` }}
                          title={`ลา ${d.leave} คน`}
                        />
                      )}
                      {d.absent > 0 && (
                        <div 
                          className="bg-rose-500 w-full transition-all duration-300"
                          style={{ height: `${Math.max(4, absentHeight)}%` }}
                          title={`ขาด ${d.absent} คน`}
                        />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-2 whitespace-nowrap text-center">
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Reasons for Leave Breakdown */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">การจำแนกสาเหตุการลา</h2>
            <p className="text-xs text-slate-500">เหตุผลที่นักกีฬาแจ้งขอลาซ้อม ({stats.totalLeave} ครั้ง)</p>

            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">ลาป่วย (มีไข้/ไม่สบาย)</span>
                  <span className="font-semibold text-slate-900 tabular-nums">{leaveReasonCounts.sick} ครั้ง</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div 
                    className="bg-amber-500 h-1.5 rounded-full" 
                    style={{ width: `${stats.totalLeave > 0 ? (leaveReasonCounts.sick / stats.totalLeave) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">บาดเจ็บจากการซ้อม/ชก</span>
                  <span className="font-semibold text-slate-900 tabular-nums">{leaveReasonCounts.injured} ครั้ง</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div 
                    className="bg-rose-500 h-1.5 rounded-full" 
                    style={{ width: `${stats.totalLeave > 0 ? (leaveReasonCounts.injured / stats.totalLeave) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">ไปแข่งขันระดับชาติ/จังหวัด</span>
                  <span className="font-semibold text-slate-900 tabular-nums">{leaveReasonCounts.competition} ครั้ง</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full" 
                    style={{ width: `${stats.totalLeave > 0 ? (leaveReasonCounts.competition / stats.totalLeave) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">ลากิจ/ภารกิจครอบครัว</span>
                  <span className="font-semibold text-slate-900 tabular-nums">{leaveReasonCounts.personal} ครั้ง</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div 
                    className="bg-violet-500 h-1.5 rounded-full" 
                    style={{ width: `${stats.totalLeave > 0 ? (leaveReasonCounts.personal / stats.totalLeave) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            * สถิติอิงตามรอบบันทึกที่เลือก ({timeRange === 'today' ? 'วันนี้' : timeRange === 'week' ? 'สัปดาห์นี้' : '30 วัน'})
          </div>
        </div>

      </div>

      {/* ATHLETE ROSTER ATTENDANCE BREAKDOWN */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Section Header with Tabs */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              ตารางสถิติรายบุคคล (เข้า · ขาด · ลา)
            </h2>
            <p className="text-xs text-slate-500">
              คลิกที่รายชื่อนักกีฬาเพื่อดูประวัติการฝึกซ้อมและรายละเอียดเชิงลึก
            </p>
          </div>

          {/* Segmented Filter for Roster */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setStatusFilterTab('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                statusFilterTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              นักกีฬาทั้งหมด ({athletes.length})
            </button>
            <button
              onClick={() => setStatusFilterTab('top')}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                statusFilterTab === 'top'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>ซ้อมดีเด่น (85%+)</span>
            </button>
            <button
              onClick={() => setStatusFilterTab('warning')}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                statusFilterTab === 'warning'
                  ? 'bg-white text-rose-700 shadow-xs font-semibold'
                  : 'text-rose-600 hover:text-rose-900'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              <span>ขาดซ้อม/เฝ้าระวัง</span>
            </button>
          </div>
        </div>

        {/* List of Athletes with specific count for เข้า, ขาด, ลา */}
        <div className="divide-y divide-slate-100">
          {displayedAthletes.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              ไม่พบข้อมูลนักกีฬาในหมวดหมู่นี้
            </div>
          ) : (
            displayedAthletes.map((item) => {
              const ath = item.athlete;
              const hasWarning = item.totalAbsent >= 2 || (item.totalSessions > 0 && item.presentRate < 75);

              return (
                <div
                  key={ath.id}
                  onClick={() => onSelectAthlete(ath)}
                  className="p-3.5 sm:p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                >
                  {/* Left: Avatar & Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-full ${ath.avatarColor} text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs`}>
                      {ath.nickname.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors">
                          {ath.name} ({ath.nickname})
                        </span>
                        {hasWarning && (
                          <span className="text-[11px] font-medium text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-sm">
                            เตือน: ขาดบ่อย
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 flex-wrap">
                        <span>{ath.weightClass}</span>
                        <span>·</span>
                        <span>{ath.gender}</span>
                        <span>·</span>
                        <span>{ath.ageGroup}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Explicit numbers: เข้า, ขาด, ลา + Percentage */}
                  <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                    
                    {/* Numbers: เข้า, ขาด, ลา */}
                    <div className="flex items-center gap-2 sm:gap-3 text-xs">
                      
                      {/* จำนวนวันที่เข้า */}
                      <div className="text-center min-w-[42px] px-2 py-1 rounded-md bg-emerald-50 border border-emerald-100">
                        <div className="text-[10px] text-emerald-700 font-medium">เข้า</div>
                        <div className="text-sm font-bold text-emerald-800 tabular-nums">
                          {item.totalPresent}
                        </div>
                      </div>

                      {/* จำนวนวันที่ขาด */}
                      <div className={`text-center min-w-[42px] px-2 py-1 rounded-md ${
                        item.totalAbsent > 0 ? 'bg-rose-50 border border-rose-200' : 'bg-slate-50 border border-slate-100'
                      }`}>
                        <div className={`text-[10px] font-medium ${item.totalAbsent > 0 ? 'text-rose-700' : 'text-slate-500'}`}>ขาด</div>
                        <div className={`text-sm font-bold tabular-nums ${item.totalAbsent > 0 ? 'text-rose-700' : 'text-slate-600'}`}>
                          {item.totalAbsent}
                        </div>
                      </div>

                      {/* จำนวนวันที่ลา */}
                      <div className="text-center min-w-[42px] px-2 py-1 rounded-md bg-amber-50 border border-amber-100">
                        <div className="text-[10px] text-amber-700 font-medium">ลา</div>
                        <div className="text-sm font-bold text-amber-800 tabular-nums">
                          {item.totalLeave}
                        </div>
                      </div>

                    </div>

                    {/* Percentage Rate */}
                    <div className="hidden sm:flex flex-col items-end min-w-[70px]">
                      <span className="text-xs font-semibold text-slate-700 tabular-nums">
                        {item.presentRate}%
                      </span>
                      <div className="w-16 bg-slate-200 rounded-full h-1 mt-1">
                        <div 
                          className={`h-1 rounded-full ${item.presentRate >= 80 ? 'bg-emerald-500' : item.presentRate >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                          style={{ width: `${item.presentRate}%` }} 
                        />
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
};
