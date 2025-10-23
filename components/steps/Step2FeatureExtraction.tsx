import React from 'react';
import StepHeader from '../StepHeader';
import type { ExtractedFeatures } from '../../types';

interface Step2FeatureExtractionProps {
  imagePreview: string;
  features: ExtractedFeatures | null;
}

const FeatureItem: React.FC<{ label: string; value: string | number; color?: string }> = ({ label, value, color = 'text-white' }) => (
  <div className="flex justify-between items-center py-3 border-b border-slate-700">
    <span className="text-slate-400">{label}</span>
    <span className={`font-semibold ${color}`}>{value}</span>
  </div>
);

const Step2FeatureExtraction: React.FC<Step2FeatureExtractionProps> = ({ imagePreview, features }) => {

  const getFeatureColor = (label: string, value: string) => {
    if (label === 'Состояние дороги' || label === 'Препятствия') {
        if (value === 'Плохое' || value === 'Ямы') return 'text-red-400';
        if (value === 'Удовлетворительное' || value === 'Мусор') return 'text-amber-400';
    }
    if (label === 'Разметка') {
        if (value === 'Стерта') return 'text-amber-400';
        if (value === 'Отсутствует') return 'text-red-400';
    }
    return 'text-green-400';
  };

  if (!imagePreview) {
    return (
      <div>
        <StepHeader stepId={2} />
        <div className="text-center py-20 bg-slate-800/50 rounded-lg border border-slate-700">
          <p className="text-slate-400">Пожалуйста, загрузите изображение на Шаге 1 для начала анализа.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <StepHeader stepId={2} />
      <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-cyan-300">Изображение для анализа</h3>
            <img 
              src={imagePreview}
              alt="Analyzed road" 
              className="rounded-lg w-full"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-cyan-300">Извлеченные признаки</h3>
            <div className="bg-slate-800 p-4 rounded-lg min-h-[220px]">
              {!features && (
                 <div className="space-y-4 animate-pulse pt-2">
                    <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-700 rounded w-full"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                    <div className="h-4 bg-slate-700 rounded w-4/5"></div>
                </div>
              )}
              {features && (
                <>
                  <FeatureItem label="Состояние дороги" value={features.roadCondition} color={getFeatureColor('Состояние дороги', features.roadCondition)} />
                  <FeatureItem label="Разметка" value={features.markings} color={getFeatureColor('Разметка', features.markings)} />
                  <FeatureItem label="Препятствия" value={features.obstacles} color={getFeatureColor('Препятствия', features.obstacles)} />
                  <FeatureItem label="Обнаружено ям" value={features.potholeCount} color={features.potholeCount > 0 ? 'text-red-400' : 'text-green-400'} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2FeatureExtraction;