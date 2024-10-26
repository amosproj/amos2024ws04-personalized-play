/**
 * Expo configuration for the mobile application.
 *
 * This file dynamically loads environment variables using `dotenv`, allowing secure
 * management of sensitive information (e.g., API keys) without hardcoding them.
 *
 * Key components:
 * - `slug` and `name`: Identifiers for the app; defaults to empty strings if not set.
 * - `ios.googleServicesFile` & `android.googleServicesFile`: Paths to Google services
 *   configuration files needed for Firebase integration.
 * - `extra`: Contains additional configuration details, including Firebase and Google Auth
 *   credentials.
 *
 * Importance:
 * - This configuration enables the app to access necessary services securely.
 * - Modifying or removing this file could lead to missing environment variables, breaking
 *   integrations, and exposing sensitive data.
 */

import { config } from "dotenv";
import type { ConfigContext, ExpoConfig } from "expo/config";

// Load environment variables from a .env file
config();

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: config.slug || "cognikids",
  name: process.env.APP_NAME || config.name || "CogniKids",
  ios: {
    ...config.ios,
    googleServicesFile: process.env.GOOGLE_SERVICE_INFO,
  },
  android: {
    ...config.android,
    googleServicesFile: process.env.GOOGLE_SERVICE_JSON,
  },
  extra: {
    ...config.extra,
    firebase: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    },
    googleAuthClientId: process.env.GOOGLE_AUTH_CLIENT_ID,
  },
});
