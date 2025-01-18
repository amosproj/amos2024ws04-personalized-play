import { Collections } from '@src/constants';
import { fireStore } from '@src/firebase';
import { Timestamp } from 'firebase-admin/firestore';
import { auth, logger } from 'firebase-functions/v1';

// Firebase Authentication triggers
const handleUserCreation = auth.user().onCreate(async (user) => {
  const { email, displayName, uid } = user;
  try {
    await fireStore.collection(Collections.USERS).doc(uid).set({
      displayName,
      email,
      lastSignIn: Timestamp.now(),
      createdAt: Timestamp.now(),
      isOnboarded: false
    });
  } catch (error) {
    logger.error('Error creating user', error);
  }
});

const handleUserDeletion = auth.user().onDelete(async (user) => {
  const { uid } = user;
  try {
    await fireStore.collection(Collections.USERS).doc(uid).delete();
  } catch (error) {
    logger.error('Error deleting user', error);
  }
});

export { handleUserCreation, handleUserDeletion };
