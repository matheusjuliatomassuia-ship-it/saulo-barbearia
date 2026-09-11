import React from 'react';
import { Star, Check, Sparkles, ShieldCheck, ArrowRight, ArrowLeft, Scissors, Clock } from 'lucide-react';
import { Barber, Service } from '../types';

interface BarberStepProps {
  barber: Barber;
  selectedService: Service;
  onBack: () => void;
  onContinue: () => void;
}

export const BarberStep: React.FC<BarberStepProps> = ({
  barber,
  selectedService,
  onBack,
  onContinue,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* CABEÇALHO DA ETAPA 2 */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 mb-1.5">
          <span>Passo 2 de 4</span>
          <span>•</span>
          <span>Profissional Responsável</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-cinzel">
          Seleção do Barbeiro
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Confira o profissional responsável pelo seu atendimento personalizado.
        </p>
      </div>

      {/* LEMBRETE DO SERVIÇO SELECIONADO NO PASSO 1 */}
      {selectedService && (
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block leading-none">
                Serviço Selecionado no Passo 1:
              </span>
              <span className="text-sm font-bold text-white mt-0.5 block truncate">
                {selectedService.name}
              </span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-sm font-black text-amber-400 block">
              R$ {selectedService.price.toFixed(2).replace('.', ',')}
            </span>
            <span className="text-[11px] text-neutral-400 flex items-center gap-1 justify-end">
              <Clock className="w-3 h-3" />
              {selectedService.durationMinutes} min
            </span>
          </div>
        </div>
      )}

      {/* CARD PRINCIPAL DO BARBEIRO SAULO */}
      <div
        id={`barber-card-${barber.id}`}
        className="relative rounded-3xl p-5 sm:p-6 border bg-gradient-to-b from-neutral-900 via-neutral-900 to-amber-950/20 border-amber-500 shadow-xl shadow-amber-500/15 ring-2 ring-amber-500/40 text-left"
      >
        <span className="absolute -top-3 right-5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-amber-500 text-neutral-950 uppercase tracking-wider shadow-md flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          Atendimento Exclusivo
        </span>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={barber.avatar}
                alt={barber.name}
                referrerPolicy="no-referrer"
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-500 shadow-lg shadow-amber-500/25"
              />
              <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center border-2 border-neutral-950 shadow">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-white font-cinzel tracking-tight">
                  {barber.name}
                </h3>
                <span className="text-xs font-bold text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30">
                  {barber.nickname || 'Master Barber'}
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-0.5">
                {barber.role}
              </p>
              <div className="flex items-center gap-2 mt-1.5 text-xs">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="ml-1 text-xs font-black">{barber.rating}</span>
                </div>
                <span className="text-neutral-600">•</span>
                <span className="text-neutral-400 text-xs">
                  {barber.reviewCount} avaliações 5 estrelas
                </span>
              </div>
            </div>
          </div>

          <div className="bg-neutral-950/80 border border-neutral-800 rounded-2xl p-3 sm:text-right">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              Barbeiro Oficial
            </span>
            <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
              Atendimento com toalha quente, navalha e padrão profissional.
            </p>
          </div>
        </div>

        {/* Especialidades */}
        <div className="mt-5 pt-4 border-t border-neutral-800/80">
          <span className="text-[11px] uppercase font-bold text-neutral-400 tracking-wider block mb-2">
            Especialidades & Habilidades:
          </span>
          <div className="flex flex-wrap gap-2">
            {barber.specialties.map((spec, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-xl text-xs bg-neutral-950/90 text-neutral-200 border border-neutral-800 font-medium"
              >
                ✂️ {spec}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* BOTÕES DE NAVEGAÇÃO DA ETAPA 2 */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-4 sm:px-6 py-3 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 font-bold text-xs sm:text-sm flex items-center gap-2 transition active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar aos Serviços</span>
        </button>

        <button
          type="button"
          id="btn-continue-step-2"
          onClick={onContinue}
          className="px-6 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition active:scale-95"
        >
          <span>Avançar para Data e Horário (Passo 3)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
