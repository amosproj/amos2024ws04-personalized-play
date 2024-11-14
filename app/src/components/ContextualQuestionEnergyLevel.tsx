import { Text } from '@shadcn/components';
import { ToggleGroup, ToggleGroupIcon, ToggleGroupItem } from '@shadcn/components/ui/toggle-group';
import { Angry, Frown, Laugh, Meh, Smile } from '@shadcn/icons';
import { Asset } from 'expo-asset';
import React from 'react';
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
  const [value, setValue] = React.useState<string>('3');

  function handleValueChange(e: string | undefined) {
    if (e === undefined) {
      //do not update value, since e should not be undefined
    } else {
      //update value and set Current screen as answered
      setValue(e);
      setCurrentScreenAnswered(true);
    }
  }

  const image = Asset.fromModule(require('../../assets/landing.png')).uri;

  return (
    <View className='flex-1 justify-center items-center'>
      <Image source={{ uri: image }} className='w-[350] h-[500] m-4' />
      <Text className='font-bold text-2xl'>How are you feeling right now?</Text>
      <ToggleGroup value={value} onValueChange={handleValueChange} type='single' className='m-4'>
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
  );
};
