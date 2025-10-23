import React from 'react';
import { STEPS } from '../constants';
import { RoadIcon } from './icons/RoadIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';


interface SidebarProps {
  activeStep: number;
  setActiveStep: (stepId: number) => void;
  completedSteps: number[];
  processingStep: number | null;
  isProcessing: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeStep, setActiveStep, completedSteps, processingStep, isProcessing }) => {
  return (
    <aside className="w-64 bg-slate-800/50 p-6 flex flex-col shrink-0 border-r border-slate-700">
      <div className="flex items-center gap-3 mb-8">
        <RoadIcon className="w-8 h-8 text-cyan-400" />
        <h1 className="text-xl font-bold text-white">
          Анализ Трафика
        </h1>
      </div>
      <nav>
        <ul className="space-y-1">
          {STEPS.map((step) => (
            <li key={step.id}>
              <button
                onClick={() => !isProcessing && setActiveStep(step.id)}
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
        <p>Демо-проект на основе Gemini</p>
        <p>&copy; 2024</p>
      </div>
    </aside>
  );
};