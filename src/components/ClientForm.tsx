import React from 'react';
import { User, Phone, FileText, CheckCircle, ShieldCheck, MessageCircle, ArrowRight } from 'lucide-react';
import { Barber, Service } from '../types';
import { formatFullDate } from '../utils/dateUtils';
import { maskPhoneBR } from '../utils/whatsappUtils';

interface ClientFormProps {
  name: string;
  phone: string;
  notes: string;
  selectedService: Service | null;
  selectedBarber: Barber | null;
  selectedDate: string;
  selectedTime: string;
  onChangeName: (name: string) => void;
  onChangePhone: (phone: string) => void;
  onChangeNotes: (notes: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export const ClientForm: React.FC<ClientFormProps> = ({
  name,
  phone,
  notes,
  selectedService,
  selectedBarber,
  selectedDate,
  selectedTime,
  onChangeName,
  onChangePhone,
  onChangeNotes,
  onSubmit,
  isSubmitting,
}) => {
  const digitsOnly = phone.replace(/\D/g, '');
  const isPhoneValid = digitsOnly.length >= 10;
  const isNameValid = name.trim().length >= 3;
  const canSubmit = isNameValid && isPhoneValid && selectedService && selectedDate && selectedTime;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const masked = maskPhoneBR(raw);
    onChangePhone(masked);
  };

  return (
    <section id="section-form" aria-labelledby="section-form-title" className="space-y-3.5 scroll-mt-24 pb-20 sm:pb-6">
      <div>
        <h2 id="section-form-title" className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-neutral-950 text-xs font-black shadow-sm">
            4
          </span>
          Seus Dados para Contato
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          Informe seu nome e WhatsApp para receber o lembrete e confirmação
        </p>
      </div>

      <form onSubmit={onSubmit} className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Nome Completo */}
          <div className="space-y-1.5">
            <label htmlFor="client-name-input" className="block text-xs font-bold text-neutral-300">
              Nome Completo <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <User className="w-4 h-4" />
              </div>
              <input
                id="client-name-input"
                type="text"
                autoComplete="name"
                required
                placeholder="Ex: Carlos Oliveira"
                value={name}
                onChange={(e) => onChangeName(e.target.value)}
                className="w-full pl-10 pr-3.5 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-base sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors min-h-[48px]"
              />
            </div>
            {name.length > 0 && !isNameValid && (
              <p className="text-[11px] text-amber-400/90 font-medium">Por favor, digite seu nome e sobrenome.</p>
            )}
          </div>

          {/* WhatsApp */}
          <div className="space-y-1.5">
            <label htmlFor="client-phone-input" className="block text-xs font-bold text-neutral-300">
              WhatsApp (com DDD) <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="client-phone-input"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                placeholder="(11) 98765-4321"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={15}
                className="w-full pl-10 pr-3.5 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-base sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors min-h-[48px]"
              />
            </div>
            {phone.length > 0 && !isPhoneValid && (
              <p className="text-[11px] text-amber-400/90 font-medium">Digite o DDD + número do seu celular.</p>
            )}
          </div>
        </div>

        {/* Observações / Preferências (Opcional) */}
        <div className="space-y-1.5">
          <label htmlFor="client-notes-input" className="block text-xs font-medium text-neutral-400">
            Observações ou preferências <span className="text-neutral-500 text-[10px]">(opcional)</span>
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3.5 pointer-events-none text-neutral-500">
              <FileText className="w-4 h-4" />
            </div>
            <textarea
              id="client-notes-input"
              rows={2}
              placeholder="Ex: Corte navalhado, pele sensível, levar referência..."
              value={notes}
              onChange={(e) => onChangeNotes(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-base sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Resumo do Agendamento antes de confirmar */}
        {selectedService && selectedDate && selectedTime && (
          <div className="bg-neutral-950 border border-neutral-800/90 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between border-b border-neutral-800/60 pb-2 text-xs">
              <span className="text-neutral-400">Serviço:</span>
              <span className="font-bold text-white text-right">{selectedService.name}</span>
            </div>
            <div className="flex items-center justify-between border-b border-neutral-800/60 pb-2 text-xs">
              <span className="text-neutral-400">Barbeiro:</span>
              <span className="font-semibold text-neutral-200">
                {selectedBarber ? selectedBarber.name : 'Primeiro livre'}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-neutral-800/60 pb-2 text-xs">
              <span className="text-neutral-400">Data e Hora:</span>
              <span className="font-semibold text-emerald-400">
                {formatFullDate(selectedDate)} às {selectedTime}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 text-sm font-bold">
              <span className="text-neutral-300">Valor Total:</span>
              <span className="text-amber-400 text-base">
                R$ {selectedService.price.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        )}

        {/* Garantia & Notificação WhatsApp */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
          <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Ao confirmar, você receberá a <strong>confirmação instantânea com comprovante</strong> e a barbearia será notificada automaticamente no WhatsApp.
          </p>
        </div>

        {/* Botão Principal de Conclusão */}
        <button
          id="btn-confirm-appointment"
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-lg min-h-[50px] active:scale-[0.98] ${
            !canSubmit || isSubmitting
              ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700/50'
              : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-neutral-950 shadow-emerald-500/25 border border-emerald-400/40'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
              <span>Concluindo Agendamento...</span>
            </>
          ) : (
            <>
              <MessageCircle className="w-4 h-4 fill-neutral-950 text-neutral-950" />
              <span>Concluir e Confirmar no WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </section>
  );
};
