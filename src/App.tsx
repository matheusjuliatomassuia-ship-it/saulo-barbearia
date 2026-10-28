import { supabase } from './supabaseClient';
import React, { useState, useEffect } from 'react';
import {
  SERVICES,
  BARBERS,
  BARBERSHOP_INFO,
  getInitialAppointments,
} from './data/barbershopData';
import { Appointment, Barber, Service } from './types';
import { Header } from './components/Header';
import { StepProgressBar } from './components/StepProgressBar';
import { ServiceStep } from './components/ServiceStep';
import { BarberStep } from './components/BarberStep';
import { DateTimeStep } from './components/DateTimeStep';
import { ConfirmationStep } from './components/ConfirmationStep';
import { ConfirmationScreen } from './components/ConfirmationScreen';
import { toLocalIsoDate } from './utils/dateUtils';
import { generateEstablishmentMessage, getWhatsAppUrl } from './utils/whatsappUtils';
import { Scissors, PhoneCall, Clock } from 'lucide-react';

const STORAGE_KEY = 'saulo_barbearia_appointments_v1';

export default function App() {
  // Estado de agendamentos persistido em localStorage (para validar horários ocupados)
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: Appointment[] = JSON.parse(saved);
        return parsed.filter((app) => app.time !== '15:00');
      }
    } catch {
      // ignore
    }
    return getInitialAppointments().filter((app) => app.time !== '15:00');
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
    } catch {
      // ignore
    }
  }, [appointments]);

  // Passo ativo: 1 - Serviço | 2 - Barbeiro | 3 - Data & Horário | 4 - Confirmação & WhatsApp
  const [activeStep, setActiveStep] = useState<number>(1);
const [remoteBusy, setRemoteBusy] = useState<Appointment[] | null>(null);

const loadBusySlots = async () => {
  if (!supabase) return;
  const fim = new Date();
  fim.setDate(fim.getDate() + 60);
  const { data, error } = await supabase.rpc('horarios_ocupados', {
    p_inicio: toLocalIsoDate(new Date()),
    p_fim: toLocalIsoDate(fim),
  });
  if (error || !data) return;
  setRemoteBusy(
    (data as { dia: string; hora: string }[]).map(
      (r) =>
        ({
          id: `remote-${r.dia}-${r.hora}`,
          date: r.dia,
          time: r.hora,
          barberId: BARBERS[0].id,
          status: 'confirmado',
        }) as unknown as Appointment
    )
  );
};

useEffect(() => {
  if (activeStep === 3) loadBusySlots();
}, [activeStep]);
  // Estado da reserva do cliente
  const [selectedService, setSelectedService] = useState<Service>(SERVICES[0]);
  const [selectedBarber, setSelectedBarber] = useState<Barber>(BARBERS[0]);

  // Data padrão: hoje ou amanhã se hoje for domingo
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    if (today.getDay() === 0) {
      today.setDate(today.getDate() + 1);
    }
    return toLocalIsoDate(today);
  });

  const [selectedTime, setSelectedTime] = useState<string>('15:00');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientNotes, setClientNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Agendamento recém-concluído (tela de confirmação do cliente)
  const [completedAppointment, setCompletedAppointment] = useState<Appointment | null>(null);

  // Verificação de passos concluídos
  const completedSteps = {
    service: Boolean(selectedService),
    barber: Boolean(selectedBarber),
    dateTime: Boolean(selectedDate && selectedTime),
  };

  const goToStep = (stepNumber: number) => {
    setActiveStep(stepNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Manipulador de submissão e conclusão via WhatsApp
  const handleBookingSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime || !clientName || !clientPhone) {
      return;
    }

    setIsSubmitting(true);

    // Código único amigável: SB-XXXX
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = `SB-${randomNum}`;
    const finalBarber = selectedBarber || BARBERS[0];

    const newAppointment: Appointment = {
      id: `app-${Date.now()}`,
      code,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      notes: clientNotes.trim() || undefined,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      servicePrice: selectedService.price,
      serviceDuration: selectedService.durationMinutes,
      barberId: finalBarber.id,
      barberName: finalBarber.name,
      date: selectedDate,
      time: selectedTime,
      status: 'confirmado',
      createdAt: new Date().toISOString(),
      notifiedEstablishment: true,
      notifiedClient: true,
    };

    // Feedback de envio e abertura automática do WhatsApp
    setTimeout(() => {
      setAppointments((prev) => [newAppointment, ...prev]);
      setCompletedAppointment(newAppointment);
      setIsSubmitting(false);

      // Vibração táctil leve no celular (se suportado pelo navegador)
      try {
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
      } catch {
        // ignore
      }

      // Abre automaticamente o WhatsApp com a mensagem formatada para a Saulo Barbearia
      try {
        const msg = generateEstablishmentMessage(newAppointment, BARBERSHOP_INFO);
        const url = getWhatsAppUrl(BARBERSHOP_INFO.phone, msg);
        window.open(url, '_blank');
      } catch {
        // fallback
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  // Reseta para novo agendamento
  const handleNewBooking = () => {
    setCompletedAppointment(null);
    setSelectedTime('');
    setClientNotes('');
    setActiveStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-amber-500 selection:text-neutral-950 relative">
      {/* IMAGEM DE FUNDO DA BARBEARIA */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none"
        aria-hidden="true"
      >
        <img
          src="/barber_background.jpg"
          alt="Ambiente Barbearia"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.27] contrast-[1.12] saturate-[0.88]"
        />
        {/* Camadas de proteção e gradientes para garantir contraste e legibilidade impecáveis */}
        <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-[1.5px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/90 via-neutral-950/60 to-neutral-950/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-neutral-950/80" />
      </div>

      {/* HEADER 100% PARA O CLIENTE */}
      <Header />

      {/* CONTEÚDO PRINCIPAL DIVIDIDO EM 4 PARTES */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3.5 sm:px-6 py-4 sm:py-6">
        {completedAppointment ? (
          /* TELA FINAL DE CONFIRMAÇÃO & COMPROVANTE DO WHATSAPP */
          <ConfirmationScreen
            appointment={completedAppointment}
            barbershop={BARBERSHOP_INFO}
            onNewBooking={handleNewBooking}
          />
        ) : (
          <div className="space-y-6">
            {/* INDICADOR DAS 4 ETAPAS (STEPPER NO TOPO) */}
            <StepProgressBar
              currentStep={activeStep}
              onStepClick={goToStep}
              completedSteps={completedSteps}
            />

            {/* PARTE 1: TELA DE SERVIÇO (Corte, Barba, Sobrancelha, Combo, Hidratação + Monte seu Combo) */}
            {activeStep === 1 && (
              <ServiceStep
                services={SERVICES}
                selectedService={selectedService}
                onSelectService={(service) => setSelectedService(service)}
                onContinue={() => goToStep(2)}
              />
            )}

            {/* PARTE 2: TELA DE SELEÇÃO DO BARBEIRO (Saulo) */}
            {activeStep === 2 && (
              <BarberStep
                barber={selectedBarber || BARBERS[0]}
                selectedService={selectedService}
                onBack={() => goToStep(1)}
                onContinue={() => goToStep(3)}
              />
            )}

            {/* PARTE 3: TELA DE SELEÇÃO DE HORÁRIO E DIA */}
            {activeStep === 3 && (
              <DateTimeStep
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                selectedBarber={selectedBarber || BARBERS[0]}
                selectedService={selectedService}
                barbers={BARBERS}
                appointments={appointments}
                onSelectDate={(date) => setSelectedDate(date)}
                onSelectTime={(time) => setSelectedTime(time)}
                onBack={() => goToStep(2)}
                onContinue={() => goToStep(4)}
              />
            )}

            {/* PARTE 4: CONFIRMAÇÃO DO PEDIDO E CONCLUIR ENVIANDO PELO WHATSAPP */}
            {activeStep === 4 && (
              <ConfirmationStep
                name={clientName}
                phone={clientPhone}
                notes={clientNotes}
                selectedService={selectedService}
                selectedBarber={selectedBarber || BARBERS[0]}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onChangeName={setClientName}
                onChangePhone={setClientPhone}
                onChangeNotes={setClientNotes}
                onBack={() => goToStep(3)}
                onSubmit={handleBookingSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        )}
      </main>

      {/* FOOTER DO CLIENTE */}
      <footer className="mt-auto border-t border-neutral-900 bg-neutral-950/90 py-5 text-xs text-neutral-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Scissors className="w-3 h-3" />
            </div>
            <span className="font-semibold text-neutral-300 font-cinzel">
              {BARBERSHOP_INFO.name}
            </span>
            <span>•</span>
            <span className="truncate max-w-[320px]">
              {BARBERSHOP_INFO.address} – {BARBERSHOP_INFO.neighborhood}, {BARBERSHOP_INFO.city}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <a
              href={`https://wa.me/${BARBERSHOP_INFO.phone}?text=${encodeURIComponent('Olá! Gostaria de informações.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
            >
              <PhoneCall className="w-3 h-3" />
              WhatsApp: {BARBERSHOP_INFO.displayPhone}
            </a>
            <span>•</span>
            <span className="text-neutral-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-400" />
              {BARBERSHOP_INFO.openingHours}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
