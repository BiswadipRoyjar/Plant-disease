
export interface AnalysisResult {
  isHealthy: boolean;
  diseaseName: string;
  confidenceScore: number;
  description: string;
  organicTreatment: string;
  chemicalTreatment: string;
}
