import React, { useState } from 'react';
import { Scissors, Star, MessageCircle, MapPin, Info } from 'lucide-react';
import { BARBERSHOP_INFO } from '../data/barbershopData';
import { ShopInfoModal } from './ShopInfoModal';

export const Header: React.FC = () => {
  const [showShopInfo, setShowShopInfo] = useState(false);

  return (
    <>
      <header className="border-b border-neutral-800/80 bg-neutral-900/95 backdrop-blur-md sticky top-0 z-30 transition-all pt-[env(safe-area-inset-top,0px)]">
        <div className="max-w-5xl mx-auto px-3.5 sm:px-6 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-2">
            {/* Logo, Nome e Indicador de Aberto */}
            <button
              type="button"
              onClick={() => setShowShopInfo(true)}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
              title="Toque para ver endereço e horários"
            >
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full p-0.5 bg-gradient-to-br from-amber-400 via-amber-600 to-amber-700 shadow-lg shadow-amber-500/20 shrink-0 group-hover:scale-105 transition-transform overflow-hidden border border-amber-300/40">
                <img
                  src={BARBERSHOP_INFO.logo || '/saulo_profile_logo.jpg'}
                  alt={BARBERSHOP_INFO.name}
                  className="w-full h-full object-cover rounded-full bg-neutral-900"
                  onError={(e) => {
                    // Fallback visual caso a imagem falhe
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base sm:text-lg font-bold tracking-tight text-white font-cinzel leading-none">
                    {BARBERSHOP_INFO.name}
                  </h1>
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    {BARBERSHOP_INFO.rating}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-1">
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Aberto até 20h
                  </span>
                  <span className="text-neutral-600 hidden xs:inline">•</span>
                  <span className="text-neutral-400 text-[10px] underline decoration-neutral-600 hidden xs:inline">
                    Ver endereço
                  </span>
                </div>
              </div>
            </button>

            {/* Ações do Cliente: Localização e WhatsApp Direto */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowShopInfo(true)}
                className="hidden xs:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white hover:border-neutral-700 active:scale-95 transition"
                title="Informações da barbearia"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Onde Estamos</span>
              </button>

              <a
                href={`https://wa.me/${BARBERSHOP_INFO.phone}?text=${encodeURIComponent('Olá! Gostaria de tirar uma dúvida sobre agendamento.')}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Falar no WhatsApp"
                className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 active:scale-95 text-xs font-bold flex items-center gap-1.5 transition shrink-0"
              >
                <MessageCircle className="w-4 h-4 fill-emerald-400/20" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Modal de informações detalhadas da Barbearia para o Cliente */}
      <ShopInfoModal isOpen={showShopInfo} onClose={() => setShowShopInfo(false)} />
    </>
  );
};
