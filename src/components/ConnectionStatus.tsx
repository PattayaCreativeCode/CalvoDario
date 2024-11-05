import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useSocket } from '../hooks/useSocket';

const ConnectionStatus: React.FC = () => {
  const { isConnected } = useSocket();

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
      isConnected ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'
    }`}>
      {isConnected ? (
        <>
          <Wifi className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium">Synced</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium">Local Only</span>
        </>
      )}
    </div>
  );
};

export default ConnectionStatus;