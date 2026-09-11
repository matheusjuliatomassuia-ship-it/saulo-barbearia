import React from 'react';
import { Scissors, User, Calendar, MessageCircle, Check } from 'lucide-react';

interface StepProgressBarProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  completedSteps: {
    service: boolean;
    barber: boolean;
    dateTime: boolean;
  };
}

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  currentStep,
  onStepClick,
  completedSteps,
}) => {
  const steps = [
    { id: 1, label: 'Serviço', shortLabel: 'Serviço', icon: Scissors, completed: completedSteps.service },
    { id: 2, label: 'Barbeiro', shortLabel: 'Barbeiro', icon: User, completed: completedSteps.barber },
    { id: 3, label: 'Data & Horário', shortLabel: 'Horário', icon: Calendar, completed: completedSteps.dateTime },
    { id: 4, label: 'Confirmação', shortLabel: 'WhatsApp', icon: MessageCircle, completed: false },
  ];

  return (
    <div className="w-full bg-neutral-900/90 border border-neutral-800 rounded-2xl p-2.5 sm:p-3 shadow-md">
      <div className="flex items-center justify-between gap-1.5 sm:gap-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isDone = step.completed && currentStep > step.id;
          const canClick = currentStep > step.id || (step.id === 1);

          return (
            <React.Fragment key={step.id}>
              <button
                type="button"
                id={`step-progress-btn-${step.id}`}
                disabled={!canClick && !isActive}
                onClick={() => canClick && onStepClick(step.id)}
                className={`flex-1 flex items-center justify-center sm:justify-start gap-2 py-2 px-2 sm:px-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20 ring-1 ring-amber-400'
                    : isDone
                    ? 'bg-neutral-800/80 text-emerald-400 border border-emerald-500/20 hover:bg-neutral-800 cursor-pointer'
                    : 'bg-neutral-950/40 text-neutral-500 border border-neutral-800/60 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-transform ${
                    isActive
                      ? 'bg-neutral-950 text-amber-400'
                      : isDone
                      ? 'bg-emerald-500 text-neutral-950'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.id}
                </div>

                <div className="hidden sm:block text-left min-w-0">
                  <div className={`text-[10px] uppercase font-bold tracking-wider leading-none ${
                    isActive ? 'text-neutral-900' : isDone ? 'text-emerald-400' : 'text-neutral-500'
                  }`}>
                    Passo {step.id}
                  </div>
                  <div className={`text-xs font-semibold truncate leading-tight mt-0.5 ${
                    isActive ? 'text-neutral-950 font-bold' : isDone ? 'text-white' : 'text-neutral-400'
                  }`}>
                    {step.label}
                  </div>
                </div>

                {/* Mobile label */}
                <span className="text-[11px] font-bold sm:hidden truncate">
                  {step.shortLabel}
                </span>
              </button>

              {idx < steps.length - 1 && (
                <div
                  className={`w-2 sm:w-4 h-[2px] rounded-full shrink-0 ${
                    currentStep > step.id ? 'bg-amber-500' : 'bg-neutral-800'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
