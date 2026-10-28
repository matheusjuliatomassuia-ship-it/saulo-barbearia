import { Appointment, BarbershopInfo } from '../types';
import { formatFullDate } from './dateUtils';

// Limpa telefone para formato internacional WhatsApp (apenas dígitos)
export function sanitizePhoneForWhatsApp(phone: string): string {
  const clean = phone.replace(/\D/g, '');
  // Se começar sem 55 (código do Brasil) e tiver 10 ou 11 dígitos, adiciona 55
  if (!clean.startsWith('55') && (clean.length === 10 || clean.length === 11)) {
    return `55${clean}`;
  }
  return clean;
}

// Máscara brasileira para input de telefone: (11) 98765-4321
export function maskPhoneBR(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) {
    return digits.length > 0 ? `(${digits}` : '';
  }
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

// Mensagem automática enviada para o estabelecimento (inclui link direto para o Google Agenda do barbeiro)
export function generateEstablishmentMessage(
  appointment: Appointment,
  barbershop: BarbershopInfo
): string {
  const dateFormatted = formatFullDate(appointment.date);
  const calendarUrl = getGoogleCalendarUrl(appointment, barbershop);

  return (
    `💈 *NOVO AGENDAMENTO RECEBIDO* 💈\n` +
    `*${barbershop.name}*\n\n` +
    `📋 *Código:* #${appointment.code}\n` +
    `👤 *Cliente:* ${appointment.clientName}\n` +
    `📱 *WhatsApp:* ${appointment.clientPhone}\n` +
    `✂️ *Serviço:* ${appointment.serviceName}\n` +
    `💈 *Profissional:* ${appointment.barberName}\n` +
    `📅 *Data:* ${dateFormatted}\n` +
    `⏰ *Horário:* ${appointment.time} (Duração aprox. ${appointment.serviceDuration} min)\n` +
    `💰 *Valor:* R$ ${appointment.servicePrice.toFixed(2).replace('.', ',')}\n` +
    (appointment.notes ? `📝 *Observação:* ${appointment.notes}\n` : '') +
    `\n📅 *Salvar na sua Agenda (Google Calendar):*\n${calendarUrl}\n\n` +
    `✅ _Agendamento registrado pelo sistema online em ${new Date(appointment.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}_`
  );
}

// Mensagem de confirmação para o WhatsApp do cliente
export function generateClientConfirmationMessage(
  appointment: Appointment,
  barbershop: BarbershopInfo
): string {
  const dateFormatted = formatFullDate(appointment.date);

  return (
    `💈 *AGENDAMENTO CONFIRMADO!* 💈\n` +
    `*${barbershop.name}*\n\n` +
    `Olá, *${appointment.clientName}*! Seu horário foi reservado com sucesso:\n\n` +
    `📋 *Comprovante:* #${appointment.code}\n` +
    `✂️ *Serviço:* ${appointment.serviceName}\n` +
    `💈 *Barbeiro:* ${appointment.barberName}\n` +
    `📅 *Data:* ${dateFormatted}\n` +
    `⏰ *Horário:* ${appointment.time}\n` +
    `💰 *Valor:* R$ ${appointment.servicePrice.toFixed(2).replace('.', ',')}\n` +
    `📍 *Local:* ${barbershop.address}, ${barbershop.neighborhood} - ${barbershop.city}\n\n` +
    `⚠️ *Dica:* Chegue com 5 minutinhos de antecedência para relaxar.\n` +
    `Caso precise remarcar, entre em contato pelo telefone ${barbershop.displayPhone}.\n\n` +
    `_Nos vemos em breve!_ ✂️🪒`
  );
}

// Gera URL do wa.me para abrir diretamente no WhatsApp
export function getWhatsAppUrl(phone: string, text: string): string {
  const cleanPhone = sanitizePhoneForWhatsApp(phone);
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

// Gera link interativo para o Google Agenda pré-preenchido
export function getGoogleCalendarUrl(
  appointment: Appointment,
  barbershop: BarbershopInfo
): string {
  const [year, month, day] = appointment.date.split('-').map(Number);
  const [hour, minute] = appointment.time.split(':').map(Number);

  const startDate = new Date(year, month - 1, day, hour, minute);
  const endDate = new Date(startDate.getTime() + (appointment.serviceDuration || 30) * 60000);

  const pad = (n: number) => String(n).padStart(2, '0');
  const formatCalDate = (d: Date) => {
    return (
      `${d.getFullYear()}` +
      `${pad(d.getMonth() + 1)}` +
      `${pad(d.getDate())}T` +
      `${pad(d.getHours())}` +
      `${pad(d.getMinutes())}00`
    );
  };

  const title = encodeURIComponent(
    `💈 ${appointment.serviceName} - ${appointment.clientName}`
  );
  const details = encodeURIComponent(
    `Agendamento na ${barbershop.name}\n\n` +
      `👤 Cliente: ${appointment.clientName}\n` +
      `📱 Telefone: ${appointment.clientPhone}\n` +
      `✂️ Serviço: ${appointment.serviceName}\n` +
      `💈 Barbeiro: ${appointment.barberName}\n` +
      `💰 Valor: R$ ${appointment.servicePrice.toFixed(2).replace('.', ',')}\n` +
      `📋 Código: #${appointment.code}\n` +
      (appointment.notes ? `📝 Obs: ${appointment.notes}\n` : '')
  );
  const location = encodeURIComponent(
    `${barbershop.address} - ${barbershop.neighborhood}, ${barbershop.city}`
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatCalDate(startDate)}/${formatCalDate(endDate)}&details=${details}&location=${location}&ctz=America/Sao_Paulo`;
}
