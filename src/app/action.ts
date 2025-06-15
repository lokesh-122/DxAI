
'use server';
import type { ExtractHealthInsightsOutput, ExtractHealthInsightsInput } from '@/ai/flow/extract-health-insights';
import { extractHealthInsights } from '@/ai/flow/extract-health-insights';
import type { ReportHistoryEntry } from '@/lib/types';
import { getFunctions, httpsCallable } from 'firebase/functions';
// import { firebaseApp } from '@/lib/firebase'; // Assuming you have firebase initialized in lib/firebase.ts

// Placeholder for actual Firebase app initialization if not done elsewhere
// You would typically initialize firebaseApp once in your application (e.g., in a lib/firebase.ts)
// For now, this action won't call live Firebase functions without it.
// const functions = getFunctions(firebaseApp);


const MOCK_USER_ID = "mock_user_id"; // Placeholder for user authentication

export async function analyzeReportAction(
  reportText: string,
  targetLanguage: string
): Promise<{ data?: ExtractHealthInsightsOutput; error?: string }> {
  if (!reportText.trim()) {
    return { error: 'Report text cannot be empty.' };
  }

  try {
    const input: ExtractHealthInsightsInput = { medicalReportText: reportText, targetLanguage: targetLanguage };
    const result = await extractHealthInsights(input);
    
    if (!result || !result.analysisStatus || typeof result.healthIssues === 'undefined') {
        console.error('AI flow returned unexpected structure:', result);
        return { error: 'AI analysis returned an unexpected data structure. Please check the AI flow output.' };
    }
    if (!Array.isArray(result.healthIssues)) {
      console.error('AI flow healthIssues is not an array:', result.healthIssues);
      return { error: 'AI analysis returned healthIssues that is not an array.'};
    }

    // If analysis is successful, save to history (currently mocked)
    if (result.analysisStatus === 'VALID_REPORT_WITH_ISSUES' || result.analysisStatus === 'VALID_REPORT_NO_ISSUES') {
      const reportName = `Analysis from ${new Date().toLocaleDateString()}`;
      await saveReportToHistoryAction(MOCK_USER_ID, {
        analysisDate: new Date().toISOString(),
        reportName: reportName,
        extractedInsights: result,
        originalReportText: reportText.substring(0, 500) + (reportText.length > 500 ? '...' : ''), // Store a snippet
      });
    }
    
    return { data: result };
  } catch (e) {
    console.error('Error calling extractHealthInsights flow:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during analysis.';
    return { error: `Failed to analyze report: ${errorMessage}` };
  }
}

export async function saveReportToHistoryAction(
  userId: string,
  reportData: Omit<ReportHistoryEntry, 'id' | 'userId'>
): Promise<{ success: boolean; id?: string; error?: string }> {
  console.log(`HISTORY_SAVE: Would save report for user ${userId}:`, reportData.reportName);
  // In a real app, this would save to Firestore:
  // try {
  //   const docRef = await addDoc(collection(db, 'users', userId, 'reports'), reportData);
  //   return { success: true, id: docRef.id };
  // } catch (error) {
  //   console.error("Error saving report to history:", error);
  //   return { success: false, error: "Failed to save report to history." };
  // }
  return { success: true, id: `mock_report_${Date.now()}` }; // Simulate success with a mock ID
}

export async function getReportHistoryAction(
  userId: string
): Promise<{ data?: ReportHistoryEntry[]; error?: string }> {
  console.log(`HISTORY_FETCH: Would fetch report history for user ${userId}`);
  // In a real app, this would fetch from Firestore:
  // try {
  //   const q = query(collection(db, 'users', userId, 'reports'), orderBy('analysisDate', 'desc'));
  //   const querySnapshot = await getDocs(q);
  //   const history = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ReportHistoryEntry));
  //   return { data: history };
  // } catch (error) {
  //   console.error("Error fetching report history:", error);
  //   return { error: "Failed to fetch report history." };
  // }

  // Mock data for now:
  const mockHistory: ReportHistoryEntry[] = [
    {
      id: 'mock1',
      userId: userId,
      analysisDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
      reportName: 'Routine Checkup Results - Mock',
      extractedInsights: {
        analysisStatus: 'VALID_REPORT_WITH_ISSUES',
        healthIssues: [
          {
            condition: 'Slightly Elevated Cholesterol',
            stage: 'Mild',
            description: 'Cholesterol levels are marginally above the recommended range.',
            conditionSummary: "The patient's LDL cholesterol was 135 mg/dL. HDL and Triglycerides were normal.",
            generalCauses: ['Diet high in saturated fats', 'Lack of physical activity'],
            commonSymptoms: ['Usually asymptomatic'],
            departmentRecommendation: 'General Practitioner / Cardiologist',
            dietaryRecommendations: { foodsToEatMoreOf: ['Oats', 'Fruits', 'Vegetables'], foodsToAvoid: ['Fried foods', 'Red meat'] },
            lifestyleSuggestions: ['Increase aerobic exercise', 'Monitor diet'],
          },
        ],
      },
      originalReportText: 'Patient presented for routine checkup. Vitals stable. Labs show LDL at 135 mg/dL...',
    },
    {
      id: 'mock2',
      userId: userId,
      analysisDate: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
      reportName: 'Follow-up Consultation - Mock',
      extractedInsights: {
        analysisStatus: 'VALID_REPORT_NO_ISSUES',
        statusReason: 'All parameters within normal limits. No new concerns identified.',
        healthIssues: [],
      },
      originalReportText: 'Follow-up visit post medication adjustment. Patient reports feeling well...',
    },
     {
      id: 'mock3',
      userId: userId,
      analysisDate: new Date(Date.now() - 86400000 * 15).toISOString(), // 15 days ago
      reportName: 'Invalid Document Upload - Mock',
      extractedInsights: {
        analysisStatus: 'INVALID_REPORT_CONTENT',
        statusReason: 'The uploaded document was not recognized as a medical report.',
        healthIssues: [],
      },
      originalReportText: 'This is not a medical report, it is a shopping list.',
    }
  ];
  return { data: mockHistory };
}


export async function shareReportByEmailAction(
  reportSummary: string,
  recipientEmail: string,
  pdfBase64: string | null,
  pdfFilename: string | null
): Promise<{ success?: boolean; error?: string }> {
  if (!reportSummary) {
    return { error: 'Report summary cannot be empty.' };
  }
  if (!recipientEmail || !recipientEmail.includes('@')) {
    return { error: 'Invalid recipient email address.' };
  }
   if (pdfBase64 && !pdfFilename) {
    return { error: 'If PDF data is provided, a filename is also required.'};
  }

  // Placeholder: Firebase Function Call (assuming firebaseApp is initialized)
  // This section needs Firebase SDK setup to call the actual cloud function.
  // For now, it simulates the call.
  // const sendEmailFunction = httpsCallable(getFunctions(firebaseApp), 'sendEmail');
  try {
    console.log(`EMAIL_SEND_ACTION: Would call Firebase Function 'sendEmail'`);
    console.log(`  To: ${recipientEmail}`);
    console.log(`  Summary (first 100 chars): ${reportSummary.substring(0,100)}...`);
    if (pdfBase64) {
      console.log(`  Attachment: ${pdfFilename} (approx. ${Math.ceil(pdfBase64.length * 3/4 / 1024)} KB)`);
    }
    // Example of actual call (needs firebaseApp initialized and functions imported):
    // await sendEmailFunction({
    //   toEmail: recipientEmail,
    //   subject: "Your Health Insights Report",
    //   summary: reportSummary,
    //   pdfBase64: pdfBase64,
    //   pdfFilename: pdfFilename,
    // });
    return { success: true };
  } catch (e) {
    console.error('Error simulating call to sendEmail Firebase Function:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `Failed to initiate email sharing: ${errorMessage}` };
  }
}

