import { Input, Text } from '@shadcn/components';
import { Asset } from 'expo-asset';
import { useState } from 'react';
import { Image, View } from 'react-native';
import type { OnboardingType } from '../types/OnboardingType';

export const ContextualQuestionNumberKids = ({
  type,
  setCurrentScreenAnswered
}: { type: OnboardingType; setCurrentScreenAnswered: (answered: boolean) => void }) => {
  const [number, setNumber] = useState('');

  const image = Asset.fromModule(require('../../assets/question-number-kids.png')).uri;

  const handleNumberChange = (value: string) => {
    // Only allow numeric input

    if (value == '') {
      setCurrentScreenAnswered(false);
      setNumber(value)
      return
    }

    if (/^\d*$/.test(value)) {
      const parsedNumber = Number(value);
      if (parsedNumber >= 10) {
        return;
      }
      setNumber(value);
      type.kids = parsedNumber;
      setCurrentScreenAnswered(true);
    } else {
      console.log("answered false")
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
          <Input
            placeholder='Enter a number'
            keyboardType='numeric'
            value={number}
            onChangeText={handleNumberChange}
          />
        </View>
      </View>
    </View>
  );
};
