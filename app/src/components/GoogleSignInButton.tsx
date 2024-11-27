import { GoogleAuthProvider, getAdditionalUserInfo, signInWithCredential } from '@firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import { Button, Text } from '@shadcn/components';
import { Collections, Screens, Stacks, fireAuth, fireStore } from '@src/constants';
import type { AppNavigation } from '@src/types';
import Constants from 'expo-constants';
import { Timestamp, doc, getDoc, setDoc } from 'firebase/firestore';
import { IconGoogle } from './IconGoogle';

export const GoogleSignInButton: React.FC = () => {
  const { reset } = useNavigation<AppNavigation>();

  /**
   * Handles sign-in with Google and navigates the user based on their profile status.
   */
  const onSignInWithGoogle = async () => {
    try {
      // Configure Google Sign-In with the web client ID
      GoogleSignin.configure({
        webClientId: Constants.expoConfig?.extra?.googleAuthClientId,
        forceCodeForRefreshToken: true
      });

      // Perform Google Sign-In
      const { data } = await GoogleSignin.signIn();

      // Get Firebase credential from Google ID token
      const credential = GoogleAuthProvider.credential(data?.idToken);

      // Sign in to Firebase with the credential
      const userCredential = await signInWithCredential(fireAuth, credential);

      // Reference to the user's document in Firestore
      const userDocRef = doc(fireStore, Collections.Users, userCredential.user.uid);

      // Fetch existing user data and additional user info concurrently
      const [docData, userInfo] = await Promise.all([
        getDoc(userDocRef),
        getAdditionalUserInfo(userCredential)
      ]);

      // Prepare user data for Firestore if the user document does not exist
      const userData = docData.exists()
        ? {}
        : { displayName: userCredential.user.displayName, email: userCredential.user.email };

      // Update Firestore with user data and last sign-in timestamp
      await setDoc(userDocRef, { ...userData, lastSignIn: Timestamp.now() }, { merge: true });

      // Reset navigation stack and navigate to the appropriate screen
      reset({
        index: 0,
        routes: [
          {
            name: Stacks.Auth,
            params: { screen: userInfo?.isNewUser ? Screens.Welcome : Screens.Home }
          }
        ]
      });
    } catch (error) {
      // Log any errors encountered during the sign-in process
      console.error(error);
    }
  };

  return (
    <Button
      size={'lg'}
      className='flex flex-row items-center justify-center bg-white rounded-xl border px-6 native:h-14 native:py-2'
      onPress={onSignInWithGoogle}
    >
      <IconGoogle />
      <Text className='text-foreground ml-4 native:text-xl'>Sign in with Google</Text>
    </Button>
  );
};
