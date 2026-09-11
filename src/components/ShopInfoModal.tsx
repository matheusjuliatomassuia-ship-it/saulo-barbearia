import React from 'react';
import { X, MapPin, Clock, Phone, MessageCircle, Instagram, ShieldCheck, Star } from 'lucide-react';
import { BARBERSHOP_INFO } from '../data/barbershopData';

interface ShopInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShopInfoModal: React.FC<ShopInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl z-10 space-y-5 animate-in slide-in-from-bottom duration-300">
        {/* Puxador para mobile */}
        <div className="w-12 h-1.5 bg-neutral-700 rounded-full mx-auto -mt-2 mb-2 sm:hidden" />

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-neutral-950 font-bold border border-amber-400/40 shrink-0">
              <span className="font-cinzel text-lg">SB</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-cinzel">
                {BARBERSHOP_INFO.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-0.5">
                <span className="flex items-center text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <strong className="ml-1">{BARBERSHOP_INFO.rating}</strong>
                </span>
                <span>•</span>
                <span>{BARBERSHOP_INFO.reviewCount} avaliações no Google</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Informações detalhadas */}
        <div className="space-y-3 text-xs">
          <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Localização</p>
                <p className="text-neutral-400 mt-0.5 leading-relaxed">{BARBERSHOP_INFO.address}</p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(BARBERSHOP_INFO.name + ' ' + BARBERSHOP_INFO.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-1 text-amber-400 underline font-medium hover:text-amber-300"
                >
                  Abrir no Google Maps ↗
                </a>
              </div>
            </div>

            <div className="border-t border-neutral-800/60 pt-2.5 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Horário de Funcionamento</p>
                <p className="text-neutral-400 mt-0.5">Segunda a Sábado: 09:00 às 20:00</p>
                <p className="text-neutral-500 text-[11px]">Domingos e Feriados: Fechado</p>
              </div>
            </div>

            <div className="border-t border-neutral-800/60 pt-2.5 flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">WhatsApp Oficial</p>
                <p className="text-amber-400 font-mono font-semibold mt-0.5">{BARBERSHOP_INFO.displayPhone}</p>
              </div>
            </div>
          </div>

          {/* Botões de Ação Rápida */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <a
              href={`https://wa.me/${BARBERSHOP_INFO.phone}?text=${encodeURIComponent('Olá! Gostaria de tirar uma dúvida sobre agendamento.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-3 rounded-xl bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600/30 text-emerald-400 font-semibold flex items-center justify-center gap-2 transition text-center"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`tel:+${BARBERSHOP_INFO.phone}`}
              className="py-3 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold flex items-center justify-center gap-2 transition text-center"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Ligar Agora</span>
            </a>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold rounded-xl text-xs transition"
        >
          Voltar ao Agendamento
        </button>
      </div>
    </div>
  );
};
