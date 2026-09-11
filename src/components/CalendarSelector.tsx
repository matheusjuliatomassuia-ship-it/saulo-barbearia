import React, { useState, useRef } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Sun,
  Sunset,
  Moon,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Appointment, Barber } from '../types';
import {
  ALL_TIME_SLOTS,
  DAYS_SHORT_PT,
  formatFullDate,
  getCalendarGrid,
  getNextDays,
  isSlotAvailable,
  MONTHS_PT,
  toLocalIsoDate,
} from '../utils/dateUtils';

interface CalendarSelectorProps {
  selectedDate: string; // "YYYY-MM-DD"
  selectedTime: string; // "14:30"
  selectedBarberId: string;
  barbers: Barber[];
  appointments: Appointment[];
  onSelectDate: (dateIso: string) => void;
  onSelectTime: (time: string) => void;
}

export const CalendarSelector: React.FC<CalendarSelectorProps> = ({
  selectedDate,
  selectedTime,
  selectedBarberId,
  barbers,
  appointments,
  onSelectDate,
  onSelectTime,
}) => {
  const [showMonthView, setShowMonthView] = useState(false);
  const nextDays = getNextDays(14);
  const dateScrollRef = useRef<HTMLDivElement>(null);

  // Mês e Ano para visualização em grade
  const initialDateObj = selectedDate ? new Date(selectedDate + 'T12:00:00') : new Date();
  const [viewYear, setViewYear] = useState(initialDateObj.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDateObj.getMonth());

  const monthGrid = getCalendarGrid(viewYear, viewMonth);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  // Separação de horários por período
  const morningSlots = ALL_TIME_SLOTS.filter((t) => t < '12:30');
  const afternoonSlots = ALL_TIME_SLOTS.filter((t) => t >= '12:30' && t < '18:00');
  const eveningSlots = ALL_TIME_SLOTS.filter((t) => t >= '18:00');

  // Conta total de horários livres no dia selecionado
  const availableSlotsCount = ALL_TIME_SLOTS.filter(
    (time) =>
      isSlotAvailable(selectedDate, time, selectedBarberId, barbers, appointments).available
  ).length;

  return (
    <section id="section-calendar" aria-labelledby="section-calendar-title" className="space-y-3.5 scroll-mt-24">
      {/* Cabeçalho da Etapa 3 */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 id="section-calendar-title" className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-neutral-950 text-xs font-black shadow-sm">
              3
            </span>
            Data e Horário
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Escolha o melhor dia e horário livre na agenda
          </p>
        </div>

        {/* Botão para alternar entre Próximos Dias e Calendário Mensal */}
        <button
          id="btn-toggle-month-view"
          type="button"
          onClick={() => setShowMonthView(!showMonthView)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-900 border border-neutral-700/80 text-amber-400 hover:bg-neutral-800 active:scale-95 transition-all shrink-0"
        >
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>{showMonthView ? 'Ver Dias' : 'Ver Mês'}</span>
        </button>
      </div>

      {/* 1. VISUALIZAÇÃO: PRÓXIMOS DIAS (CARROSSEL DESLIZÁVEL NO MOBILE) */}
      {!showMonthView ? (
        <div className="relative">
          <div
            ref={dateScrollRef}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 snap-x snap-mandatory scroll-smooth -mx-1 px-1"
          >
            {nextDays.map((day) => {
              const isSelected = selectedDate === day.isoString;
              const isSunday = day.isSunday;

              return (
                <button
                  key={day.isoString}
                  id={`day-pill-${day.isoString}`}
                  type="button"
                  disabled={isSunday}
                  onClick={() => {
                    onSelectDate(day.isoString);
                    if (selectedTime) {
                      const avail = isSlotAvailable(
                        day.isoString,
                        selectedTime,
                        selectedBarberId,
                        barbers,
                        appointments
                      ).available;
                      if (!avail) onSelectTime('');
                    }
                  }}
                  className={`flex flex-col items-center justify-center min-w-[70px] sm:min-w-[80px] py-3 px-2 rounded-2xl border transition-all snap-start shrink-0 active:scale-95 ${
                    isSunday
                      ? 'opacity-40 cursor-not-allowed bg-neutral-900/30 border-neutral-800/40 text-neutral-500'
                      : isSelected
                      ? 'bg-amber-500 text-neutral-950 border-amber-400 font-bold shadow-lg shadow-amber-500/25 scale-[1.02]'
                      : 'bg-neutral-900/70 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-900'
                  }`}
                >
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider ${
                      isSelected ? 'text-neutral-900' : 'text-neutral-400'
                    }`}
                  >
                    {day.isToday ? 'Hoje' : day.isTomorrow ? 'Amanhã' : day.dayShort}
                  </span>
                  <span className="text-xl font-extrabold my-0.5 leading-none font-cinzel">
                    {day.dayNumber}
                  </span>
                  <span
                    className={`text-[10px] ${
                      isSelected ? 'text-neutral-900 font-bold' : 'text-neutral-400'
                    }`}
                  >
                    {isSunday ? 'Fechado' : day.monthShort}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* 2. VISUALIZAÇÃO: CALENDÁRIO MENSAL COMPLETO */
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-3.5 sm:p-4 animate-in fade-in duration-200 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-white font-cinzel">
              {MONTHS_PT[viewMonth]} {viewYear}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 active:scale-95 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 active:scale-95 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-neutral-400 mb-1.5">
            {DAYS_SHORT_PT.map((d, idx) => (
              <div key={idx} className={idx === 0 ? 'text-rose-400/80' : ''}>
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-xs">
            {monthGrid.map((cell, idx) => {
              const isSelected = selectedDate === cell.isoString;
              const isDisabled = cell.isPast || cell.isSunday || !cell.isCurrentMonth;
              const isToday = cell.isoString === toLocalIsoDate(new Date());

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    onSelectDate(cell.isoString);
                    if (selectedTime) {
                      const avail = isSlotAvailable(
                        cell.isoString,
                        selectedTime,
                        selectedBarberId,
                        barbers,
                        appointments
                      ).available;
                      if (!avail) onSelectTime('');
                    }
                  }}
                  className={`h-10 rounded-xl flex items-center justify-center font-bold transition-all active:scale-95 ${
                    isDisabled
                      ? 'opacity-25 cursor-not-allowed text-neutral-600'
                      : isSelected
                      ? 'bg-amber-500 text-neutral-950 font-black shadow-md'
                      : isToday
                      ? 'border border-amber-500/60 text-amber-400 bg-amber-500/10'
                      : 'hover:bg-neutral-800 text-neutral-200 bg-neutral-950/40'
                  }`}
                >
                  {cell.dayNumber}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* DIA SELECIONADO & STATUS DE HORÁRIOS LIVRES */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-3 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-neutral-300 font-medium truncate">
            <strong className="text-white">{formatFullDate(selectedDate)}</strong>
          </span>
        </div>
        <div className="shrink-0">
          {availableSlotsCount > 0 ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold text-[11px]">
              <CheckCircle2 className="w-3 h-3" />
              {availableSlotsCount} livres
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 font-bold text-[11px]">
              <XCircle className="w-3 h-3" />
              Lotado
            </span>
          )}
        </div>
      </div>

      {/* GRADE DE HORÁRIOS LIVRES ORGANIZADOS POR TURNO */}
      <div className="space-y-3.5 pt-1">
        {/* Turno da Manhã */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-semibold px-1">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Manhã (09h às 12h)</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {morningSlots.map((time) => {
              const { available, reason } = isSlotAvailable(
                selectedDate,
                time,
                selectedBarberId,
                barbers,
                appointments
              );
              const isSelected = selectedTime === time;

              return (
                <button
                  key={time}
                  id={`slot-${time.replace(':', '')}`}
                  type="button"
                  disabled={!available}
                  onClick={() => onSelectTime(time)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center min-h-[46px] active:scale-95 ${
                    !available
                      ? 'opacity-30 cursor-not-allowed bg-neutral-900/30 border-neutral-800/60 text-neutral-500 line-through'
                      : isSelected
                      ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/25 scale-[1.02]'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-200 hover:border-amber-500/50 hover:bg-neutral-800'
                  }`}
                >
                  <span className="text-xs leading-none">{time}</span>
                  <span
                    className={`text-[9px] font-medium tracking-tight mt-0.5 ${
                      isSelected
                        ? 'text-neutral-950 font-bold'
                        : available
                        ? 'text-emerald-400'
                        : 'text-neutral-600'
                    }`}
                  >
                    {available ? 'Livre' : reason === 'booked' ? 'Ocupado' : 'Indisp.'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Turno da Tarde */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-semibold px-1">
            <Sunset className="w-3.5 h-3.5 text-amber-500" />
            <span>Tarde (13h30 às 17h30)</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {afternoonSlots.map((time) => {
              const { available, reason } = isSlotAvailable(
                selectedDate,
                time,
                selectedBarberId,
                barbers,
                appointments
              );
              const isSelected = selectedTime === time;

              return (
                <button
                  key={time}
                  id={`slot-${time.replace(':', '')}`}
                  type="button"
                  disabled={!available}
                  onClick={() => onSelectTime(time)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center min-h-[46px] active:scale-95 ${
                    !available
                      ? 'opacity-30 cursor-not-allowed bg-neutral-900/30 border-neutral-800/60 text-neutral-500 line-through'
                      : isSelected
                      ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/25 scale-[1.02]'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-200 hover:border-amber-500/50 hover:bg-neutral-800'
                  }`}
                >
                  <span className="text-xs leading-none">{time}</span>
                  <span
                    className={`text-[9px] font-medium tracking-tight mt-0.5 ${
                      isSelected
                        ? 'text-neutral-950 font-bold'
                        : available
                        ? 'text-emerald-400'
                        : 'text-neutral-600'
                    }`}
                  >
                    {available ? 'Livre' : reason === 'booked' ? 'Ocupado' : 'Indisp.'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Turno da Noite */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-semibold px-1">
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
            <span>Noite (18h às 19h30)</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {eveningSlots.map((time) => {
              const { available, reason } = isSlotAvailable(
                selectedDate,
                time,
                selectedBarberId,
                barbers,
                appointments
              );
              const isSelected = selectedTime === time;

              return (
                <button
                  key={time}
                  id={`slot-${time.replace(':', '')}`}
                  type="button"
                  disabled={!available}
                  onClick={() => onSelectTime(time)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center min-h-[46px] active:scale-95 ${
                    !available
                      ? 'opacity-30 cursor-not-allowed bg-neutral-900/30 border-neutral-800/60 text-neutral-500 line-through'
                      : isSelected
                      ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/25 scale-[1.02]'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-200 hover:border-amber-500/50 hover:bg-neutral-800'
                  }`}
                >
                  <span className="text-xs leading-none">{time}</span>
                  <span
                    className={`text-[9px] font-medium tracking-tight mt-0.5 ${
                      isSelected
                        ? 'text-neutral-950 font-bold'
                        : available
                        ? 'text-emerald-400'
                        : 'text-neutral-600'
                    }`}
                  >
                    {available ? 'Livre' : reason === 'booked' ? 'Ocupado' : 'Indisp.'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
