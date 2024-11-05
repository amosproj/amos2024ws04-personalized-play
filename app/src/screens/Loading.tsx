import { Text } from '@shadcn/components';
import { View } from 'react-native';

export const Loading: React.FC = () => {
  return (
    <View className='flex flex-1 items-center justify-center'>
      <Text>Loading</Text>
    </View>
  );
};
