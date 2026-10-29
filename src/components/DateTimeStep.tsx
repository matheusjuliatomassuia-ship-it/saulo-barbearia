import React from 'react';
import { ArrowLeft, ArrowRight, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Appointment, Barber, Service } from '../types';
import { CalendarSelector } from './CalendarSelector';
import { formatFullDate } from '../utils/dateUtils';

interface DateTimeStepProps {
  selectedDate: string;
  selectedTime: string;
  selectedBarber: Barber;
  selectedService: Service;
  barbers: Barber[];
  appointments: Appointment[];
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const DateTimeStep: React.FC<DateTimeStepProps> = ({
  selectedDate,
  selectedTime,
  selectedBarber,
  selectedService,
  barbers,
  appointments,
  onSelectDate,
  onSelectTime,
  onBack,
  onContinue,
}) => {
  const isReadyToContinue = Boolean(selectedDate && selectedTime);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* CABEÇALHO DA ETAPA 3 */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 mb-1.5">
          <span>Passo 3 de 4</span>
          <span>•</span>
          <span>Data e Horário</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-cinzel">
          Quando você prefere ser atendido?
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Escolha o dia e o melhor horário disponível na agenda do Saulo.
        </p>
      </div>

      {/* SELETOR DE DATA E HORÁRIO */}
<CalendarSelector
  selectedDate={selectedDate}
  selectedTime={selectedTime}
  selectedBarberId={selectedBarber.id}
  barbers={barbers}
  appointments={appointments}
  onSelectDate={onSelectDate}
  onSelectTime={onSelectTime}
/>

      {/* BARRA INFERIOR DE CONTINUAÇÃO DA ETAPA 3 */}
      <div className="sticky bottom-3 z-20 bg-neutral-900/95 backdrop-blur-md border border-neutral-800 p-3.5 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
            Horário Escolhido
          </span>
          {isReadyToContinue ? (
            <div className="flex items-center gap-2 text-sm font-bold text-white mt-0.5">
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                {selectedTime}
              </span>
              <span className="text-neutral-500">•</span>
              <span className="truncate">{formatFullDate(selectedDate)}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-amber-400 mt-0.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Por favor, toque em um dos horários disponíveis acima</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 sm:flex-none px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950/70 hover:bg-neutral-800 text-neutral-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>

          <button
            type="button"
            id="btn-continue-step-3"
            disabled={!isReadyToContinue}
            onClick={onContinue}
            className={`flex-[2] sm:flex-none px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shrink-0 ${
              isReadyToContinue
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 shadow-lg shadow-amber-500/20'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
            }`}
          >
            <span>Avançar para Confirmação (Passo 4)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
