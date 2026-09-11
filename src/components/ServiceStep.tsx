import React, { useState } from 'react';
import {
  Scissors,
  Sparkles,
  Crown,
  Eye,
  Flame,
  Check,
  Clock,
  ArrowRight,
  Plus,
  Layers,
  X,
} from 'lucide-react';
import { Service } from '../types';

interface ServiceStepProps {
  services: Service[];
  selectedService: Service;
  onSelectService: (service: Service) => void;
  onContinue: () => void;
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

// Itens base que podem ser combinados no combo personalizado
const COMBO_ITEMS = [
  { id: 'corte', name: 'Corte de Cabelo', price: 50.0, durationMinutes: 40, icon: Scissors },
  { id: 'barba', name: 'Barba', price: 40.0, durationMinutes: 35, icon: Sparkles },
  { id: 'sobrancelha', name: 'Sobrancelha', price: 20.0, durationMinutes: 15, icon: Eye },
  { id: 'hidratacao', name: 'Hidratação', price: 30.0, durationMinutes: 25, icon: Flame },
];

export const ServiceStep: React.FC<ServiceStepProps> = ({
  services,
  selectedService,
  onSelectService,
  onContinue,
}) => {
  // Estado para montagem de combo customizado (inicia com todas as opções desativadas)
  const [customComboItemIds, setCustomComboItemIds] = useState<string[]>([]);
  const isCustomComboActive = selectedService?.id === 'custom-combo';
  const isAnyComboSelected = selectedService?.id === 'custom-combo' || selectedService?.category === 'combo';

  const handleRemoveCombo = () => {
    // Desativa todas as opções do combo
    setCustomComboItemIds([]);
    // Reverte para o primeiro serviço individual (Corte de Cabelo padrão)
    const singleService = services.find((s) => s.id === 'corte') || services.find((s) => s.category !== 'combo') || services[0];
    onSelectService(singleService);
  };

  const toggleComboItem = (id: string) => {
    setCustomComboItemIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      if (updated.length > 0) {
        applyCustomCombo(updated);
      } else {
        // Se desmarcou tudo, reverte para serviço individual
        const singleService = services.find((s) => s.id === 'corte') || services.find((s) => s.category !== 'combo') || services[0];
        onSelectService(singleService);
      }
      return updated;
    });
  };

  const applyCustomCombo = (selectedIds: string[]) => {
    if (selectedIds.length === 0) return;

    const selectedItems = COMBO_ITEMS.filter((item) => selectedIds.includes(item.id));
    const rawSum = selectedItems.reduce((acc, item) => acc + item.price, 0);
    const totalDuration = selectedItems.reduce((acc, item) => acc + item.durationMinutes, 0);

    // Desconto progressivo no combo personalizado (R$ 10 de desconto se 2 itens, R$ 15 se 3+, ou preço mínimo justo)
    let discount = 0;
    if (selectedItems.length >= 3) {
      discount = 15;
    } else if (selectedItems.length === 2) {
      discount = 10;
    }

    const finalPrice = Math.max(rawSum - discount, 20);
    const namesList = selectedItems.map((i) => i.name).join(' + ');

    const customComboService: Service = {
      id: 'custom-combo',
      name: `Combo Personalizado (${namesList})`,
      category: 'combo',
      description: `Seu combo exclusivo: ${namesList}. Desconto especial aplicado de R$ ${discount.toFixed(2).replace('.', ',')}.`,
      price: finalPrice,
      durationMinutes: totalDuration,
      iconName: 'Crown',
    };

    onSelectService(customComboService);
  };

  const selectedComboItems = COMBO_ITEMS.filter((i) => customComboItemIds.includes(i.id));
  const rawSum = selectedComboItems.reduce((acc, i) => acc + i.price, 0);
  const discountAmount = selectedComboItems.length >= 3 ? 15 : selectedComboItems.length === 2 ? 10 : 0;
  const customComboPrice = selectedComboItems.length > 0 ? Math.max(rawSum - discountAmount, 20) : 0;
  const customComboDuration = selectedComboItems.reduce((acc, i) => acc + i.durationMinutes, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* CABEÇALHO DA ETAPA 1 */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 mb-1.5">
          <span>Passo 1 de 4</span>
          <span>•</span>
          <span>Escolha do Serviço</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-cinzel">
          Qual serviço você deseja realizar?
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Selecione uma das opções principais ou monte seu próprio combo personalizado abaixo.
        </p>
      </div>

      {/* 1. SERVIÇOS PRINCIPAIS */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
          <Scissors className="w-3.5 h-3.5 text-amber-400" />
          Serviços Individuais & Combos Prontos
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {services.map((service) => {
            const isSelected = selectedService?.id === service.id;

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
                    ? 'bg-neutral-900/95 border-amber-500 shadow-lg shadow-amber-500/20 ring-2 ring-amber-500/50'
                    : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/90'
                }`}
              >
                {service.popular && (
                  <span className="absolute -top-2.5 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 uppercase tracking-wider shadow-sm">
                    Mais Pedido
                  </span>
                )}

                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
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
                        <h4 className="text-sm font-bold text-white tracking-tight">
                          {service.name}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] text-neutral-400 mt-0.5">
                          <Clock className="w-3 h-3 text-neutral-500" />
                          <span>{service.durationMinutes} min</span>
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

                {/* Status no rodapé do card */}
                <div className="mt-3 pt-2.5 border-t border-neutral-800/60 flex items-center justify-between text-xs">
                  <span className={`text-[11px] font-medium ${isSelected ? 'text-amber-400 font-bold' : 'text-neutral-500'}`}>
                    {isSelected ? '✓ Selecionado' : 'Toque para escolher'}
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
      </div>

      {/* 2. ÁREA EXCLUSIVA: MONTE SEU COMBO PERSONALIZADO */}
      <div className={`rounded-2xl border p-4 sm:p-5 transition-all ${
        isCustomComboActive
          ? 'bg-neutral-900/95 border-amber-500 ring-2 ring-amber-500/50 shadow-xl shadow-amber-500/10'
          : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-neutral-800">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider mb-1">
              <Layers className="w-3 h-3" />
              Monte do seu jeito
            </div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Combo Personalizado (Cabelo + Sobrancelha + Barba e etc.)
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Marque os serviços abaixo para montar a sua combinação com desconto especial
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              id="btn-header-remove-combo"
              onClick={handleRemoveCombo}
              className="px-3 py-2 rounded-xl text-xs font-bold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-all shrink-0 active:scale-95 flex items-center gap-1.5"
              title="Não aplicar combo e manter apenas o corte individual"
            >
              <X className="w-3.5 h-3.5 text-red-400" />
              <span>Não Aplicar combo</span>
            </button>

            <button
              type="button"
              disabled={customComboItemIds.length === 0}
              onClick={() => applyCustomCombo(customComboItemIds)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 flex items-center gap-1.5 ${
                customComboItemIds.length === 0
                  ? 'bg-neutral-800/60 text-neutral-500 border border-neutral-800 cursor-not-allowed'
                  : isCustomComboActive
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20 ring-1 ring-amber-400'
                  : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700 hover:text-white border border-neutral-700'
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>
                {customComboItemIds.length === 0
                  ? 'Selecione os Itens'
                  : isCustomComboActive
                  ? 'Combo Selecionado'
                  : 'Usar este Combo'}
              </span>
            </button>
          </div>
        </div>

        {/* Caixas de seleção para montar o combo */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
          {COMBO_ITEMS.map((item) => {
            const isChecked = customComboItemIds.includes(item.id);
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleComboItem(item.id)}
                className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between active:scale-95 ${
                  isChecked
                    ? 'bg-amber-500/15 border-amber-500/70 text-white shadow-sm'
                    : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isChecked ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                    isChecked ? 'bg-amber-500 border-amber-500 text-neutral-950' : 'border-neutral-700 bg-neutral-900'
                  }`}>
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-white truncate">{item.name}</div>
                  <div className="flex items-center justify-between mt-1 text-[11px]">
                    <span className="text-neutral-400">{item.durationMinutes} min</span>
                    <span className="font-bold text-amber-400">R$ {item.price.toFixed(0)}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Resumo dinâmico do combo personalizado */}
        <div className="mt-4 pt-3 border-t border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950/60 p-3 rounded-xl">
          <div className="text-xs space-y-0.5">
            {selectedComboItems.length === 0 ? (
              <>
                <div className="text-neutral-400 font-medium">
                  Nenhum serviço marcado no combo personalizado
                </div>
                <div className="text-neutral-500 text-[11px]">
                  Toque nas opções acima caso queira montar e combinar serviços com desconto
                </div>
              </>
            ) : (
              <>
                <div className="text-neutral-300 font-medium">
                  Itens selecionados ({selectedComboItems.length}):{' '}
                  <span className="text-white font-bold">{selectedComboItems.map((i) => i.name).join(', ')}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-400 text-[11px]">
                  <span>Tempo total: ~{customComboDuration} min</span>
                  {discountAmount > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">
                        Economia de R$ {discountAmount.toFixed(2).replace('.', ',')}
                      </span>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            {selectedComboItems.length > 0 && (
              <div className="text-right">
                {discountAmount > 0 && (
                  <span className="text-xs text-neutral-500 line-through mr-1.5">
                    R$ {rawSum.toFixed(2).replace('.', ',')}
                  </span>
                )}
                <span className="text-lg font-black text-amber-400">
                  R$ {customComboPrice.toFixed(2).replace('.', ',')}
                </span>
              </div>
            )}

            <button
              type="button"
              id="btn-footer-apply-combo"
              disabled={customComboItemIds.length === 0}
              onClick={() => applyCustomCombo(customComboItemIds)}
              className={`px-4 py-2 rounded-xl font-bold text-xs shadow-sm transition active:scale-95 flex items-center gap-1.5 ${
                customComboItemIds.length === 0
                  ? 'bg-neutral-800/60 text-neutral-500 border border-neutral-800 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400 text-neutral-950'
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Aplicar Combo</span>
            </button>
          </div>
        </div>
      </div>

      {/* BARRA INFERIOR DE CONTINUAÇÃO DA ETAPA 1 */}
      <div className="sticky bottom-3 z-20 bg-neutral-900/95 backdrop-blur-md border border-neutral-800 p-3.5 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
              Serviço Selecionado
            </span>
            {isAnyComboSelected && (
              <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold uppercase">
                Combo Ativo
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm font-bold text-white truncate max-w-[260px] sm:max-w-md">
              {selectedService ? selectedService.name : 'Nenhum serviço selecionado'}
            </span>
            {selectedService && (
              <span className="text-xs font-black text-amber-400 shrink-0">
                R$ {selectedService.price.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          id="btn-continue-step-1"
          disabled={!selectedService}
          onClick={onContinue}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shrink-0 ${
            selectedService
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 shadow-lg shadow-amber-500/20'
              : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
          }`}
        >
          <span>Avançar para Barbeiro (Passo 2)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
