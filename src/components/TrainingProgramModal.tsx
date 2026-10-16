import React, { useState } from 'react';
import { TrainingProgram, SessionType } from '../types/boxing';
import { Dumbbell, Plus, Trash2, Save, UserCheck, Flame, Check } from 'lucide-react';

interface TrainingProgramModalProps {
  programs: Record<string, TrainingProgram>;
  onSavePrograms: (updated: Record<string, TrainingProgram>) => void;
}

export const TrainingProgramModal: React.FC<TrainingProgramModalProps> = ({
  programs,
  onSavePrograms,
}) => {
  const [activeSession, setActiveSession] = useState<SessionType>('morning');
  const currentProgram = programs[activeSession] || {
    date: new Date().toISOString().split('T')[0],
    session: activeSession,
    coachName: 'ผู้ฝึกสอนมวยสากล ร.ร.กีฬากรุงเทพ',
    focus: 'ฝึกซ้อมพื้นฐานและสมรรถภาพทางกาย',
    exercises: ['วิ่งระยะทาง 5 กม.', 'กระโดดเชือก 5 ยก', 'ชกลม 4 ยก']
  };

  const [coachName, setCoachName] = useState(currentProgram.coachName);
  const [focus, setFocus] = useState(currentProgram.focus);
  const [exercises, setExercises] = useState<string[]>(currentProgram.exercises);
  const [newExercise, setNewExercise] = useState('');
  const [toast, setToast] = useState(false);

  const handleSwitchSession = (session: SessionType) => {
    setActiveSession(session);
    const p = programs[session];
    if (p) {
      setCoachName(p.coachName);
      setFocus(p.focus);
      setExercises(p.exercises);
    }
  };

  const handleAddExercise = () => {
    if (!newExercise.trim()) return;
    setExercises([...exercises, newExercise.trim()]);
    setNewExercise('');
  };

  const handleRemoveExercise = (idx: number) => {
    setExercises(exercises.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    const updated = {
      ...programs,
      [activeSession]: {
        ...currentProgram,
        session: activeSession,
        coachName: coachName.trim(),
        focus: focus.trim(),
        exercises,
      }
    };
    onSavePrograms(updated);
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  };

  return (
    <div className="space-y-5 pb-24 md:pb-8">
      
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>บันทึกโปรแกรมการฝึกซ้อมเรียบร้อยแล้ว</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-600">
              <Flame className="w-4 h-4" />
              <span>ตารางการฝึกซ้อมประจำวัน</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              โปรแกรมฝึกซ้อมมวยสากล โรงเรียนกีฬากรุงเทพมหานคร
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              กำหนดแบบฝึก โค้ชผู้รับผิดชอบ และเป้าหมายการซ้อมแต่ละคาบ
            </p>
          </div>

          {/* Session Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => handleSwitchSession('morning')}
              className={`px-3 py-2 text-xs font-semibold rounded-md transition-all ${
                activeSession === 'morning'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              รอบเช้า (05:30 - 07:15)
            </button>
            <button
              onClick={() => handleSwitchSession('evening')}
              className={`px-3 py-2 text-xs font-semibold rounded-md transition-all ${
                activeSession === 'evening'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              รอบเย็น (16:00 - 18:30)
            </button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        
        {/* Coach Name */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">ผู้ฝึกสอน / โค้ชผู้ควบคุมคาบ</label>
          <input
            type="text"
            value={coachName}
            onChange={(e) => setCoachName(e.target.value)}
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Focus & Target */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">เป้าหมายหลักประจำคาบ (Training Focus)</label>
          <input
            type="text"
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Exercise Checklist */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold text-slate-700">รายการแบบฝึก (Drills & Routine)</label>
          
          <div className="space-y-2">
            {exercises.map((ex, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  {idx + 1}
                </span>
                <span className="flex-1 font-medium text-slate-800">{ex}</span>
                <button
                  onClick={() => handleRemoveExercise(idx)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add new drill */}
          <div className="flex gap-2 pt-1">
            <input
              type="text"
              placeholder="เพิ่มรายการฝึกซ้อมใหม่ เช่น วิ่ง 6 กม., ล่อเป้า 4 ยก"
              value={newExercise}
              onChange={(e) => setNewExercise(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExercise())}
              className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
            <button
              onClick={handleAddExercise}
              className="px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มแบบฝึก</span>
            </button>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg shadow-xs flex items-center gap-1.5 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>บันทึกโปรแกรมการฝึก</span>
          </button>
        </div>

      </div>

    </div>
  );
};
