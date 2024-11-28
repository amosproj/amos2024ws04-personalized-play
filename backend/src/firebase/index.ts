import vertexAI from '@genkit-ai/vertexai';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { genkit } from 'genkit';

const fireApp = initializeApp();
const fireAuth = getAuth(fireApp);
const fireStore = getFirestore(fireApp);

const mumbiAI = genkit({
  plugins: [vertexAI({ projectId: 'mumbi-amos', location: 'us-central1' })]
});

export { fireApp, fireAuth, fireStore, mumbiAI };
