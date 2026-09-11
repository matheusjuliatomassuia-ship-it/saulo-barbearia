import React from 'react';
import { Star, Check, Sparkles, ShieldCheck, Scissors } from 'lucide-react';
import { Barber } from '../types';

interface BarberSelectorProps {
  barbers: Barber[];
  selectedBarberId: string;
  onSelectBarber: (barber: Barber) => void;
}

export const BarberSelector: React.FC<BarberSelectorProps> = ({
  barbers,
  selectedBarberId,
  onSelectBarber,
}) => {
  const barber = barbers[0];
  if (!barber) return null;

  const isSelected = selectedBarberId === barber.id || barbers.length === 1;

  return (
    <section id="section-barber" aria-labelledby="section-barber-title" className="space-y-3.5 scroll-mt-24">
      <div>
        <h2 id="section-barber-title" className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-neutral-950 text-xs font-black shadow-sm">
            2
          </span>
          Profissional
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          Atendimento exclusivo e personalizado com o barbeiro
        </p>
      </div>

      <div
        id={`barber-card-${barber.id}`}
        role="button"
        tabIndex={0}
        onClick={() => onSelectBarber(barber)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onSelectBarber(barber);
          }
        }}
        className="relative cursor-pointer rounded-2xl p-4 sm:p-5 transition-all duration-150 border text-left bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/20 border-amber-500/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30 active:scale-[0.99]"
      >
        <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-neutral-950 uppercase tracking-wider shadow-sm flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Atendimento Exclusivo
        </span>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative shrink-0">
              <img
                src={barber.avatar}
                alt={barber.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-amber-500/60 shadow-md shadow-amber-500/20"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center border-2 border-neutral-950 shadow">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-cinzel">
                  {barber.name}
                </h3>
                <span className="text-xs text-amber-400 font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30">
                  {barber.nickname}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                {barber.role}
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-xs">
                <div className="flex items-center text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="ml-1 text-xs font-bold">{barber.rating}</span>
                </div>
                <span className="text-neutral-500">•</span>
                <span className="text-neutral-400 text-[11px]">
                  {barber.reviewCount} avaliações 5 estrelas
                </span>
              </div>
            </div>
          </div>

          <div className="sm:text-right border-t sm:border-t-0 border-neutral-800/80 pt-3 sm:pt-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              Barbeiro Selecionado
            </span>
            <p className="text-[11px] text-neutral-400 mt-1">
              Todos os horários da agenda são dedicados a você
            </p>
          </div>
        </div>

        {/* Especialidades do Saulo */}
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-neutral-800/60">
          {barber.specialties.map((spec, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-lg text-xs bg-neutral-950/80 text-neutral-300 border border-neutral-800"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
