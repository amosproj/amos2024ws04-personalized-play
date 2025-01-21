import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { Skills } from '@src/constants';
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
  displayName: string;
  numberOfKids: number;
  kids: Kid[];
  energyLevel: 'low' | 'medium' | 'high';
  time: number;
  type: string;
  objects: string[];
  skillsToBeIntegrated: Skills[];
  image: string;
  choreType: string;
}

export interface User {
  displayName: string;
  email: string;
  lastSignIn: Timestamp;
  createdAt: Timestamp;
  isOnboarded: boolean;
}

export interface Kid {
  name: string;
  age: number;
  biologicalSex: 'male' | 'female' | 'other';
  healthConsiderations: string[];
}

export interface Activity { 
  id?: string;
  energyLevel: 'low' | 'medium' | 'high';
  time: number;
  type: string;
  choreType: string;
  objects: string[];
  skillsToBeIntegrated: string[];
  name: string;
  description: string;
  kids: string[];
  createdAt: Timestamp;
  favorite: boolean?;
  activity: {
    name: string;
    description: string;
    totalDuration: number;
    benefits: string;
    scienceBehind: string;
    steps: {
      instructions: string;
      duration: number;
      audioUrl: string;
    }[];
  };
}

export interface NewPlayFormData {
  selectKids: Array;
  energyLevel: number;
  time: number;
  activityType: string;
}

export interface HistoryActivity { 
  id?: string;
  activity: string;
  description: string;
  isFavourite: boolean?;
}