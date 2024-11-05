import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Staff, TimeSlot } from '../types';
import { format, addDays, addWeeks, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';

interface WeeklyCalendarProps {
  selectedStaff: Staff | null;
  schedules: Record<string, TimeSlot[]>;
  onTimeSlotToggle: (day: string, hour: number) => void;
  isWeeklyView: boolean;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  selectedStaff,
  schedules,
  onTimeSlotToggle,
  isWeeklyView
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const hours = Array.from({ length: 13 }, (_, i) => i + 10); // 10:00 to 22:00

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const visibleDays = isWeeklyView ? daysInWeek : [currentDate];

  const handlePrevDay = () => {
    setCurrentDate(prev => addDays(prev, -1));
  };

  const handleNextDay = () => {
    setCurrentDate(prev => addDays(prev, 1));
  };

  const handlePrevWeek = () => {
    setCurrentDate(prev => addWeeks(prev, -1));
  };

  const handleNextWeek = () => {
    setCurrentDate(prev => addWeeks(prev, 1));
  };

  const getSlotOwner = (day: Date, hour: number): Staff | null => {
    const dayStr = format(day, 'yyyy-MM-dd');
    for (const [name, slots] of Object.entries(schedules)) {
      if (slots.some(slot => slot.day === dayStr && slot.hour === hour)) {
        const color = name === 'Dani' ? 'indigo' : name === 'Tere' ? 'rose' : 'slate';
        return { name, color, icon: name === 'Sin Reparto' ? 'car-off' : 'user' };
      }
    }
    return null;
  };

  return (
    <div className="overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={isWeeklyView ? handlePrevWeek : handlePrevDay}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label={isWeeklyView ? "Previous week" : "Previous day"}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h3 className="font-medium text-gray-900">
            {isWeeklyView ? (
              <>
                {format(weekStart, "d 'de' MMMM", { locale: es })} - {format(weekEnd, "d 'de' MMMM, yyyy", { locale: es })}
              </>
            ) : (
              format(currentDate, "EEEE, d 'de' MMMM, yyyy", { locale: es })
            )}
          </h3>
        </div>
        <button
          onClick={isWeeklyView ? handleNextWeek : handleNextDay}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label={isWeeklyView ? "Next week" : "Next day"}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="min-w-full overflow-x-auto">
        <div className={`grid ${isWeeklyView ? 'grid-cols-8' : 'grid-cols-2'} gap-1`}>
          {/* Time column header */}
          <div className="h-14 flex items-end justify-center pb-2">
            <span className="text-sm font-medium text-gray-500">Hora</span>
          </div>
          
          {/* Day column headers */}
          {visibleDays.map(day => (
            <div
              key={format(day, 'yyyy-MM-dd')}
              className="h-14 flex items-end justify-center pb-2"
            >
              <div className="text-center">
                <div className="text-sm font-medium text-gray-700">
                  {format(day, 'EEEE', { locale: es })}
                </div>
                <div className="text-sm text-gray-500">
                  {format(day, "d MMM", { locale: es })}
                </div>
              </div>
            </div>
          ))}

          {/* Time slots */}
          {hours.map(hour => (
            <React.Fragment key={hour}>
              {/* Time column */}
              <div className="h-12 flex items-center justify-center border-t border-gray-100">
                <span className="text-sm text-gray-500">{hour}:00</span>
              </div>

              {/* Day columns */}
              {visibleDays.map(day => {
                const owner = getSlotOwner(day, hour);
                const dayStr = format(day, 'yyyy-MM-dd');
                const isOwned = !!owner;
                const isOwnedBySelected = owner?.name === selectedStaff?.name;
                const canInteract = !isOwned || isOwnedBySelected;

                return (
                  <div
                    key={`${dayStr}-${hour}`}
                    className="h-12 border-t border-gray-100"
                  >
                    <button
                      onClick={() => canInteract && onTimeSlotToggle(dayStr, hour)}
                      disabled={!selectedStaff || !canInteract}
                      className={`
                        w-full h-full transition-all duration-150 relative
                        ${!selectedStaff || !canInteract ? 'cursor-not-allowed' : 'cursor-pointer'}
                        ${owner 
                          ? `bg-${owner.color}-100 hover:bg-${owner.color}-200`
                          : 'hover:bg-gray-50'
                        }
                      `}
                    >
                      {owner && (
                        <span className={`
                          absolute inset-0 flex items-center justify-center
                          text-sm font-medium text-${owner.color}-700
                        `}>
                          {owner.name}
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendar;