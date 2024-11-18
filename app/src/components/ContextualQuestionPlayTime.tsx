import { Text } from '@shadcn/components';
import { Asset } from 'expo-asset';
import { useEffect } from 'react';
import { Image, View } from 'react-native';
import type { OnboardingType } from '../types/OnboardingType';
import { SliderExample } from './Slider';

export const ContextualQuestionPlayTime = ({
  type,
  setCurrentScreenAnswered
}: { type: OnboardingType; setCurrentScreenAnswered: (answered: boolean) => void }) => {
  const defaulTime = 10;

  const image = Asset.fromModule(require('../../assets/question-number-kids.png')).uri;

  useEffect(() => {
    type.time = defaulTime;
  }, []);

  const handleNumberChange = (value: number) => {
    type.time = value;
  };

  return (
    <View className='bg-white h-full flex-1'>
      <View className='p-4 flex-1'>
        {/* Image Container */}
        <View className='flex-1'>
          <View className='aspect-square w-full bg-gray-200 overflow-hidden'>
            <Image source={{ uri: image }} className='w-full h-full' resizeMode='cover' />
          </View>
        </View>

        {/* Question Container */}
        <View className='mt-8'>
          <Text className='font-bold text-gray-700 text-center text-2xl mb-6'>
            How much time do you have?
          </Text>
          <View className='mt-5'>
            <SliderExample
              defaultValue={defaulTime}
              min={5}
              max={30}
              onSlidingComplete={handleNumberChange}
              style={{ marginHorizontal: 30 }}
            />
          </View>
          <View className='mx-5 mt-4'>
            <View className='font-medium flex flex-row w-full justify-between'>
              <Text className='text-xl'>5 min</Text>
              <Text className='text-xl'>30 min+</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
