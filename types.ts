// Data structure for Step 2: Road Condition Analysis
export interface RoadConditionData {
  summary: string;
  losDistribution: {
    level: number;
    count: number;
  }[];
  highPrioritySegments: {
    EdgeId: number;
    ST_NM_BASE: string;
    CurLos: number;
    reason: string;
  }[];
}

// Data structure for Step 3: Congestion & Accident Analysis
export interface CongestionAnalysisData {
  summary: string;
  highRiskSegments: {
    EdgeId: number;
    ST_NM_BASE: string;
    CurLoad: number;
    NewLoad: number;
    Ovrld: boolean;
    reason: string;
  }[];
  keyStats: {
    totalProjectedOverload: number;
    avgCurrentLoad: number;
    avgProjectedLoad: number;
  };
}

// Data structure for Step 4: Traffic Forecast
export interface TrafficForecastData {
  summary: string;
  peakHourForecast: {
    avgSpeedChangePercent: number;
    newBottlenecks: number;
  };
  criticalSegments: {
    EdgeId: number;
    ST_NM_BASE: string;
    NewSpdU: number;
    SpdDelAbs: number;
  }[];
}

// Data structure for Step 5: Recommendations
export interface RecommendationData {
  summary: string;
  prioritized_recommendations: {
    segment_name: string;
    edge_id: number;
    priority: string;
    problem_areas: string[];
    recommendations: string[];
  }[];
}


// Fix: Add missing ExtractedFeatures interface for the unused Step2FeatureExtraction component.
// This resolves the compilation error.
export interface ExtractedFeatures {
  roadCondition: string;
  markings: string;
  obstacles: string;
  potholeCount: number;
}