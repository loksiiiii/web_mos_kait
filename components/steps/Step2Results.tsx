import React from 'react';
import StepHeader from '../StepHeader';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';

interface Step2ResultsProps {
  problematicEdges: any[] | null;
  isProcessingRecommendations: boolean;
  recommendationsHtml: string;
}

const Step2Results: React.FC<Step2ResultsProps> = ({ problematicEdges, isProcessingRecommendations, recommendationsHtml }) => {
  if (!problematicEdges) {
    return (
      <div>
        <StepHeader stepId={2} />
        <div className="text-center py-20 bg-slate-800/50 rounded-lg border border-slate-700">
          <p className="text-slate-400">Пожалуйста, вернитесь к Шагу 1 и загрузите файл для анализа.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <StepHeader stepId={2} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Data */}
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
          <h3 className="text-xl font-semibold mb-4 text-cyan-300">
            Загруженные данные
          </h3>
          <div className="bg-slate-900/70 p-4 rounded-md min-h-[24rem] h-full border border-slate-700 flex flex-col items-center justify-center text-center">
            <CheckCircleIcon className="w-20 h-20 text-green-500 mb-4" />
            <p className="text-lg text-slate-300 font-semibold">Данные успешно обработаны</p>
            <p className="text-slate-400 mt-2">
              ИИ анализирует {problematicEdges.length} проблемных участков для генерации рекомендаций.
            </p>
          </div>
        </div>

        {/* Right Column: Recommendations */}
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
          <h3 className="text-xl font-semibold mb-4 text-cyan-300">
              Рекомендации от ИИ
          </h3>
          {isProcessingRecommendations && (
              <div className="space-y-4 animate-pulse">
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-700 rounded w-full"></div>
                  <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                  <div className="h-4 bg-slate-700 rounded w-4/5 mt-6"></div>
                  <div className="h-4 bg-slate-700 rounded w-full"></div>
              </div>
          )}
          {recommendationsHtml && (
              <div 
                className="prose prose-sm prose-slate prose-invert max-w-none min-h-[24rem] h-full overflow-auto" 
                dangerouslySetInnerHTML={{ __html: recommendationsHtml }} 
              />
          )}
        </div>
      </div>
    </div>
  );
};

export default Step2Results;
