import { firebaseAuth } from '@genkit-ai/firebase/auth';
import { onFlow } from '@genkit-ai/firebase/functions';
import { Collections } from '@src/constants';
import { fireGenkit, fireStore } from '@src/firebase';
import type { Activity, Kid, User } from '@src/types';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { getFlowAuth, z } from 'genkit';
import { chorsGeneratorAgent } from './agent';

export const ChorsGeneratorFlow = onFlow(
  fireGenkit,
  {
    name: 'ChorsGeneratorFlow',
    inputSchema: z.object({
      activityId: z.string().describe('Activity ID')
    }),
    authPolicy: firebaseAuth((user) => {
      if (!user.uid) throw new Error('Authentication required');
    })
  },
  async (input) => {
    const { activityId } = input;
    const { uid } = getFlowAuth() as DecodedIdToken;
    const [uDoc, aDoc, kidsDocs] = await Promise.all([
      fireStore.doc(`${Collections.USERS}/${uid}`).get(),
      fireStore.doc(`${Collections.USERS}/${uid}/${Collections.ACTIVITIES}/${activityId}`).get(),
      fireStore.collection(`${Collections.USERS}/${uid}/${Collections.KIDS}`).get()
    ]);
    const uDocData = uDoc.data() as User;
    const aDocData = aDoc.data() as Activity;
    const kids = kidsDocs.docs.map((doc) => doc.data()) as Kid[];
    const { text } = await chorsGeneratorAgent({
      guardianName: uDocData.displayName,
      energyLevel: aDocData.energyLevel,
      time: aDocData.time,
      objects: aDocData.objects,
      skillsToBeIntegrated: aDocData.skillsToBeIntegrated,
      kids: kids.map((kid) => ({
        name: kid.name,
        age: kid.age,
        biologicalSex: kid.biologicalSex,
        healthConsiderations: kid.healthConsiderations
      }))
    });
    await fireStore
      .doc(`${Collections.USERS}/${uid}/${Collections.ACTIVITIES}/${activityId}`)
      .update({
        activity: JSON.parse(text)
      });
    return JSON.parse(text);
  }
);
