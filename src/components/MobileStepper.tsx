import React from 'react';
import { Scissors, User, Calendar, CheckCircle, Check } from 'lucide-react';

interface MobileStepperProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  completedSteps: {
    service: boolean;
    barber: boolean;
    dateTime: boolean;
    client: boolean;
  };
}

export const MobileStepper: React.FC<MobileStepperProps> = ({
  currentStep,
  onStepClick,
  completedSteps,
}) => {
  const steps = [
    { id: 1, label: 'Serviço', anchor: 'section-service', icon: Scissors, completed: completedSteps.service },
    { id: 2, label: 'Barbeiro', anchor: 'section-barber', icon: User, completed: completedSteps.barber },
    { id: 3, label: 'Horário', anchor: 'section-calendar', icon: Calendar, completed: completedSteps.dateTime },
    { id: 4, label: 'Dados', anchor: 'section-form', icon: CheckCircle, completed: completedSteps.client },
  ];

  const handleStepClick = (stepId: number, anchor: string) => {
    onStepClick(stepId);
    const element = document.getElementById(anchor);
    if (element) {
      const yOffset = -80; // Offset para o header fixo
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-[61px] z-20 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800/80 -mx-4 px-4 py-2 sm:hidden">
      <div className="flex items-center justify-between gap-1.5">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isDone = step.completed;

          return (
            <React.Fragment key={step.id}>
              <button
                type="button"
                id={`mobile-step-${step.id}`}
                onClick={() => handleStepClick(step.id, step.anchor)}
                className={`flex-1 flex flex-col items-center py-1.5 px-1 rounded-xl transition-all ${
                  isActive
                    ? 'bg-amber-500/15 border border-amber-500/40 text-amber-400'
                    : isDone
                    ? 'text-emerald-400 bg-neutral-900/60 border border-emerald-500/20'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive
                        ? 'bg-amber-500 text-neutral-950 shadow-sm shadow-amber-500/30'
                        : isDone
                        ? 'bg-emerald-500 text-neutral-950'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {isDone && !isActive ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>
                </div>
                <span className="text-[10px] font-medium mt-1 leading-tight truncate w-full text-center">
                  {step.label}
                </span>
              </button>

              {idx < steps.length - 1 && (
                <div
                  className={`w-2.5 h-[1.5px] rounded-full shrink-0 ${
                    steps[idx].completed && steps[idx + 1].completed
                      ? 'bg-emerald-500'
                      : steps[idx].completed
                      ? 'bg-amber-500/50'
                      : 'bg-neutral-800'
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
