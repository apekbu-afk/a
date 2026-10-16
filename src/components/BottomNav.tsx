import React from 'react';
import { BarChart3, ClipboardCheck, Users, Dumbbell, FileSpreadsheet } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'dashboard' | 'attendance' | 'athletes' | 'programs' | 'export';
  setActiveTab: (tab: 'dashboard' | 'attendance' | 'athletes' | 'programs' | 'export') => void;
  todaySummary: { present: number; absent: number; leave: number; total: number };
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  todaySummary,
}) => {
  const tabs = [
    {
      id: 'dashboard' as const,
      label: 'เดชบอร์ด',
      icon: BarChart3,
    },
    {
      id: 'attendance' as const,
      label: 'เช็คชื่อ',
      icon: ClipboardCheck,
      badge: todaySummary.total > 0 ? `${todaySummary.present}/${todaySummary.total}` : undefined,
    },
    {
      id: 'athletes' as const,
      label: 'นักกีฬา',
      icon: Users,
    },
    {
      id: 'programs' as const,
      label: 'โปรแกรมซ้อม',
      icon: Dumbbell,
    },
    {
      id: 'export' as const,
      label: 'รายงาน',
      icon: FileSpreadsheet,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe shadow-lg">
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-[44px] flex flex-col items-center justify-center relative py-1 rounded-lg transition-colors ${
                isActive
                  ? 'text-amber-500 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-3 text-[9px] font-bold px-1 py-0.2 bg-emerald-500 text-white rounded-full leading-tight shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-tight mt-1 truncate max-w-[64px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-4 h-0.5 bg-amber-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
