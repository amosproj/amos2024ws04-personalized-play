import { useNavigation } from '@react-navigation/native';
import { Button, Text } from '@shadcn/components';
import { Separator } from '@shadcn/components/ui/separator';
import { AppLogo } from '@src/components';
import { Screens, Stacks } from '@src/constants';
import type { AppNavigation } from '@src/types';
import type React from 'react';
import { View } from 'react-native';

export const Welcome: React.FC = () => {
  const { navigate } = useNavigation<AppNavigation>();

  return (
    <View className='flex flex-1 flex-col justify-center items-center px-6'>
      <AppLogo height={100} width={80} />
      <Text className='text-3xl font-medium mt-4 mb-2'>Welcome to MUMBI</Text>
      <Text className='text-lg mb-16 text-center'>
        We are going to ask a few questions before we can suggest a personalized playground for your
        kids.
      </Text>
      <Button
        className='w-full'
        size={'lg'}
        onPress={() => navigate(Stacks.Auth, { screen: Screens.Onboarding })}
      >
        <Text>Get Started</Text>
      </Button>
      <View className='flex flex-row justify-center items-center my-4'>
        <Separator className='w-1/4' />
        <Text className='mx-4'>Or</Text>
        <Separator className='w-1/4' />
      </View>
      <Button
        className='w-full'
        size={'lg'}
        variant={'secondary'}
        onPress={() => navigate(Stacks.Auth, { screen: Screens.Home })}
      >
        <Text>Skip</Text>
      </Button>
    </View>
  );
};
