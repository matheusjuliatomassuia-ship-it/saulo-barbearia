import { Barber, BarbershopInfo, Service, Appointment } from '../types';

export const BARBERSHOP_INFO: BarbershopInfo = {
  name: 'Saulo Fernandes Barbearia',
  tagline: 'Cortes autênticos, toalha quente e tradição',
  phone: '5511918775816', // WhatsApp oficial do estabelecimento
  displayPhone: '+55 11 91877-5816',
  address: 'Rua São José, Nº170',
  neighborhood: 'Criciúma',
  city: 'Caieiras - SP',
  instagram: '@saulobarbearia',
  openingHours: 'Terça a Sábado: 09:00 às 20:00',
  rating: 4.9,
  reviewCount: 480,
  logo: '/saulo_profile_logo.jpg',
};

export const SERVICES: Service[] = [
  {
    id: 'corte',
    name: 'Corte de Cabelo',
    category: 'corte',
    description: 'Corte personalizado (Fade, Degradê, Social ou Tesoura) com acabamento na navalha e finalização.',
    price: 50.0,
    durationMinutes: 40,
    iconName: 'Scissors',
    popular: true,
  },
  {
    id: 'barba',
    name: 'Barba',
    category: 'barba',
    description: 'Modelagem de barba com toalha quente, óleos essenciais, massagem facial e navalha afiada.',
    price: 40.0,
    durationMinutes: 35,
    iconName: 'Sparkles',
  },
  {
    id: 'sobrancelha',
    name: 'Sobrancelha',
    category: 'adicional',
    description: 'Design e alinhamento milimétrico na navalha para realçar o olhar.',
    price: 20.0,
    durationMinutes: 15,
    iconName: 'Eye',
  },
  {
    id: 'combo',
    name: 'Combo (Barba + Cabelo)',
    category: 'combo',
    description: 'A experiência completa: Corte de cabelo impecável + Barba com toalha quente e lavagem especial.',
    price: 80.0,
    durationMinutes: 65,
    iconName: 'Crown',
    popular: true,
  },
  {
    id: 'hidratacao',
    name: 'Hidratação',
    category: 'adicional',
    description: 'Acabamento perfeito no pezinho com navalha e hidratação profunda no couro cabeludo.',
    price: 30.0,
    durationMinutes: 25,
    iconName: 'Flame',
  },
];

export const BARBERS: Barber[] = [
  {
    id: 'saulo',
    name: 'Saulo',
    nickname: 'Master Barber',
    role: 'Barbeiro & Proprietário',
    avatar: '/saulo_profile_logo.jpg',
    rating: 5.0,
    reviewCount: 480,
    specialties: ['Degradê Low / Mid / High', 'Barba Terapia com Toalha Quente', 'Cortes Clássicos & Visagismo'],
    workDays: [1, 2, 3, 4, 5, 6], // Segunda a Sábado
    availableHours: { start: '09:00', end: '20:00' },
    breakTime: { start: '12:30', end: '13:30' },
  },
];

// Gera agendamentos iniciais para teste realístico
export function getInitialAppointments(): Appointment[] {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  return [
    {
      id: 'init-1',
      code: 'SB-7821',
      clientName: 'Gabriel Siqueira',
      clientPhone: '(11) 97123-4567',
      notes: 'Degradê médio bem baixo nas laterais',
      serviceId: 'corte',
      serviceName: 'Corte de Cabelo',
      servicePrice: 50.0,
      serviceDuration: 40,
      barberId: 'saulo',
      barberName: 'Saulo',
      date: dateStr,
      time: '10:00',
      status: 'confirmado',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      notifiedEstablishment: true,
      notifiedClient: true,
    },
    {
      id: 'init-2',
      code: 'SB-7822',
      clientName: 'Matheus Henrique',
      clientPhone: '(11) 98345-9821',
      notes: 'Combo toalha quente caprichada',
      serviceId: 'combo',
      serviceName: 'Combo Saulo Barbearia (Corte + Barba)',
      servicePrice: 80.0,
      serviceDuration: 65,
      barberId: 'saulo',
      barberName: 'Saulo',
      date: dateStr,
      time: '14:30',
      status: 'confirmado',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      notifiedEstablishment: true,
      notifiedClient: true,
    },
    {
      id: 'init-3',
      code: 'SB-7823',
      clientName: 'Felipe Alcantara',
      clientPhone: '(11) 99112-3344',
      serviceId: 'barba',
      serviceName: 'Barba Terapia Completa',
      servicePrice: 40.0,
      serviceDuration: 35,
      barberId: 'saulo',
      barberName: 'Saulo',
      date: tomorrowStr,
      time: '11:00',
      status: 'confirmado',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      notifiedEstablishment: true,
      notifiedClient: true,
    },
  ];
}
