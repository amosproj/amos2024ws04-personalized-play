import { generate } from '@genkit-ai/ai';
import { firebaseAuth } from '@genkit-ai/firebase/auth';
import { onFlow } from '@genkit-ai/firebase/functions';
import { gemini15Flash } from '@genkit-ai/vertexai';
import { fireGenkit } from '@src/firebase';
import { z } from 'genkit';

export const itemsInImage = onFlow(
  fireGenkit,
  {
    name: 'Items in Image',
    inputSchema: z.object({
      image: z.string().describe('Base64 encoded image')
    }),
    outputSchema: z
      .array(z.string().describe('Item name'))
      .describe('List of items found in the image'),
    authPolicy: firebaseAuth((user) => {
      if (!user.uid) throw new Error('Authentication required');
    })
  },
  async (input): Promise<string[]> => {
    const response = await generate(fireGenkit.registry, {
      model: gemini15Flash,
      output: {
        schema: z
          .array(z.string().describe('Item name'))
          .describe('List of items found in the image'),
        format: 'json'
      },
      prompt: [
        {
          media: {
            url: `data:image/png;base64,${input.image}`,
            contentType: 'image/jpeg'
          }
        },
        {
          text: 'Analyze the given image and identify all distinct items within it. Return the list of detected items in an array format.'
        }
      ]
    });
    console.log(response.toJSON());
    return JSON.parse(response.text);
  }
);
