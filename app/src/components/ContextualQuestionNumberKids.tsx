import { Text } from '@shadcn/components';
import { Asset } from 'expo-asset';
import { useState } from 'react';
import { Image, TextInput, View } from 'react-native';
import type { OnboardingType } from '../types/OnboardingType';

export const ContextualQuestionNumberKids = ({
  type,
  setCurrentScreenAnswered
}: { type: OnboardingType; setCurrentScreenAnswered: (answered: boolean) => void }) => {
  const [number, setNumber] = useState('');

  const image = Asset.fromModule(require('../../assets/question-number-kids.png')).uri;

  const handleNumberChange = (value: string) => {
    // Only allow numeric input
    if (/^\d*$/.test(value)) {
      setNumber(value);
      type.kids = Number(value);
      setCurrentScreenAnswered(true);
    } else {
      setCurrentScreenAnswered(false);
    }
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
            How many kids are there with you?
          </Text>
          <TextInput
            value={number}
            onChangeText={handleNumberChange}
            placeholder='Enter a number'
            keyboardType='numeric'
            className='w-full px-4 py-3 border border-slate-600 text-base text-black'
            placeholderTextColor='#666'
          />
        </View>
      </View>
    </View>
  );
};
