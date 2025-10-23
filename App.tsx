import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import Step1DataPrep from './components/steps/Step1DataPrep';
import Step2RoadCondition from './components/steps/Step2RoadCondition';
import Step3Analysis from './components/steps/Step3Analysis';
import Step4Modeling from './components/steps/Step4Modeling';
import Step5Recommendations from './components/steps/Step5Recommendations';
import Step6Visualization from './components/steps/Step6Visualization';
import { 
  analyzeRoadCondition,
  analyzeCongestionAndAccidents,
  analyzeTrafficForecast,
  generateRecommendations
} from './services/geminiService';
import { marked } from 'marked';
import { CongestionAnalysisData, RoadConditionData, TrafficForecastData } from './types';
import { MenuIcon } from './components/icons/MenuIcon';
import { RoadIcon } from './components/icons/RoadIcon';

const App: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [processingStep, setProcessingStep] = useState<number | null>(null);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [problematicEdges, setProblematicEdges] = useState<any[] | null>(null);
  
  // State for each analysis step
  const [roadConditionData, setRoadConditionData] = useState<RoadConditionData | null>(null);
  const [congestionAnalysisData, setCongestionAnalysisData] = useState<CongestionAnalysisData | null>(null);
  const [trafficForecastData, setTrafficForecastData] = useState<TrafficForecastData | null>(null);
  const [recommendationsHtml, setRecommendationsHtml] = useState<string>('');
  
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const resetState = () => {
    setActiveStep(1);
    setCompletedSteps([]);
    setProcessingStep(null);
    setUploadedFile(null);
    setProblematicEdges(null);
    setRoadConditionData(null);
    setCongestionAnalysisData(null);
    setTrafficForecastData(null);
    setRecommendationsHtml('');
    setError(null);
  };

  const handleFileSelect = useCallback(async (file: File) => {
    resetState();
    setUploadedFile(file);
    setProcessingStep(1);
    setError(null);

    try {
      const text = await file.text();
      const geojson = JSON.parse(text);

      if (!geojson.features || !Array.isArray(geojson.features)) {
        throw new Error('Неверный формат GeoJSON: отсутствует массив "features".');
      }

      const edges = geojson.features.filter(
        (feature: any) => feature?.properties?.PaintEdge === true
      );
      
      if (edges.length === 0) {
        throw new Error('В файле не найдено проблемных участков с параметром "PaintEdge": true.');
      }

      const propertiesOnly = edges.map(e => e.properties);
      setProblematicEdges(propertiesOnly);
      setCompletedSteps([1]);
      setActiveStep(2);

      // --- Step 2: Road Condition ---
      setProcessingStep(2);
      const roadConditionResult = await analyzeRoadCondition(propertiesOnly);
      setRoadConditionData(roadConditionResult);
      setCompletedSteps([1, 2]);
      setActiveStep(3);

      // --- Step 3: Congestion Analysis ---
      setProcessingStep(3);
      const congestionAnalysisResult = await analyzeCongestionAndAccidents(propertiesOnly);
      setCongestionAnalysisData(congestionAnalysisResult);
      setCompletedSteps([1, 2, 3]);
      setActiveStep(4);
      
      // --- Step 4: Traffic Forecast ---
      setProcessingStep(4);
      const trafficForecastResult = await analyzeTrafficForecast(propertiesOnly);
      setTrafficForecastData(trafficForecastResult);
      setCompletedSteps([1, 2, 3, 4]);
      setActiveStep(5);

      // --- Step 5: Recommendations ---
      setProcessingStep(5);
      const recommendationsText = await generateRecommendations(
        propertiesOnly,
        roadConditionResult.summary,
        congestionAnalysisResult.summary,
        trafficForecastResult.summary
      );
      setRecommendationsHtml(await marked.parse(recommendationsText));
      setCompletedSteps([1, 2, 3, 4, 5]);
      
    } catch (e: any) {
      console.error(e);
      if (e instanceof SyntaxError) {
        setError(`Ошибка разбора файла: убедитесь, что это валидный JSON. (${e.message})`);
      } else {
        setError(e.message || 'Произошла неизвестная ошибка.');
      }
      setActiveStep(1);
      setCompletedSteps([]);
    } finally {
      setProcessingStep(null);
    }
  }, []);
  
  const isProcessing = processingStep !== null;

  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return <Step1DataPrep onFileSelect={handleFileSelect} isProcessing={isProcessing} fileName={uploadedFile?.name || null} />;
      case 2:
        return <Step2RoadCondition analysisData={roadConditionData} isProcessing={processingStep === 2} />;
      case 3:
        return <Step3Analysis analysisData={congestionAnalysisData} isProcessing={processingStep === 3} />;
      case 4:
        return <Step4Modeling analysisData={trafficForecastData} isProcessing={processingStep === 4} />;
      case 5:
        return <Step5Recommendations recommendationsHtml={recommendationsHtml} isProcessing={processingStep === 5} />;
      case 6:
        return <Step6Visualization />;
      default:
         return <Step1DataPrep onFileSelect={handleFileSelect} isProcessing={isProcessing} fileName={uploadedFile?.name || null} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-200">
      <Sidebar
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        completedSteps={completedSteps}
        processingStep={processingStep}
        isProcessing={isProcessing}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <div className="md:pl-64 flex flex-col flex-1 min-h-screen">
        <header className="md:hidden flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-2">
                <RoadIcon className="w-6 h-6 text-cyan-400" />
                <h1 className="text-lg font-bold text-white">Анализ Трафика</h1>
            </div>
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-1 text-slate-400 hover:text-cyan-400"
                aria-label="Открыть меню"
            >
                <MenuIcon className="w-6 h-6" />
            </button>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {error && (
              <div className="bg-red-600/20 border border-red-500 text-red-300 p-4 rounded-lg shadow-lg flex items-start gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-800 flex items-center justify-center font-bold text-sm">!</div>
                <div className="flex-grow">
                  <p className="font-bold">Ошибка</p>
                  <p className="text-sm">{error}</p>
                </div>
                <button onClick={() => setError(null)} className="text-red-200 hover:text-white font-bold text-2xl leading-none">&times;</button>
              </div>
            )}
            {renderStep()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
