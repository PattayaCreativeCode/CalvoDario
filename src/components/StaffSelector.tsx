import React from 'react';
import { User, Ban } from 'lucide-react';
import { Staff } from '../types';

interface StaffSelectorProps {
  selectedStaff: Staff | null;
  onSelectStaff: (staff: Staff | null) => void;
}

const StaffSelector: React.FC<StaffSelectorProps> = ({ selectedStaff, onSelectStaff }) => {
  const staff: Staff[] = [
    { name: 'Dani', color: 'indigo' },
    { name: 'Tere', color: 'rose' },
    { name: 'Sin Reparto', color: 'slate' }
  ];

  const handleStaffClick = (member: Staff) => {
    onSelectStaff(selectedStaff?.name === member.name ? null : member);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
        <User className="w-5 h-5 text-gray-500" />
        Select Staff Member
      </h2>
      <div className="flex gap-3">
        {staff.map(member => (
          <button
            key={member.name}
            onClick={() => handleStaffClick(member)}
            className={`
              group relative flex items-center gap-2 px-4 py-2 rounded-lg
              transition-all duration-200 ease-in-out
              ${selectedStaff?.name === member.name
                ? `bg-${member.color}-100 text-${member.color}-700 ring-2 ring-${member.color}-500 ring-offset-2`
                : 'bg-white hover:bg-gray-50 text-gray-700 shadow-sm border border-gray-200'
              }
            `}
          >
            {member.name === 'Sin Reparto' ? (
              <Ban className={`w-4 h-4 ${
                selectedStaff?.name === member.name 
                  ? `text-${member.color}-500`
                  : 'text-gray-500'
              }`} />
            ) : (
              <User className={`w-4 h-4 ${
                selectedStaff?.name === member.name 
                  ? `text-${member.color}-500`
                  : 'text-gray-500'
              }`} />
            )}
            <span className="font-medium">{member.name}</span>
            <span className={`absolute inset-0 rounded-lg ring-2 ring-${member.color}-400 opacity-0 
              group-hover:opacity-100 transition-opacity duration-200 ${
                selectedStaff?.name === member.name ? 'opacity-0' : ''
              }`} 
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default StaffSelector;