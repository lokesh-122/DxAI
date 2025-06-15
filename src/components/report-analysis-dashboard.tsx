'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Heart, Activity, MapPin, Phone, Clock, AlertTriangle, CheckCircle2, Upload, Utensils, Dumbbell, Stethoscope, Calendar, Star, Download, Share2, Printer as Print } from 'lucide-react';
import { HospitalMap } from '@/components/hospital-map';
import type { MedicalReport, DiagnosisData } from '@/app/page';

interface ReportAnalysisDashboardProps {
  report: MedicalReport;
  diagnosis: DiagnosisData | null;
  isAnalyzing: boolean;
  onNewReport: () => void;
}

export function ReportAnalysisDashboard({ 
  report, 
  diagnosis, 
  isAnalyzing, 
  onNewReport 
}: ReportAnalysisDashboardProps) {
  const [activeTab, setActiveTab] = useState('diagnosis');

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'status-critical';
      case 'medium': return 'status-warning';
      case 'low': return 'status-healthy';
      default: return 'status-healthy';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return AlertTriangle;
      case 'medium': return Clock;
      case 'low': return CheckCircle2;
      default: return CheckCircle2;
    }
  };

  const handleDownloadReport = () => {
    // In a real app, this would generate and download a PDF
  };

  const handleShareReport = () => {
    if (navigator.share) {
      navigator.share({
        title: 'DxAI Medical Analysis Report',
        text: `Medical analysis for ${report.metadata.fileName}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleScheduleFollowUp = () => {
    // Feature coming soon
  };

  const handleEmergencyContact = () => {
    if (diagnosis?.urgency === 'high') {
      window.location.href = 'tel:911';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 medical-gradient rounded-xl flex items-center justify-center medical-shadow">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 font-poppins">
                Medical Report Analysis
              </h1>
              <p className="text-slate-600 font-inter">
                {report.metadata.fileName}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {!isAnalyzing && diagnosis && (
              <>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadReport}
                  className="gap-2 hover:bg-green-50"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handleShareReport}
                  className="gap-2 hover:bg-blue-50"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handlePrintReport}
                  className="gap-2 hover:bg-slate-50"
                >
                  <Print className="w-4 h-4" />
                  Print
                </Button>
              </>
            )}
            <Button 
              onClick={onNewReport}
              variant="outline"
              className="gap-2 focus-medical"
            >
              <Upload className="w-4 h-4" />
              Upload New Report
            </Button>
          </div>
        </div>

        {/* Analysis Status */}
        <Card className="medical-card mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 medical-gradient rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 font-poppins">
                    {isAnalyzing ? 'Analyzing Report...' : 'Analysis Complete'}
                  </h3>
                  <p className="text-sm text-slate-600 font-inter">
                    {isAnalyzing 
                      ? 'AI is processing your medical report' 
                      : `Analysis completed with ${diagnosis?.confidence}% confidence`
                    }
                  </p>
                </div>
              </div>
              {isAnalyzing ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600" />
                  <span className="text-sm text-slate-600">Processing...</span>
                </div>
              ) : diagnosis?.urgency === 'high' && (
                <Button
                  onClick={handleEmergencyContact}
                  className="bg-red-600 hover:bg-red-700 text-white gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Emergency Contact
                </Button>
              )}
            </div>
            {isAnalyzing && (
              <div className="mt-4">
                <Progress value={75} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dashboard Content */}
        {!isAnalyzing && diagnosis && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 medical-card p-1">
              <TabsTrigger value="diagnosis" className="gap-2">
                <Heart className="w-4 h-4" />
                Diagnosis
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="gap-2">
                <Stethoscope className="w-4 h-4" />
                Recommendations
              </TabsTrigger>
              <TabsTrigger value="hospitals" className="gap-2">
                <MapPin className="w-4 h-4" />
                Hospitals
              </TabsTrigger>
              <TabsTrigger value="followup" className="gap-2">
                <Calendar className="w-4 h-4" />
                Follow-up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="diagnosis" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Primary Diagnosis */}
                <Card className="medical-card lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-poppins">
                      <Heart className="w-5 h-5 text-red-500" />
                      Primary Diagnosis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800 mb-2 font-poppins">
                        {diagnosis.condition}
                      </h3>
                      <div className="flex items-center gap-4 mb-4">
                        <Badge variant="outline" className="gap-1">
                          Stage: {diagnosis.stage}
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <Star className="w-3 h-3" />
                          {diagnosis.confidence}% Confidence
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-2 font-poppins">
                        Identified Symptoms:
                      </h4>
                      <ul className="space-y-1">
                        {diagnosis.symptoms.map((symptom, index) => (
                          <li key={index} className="flex items-center gap-2 text-slate-600 font-inter">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            {symptom}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Urgency & Department */}
                <div className="space-y-6">
                  <Card className="medical-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-poppins">
                        {(() => {
                          const UrgencyIcon = getUrgencyIcon(diagnosis.urgency);
                          return <UrgencyIcon className="w-5 h-5" />;
                        })()}
                        Urgency Level
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge className={`${getUrgencyColor(diagnosis.urgency)} text-sm px-3 py-1 mb-3`}>
                        {diagnosis.urgency.toUpperCase()} PRIORITY
                      </Badge>
                      {diagnosis.urgency === 'high' && (
                        <Button
                          onClick={handleEmergencyContact}
                          className="w-full bg-red-600 hover:bg-red-700 text-white gap-2"
                        >
                          <Phone className="w-4 h-4" />
                          Emergency Contact
                        </Button>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="medical-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-poppins">
                        <Stethoscope className="w-5 h-5 text-green-500" />
                        Recommended Department
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-semibold text-slate-800 font-poppins mb-3">
                        {diagnosis.department}
                      </p>
                      <Button
                        onClick={() => setActiveTab('hospitals')}
                        variant="outline"
                        className="w-full gap-2 hover:bg-green-50"
                      >
                        <MapPin className="w-4 h-4" />
                        Find Nearby Hospitals
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Lifestyle Recommendations */}
                <Card className="medical-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-poppins">
                      <Dumbbell className="w-5 h-5 text-green-500" />
                      Lifestyle Changes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {diagnosis.recommendations.lifestyle.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm font-inter">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Dietary Recommendations */}
                <Card className="medical-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-poppins">
                      <Utensils className="w-5 h-5 text-orange-500" />
                      Dietary Advice
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {diagnosis.recommendations.dietary.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm font-inter">
                          <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Medical Recommendations */}
                <Card className="medical-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-poppins">
                      <Heart className="w-5 h-5 text-red-500" />
                      Medical Care
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {diagnosis.recommendations.medical.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm font-inter">
                          <CheckCircle2 className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="hospitals" className="space-y-6">
              <HospitalMap department={diagnosis.department} />
            </TabsContent>

            <TabsContent value="followup" className="space-y-6">
              <Card className="medical-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-poppins">
                    <Calendar className="w-5 h-5 text-green-500" />
                    Follow-up Care Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-slate-700 font-inter">
                      {diagnosis.followUp}
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border border-slate-200 rounded-lg">
                      <h4 className="font-semibold text-slate-800 mb-2 font-poppins">
                        Next Steps
                      </h4>
                      <ul className="space-y-2 text-sm text-slate-600 font-inter">
                        <li>• Schedule appointment with {diagnosis.department}</li>
                        <li>• Continue monitoring symptoms</li>
                        <li>• Follow prescribed treatment plan</li>
                        <li>• Return if symptoms worsen</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 border border-slate-200 rounded-lg">
                      <h4 className="font-semibold text-slate-800 mb-2 font-poppins">
                        Emergency Signs
                      </h4>
                      <ul className="space-y-2 text-sm text-slate-600 font-inter">
                        <li>• Severe chest pain</li>
                        <li>• Difficulty breathing</li>
                        <li>• Sudden severe symptoms</li>
                        <li>• Loss of consciousness</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={handleScheduleFollowUp}
                      className="medical-gradient hover:opacity-90 gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Schedule Follow-up
                    </Button>
                    <Button
                      onClick={() => setActiveTab('hospitals')}
                      variant="outline"
                      className="gap-2 hover:bg-green-50"
                    >
                      <MapPin className="w-4 h-4" />
                      Find Specialists
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}