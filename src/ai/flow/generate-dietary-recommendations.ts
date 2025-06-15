// src/ai/flows/generate-dietary-recommendations.ts
'use server';

/**
 * @fileOverview Generates personalized dietary recommendations based on health issues and their severities.
 *
 * - generateDietaryRecommendations - A function that generates dietary recommendations.
 * - GenerateDietaryRecommendationsInput - The input type for the generateDietaryRecommendations function.
 * - GenerateDietaryRecommendationsOutput - The return type for the generateDietaryRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDietaryRecommendationsInputSchema = z.object({
  healthIssues: z.array(
    z.object({
      condition: z.string().describe('The name of the health condition.'),
      stage: z.string().describe('The severity stage of the condition (e.g., Mild, Moderate, Severe).'),
    })
  ).describe('An array of health issues detected in the medical report, with their severities.'),
});
export type GenerateDietaryRecommendationsInput = z.infer<typeof GenerateDietaryRecommendationsInputSchema>;

const GenerateDietaryRecommendationsOutputSchema = z.object({
  dietaryRecommendations: z.array(
    z.object({
      condition: z.string().describe('The name of the health condition.'),
      foodsToEatMoreOf: z.string().describe('Foods to eat more of for this condition.'),
      foodsToAvoid: z.string().describe('Foods to avoid for this condition.'),
      lifestyleSuggestions: z.string().describe('General lifestyle suggestions for this condition.'),
    })
  ).describe('An array of dietary recommendations for each health condition.'),
});
export type GenerateDietaryRecommendationsOutput = z.infer<typeof GenerateDietaryRecommendationsOutputSchema>;

export async function generateDietaryRecommendations(input: GenerateDietaryRecommendationsInput): Promise<GenerateDietaryRecommendationsOutput> {
  return generateDietaryRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDietaryRecommendationsPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: {schema: GenerateDietaryRecommendationsInputSchema},
  output: {schema: GenerateDietaryRecommendationsOutputSchema},
  prompt: `You are a registered dietitian. Generate personalized dietary and lifestyle recommendations based on the
  following health issues and their severities. Provide foods to eat more of, foods to avoid, and general lifestyle
  suggestions for each condition.

  Health Issues:
  {{#each healthIssues}}
  - Condition: {{this.condition}}
    Stage: {{this.stage}}
  {{/each}}

  Format the response as a JSON array of dietary recommendations for each health condition, including specific foods to eat more of, foods to avoid, and lifestyle suggestions. The JSON must match the schema exactly.
  `,
});

const generateDietaryRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateDietaryRecommendationsFlow',
    inputSchema: GenerateDietaryRecommendationsInputSchema,
    outputSchema: GenerateDietaryRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
