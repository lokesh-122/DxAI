// src/ai/flows/determine-condition-severity.ts
'use server';

/**
 * @fileOverview Determines the severity/stage of a medical condition based on report text.
 *
 * - determineConditionSeverity - Function to determine the severity of a condition.
 * - DetermineConditionSeverityInput - Input type for the function.
 * - DetermineConditionSeverityOutput - Output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetermineConditionSeverityInputSchema = z.object({
  conditionName: z.string().describe('The name of the medical condition.'),
  reportText: z.string().describe('The relevant text from the medical report.'),
});
export type DetermineConditionSeverityInput = z.infer<typeof DetermineConditionSeverityInputSchema>;

const DetermineConditionSeverityOutputSchema = z.object({
  severity: z.string().describe('The severity or stage of the condition (e.g., Mild, Moderate, Severe, Stage 1, Stage 2).'),
  rationale: z.string().describe('Explanation of why the condition has been classified with the given severity.'),
});
export type DetermineConditionSeverityOutput = z.infer<typeof DetermineConditionSeverityOutputSchema>;

export async function determineConditionSeverity(input: DetermineConditionSeverityInput): Promise<DetermineConditionSeverityOutput> {
  return determineConditionSeverityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'determineConditionSeverityPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: {schema: DetermineConditionSeverityInputSchema},
  output: {schema: DetermineConditionSeverityOutputSchema},
  prompt: `You are an expert medical analyst. Based on the medical report text provided and the identified condition, determine the stage or severity of the condition.

Condition: {{{conditionName}}}

Medical Report Text: {{{reportText}}}

Provide the severity and a brief rationale for your determination. The severity should be chosen from terms such as Mild, Moderate, Severe, Stage 1, Stage 2, etc.
Ensure that the rationale explains how you reached this conclusion based on the provided medical report text, including any relevant lab values or observations.

Output the result in JSON format.
`,
});

const determineConditionSeverityFlow = ai.defineFlow(
  {
    name: 'determineConditionSeverityFlow',
    inputSchema: DetermineConditionSeverityInputSchema,
    outputSchema: DetermineConditionSeverityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
