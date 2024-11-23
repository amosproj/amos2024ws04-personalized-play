import { GoogleAuthProvider, signInWithCredential } from '@firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import { Button, Text } from '@shadcn/components';
import { Stacks, fireAuth } from '@src/constants';
import type { AppNavigation } from '@src/types';
import Constants from 'expo-constants';
import { IconGoogle } from './IconGoogle';

export const GoogleSignInButton: React.FC = () => {
  const { reset } = useNavigation<AppNavigation>();

  const onSignInWithGoogle = async () => {
    try {
      GoogleSignin.configure({
        webClientId: Constants.expoConfig?.extra?.googleAuthClientId,
        forceCodeForRefreshToken: true
      });
      const { data } = await GoogleSignin.signIn();
      const credential = GoogleAuthProvider.credential(data?.idToken);
      await signInWithCredential(fireAuth, credential);
      reset({ index: 0, routes: [{ name: Stacks.Auth }] });
    } catch (error) {
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
