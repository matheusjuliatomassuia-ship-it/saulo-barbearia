import React, { useState } from 'react';
import { Scissors, Sparkles, Crown, Eye, Flame, Check, Clock, Layers } from 'lucide-react';
import { Service } from '../types';

interface ServiceSelectorProps {
  services: Service[];
  selectedServiceId: string;
  onSelectService: (service: Service) => void;
}

const getServiceIcon = (iconName: string) => {
  switch (iconName) {
    case 'Scissors':
      return <Scissors className="w-5 h-5 text-amber-400" />;
    case 'Sparkles':
      return <Sparkles className="w-5 h-5 text-amber-400" />;
    case 'Crown':
      return <Crown className="w-5 h-5 text-amber-400" />;
    case 'Eye':
      return <Eye className="w-5 h-5 text-amber-400" />;
    case 'Flame':
      return <Flame className="w-5 h-5 text-amber-400" />;
    default:
      return <Scissors className="w-5 h-5 text-amber-400" />;
  }
};

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  services,
  selectedServiceId,
  onSelectService,
}) => {
  const [activeCategory, setActiveCategory] = useState<'todos' | 'corte' | 'barba' | 'combo'>('todos');

  const filteredServices = services.filter((s) => {
    if (activeCategory === 'todos') return true;
    return s.category === activeCategory;
  });

  return (
    <section id="section-service" aria-labelledby="section-service-title" className="space-y-3.5 scroll-mt-24">
      <div className="flex items-center justify-between">
        <div>
          <h2 id="section-service-title" className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-neutral-950 text-xs font-black shadow-sm">
              1
            </span>
            Escolha o Serviço
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Selecione o corte, barba ou combo que você deseja
          </p>
        </div>
      </div>

      {/* Categorias rápidas para navegação móvel com o polegar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'todos', label: 'Todos' },
          { id: 'corte', label: '✂️ Cabelo' },
          { id: 'barba', label: '🧔 Barba' },
          { id: 'combo', label: '🔥 Combos' },
        ].map((cat) => {
          const isCatActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 active:scale-95 ${
                isCatActive
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Lista de Cards de Serviços */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredServices.map((service) => {
          const isSelected = selectedServiceId === service.id;

          return (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              role="button"
              tabIndex={0}
              onClick={() => onSelectService(service)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectService(service);
                }
              }}
              className={`relative cursor-pointer rounded-2xl p-4 transition-all duration-150 border text-left flex flex-col justify-between active:scale-[0.98] ${
                isSelected
                  ? 'bg-neutral-900/95 border-amber-500 shadow-lg shadow-amber-500/15 ring-2 ring-amber-500/40'
                  : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/90'
              }`}
            >
              {service.popular && (
                <span className="absolute -top-2.5 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 uppercase tracking-wider shadow-sm">
                  Mais Pedido
                </span>
              )}

              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500/50'
                          : 'bg-neutral-800/80 border-neutral-700/60'
                      }`}
                    >
                      {getServiceIcon(service.iconName)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-tight">
                        {service.name}
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] text-neutral-400 mt-0.5">
                        <Clock className="w-3 h-3 text-neutral-500" />
                        <span>{service.durationMinutes} minutos</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-extrabold text-amber-400 block">
                      R$ {service.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2 mt-1">
                  {service.description}
                </p>
              </div>

              {/* Botão de seleção / status de toque no rodapé do card */}
              <div className="mt-3 pt-2.5 border-t border-neutral-800/60 flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-neutral-500">
                  {isSelected ? 'Selecionado' : 'Toque para escolher'}
                </span>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-neutral-950 font-bold'
                      : 'border border-neutral-700 bg-neutral-950'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
