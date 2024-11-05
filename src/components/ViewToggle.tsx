import React from 'react';
import { Calendar, CalendarDays } from 'lucide-react';

interface ViewToggleProps {
  isWeeklyView: boolean;
  onToggle: () => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ isWeeklyView, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 
        text-gray-700 rounded-lg shadow-sm border border-gray-200 
        transition-colors duration-200"
      aria-label={isWeeklyView ? "Switch to daily view" : "Switch to weekly view"}
    >
      {isWeeklyView ? (
        <>
          <Calendar className="w-4 h-4" />
          <span className="font-medium">Daily View</span>
        </>
      ) : (
        <>
          <CalendarDays className="w-4 h-4" />
          <span className="font-medium">Weekly View</span>
        </>
      )}
    </button>
  );
};

export default ViewToggle;