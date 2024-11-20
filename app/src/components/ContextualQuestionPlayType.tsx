import { Text, Button } from '@shadcn/components';
import { Asset } from 'expo-asset';
import { useEffect, useState } from 'react';
import { Image, View, TouchableOpacity } from 'react-native';
import type { OnboardingType } from '../types/OnboardingType';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@shadcn/components/ui/alert-dialog';
import { Info } from 'lucide-react-native';

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

        <View className='flex-1 justify-center items-center'>
          {/* Question Container */}
          <View className='flex flex-row mb-4 justify-center items-center'>
            <Text className='font-bold text-gray-600 text-center text-2xl mx-2'>
              What kind of play would you like?
            </Text>
            <AlertDialog>
              <AlertDialogTrigger asChild={true}>
                <Info color='gray' size={24} />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <View className='flex flex-row mb-4 justify-center items-center'>
                    <Info color='gray' size={24} />
                    <AlertDialogTitle className='mx-4'>What does this mean?</AlertDialogTitle>
                  </View>
                  <AlertDialogDescription>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus quis mattis
                    risus.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    <Text>OK</Text>
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </View>
          {/* Interaction Container */}
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
