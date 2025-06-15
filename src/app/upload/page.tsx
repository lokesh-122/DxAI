
'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar'; // Changed from Header
import { Footer } from '@/components/footer';
import { ReportUploadForm } from '@/components/ReportUploadFrom';
import { HealthInsightsDisplay } from '@/components/HealthInsightsDisplay';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import type { ExtractHealthInsightsOutput } from '@/ai/flow/extract-health-insights';

export default function UploadsPage() { // Renamed component to be more descriptive
  const [analysisResult, setAnalysisResult] = useState<ExtractHealthInsightsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysisComplete = (data: ExtractHealthInsightsOutput) => {
    setAnalysisResult(data);
    setError(null);
  };

  const handleAnalysisError = (errorMessage: string) => {
    setError(errorMessage);
    setAnalysisResult(null);
  };
  
  const clearResults = () => {
    setAnalysisResult(null);
    setError(null);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar /> 
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        <ReportUploadForm 
          onAnalysisComplete={handleAnalysisComplete} 
          onAnalysisError={handleAnalysisError}
          clearResults={clearResults}
        />
        
        {error && (
          <Alert variant="destructive" className="mt-8 max-w-2xl mx-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Analysis Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <HealthInsightsDisplay analysisResult={analysisResult} />
      </main>
      <Footer />
    </div>
  );
}
