import { Text } from '@shadcn/components';
import { ToggleGroup, ToggleGroupIcon, ToggleGroupItem } from '@shadcn/components/ui/toggle-group';
import { Angry, Frown, Laugh, Meh, Smile } from '@shadcn/icons';
import { Asset } from 'expo-asset';
import { useState } from 'react';
import { Image, View } from 'react-native';
import type { OnboardingType } from '../types/OnboardingType';

export const ContextualQuestionEnergyLevel = ({
  type,
  setCurrentScreenAnswered
}: {
  type: OnboardingType;
  setCurrentScreenAnswered: (answered: boolean) => void;
}) => {
  //define default value as 3 (Neutral/ meh emoji)
  const [value, setValue] = useState('3');

  function handleValueChange(value: string | undefined) {
    if (value !== undefined) {
      setValue(value);
      type.energy = String(value);
      setCurrentScreenAnswered(true);
    }
  }

  const image = Asset.fromModule(require('../../assets/question-number-kids.png')).uri;

  return (
    <View className='bg-white h-full flex-1'>
      <View className='p-4 flex-1'>
        {/* Image Container */}
        <View className='flex-1'>
          <View className='aspect-square w-full bg-gray-200 overflow-hidden'>
            <Image source={{ uri: image }} className='w-full h-full' resizeMode='cover' />
          </View>
        </View>

        <View className='mt-8'>
          <Text className='font-bold text-gray-700 text-center text-2xl mb-6'>
            How are you feeling right now?
          </Text>
          <ToggleGroup
            value={value}
            onValueChange={handleValueChange}
            type='single'
            className='m-4'
          >
            <ToggleGroupItem value='1' aria-label='Toggle angry'>
              <ToggleGroupIcon icon={Angry} size={42} />
            </ToggleGroupItem>
            <ToggleGroupItem value='2' aria-label='Toggle frown'>
              <ToggleGroupIcon icon={Frown} size={42} />
            </ToggleGroupItem>
            <ToggleGroupItem value='3' aria-label='Toggle meh'>
              <ToggleGroupIcon icon={Meh} size={42} />
            </ToggleGroupItem>
            <ToggleGroupItem value='4' aria-label='Toggle smile'>
              <ToggleGroupIcon icon={Smile} size={42} />
            </ToggleGroupItem>
            <ToggleGroupItem value='5' aria-label='Toggle happy'>
              <ToggleGroupIcon icon={Laugh} size={42} />
            </ToggleGroupItem>
          </ToggleGroup>
        </View>
      </View>
    </View>
  );
};
