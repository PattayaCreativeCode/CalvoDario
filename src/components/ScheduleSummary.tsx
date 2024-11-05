import React from 'react';
import { User } from 'lucide-react';
import { TimeSlot } from '../types';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface ScheduleSummaryProps {
  schedules: Record<string, TimeSlot[]>;
}

const ScheduleSummary: React.FC<ScheduleSummaryProps> = ({ schedules }) => {
  const formatTimeRanges = (slots: TimeSlot[]) => {
    if (slots.length === 0) return [];

    // Group slots by day
    const byDay = slots.reduce((acc, slot) => {
      if (!acc[slot.day]) {
        acc[slot.day] = [];
      }
      acc[slot.day].push(slot.hour);
      return acc;
    }, {} as Record<string, number[]>);

    return Object.entries(byDay)
      .sort(([a], [b]) => parseISO(a).getTime() - parseISO(b).getTime())
      .map(([day, hours]) => {
        // Sort hours
        hours.sort((a, b) => a - b);
        
        // Find consecutive ranges
        const ranges: [number, number][] = [];
        let rangeStart = hours[0];
        let prev = hours[0];
        
        for (let i = 1; i <= hours.length; i++) {
          if (i === hours.length || hours[i] !== prev + 1) {
            ranges.push([rangeStart, prev]);
            rangeStart = hours[i];
          }
          prev = hours[i];
        }

        // Format ranges
        const timeRanges = ranges
          .map(([start, end]) => `${start}:00-${end + 1}:00`)
          .join(', ');

        return {
          day,
          formattedDay: format(parseISO(day), "EEEE, d 'de' MMMM", { locale: es }),
          timeRanges
        };
      });
  };

  const getStaffColor = (name: string) => {
    switch (name) {
      case 'Dani': return 'indigo';
      case 'Tere': return 'rose';
      default: return 'slate';
    }
  };

  return (
    <>
      {Object.entries(schedules).map(([name, slots]) => {
        const color = getStaffColor(name);
        return (
          <div key={name} className={`flex-1 bg-${color}-50 rounded-lg p-4`}>
            <div className="flex items-center gap-2 mb-3">
              <User className={`w-5 h-5 text-${color}-600`} />
              <h3 className={`font-semibold text-${color}-900`}>{name}</h3>
            </div>
            <div className="space-y-2">
              {slots.length === 0 ? (
                <p className="text-sm text-gray-500">No hay horas seleccionadas</p>
              ) : (
                formatTimeRanges(slots).map(({ day, formattedDay, timeRanges }) => (
                  <div key={day} className="text-sm">
                    <span className={`font-medium text-${color}-700`}>
                      {formattedDay}:
                    </span>
                    <span className={`text-${color}-600 ml-2`}>
                      {timeRanges}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ScheduleSummary;