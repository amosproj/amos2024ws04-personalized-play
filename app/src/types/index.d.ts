import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppRoutesParams } from '@src/routes';
import type { Timestamp } from 'firebase/firestore';

export type AppNavigation = NativeStackNavigationProp<AppRoutesParams>;

export interface ContextualQuestionProps {
  onNext: () => void;
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
  };
}
