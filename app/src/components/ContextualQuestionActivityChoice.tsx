import { Text } from '@shadcn/components';
import { ToggleGroup, ToggleGroupIcon, ToggleGroupItem } from '@shadcn/components/ui/toggle-group';

import type { ContextualQuestionProps, OnboardingFormData } from '@src/types';
import { useFormikContext } from 'formik';
import LottieView from 'lottie-react-native';
import { CookingPot, Gamepad2 } from 'lucide-react-native';
import { View } from 'react-native';
import { InfoAlertIcon } from './InfoAlert';

export const ContextualQuestionActivityChoice: React.FC<ContextualQuestionProps> = (props) => {
  const { onNext } = props;
  const { setFieldValue, values } = useFormikContext<OnboardingFormData>();

  const onChange = (value: string | undefined) => {
    if (!value) return;
    setFieldValue('activityType', value);
    onNext();
  };

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
        <View className='flex-row items-center justify-center gap-x-4'>
          <ToggleGroup
            value={values.type}
            onValueChange={onChange}
            type='single'
            className='gap-x-4'
          >
            <ToggleGroupItem value='chores' className='native:h-28 native:w-28 rounded-xl'>
              <ToggleGroupIcon icon={CookingPot} size={32} />
              <Text className='text-center text-xl mt-4'>Chores</Text>
            </ToggleGroupItem>
            <ToggleGroupItem value='play' className='native:h-28 native:w-28 rounded-xl'>
              <ToggleGroupIcon icon={Gamepad2} size={32} />
              <Text className='text-center text-xl mt-4'>Play</Text>
            </ToggleGroupItem>
          </ToggleGroup>
        </View>
      </View>
    </View>
  );
};
