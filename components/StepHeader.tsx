
import React from 'react';
import { STEPS } from '../constants';

interface StepHeaderProps {
  stepId: number;
}

const StepHeader: React.FC<StepHeaderProps> = ({ stepId }) => {
  const step = STEPS.find((s) => s.id === stepId);

  if (!step) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gradient-white">{step.name}</h2>
      <p className="text-slate-400 mt-2 max-w-2xl">{step.description}</p>
    </div>
  );
};

export default StepHeader;