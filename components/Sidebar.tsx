import React from 'react';
import { STEPS } from '../constants';
import { RoadIcon } from './icons/RoadIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { XIcon } from './icons/XIcon';


interface SidebarProps {
  activeStep: number;
  setActiveStep: (stepId: number) => void;
  completedSteps: number[];
  processingStep: number | null;
  isProcessing: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeStep, setActiveStep, completedSteps, processingStep, isProcessing, isOpen, setIsOpen }) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/80 z-30 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      ></div>

      <aside className={`fixed inset-y-0 left-0 bg-slate-800/95 backdrop-blur-sm p-6 flex flex-col shrink-0 border-r border-slate-700 w-64 z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between gap-3 mb-8">
            <div className="hidden md:flex items-center gap-3">
              <RoadIcon className="w-8 h-8 text-cyan-400" />
              <h1 className="text-xl font-bold text-white">
                Анализ Трафика
              </h1>
            </div>
            <span className="md:hidden text-lg font-bold text-white">Меню</span>
            <button 
              onClick={() => setIsOpen(false)}
              className="md:hidden p-1 -mr-2 text-slate-400 hover:text-white"
              aria-label="Закрыть меню"
            >
              <XIcon className="w-6 h-6" />
            </button>
        </div>
        <nav>
          <ul className="space-y-1">
            {STEPS.map((step) => (
              <li key={step.id}>
                <button
                  onClick={() => {
                    if (!isProcessing) {
                      setActiveStep(step.id);
                      setIsOpen(false);
                    }
                  }}
                  disabled={isProcessing}
                  className={`w-full text-left p-3 rounded-lg transition-colors duration-200 flex items-center justify-between ${
                    activeStep === step.id
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                  } ${isProcessing ? 'cursor-not-allowed' : ''}`}
                >
                  <div className="flex-grow">
                    <span className="font-semibold">{step.name}</span>
                    <p className="text-xs mt-1">{step.description}</p>
                  </div>
                  <div className="w-5 h-5 ml-2 flex-shrink-0">
                    {completedSteps.includes(step.id) && processingStep !== step.id && (
                      <CheckCircleIcon className="w-5 h-5 text-green-400" />
                    )}
                    {processingStep === step.id && (
                      <SpinnerIcon className="w-5 h-5 text-cyan-400" />
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto text-center text-xs text-slate-500">
          <p>&copy; 2025</p>
        </div>
      </aside>
    </>
  );
};
