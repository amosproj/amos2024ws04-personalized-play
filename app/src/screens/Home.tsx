import { useNavigation } from '@react-navigation/native';
import { Button, Text } from '@shadcn/components';
import { Collections, Screens, Stacks, fireAuth, fireStore } from '@src/constants';
import type { AppNavigation } from '@src/types';
import { doc, getDoc } from 'firebase/firestore';
import { CircleArrowRight } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { View } from 'react-native';

export const Home: React.FC = () => {
  const { navigate } = useNavigation<AppNavigation>();
  const [user, _] = useAuthState(fireAuth);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  const getUserData = async () => {
    if (!user) return;
    try {
      const userDocRef = doc(fireStore, Collections.Users, user.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        // Document exists - you can access the data
        return docSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  };

  const isUserOnboarded = async () => {
    const userData = await getUserData();
    if (!userData) {
      return false;
    }
    return userData.isOnboarded;
  };

  useEffect(() => {
    const checkUserOnboarded = async () => {
      const userOnboarded = await isUserOnboarded();
      setIsOnboarded(userOnboarded);
      setIsLoading(false);
    };
    checkUserOnboarded();
  }, []);

  //if (isLoading) {
  //  return <Loading heading='Loading...' description='Please wait while we load the content.' />;
  //}

  const onNewPlayPressed = () => {
    if (isOnboarded) {
      navigate(Stacks.Auth, { screen: Screens.NewPlay });
      return;
    }
    navigate(Stacks.Auth, { screen: Screens.Onboarding });
  };

  return (
    <View className='flex-1 items-center justify-center'>
      <Button
        className='w-full max-w-sm h-20 bg-primary'
        onPress={onNewPlayPressed}
        disabled={isLoading}
      >
        <View className='flex-row items-center justify-between w-full px-6'>
          <Text className='text-primary-foreground text-lg font-medium'>Wonna Play?</Text>
          <CircleArrowRight color='white' size={24} />
        </View>
      </Button>
    </View>
  );
};
