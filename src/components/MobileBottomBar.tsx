import React from 'react';
import { ChevronRight, ArrowRight, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';
import { Barber, Service } from '../types';
import { formatFullDate } from '../utils/dateUtils';

interface MobileBottomBarProps {
  selectedService: Service | null;
  selectedBarber: Barber | null;
  selectedDate: string;
  selectedTime: string;
  hasNameAndPhone: boolean;
  onContinue: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  selectedService,
  selectedBarber,
  selectedDate,
  selectedTime,
  hasNameAndPhone,
  onContinue,
  onSubmit,
  isSubmitting,
}) => {
  const isTimeSelected = Boolean(selectedDate && selectedTime);
  const isReadyToSubmit = isTimeSelected && hasNameAndPhone;

  return (
    <aside aria-label="Resumo e Ação do Agendamento" className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-800/90 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-2xl shadow-black sm:hidden">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        {/* Resumo compacto */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-white truncate max-w-[130px]">
              {selectedService ? selectedService.name : 'Selecione serviço'}
            </span>
            {selectedService && (
              <span className="font-extrabold text-amber-400 shrink-0">
                R$ {selectedService.price.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>

          <div className="text-[11px] text-neutral-400 truncate mt-0.5 flex items-center gap-1">
            {selectedTime ? (
              <span className="text-emerald-400 font-medium">
                {selectedDate ? formatFullDate(selectedDate).split(',')[0] : ''} às {selectedTime}
              </span>
            ) : (
              <span className="text-neutral-500 italic">Horário não selecionado</span>
            )}
            {selectedBarber && (
              <>
                <span>•</span>
                <span className="truncate">{selectedBarber.name.split(' ')[0]}</span>
              </>
            )}
          </div>
        </div>

        {/* Botão de Ação do Polegar */}
        <div className="shrink-0">
          {isReadyToSubmit ? (
            <button
              id="mobile-bottom-submit-btn"
              type="button"
              disabled={isSubmitting}
              onClick={onSubmit}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 active:scale-95 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  <span>Confirmar</span>
                </>
              )}
            </button>
          ) : !isTimeSelected ? (
            <button
              id="mobile-bottom-choose-time-btn"
              type="button"
              onClick={onContinue}
              className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 font-bold text-xs flex items-center gap-1 shadow-md shadow-amber-500/20 transition-all"
            >
              <span>Horário</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          ) : (
            <button
              id="mobile-bottom-fill-form-btn"
              type="button"
              onClick={onContinue}
              className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 font-bold text-xs flex items-center gap-1 shadow-md shadow-amber-500/20 transition-all"
            >
              <span>Dados</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
