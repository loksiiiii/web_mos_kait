import React from 'react';
import StepHeader from '../StepHeader';
import { TrafficForecastData } from '../../types';
import { TrendingDownIcon } from '../icons/TrendingDownIcon';
import { AlertTriangleIcon } from '../icons/AlertTriangleIcon';


const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; sub?: string; color?: string }> = ({ icon, label, value, sub, color = 'text-white' }) => (
    <div className="bg-slate-800 p-6 rounded-lg flex items-center gap-4 border border-slate-700 text-center flex-col justify-center h-full">
        <div className={`p-3 rounded-full bg-slate-700 ${color}`}>{icon}</div>
        <div>
            <div className="text-3xl font-bold">{value} <span className="text-xl font-normal text-slate-400">{sub}</span></div>
            <div className="text-sm text-slate-400 mt-1">{label}</div>
        </div>
    </div>
);


const Step4Modeling: React.FC<{ analysisData: TrafficForecastData | null, isProcessing: boolean }> = ({ analysisData, isProcessing }) => {
  const renderContent = () => {
    if (isProcessing) {
      return <div className="space-y-4 animate-pulse min-h-[40rem]">
        <div className="h-24 bg-slate-700 rounded w-full"></div>
        <div className="h-64 bg-slate-700 rounded w-full"></div>
      </div>;
    }
    if (!analysisData) {
      return <div className="text-center py-20 bg-slate-800/50 rounded-lg border border-slate-700">
        <p className="text-slate-400">Ожидание завершения предыдущего шага...</p>
      </div>;
    }

    return (
        <div className="space-y-8">
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <h3 className="text-xl font-semibold mb-2 text-cyan-300">Прогноз на часы пик</h3>
                <p className="text-slate-400 mb-6 text-sm max-w-3xl">{analysisData.summary}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatCard 
                        icon={<TrendingDownIcon className="w-8 h-8"/>} 
                        label="Среднее снижение скорости" 
                        value={`${analysisData.peakHourForecast.avgSpeedChangePercent.toFixed(1)}%`}
                        color="text-red-400"
                    />
                    <StatCard 
                        icon={<AlertTriangleIcon className="w-8 h-8"/>} 
                        label="Потенциальных 'узких мест'" 
                        value={analysisData.peakHourForecast.newBottlenecks} 
                        sub="участков"
                        color="text-amber-400"
                    />
                </div>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h3 className="text-xl font-semibold mb-4 text-cyan-300">Наиболее критичные сегменты (прогноз)</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 uppercase bg-slate-800">
                    <tr>
                    <th scope="col" className="px-6 py-3">Улица</th>
                    <th scope="col" className="px-6 py-3 text-center">Прогноз. скорость (км/ч)</th>
                    <th scope="col" className="px-6 py-3 text-center">Падение скорости (км/ч)</th>
                    </tr>
                </thead>
                <tbody>
                    {analysisData.criticalSegments.map(segment => (
                    <tr key={segment.EdgeId} className="border-b border-slate-700 hover:bg-slate-800/50">
                        <td className="px-6 py-4 font-medium">{segment.ST_NM_BASE} <span className="font-mono text-xs text-slate-500">({segment.EdgeId})</span></td>
                        <td className="px-6 py-4 text-center font-semibold">{segment.NewSpdU.toFixed(1)}</td>
                        <td className="px-6 py-4 text-center font-bold text-red-400">
                           {segment.SpdDelAbs.toFixed(1)}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        </div>
    );
  };

  return (
    <div>
      <StepHeader stepId={4} />
      {renderContent()}
    </div>
  );
};

export default Step4Modeling;
