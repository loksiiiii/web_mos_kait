import React from 'react';
import StepHeader from '../StepHeader';
import { CongestionAnalysisData } from '../../types';
import { TrendingUpIcon } from '../icons/TrendingUpIcon';
import { GaugeIcon } from '../icons/GaugeIcon';
import { AlertTriangleIcon } from '../icons/AlertTriangleIcon';

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; sub?: string; color?: string }> = ({ icon, label, value, sub, color = 'text-white' }) => (
    <div className="bg-slate-800/50 p-4 rounded-lg flex items-center gap-4 border border-slate-700/80">
        <div className={`p-3 rounded-full bg-slate-700/80 ${color}`}>{icon}</div>
        <div>
            <div className="text-sm text-slate-400">{label}</div>
            <div className="text-2xl font-bold">{value} <span className="text-base font-normal text-slate-400">{sub}</span></div>
        </div>
    </div>
);

const Step3Analysis: React.FC<{ analysisData: CongestionAnalysisData | null, isProcessing: boolean }> = ({ analysisData, isProcessing }) => {
  const renderContent = () => {
    if (isProcessing) {
      return <div className="space-y-8 animate-pulse">
        <div className="h-40 bg-slate-800/60 rounded-xl w-full"></div>
        <div className="h-64 bg-slate-800/60 rounded-xl w-full"></div>
      </div>;
    }
    if (!analysisData) {
      return <div className="text-center py-20 card-modern glow-border">
        <p className="text-slate-400">Ожидание завершения предыдущего шага...</p>
      </div>;
    }

    return (
      <div className="space-y-8">
        <div className="card-modern glow-border p-6">
            <h3 className="text-xl font-semibold mb-2 text-cyan-300">Ключевые показатели загруженности</h3>
            <p className="text-slate-400 mb-6 text-sm">{analysisData.summary}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={<GaugeIcon className="w-6 h-6"/>} label="Средняя текущая загрузка" value={`${(analysisData.keyStats.avgCurrentLoad * 100).toFixed(0)}%`}/>
                <StatCard icon={<TrendingUpIcon className="w-6 h-6"/>} label="Средняя прогнозная загрузка" value={`${(analysisData.keyStats.avgProjectedLoad * 100).toFixed(0)}%`} color="text-amber-400"/>
                <StatCard icon={<AlertTriangleIcon className="w-6 h-6"/>} label="Прогнозная перегрузка" value={analysisData.keyStats.totalProjectedOverload} sub="участков" color="text-red-400"/>
            </div>
        </div>
         <div className="card-modern glow-border p-6">
          <h3 className="text-xl font-semibold mb-4 text-cyan-300">Сегменты с высоким риском заторов</h3>
           <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                <tr>
                  <th scope="col" className="px-2 sm:px-6 py-3">Улица</th>
                  <th scope="col" className="px-2 sm:px-6 py-3 text-center">Текущая загр.</th>
                  <th scope="col" className="px-2 sm:px-6 py-3 text-center">Прогноз загр.</th>
                  <th scope="col" className="px-2 sm:px-6 py-3">Причина риска</th>
                </tr>
              </thead>
              <tbody>
                {analysisData.highRiskSegments.map(segment => (
                  <tr key={segment.EdgeId} className="border-b border-slate-700/80 hover:bg-slate-800/50 transition-colors">
                    <td className="px-2 sm:px-6 py-4 font-medium">{segment.ST_NM_BASE} <span className="font-mono text-xs text-slate-500">({segment.EdgeId})</span></td>
                    <td className="px-2 sm:px-6 py-4 text-center">{(segment.CurLoad * 100).toFixed(0)}%</td>
                    <td className={`px-2 sm:px-6 py-4 font-bold text-center ${segment.Ovrld ? 'text-red-400' : 'text-amber-400'}`}>
                        {(segment.NewLoad * 100).toFixed(0)}%
                    </td>
                    <td className="px-2 sm:px-6 py-4">{segment.reason}</td>
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
      <StepHeader stepId={3} />
      {renderContent()}
    </div>
  );
};

export default Step3Analysis;