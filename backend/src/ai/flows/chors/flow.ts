import { firebaseAuth } from '@genkit-ai/firebase/auth';
import { onFlow } from '@genkit-ai/firebase/functions';
import { Collections } from '@src/constants';
import { fireGenkit, fireStorage, fireStore, gcloudTTS } from '@src/firebase';
import type { Activity, Kid, User } from '@src/types';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { getFlowAuth, z } from 'genkit';
import { chorsGeneratorAgent } from './agent';
import type { chorsGeneratorAgentOutputSchema } from './schema';

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
    try {
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
      const activity: z.infer<typeof chorsGeneratorAgentOutputSchema> = JSON.parse(text);
      const updatedSteps = await Promise.all(
        activity.steps.map(async (step, index) => {
          const [response] = await gcloudTTS.synthesizeSpeech({
            input: { text: step.instructions },
            voice: { languageCode: 'en-US', name: 'en-US-Journey-O' },
            audioConfig: { audioEncoding: 'MP3' }
          });
          if (response.audioContent) {
            const filePath = `activities/${activityId}/step-${index + 1}.mp3`;
            await fireStorage.bucket().file(filePath).save(response.audioContent);
            const publicUrl = `https://storage.googleapis.com/${fireStorage.bucket().name}/${filePath}`;
            return { ...step, audioUrl: publicUrl };
          }
          return step;
        })
      );
      await fireStore
        .doc(`${Collections.USERS}/${uid}/${Collections.ACTIVITIES}/${activityId}`)
        .update({
          activity: { ...activity, steps: updatedSteps }
        });
      return { ...activity, steps: updatedSteps };
    } catch (error) {
      console.error('Error generating chores:', error);
      return { error: (error as Error).message };
    }
  }
);
