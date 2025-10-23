export const STEPS = [
  {
    id: 1,
    name: 'Шаг 1: Загрузка данных',
    description: 'Загрузите GeoJSON файл для анализа',
  },
  {
    id: 2,
    name: 'Шаг 2: Оценка состояния',
    description: 'ИИ оценивает состояние дорожного покрытия',
  },
  {
    id: 3,
    name: 'Шаг 3: Анализ загруженности',
    description: 'Анализ рисков ДТП и заторов',
  },
  {
    id: 4,
    name: 'Шаг 4: Прогноз трафика',
    description: 'Прогнозирование ситуации на дорогах',
  },
  {
    id: 5,
    name: 'Шаг 5: Рекомендации',
    description: 'Генерация предложений по улучшению',
  },
  {
    id: 6,
    name: 'Траффик движения в Москве',
    description: 'Интерактивная карта дорожной обстановки в реальном времени',
  },
];


export const GEOJSON_ATTRIBUTE_DESCRIPTIONS = `
You are an expert in transport modeling and urban planning. Analyze the provided GeoJSON data which contains problematic road segments.
Use the following data dictionary to understand the attributes of each road segment ('feature.properties'):

- **EdgeId**: (integer) Segment ID
- **ST_NAME**: (string) Street Name
- **ST_TYP_BEF**: (string) Street Type
- **ST_NM_BASE**: (string) Base Street Name
- **ST_NM_CITY**: (string) City Name
- **FUNC_CLASS**: (integer) Street Class (1-5)
- **ROAD_CATEG**: (string) Road Category (e.g., Arterial, Regional, Local)
- **RoadDirect**: (string) Traffic Direction (0 - closed, F - forward only, T - reverse only, Any - two-way)
- **speed_utro**: (double) Existing speed in the morning rush hour (km/h)
- **countInF**: (integer) Number of incoming lanes at the end of the segment
- **EdgesInF**: (string) Identifiers of incoming segments at the end
- **EdgesAlIF**: (string) Identifiers of all adjacent segments at the end
- **countInT**: (integer) Number of incoming lanes at the start of the segment
- **EdgesInT**: (string) Identifiers of incoming segments at the start
- **EdgesAlIT**: (string) Identifiers of all adjacent segments at the start
- **PedCross**: (string) Pedestrian crossing presence
- **CrossNameF**: (string) Name of intersecting street in the forward direction
- **CrossNameT**: (string) Name of intersecting street in the reverse direction
- **CntrlId**: (string) Traffic light ID
- **CntrlName**: (string) Traffic light name
- **Intens**: (integer) Existing traffic intensity on the segment (vehicles/hour)
- **Capacity**: (integer) Segment capacity (vehicles/hour)
- **CurLoad**: (double) Existing load factor (Intens / Capacity)
- **CrSpdCur**: (double) Existing speed based on CR-function (relative to current load)
- **Control**: (string) Indicates a regulated intersection
- **CrossRoad**: (string) Indicates an unregulated intersection
- **sectId**: (integer) Section identifier
- **Rbnd**: (integer) Number of lanes
- **MaxSpd**: (integer) Maximum allowed speed
- **AvgSpd**: (integer) Average speed
- **ExtrLdTot**: (string) Additional load on the segment from new developments (both directions)
- **CurLos**: (integer) Current Level of Service score for the segment
- **NewLoad**: (double) Projected load factor for the segment
- **Ovrld**: (boolean) Is the segment/street projected to be overloaded? (NewLoad > 1)
- **OvrldLoad**: (string) Projected overload factor (if NewLoad > 1)
- **NewLos**: (integer) Projected Level of Service score for the segment
- **ExtrLdRel**: (string) Delta of load factor in percent (%)
- **CrSpdNew**: (double) Projected speed from CR-function (relative to projected load)
- **NewSpdU**: (double) Projected speed in the morning rush hour
- **SpdDelAbs**: (double) Delta between projected and existing speed in km/h
- **SpdDelRel**: (string) Delta between projected and existing speed in percent (%)
- **PaintEdge**: (boolean) Flag to highlight this segment on a dashboard. The data you are receiving is pre-filtered by this flag being true, so these are all known problem areas.
- **RecomIT**: (string) Field for outputting recommended measures.

ВАЖНО: Для аналитических задач отвечай ТОЛЬКО валидным JSON объектом без какого-либо markdown форматирования (например, без \`\`\`json ... \`\`\`).
ВСЕГДА ДАВАЙ ТЕКСТОВЫЕ ПОЛЯ В JSON (например, 'summary' или 'reason') НА РУССКОМ ЯЗЫКЕ.
`;


export const ROAD_CONDITION_PROMPT = `
Based on the provided segment data, perform an assessment of the road condition. 
Focus on attributes like 'ROAD_CATEG', 'CurLos', 'NewLos'.
Provide the output as a JSON object with the following structure:
{
  "summary": "Краткое текстовое резюме общего состояния дорог на русском языке.",
  "losDistribution": [
    { "level": 1, "count": 0 },
    { "level": 2, "count": 0 },
    { "level": 3, "count": 0 },
    { "level": 4, "count": 0 },
    { "level": 5, "count": 0 },
    { "level": 6, "count": 0 }
  ],
  "highPrioritySegments": [
    {
      "EdgeId": 123,
      "ST_NM_BASE": "улица",
      "CurLos": 5,
      "reason": "Краткое объяснение на русском, почему этот сегмент требует внимания."
    }
  ]
}
Aggregate counts for each 'CurLos' level in 'losDistribution'. List up to 5 most critical segments in 'highPrioritySegments'.
`;

export const CONGESTION_ACCIDENT_PROMPT = `
Analyze the theoretical potential for traffic congestion and accidents for the given road segments.
Use attributes such as 'CurLoad', 'NewLoad', 'Ovrld', 'speed_utro', 'Capacity', 'Intens', 'PedCross', 'CrossRoad', and 'Control'.
Provide the output as a JSON object with the following structure:
{
  "summary": "Краткое текстовое резюме рисков на русском языке.",
  "highRiskSegments": [
    {
      "EdgeId": 123,
      "ST_NM_BASE": "улица",
      "CurLoad": 0.85,
      "NewLoad": 1.1,
      "Ovrld": true,
      "reason": "Краткое объяснение рисков на русском языке."
    }
  ],
  "keyStats": {
    "totalProjectedOverload": 10,
    "avgCurrentLoad": 0.7,
    "avgProjectedLoad": 0.9
  }
}
List up to 5 highest risk segments in 'highRiskSegments', sorted by 'NewLoad' descending. Calculate averages to 2 decimal places.
`;

export const TRAFFIC_FORECAST_PROMPT = `
Generate a short-term traffic forecast for the problematic segments.
Consider the 'NewLoad', 'CrSpdNew', 'NewSpdU', 'SpdDelAbs', and 'SpdDelRel' attributes.
Provide the output as a JSON object with the following structure:
{
  "summary": "Краткое текстовое резюме прогноза на русском языке.",
  "peakHourForecast": {
    "avgSpeedChangePercent": -15.2,
    "newBottlenecks": 5
  },
  "criticalSegments": [
    {
      "EdgeId": 123,
      "ST_NM_BASE": "улица",
      "NewSpdU": 25.5,
      "SpdDelAbs": -12.5
    }
  ]
}
List up to 5 most critical segments in 'criticalSegments' based on the largest negative 'SpdDelAbs'. For 'avgSpeedChangePercent', parse the percentage string from 'SpdDelRel' (e.g., "-25.0%"), convert to a number, and calculate the average.
`;

export const RECOMMENDATIONS_PROMPT = `
Based on the previous analyses (road condition, congestion/accident risk, traffic forecast), generate a comprehensive set of recommendations to improve the traffic situation for the provided segments.
Your recommendations should be specific, actionable, and tied to the data. For example, if congestion is high due to a specific intersection, recommend traffic light optimization. If 'NewLoad' is high, suggest capacity improvements.
Here is the context from previous steps:
1. Road Condition Assessment:
---
{roadConditionAnalysis}
---
2. Congestion and Accident Analysis:
---
{congestionAnalysis}
---
3. Traffic Forecast:
---
{trafficForecast}
---

Now, provide your final recommendations based on all this information and the original data.
Provide the output as a JSON object with the following structure:
{
  "summary": "Краткое текстовое резюме с общими выводами на русском языке.",
  "prioritized_recommendations": [
    {
      "segment_name": "Название улицы (город)",
      "edge_id": 12345,
      "priority": "Высокий" | "Средний" | "Низкий",
      "problem_areas": [ "Краткое описание проблемы 1", "Краткое описание проблемы 2" ],
      "recommendations": [ "Конкретная рекомендация 1", "Конкретная рекомендация 2" ]
    }
  ]
}
List up to 5 most critical segments.
`;