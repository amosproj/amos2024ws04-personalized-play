import { Text } from '@shadcn/components';
import { View, type ViewProps } from 'react-native';
import { Slider } from 'react-native-awesome-slider';
import { useSharedValue } from 'react-native-reanimated';

export const ContextualQuestionEnergyLevel: React.FC<ViewProps> = () => {
  return (
    <View className='flex flex-1 items-stretch justify-center'>
      <View className='flex flex-1 flex-col items-center mb-4'>{/*  */}</View>
      <View className='flex flex-1 flex-col items-stretch'>
        <Text className='text-2xl text-center font-medium mb-6'>What is your energy level?</Text>
        <Text className='text-lg text-center'>
          Empty battery or fully charged? Let us know how you're feeling today.
        </Text>
        <View className='h-[48px] items-stretch justify-center'>
          <Slider
            style={{ width: '80%', alignSelf: 'center' }}
            minimumValue={useSharedValue(0)}
            maximumValue={useSharedValue(100)}
            progress={useSharedValue(50)}
          />
        </View>
      </View>
    </View>
  );
};
