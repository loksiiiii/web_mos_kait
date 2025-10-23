import { GoogleGenAI } from "@google/genai";
import { 
    GEOJSON_ATTRIBUTE_DESCRIPTIONS, 
    ROAD_CONDITION_PROMPT,
    CONGESTION_ACCIDENT_PROMPT,
    TRAFFIC_FORECAST_PROMPT,
    RECOMMENDATIONS_PROMPT
} from '../constants';
import { CongestionAnalysisData, RoadConditionData, TrafficForecastData, RecommendationData } from "../types";

const MODEL_NAME = "gemini-2.5-flash";

const getGenAI = () => {
  if (!process.env.API_KEY) {
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const callGemini = async (prompt: string): Promise<any> => {
    const ai = getGenAI();
    if (!ai) {
        if (prompt.includes('"losDistribution"')) {
             return { summary: "API-ключ не предоставлен. Это пример ответа для оценки состояния.", losDistribution: [{level: 3, count: 2}, {level: 4, count: 8}, {level: 5, count: 5}, {level: 6, count: 1}], highPrioritySegments: [{EdgeId: 101, ST_NM_BASE: "Пример ул.", CurLos: 6, reason: "Критический уровень загруженности (затор)."}] };
        }
        if (prompt.includes('"highRiskSegments"')) {
            return { summary: "API-ключ не предоставлен. Это пример ответа для анализа загруженности.", highRiskSegments: [{EdgeId: 202, ST_NM_BASE: "Тестовый пр-т", CurLoad: 0.9, NewLoad: 1.2, Ovrld: true, reason: "Прогнозируется значительная перегрузка."}], keyStats: { totalProjectedOverload: 5, avgCurrentLoad: 0.75, avgProjectedLoad: 0.95 } };
        }
        if (prompt.includes('"peakHourForecast"')) {
            return { summary: "API-ключ не предоставлен. Это пример ответа для прогноза трафика.", peakHourForecast: { avgSpeedChangePercent: -15.5, newBottlenecks: 3 }, criticalSegments: [{EdgeId: 303, ST_NM_BASE: "Демо-шоссе", NewSpdU: 25.0, SpdDelAbs: -10.0}] };
        }
        // Fallback for recommendations
        return `**API-ключ не предоставлен. Ниже приведен пример ответа для этого шага:**

*   **Пример рекомендации:** Рекомендуется пересмотреть скоростной режим и оптимизировать работу светофоров.
`;
    }
    
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
        });
        
        let resultText = response.text;
        
        const expectsJson = prompt.toLowerCase().includes('json object');

        if (expectsJson) {
            if (resultText.startsWith('```json')) {
                resultText = resultText.substring(7, resultText.length - 3).trim();
            } else if (resultText.startsWith('```')) {
                resultText = resultText.substring(3, resultText.length - 3).trim();
            }
            try {
                return JSON.parse(resultText);
            } catch (e) {
                console.error("Failed to parse Gemini JSON response:", resultText, e);
                throw new Error("Не удалось разобрать JSON-ответ от ИИ.");
            }
        } else {
             if (resultText.startsWith('```markdown')) {
                resultText = resultText.substring(10, resultText.length - 3).trim();
            } else if (resultText.startsWith('```')) {
                resultText = resultText.substring(3, resultText.length - 3).trim();
            }
            return resultText;
        }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Не удалось получить ответ от ИИ. Пожалуйста, проверьте консоль.");
    }
};

const buildPrompt = (data: any[], taskPrompt: string) => `
    ${GEOJSON_ATTRIBUTE_DESCRIPTIONS}

    Вот данные проблемных участков в формате JSON:
    ${JSON.stringify(data, null, 2)}

    ЗАДАНИЕ:
    ${taskPrompt}
`;


export const analyzeRoadCondition = async (problematicEdges: any[]): Promise<RoadConditionData> => {
    const prompt = buildPrompt(problematicEdges, ROAD_CONDITION_PROMPT);
    return callGemini(prompt);
};

export const analyzeCongestionAndAccidents = async (problematicEdges: any[]): Promise<CongestionAnalysisData> => {
    const prompt = buildPrompt(problematicEdges, CONGESTION_ACCIDENT_PROMPT);
    return callGemini(prompt);
};

export const analyzeTrafficForecast = async (problematicEdges: any[]): Promise<TrafficForecastData> => {
    const prompt = buildPrompt(problematicEdges, TRAFFIC_FORECAST_PROMPT);
    return callGemini(prompt);
};

const formatRecommendationsToMarkdown = (data: RecommendationData): string => {
    let markdown = `### Общее резюме\n${data.summary}\n\n`;
    
    data.prioritized_recommendations.forEach(rec => {
        markdown += `#### ${rec.segment_name} (Приоритет: ${rec.priority})\n\n`;
        
        markdown += `**Проблемные области:**\n`;
        if (rec.problem_areas && rec.problem_areas.length > 0) {
            markdown += rec.problem_areas.map(area => `- ${area}`).join('\n');
        } else {
            markdown += `- _Нет данных_`;
        }
        markdown += `\n\n`;
        
        markdown += `**Рекомендации:**\n`;
        if (rec.recommendations && rec.recommendations.length > 0) {
            markdown += rec.recommendations.map(item => `- ${item}`).join('\n');
        } else {
            markdown += `- _Нет данных_`;
        }
        markdown += `\n\n---\n\n`;
    });
    
    return markdown;
};

export const generateRecommendations = async (
    problematicEdges: any[],
    roadConditionAnalysis: string,
    congestionAnalysis: string,
    trafficForecast: string
): Promise<string> => {
    let taskPrompt = RECOMMENDATIONS_PROMPT
        .replace('{roadConditionAnalysis}', roadConditionAnalysis)
        .replace('{congestionAnalysis}', congestionAnalysis)
        .replace('{trafficForecast}', trafficForecast);
    
    const prompt = buildPrompt(problematicEdges, taskPrompt);
    
    const recommendationData: RecommendationData | string = await callGemini(prompt);
    
    if (typeof recommendationData === 'string') {
        return recommendationData; 
    }

    if (typeof recommendationData !== 'object' || recommendationData === null || !recommendationData.prioritized_recommendations) {
        console.error("Received invalid data structure for recommendations:", recommendationData);
        return "### Ошибка\nНе удалось отформатировать полученные рекомендации. Структура данных неверна.";
    }
    
    return formatRecommendationsToMarkdown(recommendationData);
};