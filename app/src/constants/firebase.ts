import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { type FirebaseApp, type FirebaseOptions, initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// Firebase Configuration
const firebaseConfig: FirebaseOptions = {
  ...Constants.expoConfig?.extra?.firebase
};

// Initialize Firebase
const fireApp: FirebaseApp = initializeApp(firebaseConfig);

// Firebase Auth
const fireAuth = initializeAuth(fireApp, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Firestore
const fireStore = getFirestore(fireApp, 'mumbi-amos');

// Firebase Functions
const fireFunction = getFunctions(fireApp);

// Firestore collections
enum Collections {
  Users = 'users',
  Kids = 'kids',
  Activities = 'activities'
}

export { fireApp, fireAuth, fireStore, fireFunction, Collections };
