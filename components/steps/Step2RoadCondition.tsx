import React from 'react';
import StepHeader from '../StepHeader';
import { RoadConditionData } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RoadIcon } from '../icons/RoadIcon';
import { AlertTriangleIcon } from '../icons/AlertTriangleIcon';

const LOS_LEVELS: { [key: number]: { label: string; color: string; description: string } } = {
  1: { label: 'A', color: '#10B981', description: 'Свободное движение' },
  2: { label: 'B', color: '#34D399', description: 'Стабильное движение' },
  3: { label: 'C', color: '#FBBF24', description: 'Стабильное движение, ограничения' },
  4: { label: 'D', color: '#F59E0B', description: 'Нестабильное движение' },
  5: { label: 'E', color: '#EF4444', description: 'Движение на пределе' },
  6: { label: 'F', color: '#DC2626', description: 'Затор' },
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color?: string }> = ({ icon, label, value, color = 'text-white' }) => (
    <div className="bg-slate-800/50 p-4 rounded-lg flex items-center gap-4 border border-slate-700/80">
        <div className={`p-3 rounded-full bg-slate-700/80 ${color}`}>{icon}</div>
        <div>
            <div className="text-sm text-slate-400">{label}</div>
            <div className="text-2xl font-bold">{value}</div>
        </div>
    </div>
);


const Step2RoadCondition: React.FC<{ analysisData: RoadConditionData | null, isProcessing: boolean }> = ({ analysisData, isProcessing }) => {
  const chartData = analysisData?.losDistribution
    .map(item => ({
      name: `LOS ${LOS_LEVELS[item.level]?.label || item.level}`,
      'Кол-во участков': item.count,
      color: LOS_LEVELS[item.level]?.color || '#8884d8',
    }))
    .filter(item => item['Кол-во участков'] > 0);

  const renderContent = () => {
    if (isProcessing) {
      return <div className="space-y-8 animate-pulse">
        <div className="h-24 bg-slate-800/60 rounded-xl w-full"></div>
        <div className="h-64 bg-slate-800/60 rounded-xl w-full"></div>
        <div className="h-48 bg-slate-800/60 rounded-xl w-full"></div>
      </div>;
    }

    if (!analysisData) {
      return <div className="text-center py-20 card-modern glow-border">
        <p className="text-slate-400">Ожидание завершения предыдущего шага...</p>
      </div>;
    }
    
    const totalSegments = analysisData.losDistribution.reduce((sum, item) => sum + item.count, 0);

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <StatCard icon={<RoadIcon className="w-6 h-6"/>} label="Всего проанализировано участков" value={totalSegments}/>
           <StatCard icon={<AlertTriangleIcon className="w-6 h-6"/>} label="Участков с высоким приоритетом" value={analysisData.highPrioritySegments.length} color="text-amber-400"/>
        </div>
         <div className="card-modern glow-border p-6">
          <h3 className="text-xl font-semibold mb-2 text-cyan-300">Распределение по уровню загруженности (LOS)</h3>
          <p className="text-slate-400 mb-6 text-sm">{analysisData.summary}</p>
          <div className="w-full h-[250px] sm:h-[300px]">
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2}/>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8"/>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem' }} cursor={{fill: 'rgba(100, 116, 139, 0.1)'}}/>
                <Legend />
                <Bar dataKey="Кол-во участков">
                  {chartData?.map((entry, index) => <Bar key={`cell-${index}`} dataKey="Кол-во участков" fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-modern glow-border p-6">
          <h3 className="text-xl font-semibold mb-4 text-cyan-300">Участки, требующие внимания</h3>
           <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                <tr>
                  <th scope="col" className="px-2 sm:px-6 py-3">ID</th>
                  <th scope="col" className="px-2 sm:px-6 py-3">Улица</th>
                  <th scope="col" className="px-2 sm:px-6 py-3">LOS</th>
                  <th scope="col" className="px-2 sm:px-6 py-3">Причина</th>
                </tr>
              </thead>
              <tbody>
                {analysisData.highPrioritySegments.map(segment => (
                  <tr key={segment.EdgeId} className="border-b border-slate-700/80 hover:bg-slate-800/50 transition-colors">
                    <td className="px-2 sm:px-6 py-4 font-mono">{segment.EdgeId}</td>
                    <td className="px-2 sm:px-6 py-4 font-medium">{segment.ST_NM_BASE}</td>
                    <td className="px-2 sm:px-6 py-4">
                      <span className="font-bold px-2 py-1 rounded-md text-sm" style={{backgroundColor: `${LOS_LEVELS[segment.CurLos]?.color}30`, color: LOS_LEVELS[segment.CurLos]?.color }}>
                        {LOS_LEVELS[segment.CurLos]?.label}
                      </span>
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
      <StepHeader stepId={2} />
      {renderContent()}
    </div>
  );
};

export default Step2RoadCondition;