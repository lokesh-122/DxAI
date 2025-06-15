'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileText, AlertCircle, CheckCircle2, Shield, TrendingUp, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import * as pdfjsLib from 'pdfjs-dist';
import type { PDFData } from '@/app/page';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PDFUploaderProps {
  onUpload: (data: PDFData) => void;
  isProcessing: boolean;
}

export function PDFUploader({ onUpload, isProcessing }: PDFUploaderProps) {
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
      toast.error('Please upload a PDF document');
      return;
    }

    if (file.size > 25 * 1024 * 1024) { // 25MB limit for business documents
      toast.error('File size must be less than 25MB');
      return;
    }

    try {
      setUploadProgress(0);
      toast.loading('Processing business document...', { id: 'pdf-upload' });

      const { text, pages } = await extractTextFromPDF(file);

      if (!text.trim()) {
        toast.error('Could not extract text from PDF. Please ensure the document contains readable text.');
        return;
      }

      const pdfData: PDFData = {
        file,
        text,
        pages,
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          uploadDate: new Date(),
        }
      };

      onUpload(pdfData);
      toast.success('Document processed successfully! Ready for business analysis.', { id: 'pdf-upload' });
      setUploadProgress(100);

    } catch (error) {
      console.error('Error processing PDF:', error);
      toast.error('Failed to process document. Please try again.', { id: 'pdf-upload' });
      setUploadProgress(0);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: isProcessing
  });

  return (
    <Card className="w-full max-w-4xl mx-auto business-card business-shadow-lg">
      <CardContent className="p-10">
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 group
            ${isDragActive 
              ? 'border-blue-400 bg-blue-50 scale-105' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
            }
            ${isProcessing ? 'pointer-events-none opacity-75' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-6">
            <div className="mx-auto w-20 h-20 business-gradient rounded-2xl flex items-center justify-center business-shadow-lg group-hover:scale-110 transition-transform duration-300">
              {isProcessing ? (
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white" />
              ) : (
                <Upload className="w-10 h-10 text-white" />
              )}
            </div>
            
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <TrendingUp className="w-6 h-6 text-blue-600 animate-pulse" />
                    Processing Business Document...
                  </span>
                ) : (
                  'Upload Business Document'
                )}
              </h3>
              <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
                {isDragActive
                  ? 'Drop your business document here to begin analysis'
                  : 'Upload your PDF report, financial statement, or strategic document for comprehensive AI analysis'
                }
              </p>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-4 max-w-md mx-auto">
                <Progress value={uploadProgress} className="h-2 bg-gray-200" />
                <div className="flex items-center justify-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600 animate-pulse" />
                  <p className="text-sm font-medium text-gray-700">
                    Processing... {Math.round(uploadProgress)}%
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>PDF Documents</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <span>Max 25MB</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span>Enterprise Security</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {[
            {
              icon: BarChart3,
              title: "Business Intelligence",
              description: "Extract KPIs, metrics, and performance indicators"
            },
            {
              icon: TrendingUp,
              title: "Strategic Analysis",
              description: "Get actionable insights for decision-making"
            },
            {
              icon: CheckCircle2,
              title: "Executive Summaries",
              description: "Generate comprehensive business summaries"
            }
          ].map((feature, index) => (
            <div key={index} className="flex items-start gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 business-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}