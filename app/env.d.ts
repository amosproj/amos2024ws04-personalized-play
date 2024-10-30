declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * Path to the GoogleService-Info.plist file for iOS.
     */
    GOOGLE_SERVICE_INFO: string;

    /**
     * Path to the google-services.json file for Android.
     */
    GOOGLE_SERVICE_JSON: string;

    /**
     * Firebase API key.
     */
    FIREBASE_API_KEY: string;

    /**
     * Firebase Auth domain.
     */
    FIREBASE_AUTH_DOMAIN: string;

    /**
     * Firebase Project ID.
     */
    FIREBASE_PROJECT_ID: string;

    /**
     * Firebase Storage Bucket.
     */
    FIREBASE_STORAGE_BUCKET: string;

    /**
     * Firebase Messaging Sender ID.
     */
    FIREBASE_MESSAGING_SENDER_ID: string;

    /**
     * Firebase App ID.
     */
    FIREBASE_APP_ID: string;

    /**
     * Firebase Measurement ID.
     */
    FIREBASE_MEASUREMENT_ID: string;

    /**
     * Google Auth Client ID.
     */
    GOOGLE_AUTH_CLIENT_ID: string;
  }
}
