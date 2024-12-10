import { gemini15Pro } from '@genkit-ai/vertexai';
import { fireGenkit } from '@src/firebase';
import { chorsGeneratorAgentSystemPrompt, formatUserMessage } from './helpers';
import { chorsGeneratorAgentInputSchema, chorsGeneratorAgentOutputSchema } from './schema';

export const chorsGeneratorAgent = fireGenkit.definePrompt(
  {
    name: 'ChorsGeneratorAgent',
    description: 'Generate Chors for a given activity',
    input: {
      schema: chorsGeneratorAgentInputSchema
    },
    output: {
      format: 'json',
      schema: chorsGeneratorAgentOutputSchema
    },
    model: gemini15Pro
  },
  async (input) => {
    return {
      messages: [
        {
          role: 'system',
          content: [{ text: chorsGeneratorAgentSystemPrompt }]
        },
        {
          role: 'user',
          content: [{ text: formatUserMessage(input) }]
        }
      ]
    };
  }
);
