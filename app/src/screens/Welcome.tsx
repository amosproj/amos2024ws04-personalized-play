import { useNavigation } from '@react-navigation/native';
import { Button, Text } from '@shadcn/components';
import { H2 } from '@shadcn/components/ui/typography';
import { Screens, Stacks, fireAuth, fireStore } from '@src/constants';
import type { AppNavigation } from '@src/types';
import { Asset } from 'expo-asset';
import { doc, getDoc } from 'firebase/firestore';
import type * as React from 'react';
import { useEffect, useState } from 'react';
import { Image, View } from 'react-native';

export const Welcome: React.FC = () => {
  const image = Asset.fromModule(require('../../assets/landing.png')).uri;
  const { navigate } = useNavigation<AppNavigation>();
  const [hasSeenWelcome, setHasSeenWelcome] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [visited, setVisited] = useState<boolean>(false);

  useEffect(() => {
    const checkUserInFirestore = async () => {
      try {
        setLoading(true);
        const user = fireAuth.currentUser;
        if (!user) return;
        const docRef = doc(fireStore, 'users', user.uid);
        const docSnap = await getDoc(docRef);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    checkUserInFirestore();
  }, []);

  const handleContinue = () => {
    navigate(Stacks.Auth, { screen: Screens.Home });
  };

  return (
    <View className='flex-1 flex-col justify-center items-center p-4'>
      <Image
        source={{ uri: image }}
        className='w-[95%] h-auto left-16 aspect-square'
        resizeMode='contain'
        key={'landing-image'}
      />
      <H2 className='text-center mt-4'>Welcome to COGNIKIDS!</H2>
      <Button size={'lg'} className='w-full rounded-full mb-2' onPress={handleContinue}>
        <Text>Continue session</Text>
      </Button>
      <Button
        size={'lg'}
        className='w-full rounded-full'
        onPress={() => navigate(Stacks.Auth, { screen: Screens.Home })}
      >
        <Text>Home</Text>
      </Button>
    </View>
  );
};
