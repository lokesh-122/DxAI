// src/ai/flows/generate-lifestyle-recommendations.ts
'use server';

/**
 * @fileOverview Generates personalized lifestyle recommendations based on extracted health issues.
 *
 * - generateLifestyleRecommendations - A function that generates lifestyle recommendations.
 * - GenerateLifestyleRecommendationsInput - The input type for the generateLifestyleRecommendations function.
 * - GenerateLifestyleRecommendationsOutput - The return type for the generateLifestyleRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLifestyleRecommendationsInputSchema = z.object({
  healthIssues: z
    .array(
      z.object({
        condition: z.string(),
        stage: z.string(),
      })
    )
    .describe('An array of health issues with their condition and stage.'),
});

export type GenerateLifestyleRecommendationsInput = z.infer<
  typeof GenerateLifestyleRecommendationsInputSchema
>;

const GenerateLifestyleRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('An array of personalized lifestyle recommendations.'),
});

export type GenerateLifestyleRecommendationsOutput = z.infer<
  typeof GenerateLifestyleRecommendationsOutputSchema
>;

export async function generateLifestyleRecommendations(
  input: GenerateLifestyleRecommendationsInput
): Promise<GenerateLifestyleRecommendationsOutput> {
  return generateLifestyleRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLifestyleRecommendationsPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: {schema: GenerateLifestyleRecommendationsInputSchema},
  output: {schema: GenerateLifestyleRecommendationsOutputSchema},
  prompt: `You are an AI health assistant that provides personalized lifestyle recommendations based on a user's health issues.

  Given the following health issues and their severities, generate lifestyle recommendations the user can follow to mitigate them. Focus on diet, exercise, stress management, and sleep.
  Format the answer as a list of strings.
  Health Issues:
  {{#each healthIssues}}
  - Condition: {{this.condition}}, Stage: {{this.stage}}
  {{/each}}
  `,
});

const generateLifestyleRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateLifestyleRecommendationsFlow',
    inputSchema: GenerateLifestyleRecommendationsInputSchema,
    outputSchema: GenerateLifestyleRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
