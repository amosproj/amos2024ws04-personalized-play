import { z } from 'genkit';

export const chorsGeneratorAgentInputSchema = z.object({
  guardianName: z
    .string()
    .describe(
      'The name of the guardian of the child who will be doing the activity with the child or children.'
    ),
  energyLevel: z.enum(['low', 'medium', 'high']).describe('The energy level of the guardian.'),
  time: z.number().describe('The time in minutes that the guardian has to do the activity.'),
  objects: z
    .array(z.string())
    .describe('The list of objects that the guardian has available for the activity.'),
  skillsToBeIntegrated: z
    .array(z.string())
    .describe('The list of skills to be integrated in the activity.'),
  kids: z
    .array(
      z.object({
        name: z.string().describe('The name of the child.'),
        age: z.number().describe('The age of the child in months.'),
        biologicalSex: z
          .enum(['male', 'female', 'other'])
          .describe('The biological sex of the child.'),
        healthConsiderations: z
          .array(z.string())
          .describe('The list of health considerations of the child.')
      })
    )
    .describe('The list of children who will be doing the activity.')
});

export const chorsGeneratorAgentOutputSchema = z.object({
  name: z.string().describe('The name of the activity.'),
  description: z.string().describe('The description of the activity.'),
  totalDuration: z.number().describe('The total duration of the activity in minutes.'),
  benefits: z.string().describe('The benefits of the activity.'),
  scienceBehind: z.string().describe('The science behind the activity.'),
  steps: z
    .array(
      z.object({
        instructions: z.string().describe('The plain text instructions for the step.'),
        duration: z.number().describe('The duration of the step in minutes.')
      })
    )
    .describe('The list of steps for the activity.')
});
