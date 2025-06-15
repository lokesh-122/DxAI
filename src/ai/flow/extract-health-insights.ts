
'use server';

/**
 * @fileOverview Extracts health insights from a medical report and provides a summary.
 *
 * - extractHealthInsights - A function that handles the extraction of health insights from a medical report.
 * - ExtractHealthInsightsInput - The input type for the extractHealthInsights function.
 * - ExtractHealthInsightsOutput - The return type for the extractHealthInsights function.
 */

import {ai} from '@/ai/genkits'
import {z} from 'genkit';

const ExtractHealthInsightsInputSchema = z.object({
  medicalReportText: z
    .string()
    .describe('The text content extracted from the medical report.'),
  targetLanguage: z
    .string()
    .optional()
    .default('English')
    .describe('The target language for the insights (e.g., "Spanish", "French"). Defaults to English.'),
});
export type ExtractHealthInsightsInput = z.infer<
  typeof ExtractHealthInsightsInputSchema
>;

const ExtractHealthInsightsOutputSchema = z.object({
  analysisStatus: z
    .enum(['VALID_REPORT_WITH_ISSUES', 'VALID_REPORT_NO_ISSUES', 'INVALID_REPORT_CONTENT'])
    .describe(
      "Indicates the outcome of the analysis: " +
      "'VALID_REPORT_WITH_ISSUES' if the input is a medical report and health issues were found. " +
      "'VALID_REPORT_NO_ISSUES' if the input is a medical report but no specific issues were identified or it appears normal. " +
      "'INVALID_REPORT_CONTENT' if the input text does not appear to be a medical report."
    ),
  statusReason: z
    .string()
    .optional()
    .describe(
      "Provides a brief explanation if 'analysisStatus' is 'VALID_REPORT_NO_ISSUES' (e.g., 'Report appears normal.') or 'INVALID_REPORT_CONTENT' (e.g., 'Text does not resemble a medical document.'). Omit if 'VALID_REPORT_WITH_ISSUES'."
    ),
  healthIssues: z.array(
    z.object({
      condition: z.string().describe('The name of the health condition.'),
      stage: z.string().describe('The medical stage or severity (e.g., Mild, Moderate, Severe).'),
      description: z
        .string()
        .describe('A detailed but simple medical definition of the issue explained in layperson terms. Avoid medical jargon or explain it clearly with analogies if helpful. Should be comprehensive.'),
      conditionSummary: z.string().describe("A comprehensive summary of the patient's specific condition based on the report, highlighting all key findings relevant to this issue. This summary MUST be in very plain language, easily understandable by someone with no medical background. Explain what each finding means for the patient in simple terms. Make this section as detailed as possible based on the report."),
      explanationOfFindings: z.string().describe("A detailed, step-by-step explanation of what in the medical report led to identifying this condition. For example, 'This was noted because your report mentions X and Y, and these values/observations are typically associated with [condition] because...'. Make this very easy to understand and thorough."),
      generalCauses: z.array(z.string()).describe('A list of 5-7 common or general causes known for this condition, with each cause briefly explained in simple, non-medical language.'),
      commonSymptoms: z.array(z.string()).describe('A list of 5-7 typical symptoms experienced by individuals with this condition, with each symptom described clearly in a way a layperson can easily recognize or understand.'),
      impactOnDailyLife: z.string().optional().describe("A detailed and practical explanation of how this condition might affect daily life or well-being, if applicable. Focus on common, understandable impacts and provide examples if possible."),
      departmentRecommendation: z.string().describe('ONLY the name of the specialist or medical department recommended for consultation (e.g., Cardiology, Neurologist, General Practitioner, Vascular Surgeon). DO NOT include any additional explanation in this field.'),
      dietaryRecommendations: z.object({
        foodsToEatMoreOf: z.array(z.string()).describe('A detailed list of foods to eat more of, with brief explanations for why each food group is beneficial for the condition.'),
        foodsToAvoid: z.array(z.string()).describe('A detailed list of foods to avoid or limit, with brief explanations for why each food group may be detrimental for the condition.'),
      }),
      lifestyleSuggestions: z.array(z.string()).describe('Comprehensive and actionable general lifestyle suggestions, explained clearly. Provide multiple suggestions covering different aspects like exercise, stress management, sleep, etc., with rationale for each.'),
      questionsToAskDoctor: z.array(z.string()).optional().describe("A list of 3-5 thoughtful, practical questions the patient could consider asking their doctor about this condition during their next appointment. Ensure questions are simple and empower the patient."),
      monitoringAdvice: z.array(z.string()).optional().describe("Detailed, simple, and general advice on what symptoms or changes to monitor related to this condition. Provide specific but easy-to-understand points. Avoid giving medical instructions; suggest general awareness points, for example, 'It might be useful to note if X symptom changes after Y activity/food'.")
    })
  ).describe("An array of identified health issues. Empty if 'analysisStatus' is not 'VALID_REPORT_WITH_ISSUES'."),
});
export type ExtractHealthInsightsOutput = z.infer<
  typeof ExtractHealthInsightsOutputSchema
>;

export async function extractHealthInsights(
  input: ExtractHealthInsightsInput
): Promise<ExtractHealthInsightsOutput> {
  return extractHealthInsightsFlow(input);
}

const extractHealthInsightsPrompt = ai.definePrompt({
  name: 'extractHealthInsightsPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: {schema: ExtractHealthInsightsInputSchema},
  output: {schema: ExtractHealthInsightsOutputSchema},
  prompt: `You are an AI medical report analyzer. Your primary task is to analyze provided medical report text, extract meaningful health insights, and provide personalized recommendations.
Your explanations MUST be exceptionally clear, detailed, and easy for a layperson with NO medical background to understand. The goal is to produce a VERY LENGTHY and COMPREHENSIVE report that is still accessible. Avoid medical jargon. If a medical term is absolutely necessary, define it simply and thoroughly. Use analogies if they help clarify complex points.

IMPORTANT INSTRUCTION FOR LANGUAGE:
The final JSON output MUST have all its user-facing string values translated into the language specified by the '{{{targetLanguage}}}' input field.
Specifically, the following fields within the 'healthIssues' array and the 'statusReason' field (if present) MUST be in '{{{targetLanguage}}}' and written in simple, layperson-friendly, and detailed language:
- 'condition' (name of the health condition)
- 'stage' (medical stage or severity)
- 'description' (medical definition of the issue - explain like you're talking to a friend, be thorough)
- 'conditionSummary' (patient-specific summary for this condition - make this very easy to grasp and as detailed as the report allows)
- 'explanationOfFindings' (detailed and simple explanation of what in the report led to this)
- 'generalCauses' (array of strings - explain 5-7 causes simply and provide context for each)
- 'commonSymptoms' (array of strings - describe 5-7 symptoms clearly and explain what they might feel like)
- 'impactOnDailyLife' (optional - how it might affect daily life, explained simply but comprehensively with examples)
- 'departmentRecommendation' (ONLY the name of the specialist or medical department, e.g., Cardiology, Neurologist, Vascular Surgeon. DO NOT include any explanation here.)
- 'foodsToEatMoreOf' (array of strings in dietaryRecommendations - provide detailed list with brief reasons)
- 'foodsToAvoid' (array of strings in dietaryRecommendations - provide detailed list with brief reasons)
- 'lifestyleSuggestions' (array of strings - explain suggestions clearly and provide multiple actionable examples with rationale)
- 'questionsToAskDoctor' (optional array of strings - 3-5 simple yet insightful questions for the doctor)
- 'monitoringAdvice' (optional array of strings - detailed and simple monitoring tips, with examples)
- 'statusReason' (explanation for analysisStatus, if applicable - keep it simple)

For example, if '{{{targetLanguage}}}' is 'Spanish', all these text fields must be in Spanish, explained simply and in detail.
If '{{{targetLanguage}}}' is 'English' (or if it's not specified), provide the output in English, explained simply and in detail.
The JSON keys themselves (e.g., "analysisStatus", "healthIssues", "condition") MUST always remain in English.

First, critically evaluate if the provided text is a genuine medical report.
- If the text does not seem to be a medical report (e.g., it is random text, a news article, a shopping list, etc.), you MUST set the 'analysisStatus' field to 'INVALID_REPORT_CONTENT'. In this case, the 'healthIssues' array MUST be empty. Provide a brief 'statusReason' explaining why the text is not considered a medical report (e.g., "The provided text does not appear to be a medical document."). Remember this 'statusReason' MUST be translated to '{{{targetLanguage}}}' and be simple.
- If the text appears to be a medical report but contains no discernible health issues, or if it describes a normal/healthy state, you MUST set 'analysisStatus' to 'VALID_REPORT_NO_ISSUES'. The 'healthIssues' array MUST be empty. Provide a 'statusReason' such as "No specific health concerns were identified in this report." or "The report indicates normal findings." Remember this 'statusReason' MUST be translated to '{{{targetLanguage}}}' and be simple.
- If the text is identified as a medical report AND specific health issues are found, you MUST set 'analysisStatus' to 'VALID_REPORT_WITH_ISSUES'. Then, proceed to populate the 'healthIssues' array with detailed information for each issue. The 'statusReason' field can be omitted or left empty in this case.

For each detected health issue (when 'analysisStatus' is 'VALID_REPORT_WITH_ISSUES'):
  - Identify the 'condition' name.
  - Determine the medical 'stage' or severity (e.g., Mild, Moderate, Severe, Stage 1). Ensure these terms are understandable or briefly explained if necessary.
  - Provide a 'description': A detailed medical definition of the issue, explained in extremely simple terms suitable for a layperson. Be thorough. For example, instead of "myocardial infarction," say "heart attack" and explain it simply as "when blood flow to a part of the heart is blocked," potentially elaborating on what happens and why it's serious, in simple terms.
  - Write a 'conditionSummary': A comprehensive and detailed summary of the patient's specific situation related to this condition, based *directly and extensively on the provided medical report text*. Highlight all key findings, measurements, or observations from the report that are relevant to this particular condition. This summary MUST be in very plain language, easily understandable by someone with no medical background. Explain what the findings mean for the patient in simple, thorough terms.
  - Include an 'explanationOfFindings': Explain IN VERY SIMPLE AND DETAILED TERMS what in the report (e.g., specific observations, lab values, or symptoms mentioned) led to identifying this particular condition. For instance, "This was noted because your report shows your [lab_value_name] is [value], which is higher than the typical range. This is important because [explain significance in simple terms], and this pattern can be associated with [condition] because [explain link simply]."
  - List 'generalCauses': Provide a list of 5-7 common or general causes known for this type of condition. For each cause, provide a brief explanation in simple, non-medical language that clarifies how it might contribute to the condition.
  - List 'commonSymptoms': Provide a list of 5-7 typical symptoms experienced by individuals with this condition. For each symptom, describe it in a way a layperson can easily recognize or understand, perhaps including what it might feel like.
  - If applicable and can be stated generally, provide a detailed 'impactOnDailyLife': Describe in simple, practical terms how this condition might generally affect daily activities or well-being (e.g., "This might sometimes make you feel more tired than usual, potentially affecting your ability to concentrate for long periods or engage in strenuous activities. For example, you might find X more challenging..."). Keep it general, understandable, and provide examples. If not broadly applicable or too complex to simplify, this can be omitted.
  - Suggest a 'departmentRecommendation': Specify ONLY the name of the medical department or type of specialist most appropriate for consultation regarding this condition (e.g., Cardiology, Neurologist, General Practitioner, Vascular Surgeon). DO NOT include any explanation or descriptive text in this field; just the name.
  - Offer personalized and detailed 'dietaryRecommendations', including 'foodsToEatMoreOf' (with brief explanations for why each food group is beneficial) and 'foodsToAvoid' (with brief explanations for why they might be detrimental). These should be practical and easy to follow.
  - Suggest comprehensive 'lifestyleSuggestions', explained clearly and actionably. Provide multiple suggestions covering different aspects like exercise (type, frequency, intensity if appropriate, all simply explained), stress management techniques, sleep hygiene, etc., with a simple rationale for each suggestion.
  - List 3-5 'questionsToAskDoctor' (optional): Provide simple, practical, yet insightful questions the patient could consider asking their doctor about this condition during their next appointment (e.g., "What are the next steps for managing this, and what are the pros and cons of each option?", "Are there specific lifestyle changes I should prioritize, and how can I best implement them?", "How will we monitor this condition going forward, and what signs should I look out for?").
  - Offer 2-3 detailed 'monitoringAdvice' points (optional): Suggest general things the user might pay attention to or monitor regarding their condition (e.g., "Notice if symptoms like [specific symptom] change or worsen, and consider noting when this happens and what you were doing. For example, if you feel X after eating Y, that might be useful information for your doctor.", "It can be helpful to keep a note of how you feel after [activity/food if relevant to condition], or if you notice any new patterns."). Avoid giving medical instructions; suggest general awareness points with examples.

Medical Report Text: {{{medicalReportText}}}

Return the response as structured JSON matching the defined output schema. Ensure the 'healthIssues' array is empty if 'analysisStatus' is 'INVALID_REPORT_CONTENT' or 'VALID_REPORT_NO_ISSUES'.
CRITICAL REMINDER: All specified user-facing text fields in the output JSON MUST be in the language '{{{targetLanguage}}}' and MUST be exceptionally easy for a layperson to understand, while also being VERY LENGTHY AND DETAILED.
`,
});

const extractHealthInsightsFlow = ai.defineFlow(
  {
    name: 'extractHealthInsightsFlow',
    inputSchema: ExtractHealthInsightsInputSchema,
    outputSchema: ExtractHealthInsightsOutputSchema,
  },
  async input => {
    const {output} = await extractHealthInsightsPrompt(input);
    return output!;
  }
);

