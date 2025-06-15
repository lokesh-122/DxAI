'use client';

import { useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { HeroSection } from '@/components/hero-section';
import { Footer } from '@/components/footer';
import { useLoading } from '@/contexts/LoadingContext';

export interface MedicalReport {
  id: string;
  file: File;
  text: string;
  pages: number;
  metadata: {
    fileName: string;
    fileSize: number;
    uploadDate: Date;
  };
}

export interface DiagnosisData {
  condition: string;
  stage: string;
  confidence: number;
  symptoms: string[];
  recommendations: {
    lifestyle: string[];
    dietary: string[];
    medical: string[];
  };
  department: string;
  urgency: 'low' | 'medium' | 'high';
  followUp: string;
}

export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    reportId?: string;
    diagnosisId?: string;
    [key: string]: any;
  };
}

export interface PDFData {
  file: File;
  text: string;
  pages: number;
  metadata: {
    fileName: string;
    fileSize: number;
    uploadDate: Date;
  };
}

export default function Home() {
  const { isLoading } = useLoading();

  // Don't render content while loading screen is showing
  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />
      
      <main>
        <HeroSection />
      </main>
      
      <Footer />
    </div>
  );
}