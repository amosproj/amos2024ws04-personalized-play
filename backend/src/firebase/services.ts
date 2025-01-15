import vertexAI, { gemini15Pro } from '@genkit-ai/vertexai';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { defineString } from 'firebase-functions/params';
import { genkit } from 'genkit';

// firebase services
const fireApp = initializeApp();
const fireAuth = getAuth(fireApp);
const fireStore = getFirestore(fireApp, 'mumbi-amos');
fireStore.settings({ ignoreUndefinedProperties: true });
const fireStorage = getStorage(fireApp);

// google cloud services
const gcloudTTS = new TextToSpeechClient({
  apiKey: defineString('GOOGLE_TTS_API').value()
});

// firebase ai services
const fireGenkit = genkit({
  plugins: [vertexAI()],
  model: gemini15Pro
});

export { fireApp, fireAuth, fireStore, fireGenkit, fireStorage, gcloudTTS };
