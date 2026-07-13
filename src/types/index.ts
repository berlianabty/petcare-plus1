export type AppointmentStatus = 'Upcoming' | 'Completed' | 'Cancelled';
export type Species = 'Dog' | 'Cat' | 'Bird' | 'Other';
export type Gender = 'Male' | 'Female';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  location: string;
  bio: string;
  memberSince: string;
}

export interface Vaccination {
  id: string;
  name: string;
  dateGiven: string;
  nextDue: string;
}

export interface WeightRecord {
  month: string;
  weight: number;
}

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  age: number;
  weight: number;
  gender: Gender;
  color: string;
  microchipId: string;
  emoji: string;
  vetName: string;
  vetClinic: string;
  vetPhone: string;
  lastCheckup: string;
  medicalNotes: string;
  allergies: string[];
  medications: string[];
  vaccinations: Vaccination[];
  weightHistory: WeightRecord[];
}

export interface Appointment {
  id: string;
  petId: string;
  petName: string;
  petEmoji: string;
  type: string;
  vetName: string;
  clinic: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes: string;
  reason: string;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: 'user' | 'them';
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  name: string;
  role: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  online: boolean;
  messages: Message[];
}

export interface Activity {
  id: string;
  type: 'appointment' | 'pet' | 'message' | 'vaccination' | 'profile';
  text: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}
