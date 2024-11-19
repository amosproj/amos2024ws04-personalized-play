import { Text } from '@shadcn/components';
import { Asset } from 'expo-asset';
import { useEffect, useState } from 'react';
import { Image, View, TouchableOpacity } from 'react-native';
import type { OnboardingType } from '../types/OnboardingType';

export const ContextualQuestionPlayType = ({
  type,
  setCurrentScreenAnswered
}: {
  type: OnboardingType;
  setCurrentScreenAnswered: (answered: boolean) => void;
}) => {
  const image = Asset.fromModule(require('../../assets/question-number-kids.png')).uri;
  //define default value as Chores
  const [selectedOption, setSelectedOption] = useState('chores');

  useEffect(() => {
    type.playType = 'chores';
  }, []);

  function handleTypeChange(option: string) {
    setSelectedOption(option);
    type.playType = option;
    setCurrentScreenAnswered(true);
  }

  return (
    <View className='bg-white h-full flex-1'>
      <View className='p-4 flex-1'>
        {/* Image Container */}
        <View className='flex-1 mb-16'>
          <View className='aspect-square w-full bg-gray-200 overflow-hidden'>
            <Image source={{ uri: image }} className='w-full h-full' resizeMode='cover' />
          </View>
        </View>

        {/* Question Container */}
        <View className='flex-1 justify-center items-center'>
          <Text className='font-bold text-gray-700 text-center text-2xl mb-4'>
            What kind of play would you like?
          </Text>
          <View className='flex-row space-x-4'>
            <TouchableOpacity
              className={`w-32 h-32 mx-4 rounded-lg justify-center items-center ${
                selectedOption === 'chores' ? 'bg-slate-500' : 'bg-slate-200'
              }`}
              onPress={() => handleTypeChange('chores')}
            >
              <Text className='text-white font-bold text-lg'>Chores</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`w-32 h-32 mx-4 rounded-lg justify-center items-center ${
                selectedOption === 'freeplay' ? 'bg-slate-500' : 'bg-slate-200'
              }`}
              onPress={() => handleTypeChange('freeplay')}
            >
              <Text className='text-white font-bold text-lg'>Free Play</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
