import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Download } from 'lucide-react';

interface ExportButtonProps {
  calendarRef: React.RefObject<HTMLDivElement>;
}

const ExportButton: React.FC<ExportButtonProps> = ({ calendarRef }) => {
  const exportSchedule = async () => {
    if (!calendarRef.current) return;

    try {
      const canvas = await html2canvas(calendarRef.current, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `schedule-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to export schedule:', error);
    }
  };

  return (
    <button
      onClick={exportSchedule}
      className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 
        text-gray-700 rounded-lg shadow-sm border border-gray-200 
        transition-colors duration-200"
    >
      <Download className="w-4 h-4" />
      <span className="font-medium">Save to Gallery</span>
    </button>
  );
};

export default ExportButton;