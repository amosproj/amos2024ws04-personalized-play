import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppRoutesParams } from '@src/routes';
import type { Timestamp } from 'firebase/firestore';

export type AppNavigation = NativeStackNavigationProp<AppRoutesParams>;

export interface ContextualQuestionProps {
  onNext: () => void;
  component: string;
}

export interface EditAcivityFromData {
  name: string;
  duration: number;
  energy: number;
}

export interface OnboardingFormData {
  name: string;
  numberOfKids: number;
  kidsDetails: Array<{
    name: string;
    age: number;
    gender: string;
    healthConsiderations: {
      isConsidered: string;
      considerations: Array<string>;
      chronicIllness: string;
      other: string;
    };
  }>;
  energyLevel: number;
  time: number;
  activityType: string;
}

export interface User {
  displayName: string;
  email: string;
  lastSignIn: Timestamp;
  relationship: string;
}

export interface Kid {
  name: string;
  birthdate: Timestamp;
  gestationalAge: number;
  gender: string;
  healthConsiderations: {
    isConsidered: boolean;
    considerations: Array<string>;
    chronicIllness: string;
    other: string;
  };
}
