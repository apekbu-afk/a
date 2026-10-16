import React from 'react';
import { ClipboardCheck, Users, BarChart3, Dumbbell, FileSpreadsheet, Plus } from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'attendance' | 'athletes' | 'programs' | 'export';
  setActiveTab: (tab: 'dashboard' | 'attendance' | 'athletes' | 'programs' | 'export') => void;
  onOpenAddAthlete: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddAthlete,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Brand Wordmark & Official Boxing Emblem */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-400/40 bg-slate-800 flex items-center justify-center shrink-0 shadow-sm">
              <img 
                src="/src/assets/images/boxing_team_crest_1792150820664.jpg" 
                alt="ตราสัญลักษณ์มวยสากล ร.ร.กีฬากรุงเทพ" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-white leading-tight">
                มวยสากล โรงเรียนกีฬากรุงเทพ
              </span>
              <span className="text-[11px] text-amber-400 font-medium leading-none">
                ระบบบันทึกการเข้าฝึกซ้อมกีฬา
              </span>
            </div>
          </div>

          {/* Zone 2: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-sm font-medium">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'dashboard'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>เดชบอร์ดภาพรวม</span>
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'attendance'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>เช็คชื่อฝึกซ้อม</span>
            </button>

            <button
              onClick={() => setActiveTab('athletes')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'athletes'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>รายชื่อนักกีฬา</span>
            </button>

            <button
              onClick={() => setActiveTab('programs')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'programs'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              <span>โปรแกรมการซ้อม</span>
            </button>

            <button
              onClick={() => setActiveTab('export')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'export'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>ส่งออกรายงาน</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenAddAthlete}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 transition-all rounded-lg shadow-sm whitespace-nowrap shrink-0"
              title="เพิ่มนักกีฬาใหม่"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">เพิ่มนักกีฬาใหม่</span>
              <span className="sm:hidden">เพิ่ม</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
