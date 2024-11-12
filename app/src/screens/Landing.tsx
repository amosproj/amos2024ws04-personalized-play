import { useNavigation } from '@react-navigation/native';
import { Button, Text } from '@shadcn/components';
import { H2 } from '@shadcn/components/ui/typography';
import { Screens, Stacks } from '@src/constants';
import type { AppNavigation } from '@src/types';
import { Asset } from 'expo-asset';
import type * as React from 'react';
import { Image, View } from 'react-native';

export const Landing: React.FC = () => {
  // Load the image asset
  const image = Asset.fromModule(require('../../assets/landing.png')).uri;
  const {navigate} = useNavigation<AppNavigation>();

  return (
    <View className='flex-1 flex-col justify-center items-center'>
      <Image
        source={{ uri: image }}
        className='w-[95%] h-auto left-16 aspect-square'
        resizeMode='contain'
        key={'landing-image'}
      />
      <H2 className='text-center mt-4'>Welcome to MUMBI!</H2>
      <Button size={'lg'} className='rounded-full margin-2 px-1 ' onPress={() => navigate(Stacks.UnAuth, {screen: Screens.SignIn})}>
        <Text>Sign In</Text>
      </Button>
      <Button size={'lg'} className='rounded-full  margin-2 px-1 ' onPress={() => navigate(Stacks.UnAuth, {screen: Screens.SignUp})}>
        <Text>Sign Up</Text>
      </Button>
    </View>
  );
};
