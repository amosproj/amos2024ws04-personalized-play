import * as z from 'zod';

// Import the Genkit core libraries and plugins.
import { generate } from '@genkit-ai/ai';
import { configureGenkit } from '@genkit-ai/core';
import { firebase } from '@genkit-ai/firebase';
import { vertexAI } from '@genkit-ai/vertexai';

// Import models from the Vertex AI plugin. The Vertex AI API provides access to
// several generative models. Here, we import Gemini 1.5 Flash.
import { gemini15Flash } from '@genkit-ai/vertexai';

// From the Firebase plugin, import the functions needed to deploy flows using
// Cloud Functions.
import { firebaseAuth } from '@genkit-ai/firebase/auth';
import { onFlow } from '@genkit-ai/firebase/functions';

configureGenkit({
  plugins: [
    // Load the Firebase plugin, which provides integrations with several
    // Firebase services.
    firebase(),
    // Load the Vertex AI plugin. You can optionally specify your project ID
    // by passing in a config object; if you don't, the Vertex AI plugin uses
    // the value from the GCLOUD_PROJECT environment variable.
    vertexAI({ location: 'us-central1' })
  ],
  // Log debug output to tbe console.
  logLevel: 'debug',
  // Perform OpenTelemetry instrumentation and enable trace collection.
  enableTracingAndMetrics: true
});

// Define a simple flow that prompts an LLM to generate menu suggestions.
export const menuSuggestionFlow = onFlow(
  {
    name: 'menuSuggestionFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
    authPolicy: firebaseAuth((user) => {
      // By default, the firebaseAuth policy requires that all requests have an
      // `Authorization: Bearer` header containing the user's Firebase
      // Authentication ID token. All other requests are rejected with error
      // 403. If your app client uses the Cloud Functions for Firebase callable
      // functions feature, the library automatically attaches this header to
      // requests.
      // You should also set additional policy requirements as appropriate for
      // your app. For example:
    })
  },
  // @ts-ignore
  async (subject) => {
    // Construct a request and send it to the model API.
    const prompt = `greet given person with Hi ${subject}!`;
    const llmResponse = await generate({
      model: gemini15Flash,
      prompt: prompt,
      config: {
        temperature: 1
      }
    });
    console.log(process.env.TEST);
    // Handle the response from the model API. In this sample, we just
    // convert it to a string, but more complicated flows might coerce the
    // response into structured output or chain the response into another
    // LLM call, etc.
    return llmResponse.text();
  }
);
