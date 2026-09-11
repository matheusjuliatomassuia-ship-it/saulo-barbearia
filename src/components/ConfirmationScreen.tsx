import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Calendar,
  Clock,
  User,
  Scissors,
  Share2,
  CalendarPlus,
  ArrowLeft,
  Check,
  Building2,
  MessageCircle,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { Appointment, BarbershopInfo } from '../types';
import { formatFullDate } from '../utils/dateUtils';
import {
  generateClientConfirmationMessage,
  generateEstablishmentMessage,
  getGoogleCalendarUrl,
  getWhatsAppUrl,
} from '../utils/whatsappUtils';

interface ConfirmationScreenProps {
  appointment: Appointment;
  barbershop: BarbershopInfo;
  onNewBooking: () => void;
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  appointment,
  barbershop,
  onNewBooking,
}) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // Dispara confetes ao abrir a tela de confirmação
  useEffect(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#10b981', '#3b82f6', '#ffffff'],
      });
    } catch {
      // safe fallback
    }
  }, []);

  const establishmentMsg = generateEstablishmentMessage(appointment, barbershop);
  const clientMsg = generateClientConfirmationMessage(appointment, barbershop);

  const establishmentWhatsAppUrl = getWhatsAppUrl(barbershop.phone, establishmentMsg);
  const clientWhatsAppUrl = getWhatsAppUrl(appointment.clientPhone, clientMsg);
  const googleCalendarUrl = getGoogleCalendarUrl(appointment, barbershop);

  const handleCopySummary = () => {
    navigator.clipboard.writeText(clientMsg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareMobile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Agendamento Barbearia - ${appointment.serviceName}`,
          text: clientMsg,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2500);
      } catch {
        handleCopySummary();
      }
    } else {
      handleCopySummary();
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4 animate-in fade-in duration-300 pb-16">
      {/* CARD DE SUCESSO SUPERIOR */}
      <div className="bg-gradient-to-b from-emerald-950/50 via-neutral-900 to-neutral-900 border border-emerald-500/30 rounded-3xl p-5 text-center relative overflow-hidden shadow-2xl shadow-emerald-950/30">
        <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-2.5 shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
        </div>

        <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase tracking-wider mb-1.5 font-mono">
          Código: {appointment.code}
        </span>

        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-cinzel">
          Agendamento Confirmado!
        </h2>
        <p className="text-xs text-neutral-300 max-w-sm mx-auto mt-1 leading-relaxed">
          Tudo pronto, <strong className="text-white">{appointment.clientName}</strong>! Seu horário foi reservado com sucesso na{' '}
          <span className="text-amber-400 font-semibold">{barbershop.name}</span>.
        </p>
      </div>

      {/* NOTIFICAÇÃO AUTOMÁTICA ENVIADA AO ESTABELECIMENTO */}
      <div className="bg-neutral-900/90 border border-emerald-500/30 rounded-2xl p-3.5 flex items-start gap-3 shadow-md">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
          <MessageCircle className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Notificação Enviada à Barbearia
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">Agora</span>
          </div>
          <p className="text-[11px] text-neutral-300 mt-0.5 leading-snug">
            A barbearia já recebeu seus dados e horário na central de atendimento do WhatsApp.
          </p>
        </div>
      </div>

      {/* TICKET DIGITAL / COMPROVANTE ESTILO PASSAGEM */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
        {/* Topo do Ticket */}
        <div className="bg-neutral-950 p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider font-cinzel">
              Comprovante de Reserva
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Confirmado
          </span>
        </div>

        {/* Detalhes do Voucher */}
        <div className="p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-neutral-800/60">
            <span className="text-neutral-400">Serviço</span>
            <span className="font-bold text-white text-right">{appointment.serviceName}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-neutral-800/60">
            <span className="text-neutral-400">Profissional</span>
            <span className="font-semibold text-neutral-200">{appointment.barberName}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-neutral-800/60">
            <span className="text-neutral-400">Data e Horário</span>
            <span className="font-bold text-emerald-400">
              {formatFullDate(appointment.date)} às {appointment.time}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-neutral-800/60">
            <span className="text-neutral-400">Cliente</span>
            <span className="text-neutral-200 font-medium">
              {appointment.clientName} ({appointment.clientPhone})
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-neutral-400 font-medium">Total a pagar no local</span>
            <span className="text-lg font-black text-amber-400">
              R$ {appointment.servicePrice.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>

        {/* Linha pontilhada com recortes laterais de ticket */}
        <div className="relative flex items-center justify-center my-1">
          <div className="absolute -left-3 w-6 h-6 rounded-full bg-neutral-950 border-r border-neutral-800" />
          <div className="w-full border-t-2 border-dashed border-neutral-800 mx-4" />
          <div className="absolute -right-3 w-6 h-6 rounded-full bg-neutral-950 border-l border-neutral-800" />
        </div>

        {/* Endereço no rodapé do ticket */}
        <div className="p-4 pt-2 bg-neutral-950/60 text-[11px] text-neutral-400 flex items-start gap-2">
          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span>{barbershop.address}</span>
        </div>
      </div>

      {/* BOTÕES DE AÇÃO RÁPIDA NO CELULAR */}
      <div className="space-y-2.5 pt-1">
        {/* 1. Botão Principal: Abrir Conversa no WhatsApp */}
        <a
          id="btn-open-whatsapp-confirmation"
          href={establishmentWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 active:scale-95 text-neutral-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all text-center min-h-[50px]"
        >
          <MessageCircle className="w-5 h-5 fill-neutral-950 text-neutral-950" />
          <span>Abrir Conversa no WhatsApp da Barbearia</span>
        </a>

        {/* 2. Botões Secundários: Calendário e Compartilhar */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 active:scale-95 text-neutral-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition text-center"
          >
            <CalendarPlus className="w-4 h-4 text-amber-400" />
            <span>Salvar na Agenda</span>
          </a>

          <button
            type="button"
            onClick={handleShareMobile}
            className="py-3 px-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 active:scale-95 text-neutral-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition text-center"
          >
            {shared || copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>Compartilhar</span>
              </>
            )}
          </button>
        </div>

        {/* Botão Novo Agendamento */}
        <button
          type="button"
          onClick={onNewBooking}
          className="w-full py-3 text-xs font-semibold text-neutral-400 hover:text-white transition active:scale-95"
        >
          Fazer Outro Agendamento
        </button>
      </div>
    </div>
  );
};
