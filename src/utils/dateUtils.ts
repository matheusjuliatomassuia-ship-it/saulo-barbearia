import { Appointment, Barber } from '../types';

export const DAYS_OF_WEEK_PT = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

export const DAYS_SHORT_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const MONTHS_PT = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export const MONTHS_SHORT_PT = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

export interface DayOption {
  date: Date;
  isoString: string; // YYYY-MM-DD
  dayOfWeek: string;
  dayShort: string;
  dayNumber: number;
  monthShort: string;
  monthNumber: number;
  year: number;
  isToday: boolean;
  isTomorrow: boolean;
  isSunday: boolean;
}

// Retorna string YYYY-MM-DD local sem desvio de fuso
export function toLocalIsoDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getNextDays(count = 14): DayOption[] {
  const days: DayOption[] = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const current = new Date(today);
    current.setDate(today.getDate() + i);

    const isoString = toLocalIsoDate(current);
    const dayIndex = current.getDay();

    days.push({
      date: current,
      isoString,
      dayOfWeek: DAYS_OF_WEEK_PT[dayIndex],
      dayShort: DAYS_SHORT_PT[dayIndex],
      dayNumber: current.getDate(),
      monthShort: MONTHS_SHORT_PT[current.getMonth()],
      monthNumber: current.getMonth() + 1,
      year: current.getFullYear(),
      isToday: i === 0,
      isTomorrow: i === 1,
      isSunday: dayIndex === 0,
    });
  }

  return days;
}

// Horários padrões de atendimento da barbearia (de 30 em 30 minutos)
export const ALL_TIME_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
];

export function isSlotAvailable(
  dateIso: string,
  time: string,
  barberId: string,
  barbers: Barber[],
  appointments: Appointment[]
): { available: boolean; reason?: 'booked' | 'past' | 'break' | 'closed' } {
  // Domingo fechado
  const [year, month, day] = dateIso.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const dayOfWeek = dateObj.getDay();

  if (dayOfWeek === 0) {
    return { available: false, reason: 'closed' };
  }



  // Verifica se o dia é hoje e o horário já passou
  const now = new Date();
  const todayIso = toLocalIsoDate(now);
  if (dateIso === todayIso) {
    const [slotHour, slotMin] = time.split(':').map(Number);
    const slotDate = new Date(now);
    slotDate.setHours(slotHour, slotMin, 0, 0);

    // Margem de 15 minutos para agendar
    if (slotDate.getTime() <= now.getTime() + 15 * 60 * 1000) {
      return { available: false, reason: 'past' };
    }
  }

  // Se for um barbeiro específico
  if (barberId !== 'any') {
    const barber = barbers.find((b) => b.id === barberId);
    if (!barber) return { available: false, reason: 'closed' };

    // Verifica se barbeiro trabalha no dia da semana
    if (!barber.workDays.includes(dayOfWeek)) {
      return { available: false, reason: 'closed' };
    }

    // Verifica intervalo / almoço
    if (barber.breakTime) {
      if (time >= barber.breakTime.start && time < barber.breakTime.end) {
        return { available: false, reason: 'break' };
      }
    }

    // Verifica se já tem agendamento ativo
    const isBooked = appointments.some(
      (app) =>
        app.date === dateIso &&
        app.time === time &&
        app.barberId === barberId &&
        app.status !== 'cancelado'
    );

    if (isBooked) {
      return { available: false, reason: 'booked' };
    }

    return { available: true };
  }

  // Se barberId === 'any', verifica se pelo menos 1 barbeiro regular está livre nesse horário
  const regularBarbers = barbers.filter((b) => b.id !== 'any');
  const availableBarbers = regularBarbers.filter((barber) => {
    if (!barber.workDays.includes(dayOfWeek)) return false;
    if (barber.breakTime && time >= barber.breakTime.start && time < barber.breakTime.end) {
      return false;
    }
    const hasBooking = appointments.some(
      (app) =>
        app.date === dateIso &&
        app.time === time &&
        app.barberId === barber.id &&
        app.status !== 'cancelado'
    );
    return !hasBooking;
  });

  if (availableBarbers.length > 0) {
    return { available: true };
  }

  return { available: false, reason: 'booked' };
}

// Formata data amigável: "Sexta-feira, 11 de Setembro"
export function formatFullDate(isoString: string): string {
  if (!isoString) return '';
  const [year, month, day] = isoString.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const dayOfWeek = DAYS_OF_WEEK_PT[dateObj.getDay()];
  const monthName = MONTHS_PT[month - 1];
  return `${dayOfWeek}, ${day} de ${monthName}`;
}

// Formatação para calendário do mês
export function getCalendarGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startDayOfWeek = firstDay.getDay(); // 0-6 (Dom a Sáb)
  const totalDays = lastDay.getDate();

  const days: {
    dayNumber: number;
    isoString: string;
    isCurrentMonth: boolean;
    isPast: boolean;
    isSunday: boolean;
  }[] = [];

  const todayIso = toLocalIsoDate(new Date());

  // Dias do mês anterior para completar a semana
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i;
    const prevDate = new Date(year, month - 1, dayNum);
    const isoString = toLocalIsoDate(prevDate);
    days.push({
      dayNumber: dayNum,
      isoString,
      isCurrentMonth: false,
      isPast: isoString < todayIso,
      isSunday: prevDate.getDay() === 0,
    });
  }

  // Dias do mês atual
  for (let d = 1; d <= totalDays; d++) {
    const currentDate = new Date(year, month, d);
    const isoString = toLocalIsoDate(currentDate);
    days.push({
      dayNumber: d,
      isoString,
      isCurrentMonth: true,
      isPast: isoString < todayIso,
      isSunday: currentDate.getDay() === 0,
    });
  }

  // Dias do próximo mês para completar 35 ou 42 células (múltiplo de 7)
  const remaining = 7 - (days.length % 7);
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month + 1, i);
      const isoString = toLocalIsoDate(nextDate);
      days.push({
        dayNumber: i,
        isoString,
        isCurrentMonth: false,
        isPast: isoString < todayIso,
        isSunday: nextDate.getDay() === 0,
      });
    }
  }

  return days;
}
