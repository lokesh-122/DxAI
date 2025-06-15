import type { ExtractHealthInsightsOutput } from '@/ai/flows/extract-health-insights';

export interface ReportHistoryEntry {
  id: string; // Firestore document ID or mock ID
  userId: string;
  analysisDate: string; // ISO string
  reportName: string; // e.g., "Report from YYYY-MM-DD"
  extractedInsights: ExtractHealthInsightsOutput;
  originalReportText?: string; // Optional, could be large
}
