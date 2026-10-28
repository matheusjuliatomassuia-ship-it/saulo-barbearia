export interface Service {
  id: string;
  name: string;
  category: 'corte' | 'barba' | 'combo' | 'adicional';
  description: string;
  price: number;
  durationMinutes: number;
  iconName: string;
  popular?: boolean;
}

export interface Barber {
  id: string;
  name: string;
  nickname?: string;
  role: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  workDays: number[]; // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  availableHours: { start: string; end: string };
  breakTime?: { start: string; end: string };
}

export interface TimeSlot {
  time: string; // e.g., "14:30"
  available: boolean;
  reason?: 'booked' | 'past' | 'break' | 'day_off';
}

export interface Appointment {
  id: string;
  code: string;
  clientName: string;
  clientPhone: string;
  notes?: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  barberId: string;
  barberName: string;
  date: string; // ISO format "YYYY-MM-DD"
  time: string; // "14:30"
  status: 'confirmado' | 'concluido' | 'cancelado';
  createdAt: string;
  notifiedEstablishment: boolean;
  notifiedClient: boolean;
}

export interface BarbershopInfo {
  name: string;
  tagline: string;
  phone: string; // raw digits with country code for wa.me, e.g., "5511999887766"
  displayPhone: string; // e.g., "(11) 99988-7766"
  address: string;
  neighborhood: string;
  city: string;
  instagram: string;
  openingHours: string;
  rating: number;
  reviewCount?: number;
  logo?: string;
}
