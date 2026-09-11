import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Phone,
  MessageCircle,
  CheckCircle,
  XCircle,
  DollarSign,
  Users,
  Filter,
  RefreshCw,
  Plus,
  Scissors,
  Search,
  Check,
} from 'lucide-react';
import { Appointment, Barber, BarbershopInfo, Service } from '../types';
import { formatFullDate, toLocalIsoDate } from '../utils/dateUtils';
import { getWhatsAppUrl } from '../utils/whatsappUtils';

interface BarberDashboardProps {
  appointments: Appointment[];
  barbers: Barber[];
  services: Service[];
  barbershop: BarbershopInfo;
  onUpdateStatus: (id: string, status: 'confirmado' | 'concluido' | 'cancelado') => void;
  onResetData: () => void;
  onSwitchToBooking: () => void;
}

export const BarberDashboard: React.FC<BarberDashboardProps> = ({
  appointments,
  barbers,
  services,
  barbershop,
  onUpdateStatus,
  onResetData,
  onSwitchToBooking,
}) => {
  const todayIso = toLocalIsoDate(new Date());

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowIso = toLocalIsoDate(tomorrow);

  const [dateFilter, setDateFilter] = useState<'today' | 'tomorrow' | 'all'>('today');
  const [selectedBarberFilter, setSelectedBarberFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtra agendamentos
  const filteredAppointments = appointments.filter((app) => {
    if (dateFilter === 'today' && app.date !== todayIso) return false;
    if (dateFilter === 'tomorrow' && app.date !== tomorrowIso) return false;

    if (selectedBarberFilter !== 'all' && app.barberId !== selectedBarberFilter) return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchName = app.clientName.toLowerCase().includes(term);
      const matchPhone = app.clientPhone.includes(term);
      const matchCode = app.code.toLowerCase().includes(term);
      if (!matchName && !matchPhone && !matchCode) return false;
    }

    return true;
  });

  const activeBookings = filteredAppointments.filter((a) => a.status !== 'cancelado');
  const totalRevenue = activeBookings.reduce((sum, a) => sum + a.servicePrice, 0);
  const completedCount = filteredAppointments.filter((a) => a.status === 'concluido').length;

  return (
    <div className="space-y-4 animate-in fade-in duration-200 pb-16">
      {/* CABEÇALHO DO PAINEL */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-neutral-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight font-cinzel">
              Painel de Agendamentos
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Admin
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Gerencie horários marcados e envie mensagens no WhatsApp
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetData}
            title="Restaurar dados demo"
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white text-xs flex items-center gap-1.5 active:scale-95 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden xs:inline text-[11px]">Resetar Demo</span>
          </button>

          <button
            type="button"
            onClick={onSwitchToBooking}
            className="px-3 py-2 rounded-xl bg-amber-500 text-neutral-950 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition shadow-sm"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Novo Agendamento</span>
          </button>
        </div>
      </div>

      {/* CARDS DE MÉTRICAS COMPACTAS NO MOBILE */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-2.5 text-center">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block">Agendados</span>
          <span className="text-lg font-black text-white font-cinzel">{activeBookings.length}</span>
        </div>
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-2.5 text-center">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block">Concluídos</span>
          <span className="text-lg font-black text-emerald-400 font-cinzel">{completedCount}</span>
        </div>
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-2.5 text-center">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block">Faturamento</span>
          <span className="text-base sm:text-lg font-black text-amber-400 font-cinzel">
            R$ {totalRevenue.toFixed(0)}
          </span>
        </div>
      </div>

      {/* FILTROS RÁPIDOS PARA O POLEGAR */}
      <div className="space-y-2">
        {/* Abas de data (Hoje, Amanhã, Todos) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'today', label: 'Hoje' },
            { id: 'tomorrow', label: 'Amanhã' },
            { id: 'all', label: 'Todos os Dias' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setDateFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 ${
                dateFilter === tab.id
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Barra de busca e filtro de barbeiro */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por cliente, telefone ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <select
            value={selectedBarberFilter}
            onChange={(e) => setSelectedBarberFilter(e.target.value)}
            aria-label="Filtrar por profissional"
            className="px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">Todos os Barbeiros</option>
            {barbers.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* LISTA DE AGENDAMENTOS (CARDS TOUCH-FRIENDLY) */}
      <div className="space-y-2.5">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12 bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6">
            <Scissors className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-neutral-300">Nenhum agendamento encontrado</p>
            <p className="text-xs text-neutral-500 mt-1">
              Tente mudar os filtros de data ou crie um novo agendamento.
            </p>
          </div>
        ) : (
          filteredAppointments.map((app) => {
            const isConfirmed = app.status === 'confirmado';
            const isConcluded = app.status === 'concluido';
            const isCancelled = app.status === 'cancelado';

            // Link WhatsApp para chamar o cliente diretamente do celular
            const clientChatUrl = getWhatsAppUrl(
              app.clientPhone,
              `Olá ${app.clientName}! Aqui é da ${barbershop.name}, sobre seu agendamento de ${app.serviceName} no dia ${formatFullDate(app.date)} às ${app.time}.`
            );

            return (
              <div
                key={app.id}
                className={`bg-neutral-900/80 border rounded-2xl p-3.5 space-y-3 transition-all ${
                  isCancelled
                    ? 'border-neutral-800/40 opacity-50 bg-neutral-950/40'
                    : isConcluded
                    ? 'border-neutral-800 bg-neutral-900/50'
                    : 'border-neutral-800 hover:border-amber-500/40'
                }`}
              >
                {/* Linha superior: Hora, Código, Status */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 font-mono">
                      {app.time}
                    </span>
                    <span className="text-xs font-semibold text-neutral-300">
                      {formatFullDate(app.date).split(',')[0]}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-neutral-500">{app.code}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isConfirmed
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : isConcluded
                          ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>

                {/* Linha do meio: Cliente, Serviço, Barbeiro */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-neutral-400" />
                      {app.clientName}
                    </h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {app.serviceName} • <strong className="text-neutral-300">{app.barberName}</strong>
                    </p>
                    {app.notes && (
                      <p className="text-[11px] text-amber-400/90 italic mt-1 bg-neutral-950/60 p-1.5 rounded-lg border border-neutral-800">
                        Obs: "{app.notes}"
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-extrabold text-amber-400">
                      R$ {app.servicePrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                {/* Linha inferior: Ações rápidas (WhatsApp e Troca de Status) */}
                <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                  {/* Botão de WhatsApp direto com o cliente */}
                  <a
                    href={clientChatUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  {/* Ações de status */}
                  <div className="flex items-center gap-1.5">
                    {isConfirmed && (
                      <>
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(app.id, 'concluido')}
                          className="px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-emerald-400 text-xs font-semibold flex items-center gap-1 active:scale-95 transition"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Concluir</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(app.id, 'cancelado')}
                          className="px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-rose-400 text-xs font-semibold active:scale-95 transition"
                        >
                          Cancelar
                        </button>
                      </>
                    )}
                    {isCancelled && (
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(app.id, 'confirmado')}
                        className="px-2.5 py-1.5 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold active:scale-95 transition"
                      >
                        Reativar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
