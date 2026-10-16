/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Athlete, AttendanceRecord, TrainingProgram } from './types/boxing';
import { 
  getStoredAthletes, 
  saveStoredAthletes, 
  getStoredAttendance, 
  saveStoredAttendance, 
  getStoredPrograms, 
  saveStoredPrograms,
  resetAllData,
  calculateStats
} from './utils/storage';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { AttendanceChecker } from './components/AttendanceChecker';
import { AthleteList } from './components/AthleteList';
import { TrainingProgramModal } from './components/TrainingProgramModal';
import { ReportExportModal } from './components/ReportExportModal';
import { AthleteDetailModal } from './components/AthleteDetailModal';
import { AthleteFormModal } from './components/AthleteFormModal';

export default function App() {
  const [athletes, setAthletes] = useState<Athlete[]>(() => getStoredAthletes());
  const [records, setRecords] = useState<AttendanceRecord[]>(() => getStoredAttendance());
  const [programs, setPrograms] = useState<Record<string, TrainingProgram>>(() => getStoredPrograms());
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'attendance' | 'athletes' | 'programs' | 'export'>('dashboard');
  
  // Modals state
  const [selectedAthleteForDetail, setSelectedAthleteForDetail] = useState<Athlete | null>(null);
  const [athleteToEdit, setAthleteToEdit] = useState<Athlete | null>(null);
  const [isAthleteFormOpen, setIsAthleteFormOpen] = useState(false);

  // Sync to storage on updates
  const handleSaveAttendance = (updatedRecords: AttendanceRecord[]) => {
    setRecords(updatedRecords);
    saveStoredAttendance(updatedRecords);
  };

  const handleSaveAthlete = (athlete: Athlete) => {
    const existingIndex = athletes.findIndex(a => a.id === athlete.id);
    let updated: Athlete[];
    if (existingIndex >= 0) {
      updated = [...athletes];
      updated[existingIndex] = athlete;
    } else {
      updated = [athlete, ...athletes];
    }
    setAthletes(updated);
    saveStoredAthletes(updated);
    
    // Also update selected if open
    if (selectedAthleteForDetail?.id === athlete.id) {
      setSelectedAthleteForDetail(athlete);
    }
  };

  const handleDeleteAthlete = (athleteId: string) => {
    const updated = athletes.filter(a => a.id !== athleteId);
    setAthletes(updated);
    saveStoredAthletes(updated);

    // Also remove associated records
    const updatedRecords = records.filter(r => r.athleteId !== athleteId);
    setRecords(updatedRecords);
    saveStoredAttendance(updatedRecords);

    if (selectedAthleteForDetail?.id === athleteId) {
      setSelectedAthleteForDetail(null);
    }
  };

  const handleSavePrograms = (updatedPrograms: Record<string, TrainingProgram>) => {
    setPrograms(updatedPrograms);
    saveStoredPrograms(updatedPrograms);
  };

  const handleResetData = () => {
    resetAllData();
    const freshAthletes = getStoredAthletes();
    const freshRecords = getStoredAttendance();
    const freshPrograms = getStoredPrograms();
    setAthletes(freshAthletes);
    setRecords(freshRecords);
    setPrograms(freshPrograms);
    setSelectedAthleteForDetail(null);
    setActiveTab('dashboard');
  };

  // Today's summary for bottom bar badge
  const todaySummary = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayRecs = records.filter(r => r.date === todayStr);
    let present = 0;
    let absent = 0;
    let leave = 0;
    todayRecs.forEach(r => {
      if (r.status === 'present') present++;
      if (r.status === 'absent') absent++;
      if (r.status === 'leave') leave++;
    });
    return {
      present,
      absent,
      leave,
      total: todayRecs.length,
    };
  }, [records]);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      
      {/* Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddAthlete={() => {
          setAthleteToEdit(null);
          setIsAthleteFormOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            athletes={athletes}
            records={records}
            onSelectAthlete={(ath) => setSelectedAthleteForDetail(ath)}
            onGoToAttendance={() => setActiveTab('attendance')}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceChecker
            athletes={athletes}
            records={records}
            onSaveAttendance={handleSaveAttendance}
            onSelectAthlete={(ath) => setSelectedAthleteForDetail(ath)}
          />
        )}

        {activeTab === 'athletes' && (
          <AthleteList
            athletes={athletes}
            records={records}
            onSelectAthlete={(ath) => setSelectedAthleteForDetail(ath)}
            onEditAthlete={(ath) => {
              setAthleteToEdit(ath);
              setIsAthleteFormOpen(true);
            }}
            onDeleteAthlete={handleDeleteAthlete}
            onAddNewAthlete={() => {
              setAthleteToEdit(null);
              setIsAthleteFormOpen(true);
            }}
          />
        )}

        {activeTab === 'programs' && (
          <TrainingProgramModal
            programs={programs}
            onSavePrograms={handleSavePrograms}
          />
        )}

        {activeTab === 'export' && (
          <ReportExportModal
            athletes={athletes}
            records={records}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Detail Modal for Selected Boxer */}
      <AthleteDetailModal
        athlete={selectedAthleteForDetail}
        records={records}
        onClose={() => setSelectedAthleteForDetail(null)}
        onEditAthlete={(ath) => {
          setAthleteToEdit(ath);
          setIsAthleteFormOpen(true);
        }}
      />

      {/* Add / Edit Boxer Form Modal */}
      <AthleteFormModal
        athleteToEdit={athleteToEdit}
        isOpen={isAthleteFormOpen}
        onClose={() => {
          setIsAthleteFormOpen(false);
          setAthleteToEdit(null);
        }}
        onSave={handleSaveAthlete}
      />

      {/* Mobile Bottom Navigation (Visible on smartphones, thumb-zone friendly) */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        todaySummary={todaySummary}
      />

    </div>
  );
}
