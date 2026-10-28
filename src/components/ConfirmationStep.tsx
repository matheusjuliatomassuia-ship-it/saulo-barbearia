import { supabase } from '../supabaseClient';
import React from 'react';
import {
  User,
  Phone,
  FileText,
  CheckCircle2,
  ShieldCheck,
  MessageCircle,
  ArrowLeft,
  ArrowRight,
  Scissors,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Barber, Service } from '../types';
import { formatFullDate } from '../utils/dateUtils';
import { maskPhoneBR } from '../utils/whatsappUtils';
import { BARBERSHOP_INFO } from '../data/barbershopData';

interface ConfirmationStepProps {
  name: string;
  phone: string;
  notes: string;
  selectedService: Service;
  selectedBarber: Barber;
  selectedDate: string;
  selectedTime: string;
  onChangeName: (name: string) => void;
  onChangePhone: (phone: string) => void;
  onChangeNotes: (notes: string) => void;
  onBack: () => void;
  onSubmit: (e?: React.FormEvent) => void;
  isSubmitting: boolean;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
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
  onBack,
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

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (canSubmit && !isSubmitting) {
      if (supabase) {
        try {
          await supabase
            .from('agendamentos')
            .insert([
              {
                codigo: 'AG' + Math.floor(1000 + Math.random() * 9000),
                cliente_nome: name.trim() || 'Cliente',
                cliente_phone: phone || '',
                servico: selectedService ? selectedService.name : 'Serviço',
                profissional: selectedBarber ? selectedBarber.name : 'Barbeiro',
                data_agendamento: selectedDate || new Date().toISOString().split('T')[0],
                horario: selectedTime || '',
                duracao_minutos: selectedService ? selectedService.durationMinutes : 30,
                valor: selectedService ? selectedService.price : 0,
                observacao: notes ? notes.trim() : ''
              }
            ]);
        } catch (err) {
          console.warn('Erro ao salvar no Supabase (prosseguindo com WhatsApp):', err);
        }
      }

      onSubmit(e);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* CABEÇALHO DA ETAPA 4 */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 mb-1.5">
          <span>Passo 4 de 4</span>
          <span>•</span>
          <span>Confirmação & WhatsApp</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-cinzel">
          Confirmação do Pedido
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Revise os detalhes do seu pedido, informe seus dados e conclua enviando para o WhatsApp.
        </p>
      </div>

      {/* 1. RESUMO COMPLETO DO PEDIDO */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <h3 className="text-xs uppercase tracking-wider font-extrabold text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            Resumo do Agendamento
          </h3>
          <span className="text-xs text-neutral-400 font-mono">{BARBERSHOP_INFO.name}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          {/* Serviço */}
          <div className="bg-neutral-950/70 border border-neutral-800/80 p-3 rounded-xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <Scissors className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Serviço:</span>
              <span className="text-sm font-bold text-white block mt-0.5">{selectedService.name}</span>
              <span className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3 text-neutral-500" />
                Duração estimada: ~{selectedService.durationMinutes} minutos
              </span>
            </div>
          </div>

          {/* Barbeiro */}
          <div className="bg-neutral-950/70 border border-neutral-800/80 p-3 rounded-xl flex items-start gap-3">
            <img
              src={selectedBarber.avatar}
              alt={selectedBarber.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-lg object-cover border border-amber-500/50 shadow-sm shrink-0 mt-0.5"
            />
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Barbeiro:</span>
              <span className="text-sm font-bold text-white block mt-0.5">{selectedBarber.name}</span>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3" />
                Atendimento Exclusivo Saulo
              </span>
            </div>
          </div>

          {/* Data e Horário */}
          <div className="bg-neutral-950/70 border border-neutral-800/80 p-3 rounded-xl flex items-start gap-3 sm:col-span-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Data & Horário:</span>
                <span className="text-sm font-bold text-white block mt-0.5">
                  {formatFullDate(selectedDate)}
                </span>
                <span className="text-xs text-amber-400 font-bold">às {selectedTime}</span>
              </div>
              <div className="sm:text-right border-t sm:border-t-0 border-neutral-800 pt-2 sm:pt-0">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Valor a pagar no local:</span>
                <span className="text-xl font-black text-amber-400">
                  R$ {selectedService.price.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FORMULÁRIO DO CLIENTE */}
      <form onSubmit={handleSubmitForm} className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
        <h3 className="text-xs uppercase tracking-wider font-extrabold text-neutral-300 flex items-center gap-1.5">
          <User className="w-4 h-4 text-amber-400" />
          Seus Dados para Contato
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Nome Completo */}
          <div className="space-y-1.5">
            <label htmlFor="step4-client-name" className="block text-xs font-bold text-neutral-300">
              Nome Completo <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <User className="w-4 h-4" />
              </div>
              <input
                id="step4-client-name"
                type="text"
                autoComplete="name"
                required
                placeholder="Ex: Carlos Oliveira"
                value={name}
                onChange={(e) => onChangeName(e.target.value)}
                className="w-full pl-10 pr-3.5 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors min-h-[48px]"
              />
            </div>
            {name.length > 0 && !isNameValid && (
              <p className="text-[11px] text-amber-400/90 font-medium">Por favor, digite seu nome e sobrenome.</p>
            )}
          </div>

          {/* WhatsApp */}
          <div className="space-y-1.5">
            <label htmlFor="step4-client-phone" className="block text-xs font-bold text-neutral-300">
              WhatsApp com DDD <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="step4-client-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                placeholder="(11) 98765-4321"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={15}
                className="w-full pl-10 pr-3.5 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors min-h-[48px]"
              />
            </div>
            {phone.length > 0 && !isPhoneValid && (
              <p className="text-[11px] text-amber-400/90 font-medium">Digite o DDD + número do seu WhatsApp.</p>
            )}
          </div>
        </div>

        {/* Observações / Preferências (Opcional) */}
        <div className="space-y-1.5">
          <label htmlFor="step4-client-notes" className="block text-xs font-medium text-neutral-400">
            Observações ou preferências <span className="text-neutral-500 text-[10px]">(opcional)</span>
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3.5 pointer-events-none text-neutral-500">
              <FileText className="w-4 h-4" />
            </div>
            <textarea
              id="step4-client-notes"
              rows={2}
              placeholder="Ex: Corte navalhado na zero, cabelo crespo, pele sensível..."
              value={notes}
              onChange={(e) => onChangeNotes(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors resize-none"
            />
          </div>
        </div>

        {/* BOX INFORMATIVO DO WHATSAPP */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-300">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <MessageCircle className="w-4 h-4" />
          </div>
          <div className="leading-relaxed">
            <p className="font-bold text-emerald-200">Envio Automático via WhatsApp</p>
            <p className="text-[11px] text-emerald-300/80 mt-0.5">
              Ao concluir, você receberá o comprovante digital e será direcionado para o WhatsApp com a mensagem formatada pronta para envio à <strong>{BARBERSHOP_INFO.name}</strong>.
            </p>
          </div>
        </div>

        {/* BOTÕES DE NAVEGAÇÃO / CONCLUSÃO */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-neutral-800 bg-neutral-950/70 hover:bg-neutral-800 text-neutral-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition active:scale-95 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Horário</span>
          </button>

          <button
            id="btn-submit-step-4"
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className={`w-full flex-1 py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all duration-200 shadow-xl min-h-[50px] active:scale-[0.98] ${
              !canSubmit || isSubmitting
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700/50'
                : 'bg-gradient-to-r from-emerald-500 via-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-neutral-950 shadow-emerald-500/25 border border-emerald-400/40 cursor-pointer'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                <span>Gerando Comprovante e WhatsApp...</span>
              </>
            ) : (
              <>
                <MessageCircle className="w-5 h-5 fill-neutral-950 text-neutral-950" />
                <span>Concluir e Enviar pelo WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
