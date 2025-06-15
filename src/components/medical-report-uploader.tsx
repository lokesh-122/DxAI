'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileText, AlertCircle, CheckCircle2, Shield, Heart, Activity, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import * as pdfjsLib from 'pdfjs-dist';
import type { MedicalReport } from '@/app/page';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface MedicalReportUploaderProps {
  onUpload: (report: MedicalReport) => void;
  isAnalyzing: boolean;
}

export function MedicalReportUploader({ onUpload, isAnalyzing }: MedicalReportUploaderProps) {
  const [uploadProgress, setUploadProgress] = useState(0);

  const extractTextFromPDF = async (file: File): Promise<{ text: string; pages: number }> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;
    let fullText = '';

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
      
      // Update progress
      setUploadProgress((i / numPages) * 100);
    }

    return { text: fullText.trim(), pages: numPages };
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF medical report');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB');
      return;
    }

    try {
      setUploadProgress(0);
      toast.loading('Processing your medical report...', { id: 'pdf-upload' });

      const { text, pages } = await extractTextFromPDF(file);

      if (!text.trim()) {
        toast.error('Could not extract text from PDF. Please ensure the document contains readable text.');
        return;
      }

      const medicalReport: MedicalReport = {
        id: Date.now().toString(),
        file,
        text,
        pages,
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          uploadDate: new Date(),
        }
      };

      onUpload(medicalReport);
      toast.success('Medical report uploaded successfully! Starting AI analysis...', { id: 'pdf-upload' });
      setUploadProgress(100);

    } catch (error) {
      console.error('Error processing PDF:', error);
      toast.error('Failed to process medical report. Please try again.', { id: 'pdf-upload' });
      setUploadProgress(0);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: isAnalyzing
  });

  return (
    <Card className="w-full max-w-4xl mx-auto medical-card medical-shadow-lg relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 left-4 w-8 h-8 text-green-500">
          <Heart className="w-full h-full animate-pulse" />
        </div>
        <div className="absolute top-8 right-8 w-6 h-6 text-blue-500">
          <Activity className="w-full h-full animate-bounce" />
        </div>
        <div className="absolute bottom-6 left-8 w-7 h-7 text-cyan-500">
          <Sparkles className="w-full h-full animate-spin" style={{animationDuration: '3s'}} />
        </div>
        <div className="absolute bottom-8 right-6 w-5 h-5 text-green-500">
          <CheckCircle2 className="w-full h-full animate-pulse" />
        </div>
      </div>
      
      {/* Gradient Border */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-cyan-500/20 rounded-2xl blur-sm"></div>
      
      <CardContent className="p-12 relative">
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-medical group overflow-hidden
            ${isDragActive 
              ? 'border-green-400 bg-gradient-to-br from-green-50 to-blue-50 scale-105 shadow-2xl' 
              : 'border-slate-300 hover:border-green-400 hover:bg-gradient-to-br hover:from-green-50/50 hover:to-blue-50/30'
            }
            ${isAnalyzing ? 'pointer-events-none opacity-75' : ''}
          `}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 medical-icons-bg opacity-30"></div>
          
          <input {...getInputProps()} />
          
          <div className="space-y-8 relative">
            <div className="mx-auto w-24 h-24 medical-gradient rounded-3xl flex items-center justify-center medical-shadow-lg group-hover:scale-110 transition-transform duration-500 relative overflow-hidden">
              {isAnalyzing ? (
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
                  <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border border-white/50" />
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-white relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl" />
                </>
              )}
            </div>
            
            <div>
              <h3 className="text-4xl font-bold text-slate-800 mb-6 font-poppins">
                {isAnalyzing ? (
                  <span className="flex items-center justify-center gap-4">
                    <Activity className="w-8 h-8 text-green-600 animate-pulse" />
                    Analyzing Your Medical Report...
                  </span>
                ) : (
                  'Upload Your Medical Report'
                )}
              </h3>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-inter">
                {isDragActive
                  ? 'Drop your medical report here to begin AI analysis'
                  : 'Upload your PDF medical report, lab results, or diagnostic imaging reports for instant AI-powered analysis'
                }
              </p>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-6 max-w-lg mx-auto">
                <div className="relative">
                  <Progress value={uploadProgress} className="h-4 bg-slate-200 rounded-full overflow-hidden" />
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full animate-pulse" />
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Heart className="w-5 h-5 text-green-600 pulse-medical" />
                  <p className="text-lg font-medium text-slate-700 font-inter">
                    Processing... {Math.round(uploadProgress)}%
                  </p>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-10 text-sm text-slate-500 flex-wrap">
              <div className="flex items-center gap-3 glass-medical px-4 py-3 rounded-full">
                <FileText className="w-5 h-5 text-green-600" />
                <span className="font-medium">PDF Reports</span>
              </div>
              <div className="flex items-center gap-3 glass-medical px-4 py-3 rounded-full">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <span className="font-medium">Max 10MB</span>
              </div>
              <div className="flex items-center gap-3 glass-medical px-4 py-3 rounded-full">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="font-medium">HIPAA Secure</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Heart,
              title: "Instant Diagnosis",
              description: "AI analyzes symptoms and provides preliminary diagnosis insights",
              color: "text-red-500"
            },
            {
              icon: Activity,
              title: "Treatment Recommendations",
              description: "Get personalized lifestyle and dietary recommendations",
              color: "text-green-500"
            },
            {
              icon: CheckCircle2,
              title: "Hospital Finder",
              description: "Find nearby hospitals and specialists for your condition",
              color: "text-green-500"
            }
          ].map((feature, index) => (
            <div key={index} className="flex items-start gap-4 p-6 rounded-2xl hover:bg-gradient-to-br hover:from-green-50/50 hover:to-blue-50/30 transition-all duration-300 group">
              <div className="w-12 h-12 medical-gradient rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 relative">
                <feature.icon className="w-6 h-6 text-white" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-2 font-poppins text-lg">{feature.title}</h4>
                <p className="text-slate-600 font-inter leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}