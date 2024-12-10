import type { Timestamp } from 'firebase-admin/firestore';

export interface User {
  id?: string;
  displayName: string;
  email: string;
  lastSignIn: Timestamp;
}

export interface Kid {
  id?: string;
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
  objects: string[];
  skillsToBeIntegrated: string[];
  name: string;
  description: string;
  kids: string[];
  createdAt: Timestamp;
}
