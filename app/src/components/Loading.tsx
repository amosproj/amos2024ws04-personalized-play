import { Text } from '@shadcn/components';
import type React from 'react';
import { View } from 'react-native';
import { AppLogo } from './AppLogo';

interface LoadingProps {
  heading?: string;
  description?: string;
}

export const Loading: React.FC<LoadingProps> = (props) => {
  const { heading, description } = props;
  return (
    <View className='flex flex-1 items-center justify-center animate-pulse'>
      <AppLogo height={150} width={120} />
      <Text className='text-3xl font-medium mt-4'>
        {heading !== undefined ? heading : 'Loading...'}
      </Text>
      <Text className='text-lg mt-2'>
        {description !== undefined ? description : 'Please wait while we load the content.'}
      </Text>
    </View>
  );
};
