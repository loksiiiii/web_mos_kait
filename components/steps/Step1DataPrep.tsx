import React, { useCallback, useState } from 'react';
import { UploadIcon } from '../icons/UploadIcon';

interface Step1DataPrepProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  fileName: string | null;
}

const Step1DataPrep: React.FC<Step1DataPrepProps> = ({ onFileSelect, isProcessing, fileName }) => {
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
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Шаг 1: Загрузка и анализ данных GeoJSON</h2>
            <p className="text-slate-400 mt-2">Загрузите файл GeoJSON для поиска проблемных участков и генерации рекомендаций.</p>
        </div>
      <div 
        className={`bg-slate-800/50 p-6 rounded-lg border-2 border-dashed ${isDragging ? 'border-cyan-400' : 'border-slate-700'} ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''} transition-all duration-300 flex flex-col items-center justify-center text-center`}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <UploadIcon className="w-12 h-12 sm:w-16 sm:h-16 text-slate-500 mb-4" />
        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-cyan-300">Загрузите GeoJSON файл</h3>
        <p className="text-slate-400 mb-4">
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
          className={`cursor-pointer bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ${isProcessing ? 'bg-slate-600 hover:bg-slate-600 cursor-not-allowed' : ''}`}
        >
          {isProcessing ? 'Обработка...' : 'Выбрать файл'}
        </label>
         <p className="text-xs text-slate-500 mt-4">Поддерживаемые форматы: .geojson, .json</p>
         {fileName && !isProcessing && (
            <p className="text-sm text-green-400 mt-4">Загружен файл: {fileName}</p>
         )}
      </div>
    </div>
  );
};

export default Step1DataPrep;
