import { create } from 'zustand';
import type { Appointment, AppointmentStatus } from '../types';
import { initialAppointments, generateId } from '../data/mockData';

interface AppointmentStore {
  appointments: Appointment[];
  addAppointment: (apt: Omit<Appointment, 'id' | 'status' | 'notes' | 'reason'>) => void;
  updateAppointment: (id: string, data: Partial<Appointment>) => void;
  cancelAppointment: (id: string) => void;
  rescheduleAppointment: (id: string, date: string, time: string, reason: string) => void;
}

export const useAppointmentStore = create<AppointmentStore>((set) => ({
  appointments: initialAppointments,
  addAppointment: (apt) =>
    set((state) => ({
      appointments: [
        {
          ...apt,
          id: generateId(),
          status: 'Upcoming' as AppointmentStatus,
          notes: '',
          reason: '',
        },
        ...state.appointments,
      ],
    })),
  updateAppointment: (id, data) =>
    set((state) => ({
      appointments: state.appointments.map((a) => (a.id === id ? { ...a, ...data } : a)),
    })),
  cancelAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === id ? { ...a, status: 'Cancelled' as AppointmentStatus } : a
      ),
    })),
  rescheduleAppointment: (id, date, time, reason) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === id ? { ...a, date, time, reason } : a
      ),
    })),
}));
