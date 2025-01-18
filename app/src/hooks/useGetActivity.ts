import { Collections, fireAuth, fireStore } from '@src/constants';
import type { Activity } from '@src/types';
import { doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';

export const useGetActivity = (activityId: string) => {
  const [user] = useAuthState(fireAuth);
  if (!user) return;
  const aDocRef = doc(fireStore, Collections.Users, user.uid, Collections.Activities, activityId);
  const [value, loading, error, reload] = useDocumentDataOnce(aDocRef);
  return { data: value as Activity, isLoading: loading, error, reload };
};
