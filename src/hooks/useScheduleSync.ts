import { useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { TimeSlot } from '../types';

const STORAGE_KEY = 'staff_schedules';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const useScheduleSync = (
  schedules: Record<string, TimeSlot[]>,
  setSchedules: (schedules: Record<string, TimeSlot[]>) => void
) => {
  // Load initial data from localStorage
  useEffect(() => {
    const savedSchedules = localStorage.getItem(STORAGE_KEY);
    if (savedSchedules) {
      setSchedules(JSON.parse(savedSchedules));
    }
  }, [setSchedules]);

  // Save to localStorage whenever schedules change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
  }, [schedules]);

  // WebSocket sync
  const syncWithServer = useCallback(() => {
    const socket = io(BACKEND_URL);

    socket.on('connect', () => {
      console.log('Connected to sync server');
      socket.emit('get_schedules');
    });

    socket.on('schedules_updated', (newSchedules: Record<string, TimeSlot[]>) => {
      setSchedules(newSchedules);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSchedules));
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from sync server');
    });

    return () => {
      socket.disconnect();
    };
  }, [setSchedules]);

  // Initialize WebSocket connection
  useEffect(() => {
    const cleanup = syncWithServer();
    return cleanup;
  }, [syncWithServer]);

  // Function to update schedules both locally and on the server
  const updateSchedules = useCallback((newSchedules: Record<string, TimeSlot[]>) => {
    setSchedules(newSchedules);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSchedules));
    const socket = io(BACKEND_URL);
    if (socket.connected) {
      socket.emit('update_schedules', newSchedules);
    }
  }, [setSchedules]);

  return { updateSchedules };
};