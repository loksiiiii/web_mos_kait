import React from 'react';
import StepHeader from '../StepHeader';

interface RecommendationsProps {
  recommendationsHtml: string;
  isProcessing: boolean;
}

const Step5Recommendations: React.FC<RecommendationsProps> = ({ recommendationsHtml, isProcessing }) => {
  return (
    <div>
      <StepHeader stepId={5} />
       <div className="card-modern glow-border p-6">
        <h3 className="text-xl font-semibold mb-4 text-cyan-300">Итоговые рекомендации</h3>
        {isProcessing && (
          <div className="space-y-4 animate-pulse min-h-[20rem]">
            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
            <div className="h-4 bg-slate-700 rounded w-full"></div>
            <div className="h-4 bg-slate-700 rounded w-1/2"></div>
             <div className="h-4 bg-slate-700 rounded w-4/5 mt-6"></div>
            <div className="h-4 bg-slate-700 rounded w-full"></div>
          </div>
        )}
        {recommendationsHtml && (
          <div 
            className="prose prose-sm prose-slate prose-invert max-w-none min-h-[20rem]" 
            dangerouslySetInnerHTML={{ __html: recommendationsHtml }} 
          />
        )}
        {!isProcessing && !recommendationsHtml && (
            <div className="text-center py-20">
              <p className="text-slate-400">Ожидание завершения предыдущих шагов для генерации рекомендаций.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Step5Recommendations;