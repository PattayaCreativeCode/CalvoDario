import React, { useState, useRef } from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import WeeklyCalendar from './components/WeeklyCalendar';
import StaffSelector from './components/StaffSelector';
import ScheduleSummary from './components/ScheduleSummary';
import { Staff, TimeSlot } from './types';
import { useScheduleSync } from './hooks/useScheduleSync';
import ConnectionStatus from './components/ConnectionStatus';
import ExportButton from './components/ExportButton';
import ViewToggle from './components/ViewToggle';

function App() {
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [schedules, setSchedules] = useState<Record<string, TimeSlot[]>>({
    'Dani': [],
    'Tere': [],
    'Sin Reparto': []
  });
  const [isWeeklyView, setIsWeeklyView] = useState(true);
  const calendarRef = useRef<HTMLDivElement>(null);

  const { updateSchedules } = useScheduleSync(schedules, setSchedules);

  const handleTimeSlotToggle = (day: string, hour: number) => {
    if (!selectedStaff) return;

    const newSchedules = { ...schedules };
    const staffSchedule = [...(newSchedules[selectedStaff.name] || [])];
    const slotIndex = staffSchedule.findIndex(
      slot => slot.day === day && slot.hour === hour
    );

    if (slotIndex >= 0) {
      // Remove the slot if it exists
      staffSchedule.splice(slotIndex, 1);
      newSchedules[selectedStaff.name] = staffSchedule;
    } else {
      // Remove the slot from other staff members' schedules
      Object.keys(newSchedules).forEach(staffName => {
        newSchedules[staffName] = newSchedules[staffName].filter(
          slot => !(slot.day === day && slot.hour === hour)
        );
      });
      // Add the slot to the selected staff member's schedule
      newSchedules[selectedStaff.name] = [
        ...staffSchedule,
        { day, hour }
      ];
    }

    updateSchedules(newSchedules);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Calendario de Personal
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <ConnectionStatus />
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-600">
                  Horario: 10:00 - 22:00
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <StaffSelector
              selectedStaff={selectedStaff}
              onSelectStaff={setSelectedStaff}
            />
            <div className="flex items-center gap-3">
              <ViewToggle 
                isWeeklyView={isWeeklyView} 
                onToggle={() => setIsWeeklyView(!isWeeklyView)} 
              />
              <ExportButton calendarRef={calendarRef} />
            </div>
          </div>

          <div ref={calendarRef}>
            {selectedStaff ? (
              <WeeklyCalendar
                selectedStaff={selectedStaff}
                schedules={schedules}
                onTimeSlotToggle={handleTimeSlotToggle}
                isWeeklyView={isWeeklyView}
              />
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">
                  Por favor, selecciona un repartidor para ver y editar su horario
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ScheduleSummary schedules={schedules} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;