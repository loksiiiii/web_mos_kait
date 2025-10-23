import React, { useCallback, useState } from 'react';
import { UploadIcon } from '../icons/UploadIcon';
import { RoadIcon } from '../icons/RoadIcon';

interface Step1DataPrepProps {
  onFileSelect: (file: File) => void;
  onDemoSelect: () => void;
  isProcessing: boolean;
  fileName: string | null;
}

const Step1DataPrep: React.FC<Step1DataPrepProps> = ({ onFileSelect, onDemoSelect, isProcessing, fileName }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (isProcessing) return;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const onDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (isProcessing) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, [isProcessing]);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (isProcessing) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, [isProcessing]);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (isProcessing) return;
    e.preventDefault();
    e.stopPropagation();
  }, [isProcessing]);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (isProcessing) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [isProcessing, onFileSelect]);


  return (
    <div className="space-y-8">
        <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gradient-white">Шаг 1: Загрузка и анализ данных</h2>
            <p className="text-slate-400 mt-2">Запустите анализ на демо-данных или загрузите свой файл GeoJSON.</p>
        </div>
      <div className="card-modern glow-border p-6 sm:p-8">
        
        <button
            onClick={onDemoSelect}
            disabled={isProcessing}
            className={`w-full flex items-center justify-center gap-3 text-lg font-bold py-4 px-6 rounded-lg transition duration-300 mb-6 transform hover:scale-[1.02] ${isProcessing ? 'bg-slate-600 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 shadow-lg shadow-cyan-600/20 hover:shadow-cyan-500/30'} text-white`}
        >
            <RoadIcon className="w-6 h-6"/>
            {isProcessing ? 'Обработка...' : 'Использовать демо-данные'}
        </button>

        <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-700"></div>
            <span className="flex-shrink mx-4 text-slate-500 text-sm font-medium">ИЛИ</span>
            <div className="flex-grow border-t border-slate-700"></div>
        </div>
        
        <div 
          className={`relative p-6 rounded-lg border-2 border-dashed ${isDragging ? 'border-cyan-400 bg-slate-800/50 glow-cyan-subtle' : 'border-slate-700'} ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''} transition-all duration-300 flex flex-col items-center justify-center text-center mt-6`}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <UploadIcon className="w-10 h-10 text-slate-500 mb-3" />
          <h3 className="font-semibold mb-1 text-slate-300">Загрузите свой GeoJSON файл</h3>
          <p className="text-slate-400 text-sm mb-4">
            Перетащите файл сюда или нажмите, чтобы выбрать
          </p>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".geojson,.json"
            onChange={(e) => handleFileChange(e.target.files)}
            disabled={isProcessing}
          />
          <label 
            htmlFor="file-upload"
            className={`cursor-pointer bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 text-sm ${isProcessing ? 'bg-slate-700 hover:bg-slate-700 cursor-not-allowed' : ''}`}
          >
            Выбрать файл
          </label>
           {fileName && !isProcessing && (
              <p className="text-sm text-green-400 mt-4 animate-pulse">Активные данные: {fileName}</p>
           )}
        </div>
      </div>
    </div>
  );
};

export default Step1DataPrep;