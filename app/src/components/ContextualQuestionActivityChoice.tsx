import { Text } from '@shadcn/components';

import type { ContextualQuestionProps, OnboardingFormData } from '@src/types';
import { useFormikContext } from 'formik';
import LottieView from 'lottie-react-native';
import { Gamepad2 } from 'lucide-react-native';
import { type ReactNode, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ChoresButtonModal } from './ChoresButtonModal';
import { InfoAlertIcon } from './InfoAlert';

export const ContextualQuestionActivityChoice: React.FC<ContextualQuestionProps> = (props) => {
  const { onNext } = props;
  const { setFieldValue, values } = useFormikContext<OnboardingFormData>();
  const [activityType, setActivityType] = useState('');

  const onChange = (value: string | undefined) => {
    if (!value) return;
    setActivityType(value);
    setFieldValue('type', value);
  };

  const onChangeAndNext = (value: string | undefined) => {
    onChange(value);
    onNext();
  };

  const onChoreSelectionComplete = (choreType: string) => {
    setFieldValue('choreType', choreType);
    onNext();
  };

  const IconWrapper = ({ children }: { children: ReactNode }) => (
    <View className='flex items-center justify-center'>{children}</View>
  );

  return (
    <View className='flex flex-1 items-stretch justify-center'>
      <View className='flex flex-1 flex-col items-center justify-center mb-4'>
        <LottieView
          autoPlay={true}
          loop={true}
          source={require('../../assets/activity.json')}
          style={{ width: 320, height: 320 }}
        />
      </View>
      <View className='flex flex-1 flex-col items-stretch gap-y-6'>
        <View className='flex flex-col items-center'>
          <View className='flex flex-row gap-x-3 items-center justify-center mb-4'>
            <Text className='text-2xl text-center font-medium'>Select an activity type</Text>
            <InfoAlertIcon
              title={'What does this mean?'}
              description={
                'Whether you are in the mood to tackle chores or enjoy some free play, select what suits you best!'
              }
            />
          </View>
          <Text className='text-lg text-center'>
            Are you looking to do some chores or play today?
          </Text>
        </View>
        <View className='flex items-center justify-center flex-row gap-4'>
          <ChoresButtonModal
            activityType={activityType}
            onPress={() => onChange('chores')}
            onFinish={(chore) => onChoreSelectionComplete(chore)}
          />

          <TouchableOpacity
            onPress={() => onChangeAndNext('play')}
            className={`h-28 w-28 rounded-xl flex items-center justify-center ${
              activityType === 'play' ? 'bg-secondary' : 'bg-white'
            }`}
          >
            <IconWrapper>
              <Gamepad2 size={32} />
            </IconWrapper>
            <Text className='text-center text-md mt-4'>Play</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
