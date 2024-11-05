export interface Staff {
  name: string;
  color: string;
  icon?: 'user' | 'car-off';
}

export interface TimeSlot {
  day: string; // ISO date string (YYYY-MM-DD)
  hour: number;
}

export interface SocketEvents {
  connect: () => void;
  disconnect: () => void;
  schedules_updated: (schedules: Record<string, TimeSlot[]>) => void;
  update_schedules: (schedules: Record<string, TimeSlot[]>) => void;
  get_schedules: () => void;
}