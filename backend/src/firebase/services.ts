import vertexAI, { gemini15Pro } from '@genkit-ai/vertexai';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { genkit } from 'genkit';

// firebase services
const fireApp = initializeApp();
const fireAuth = getAuth(fireApp);
const fireStore = getFirestore(fireApp);
fireStore.settings({ ignoreUndefinedProperties: true });

// firebase ai services
const fireGenkit = genkit({
  plugins: [vertexAI()],
  model: gemini15Pro
});

export { fireApp, fireAuth, fireStore, fireGenkit };
