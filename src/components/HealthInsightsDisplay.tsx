
'use client';

import type { ExtractHealthInsightsOutput, ExtractHealthInsightsOutputHealthIssuesInner } from '@/ai/flows/extract-health-insights';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { 
  AlertTriangle, BookOpenText, Leaf, ThumbsUp, ThumbsDown, Bike, Lightbulb, Stethoscope, ShieldAlert, 
  Info, CheckCircle, ClipboardCheck, ListTree, AlertCircle, BriefcaseMedical, FileText, Loader2, Mail
} from 'lucide-react';
import { useState, useTransition, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { NearbyHospitalsMap } from '@/components/NearbyHospitalsMap';
import { shareReportByEmailAction } from '@/app/action';


interface HealthInsightsDisplayProps {
  analysisResult: ExtractHealthInsightsOutput | null;
}

const getSeverityBadgeVariant = (severity?: string): "default" | "secondary" | "destructive" | "outline" => {
  const s = severity?.toLowerCase();
  if (s?.includes('mild') || s?.includes('low') || s?.includes('normal')) return 'default';
  if (s?.includes('moderate') || s?.includes('borderline')) return 'secondary'; 
  if (s?.includes('severe') || s?.includes('high') || s?.includes('critical')) return 'destructive';
  return 'outline';
};


export function HealthInsightsDisplay({ analysisResult }: HealthInsightsDisplayProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSharing, startSharingTransition] = useTransition();
  const { toast } = useToast();

  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [editableEmailSummary, setEditableEmailSummary] = useState('');

  const prepareShareSummary = (issues: ExtractHealthInsightsOutputHealthIssuesInner[] | undefined | null): string => {
    if (!issues || issues.length === 0) {
      return "No specific health issues to report at this time.";
    }
    let summary = "Health Insights Summary:\n\n";
    issues.forEach(issue => {
      summary += `Condition: ${issue.condition}${issue.stage ? ` (${issue.stage})` : ''}\n`;
      if (issue.conditionSummary) {
        summary += `Summary (from report): ${issue.conditionSummary}\n`;
      }
      if (issue.departmentRecommendation) {
        summary += `Recommended Specialist: ${issue.departmentRecommendation}\n`;
      }
      summary += "\n";
    });
    summary += "This summary is AI-generated based on the provided report. Please consult a medical professional for advice.";
    return summary;
  };

  useEffect(() => {
    if (analysisResult?.healthIssues && showEmailDialog) {
      const baseSummary = prepareShareSummary(analysisResult.healthIssues);
      setEditableEmailSummary(baseSummary);
    }
  }, [analysisResult, showEmailDialog]);


  const handleShareEmail = async () => {
    if (!editableEmailSummary || !recipientEmail) {
      toast({ title: "Error", description: "Missing report summary or recipient email.", variant: "destructive" });
      return;
    }
    startSharingTransition(async () => {
      // In a real app, you'd get the PDF data here.
      // For now, we'll pass null or undefined for pdfBase64 and pdfFilename
      // as the current shareReportByEmailAction doesn't use them yet.
      // TODO: Update this when PDF generation is fully integrated with sharing.
      const result = await shareReportByEmailAction(editableEmailSummary, recipientEmail, null, null);
      if (result.success) {
        toast({ title: "Email Initiated", description: "The email sharing process has been initiated." });
        setShowEmailDialog(false);
        setRecipientEmail('');
        setEditableEmailSummary('');
      } else {
        toast({ title: "Email Error", description: result.error || "Failed to initiate email sharing.", variant: "destructive" });
      }
    });
  };


  const handleDownloadPdf = async () => {
    if (!analysisResult || !analysisResult.healthIssues || analysisResult.healthIssues.length === 0) {
      console.error('No analysis data to generate PDF.');
      toast({ title: "Error", description: "No analysis data to generate PDF.", variant: "destructive"});
      return;
    }

    setIsGeneratingPdf(true);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 40;
    const contentWidth = pageWidth - 2 * margin;
    let currentY = margin;

    pdf.setFontSize(24);
    pdf.setFont(undefined, 'bold');
    const reportTitleText = "Health Insights Report";
    const reportTitleWidth = pdf.getStringUnitWidth(reportTitleText) * pdf.getFontSize() / pdf.internal.scaleFactor;
    pdf.text(reportTitleText, (pageWidth - reportTitleWidth) / 2, currentY);
    currentY += 40; 

    for (let i = 0; i < analysisResult.healthIssues.length; i++) {
      const issue = analysisResult.healthIssues[i];
      const cardElementId = `health-issue-card-${i}`;
      const cardElement = document.getElementById(cardElementId);

      if (!cardElement) {
        console.error(`Card element ${cardElementId} not found.`);
        continue;
      }
      
      if (i > 0 || currentY === margin + 40) { 
         pdf.addPage();
         currentY = margin; 
      }


      pdf.setFontSize(18);
      pdf.setFont(undefined, 'bold');
      const conditionTextLines = pdf.splitTextToSize(issue.condition, contentWidth);
      if (currentY + (conditionTextLines.length * 18) > pageHeight - margin) { 
        pdf.addPage();
        currentY = margin;
      }
      pdf.text(conditionTextLines, margin, currentY);
      currentY += (conditionTextLines.length * 18) + 5;

      if (issue.stage) {
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'normal');
        const stageText = `Severity: ${issue.stage}`;
        const stageTextLines = pdf.splitTextToSize(stageText, contentWidth);
         if (currentY + (stageTextLines.length * 12) > pageHeight - margin) { 
            pdf.addPage();
            currentY = margin;
            pdf.setFontSize(18);
            pdf.setFont(undefined, 'bold');
            pdf.text(conditionTextLines, margin, currentY);
            currentY += (conditionTextLines.length * 18) + 5;
        }
        pdf.text(stageTextLines, margin, currentY);
        currentY += (stageTextLines.length * 12) + 15;
      } else {
         currentY += 15; 
      }
      
      const canvas = await html2canvas(cardElement, {
        scale: 2, 
        useCORS: true,
        logging: false,
        width: cardElement.scrollWidth,
        height: cardElement.scrollHeight,
        windowWidth: cardElement.scrollWidth,
        windowHeight: cardElement.scrollHeight,
        scrollY: 0, 
        scrollX: 0,
      });

      const imgData = canvas.toDataURL('image/png');
      const imgProps = pdf.getImageProperties(imgData);
      
      const pdfImgWidth = contentWidth;
      const pdfImgHeight = (imgProps.height * pdfImgWidth) / imgProps.width;
      
      if (currentY + pdfImgHeight > pageHeight - margin) { 
        pdf.addPage();
        currentY = margin; 
      }
      
      pdf.addImage(imgData, 'PNG', margin, currentY, pdfImgWidth, pdfImgHeight);
      currentY += pdfImgHeight + 20; 
    }

    pdf.save('health-insights-report.pdf');
    setIsGeneratingPdf(false);
  };


  if (!analysisResult) {
    return (
      <Card className="mt-8 w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <Info className="h-5 w-5 text-accent" />
            Awaiting Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please upload a file and click "Get Insights" to see your analysis.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  if (analysisResult.analysisStatus === 'INVALID_REPORT_CONTENT') {
    return (
      <Card className="mt-8 w-full max-w-2xl mx-auto shadow-lg bg-destructive/10 border-destructive">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Invalid Report Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive-foreground">
            {analysisResult.statusReason || "The provided text does not appear to be a valid medical report. Please upload or paste a genuine medical document."}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (analysisResult.analysisStatus === 'VALID_REPORT_NO_ISSUES') {
    return (
      <Card className="mt-8 w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Analysis Complete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {analysisResult.statusReason || "No specific health issues were identified in your report."}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (analysisResult.analysisStatus === 'VALID_REPORT_WITH_ISSUES') {
    if (!Array.isArray(analysisResult.healthIssues)) {
      return (
        <Card className="mt-8 w-full max-w-2xl mx-auto shadow-lg bg-destructive/10 border-destructive">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Error in Report Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive-foreground">
              The health insights could not be displayed due to an issue with the data format.
            </p>
          </CardContent>
        </Card>
      );
    }
    if (analysisResult.healthIssues.length === 0) {
      return (
        <Card className="mt-8 w-full max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <Info className="h-5 w-5 text-accent" />
              Analysis Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The report was analyzed, but no specific health issues requiring detailed recommendations were extracted.
              {analysisResult.statusReason && ` (Note: ${analysisResult.statusReason})`}
            </p>
          </CardContent>
        </Card>
      );
    }
    
    const recommendedSpecialty = analysisResult.healthIssues[0]?.departmentRecommendation;

    return (
      <div className="mt-8 space-y-6 w-full max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
          <div>
            <h2 className="font-headline text-3xl font-semibold text-foreground flex items-center gap-2">
              <Lightbulb className="h-8 w-8 text-primary" /> Your Health Insights
            </h2>
            <p className="text-muted-foreground mt-1">Here's a summary of the analysis from your report.</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleDownloadPdf} disabled={isGeneratingPdf} size="sm" variant="outline">
              {isGeneratingPdf ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileText className="mr-2 h-4 w-4" />
              )}
              Download PDF
            </Button>
            
            <Dialog open={showEmailDialog} onOpenChange={(isOpen) => {
              setShowEmailDialog(isOpen);
              if (!isOpen) {
                setRecipientEmail('');
                setEditableEmailSummary('');
              } else if (analysisResult?.healthIssues) {
                setEditableEmailSummary(prepareShareSummary(analysisResult.healthIssues));
              }
            }}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" disabled={isSharing}>
                  <Mail className="mr-2 h-4 w-4" /> Share via Email
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Share Insights via Email</DialogTitle>
                  <DialogDescription>
                    Enter recipient's email and review the summary before sending.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      className="col-span-3"
                      placeholder="recipient@example.com"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="email-summary" className="text-right pt-2">
                      Summary
                    </Label>
                    <Textarea
                      id="email-summary"
                      value={editableEmailSummary}
                      onChange={(e) => setEditableEmailSummary(e.target.value)}
                      className="col-span-3 min-h-[100px]"
                      placeholder="Review and edit summary..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowEmailDialog(false)}>Cancel</Button>
                  <Button type="button" onClick={handleShareEmail} disabled={isSharing || !recipientEmail.includes('@') || !editableEmailSummary.trim()}>
                    {isSharing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Send Email
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          </div>
        </div>
        <Separator />
        <Accordion 
          type="multiple" 
          className="w-full" 
          defaultValue={analysisResult.healthIssues.map((_, idx) => `item-${idx}`)}
        >
          {analysisResult.healthIssues.map((issue, index) => (
            <AccordionItem value={`item-${index}`} key={index} className="border-b-0 mb-4 text-black">
               <Card className="shadow-lg overflow-hidden" id={`health-issue-card-${index}`}>
                <AccordionTrigger className="px-6 py-4 hover:no-underline bg-card hover:bg-muted/50 rounded-t-lg">
                  <div className="flex items-center gap-3 w-full">
                    <Stethoscope className="h-6 w-6 text-primary" />
                    <span className="font-headline text-lg text-left flex-1">{issue.condition}</span>
                    {issue.stage && (
                      <Badge variant={getSeverityBadgeVariant(issue.stage)} className="ml-auto whitespace-nowrap px-3 py-1 text-xs">
                        <ShieldAlert className="h-3.5 w-3.5 mr-1.5" />
                        {issue.stage}
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 bg-background rounded-b-lg"> 
                  <div className="space-y-4"> 
                    <div>
                      <h4 className="font-semibold text-md mb-1 flex items-center gap-2 text-accent">
                        <BookOpenText className="h-5 w-5" />
                        Understanding Your Condition
                      </h4>
                      <p className="text-sm text-foreground/80">{issue.description}</p>
                    </div>

                    {issue.conditionSummary && (
                      <div>
                        <h4 className="font-semibold text-md mb-1 flex items-center gap-2 text-black">
                          <ClipboardCheck className="h-5 w-5" />
                          Condition Summary (from report)
                        </h4>
                        <p className="text-sm text-foreground/80">{issue.conditionSummary}</p>
                      </div>
                    )}

                    {issue.generalCauses && issue.generalCauses.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-md mb-2 flex items-center gap-2 text-black">
                          <ListTree className="h-5 w-5" />
                          General Causes
                        </h4>
                        <ul className="list-disc list-inside text-sm space-y-1 text-foreground/80">
                          {issue.generalCauses.map((cause, i) => <li key={i}>{cause}</li>)}
                        </ul>
                      </div>
                    )}

                    {issue.commonSymptoms && issue.commonSymptoms.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-md mb-2 flex items-center gap-2 text-black">
                          <AlertCircle className="h-5 w-5" />
                          Common Symptoms
                        </h4>
                        <ul className="list-disc list-inside text-sm space-y-1 text-foreground/80">
                          {issue.commonSymptoms.map((symptom, i) => <li key={i}>{symptom}</li>)}
                        </ul>
                      </div>
                    )}
                     
                    {issue.departmentRecommendation && (
                      <div>
                        <h4 className="font-semibold text-md mb-1 flex items-center gap-2 text-black">
                          <BriefcaseMedical className="h-5 w-5" />
                          Recommended Specialist
                        </h4>
                        <p className="text-sm text-foreground/80">{issue.departmentRecommendation}</p>
                      </div>
                    )}


                    {issue.dietaryRecommendations && (
                      <div>
                        <h4 className="font-semibold text-md mb-2 flex items-center gap-2 text-black">
                          <Leaf className="h-5 w-5" />
                          Dietary Recommendations
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="bg-primary/10">
                            <CardHeader className="pb-2 pt-4">
                              <CardTitle className="text-sm font-medium flex items-center gap-2 text-primary-foreground/90">
                                <ThumbsUp className="h-4 w-4 text-green-600" /> Foods to Eat More Of
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="list-disc list-inside text-sm space-y-1 text-foreground/80">
                                {issue.dietaryRecommendations.foodsToEatMoreOf.map((food, i) => <li key={i}>{food}</li>)}
                              </ul>
                            </CardContent>
                          </Card>
                          <Card className="bg-destructive/10">
                            <CardHeader className="pb-2 pt-4">
                              <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
                                <ThumbsDown className="h-4 w-4 text-red-600" /> Foods to Limit/Avoid
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="list-disc list-inside text-sm space-y-1 text-foreground/80">
                                {issue.dietaryRecommendations.foodsToAvoid.map((food, i) => <li key={i}>{food}</li>)}
                              </ul>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    )}

                    {issue.lifestyleSuggestions && issue.lifestyleSuggestions.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-md mb-2 flex items-center gap-2 text-accent">
                          <Bike className="h-5 w-5" />
                          Lifestyle Suggestions
                        </h4>
                        <ul className="list-disc list-inside text-sm space-y-1 text-foreground/80">
                          {issue.lifestyleSuggestions.map((suggestion, i) => <li key={i}>{suggestion}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
        <Separator className="my-8" />
        <NearbyHospitalsMap recommendedSpecialty={recommendedSpecialty} />
      </div>
    );
  }
  
  return (
    <Card className="mt-8 w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center gap-2">
          <Info className="h-5 w-5 text-accent" />
          Analysis Status Unknown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          The report analysis returned an unknown status. Please try again or check the input.
        </p>
      </CardContent>
    </Card>
  );
}


    

