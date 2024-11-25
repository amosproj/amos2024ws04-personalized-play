import { Text } from '@shadcn/components';
import { ToggleGroup, ToggleGroupIcon, ToggleGroupItem } from '@shadcn/components/ui/toggle-group';
import { iconWithClassName } from '@shadcn/icons/iconWithClassName';
import { useFormikContext } from 'formik';
import LottieView from 'lottie-react-native';
import { CookingPot, Gamepad2, Info } from 'lucide-react-native';
import { View, type ViewProps } from 'react-native';

iconWithClassName(Info);

export const ContextualQuestionActivityChoice: React.FC<ViewProps> = () => {
  const { setFieldValue, values } = useFormikContext<{ activityType: string }>();
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
          <Text className='text-2xl text-center font-medium mb-4'>Select an activity type</Text>
          <Text className='text-lg text-center'>
            Are you looking to do some chores or play today?
          </Text>
        </View>
        <View className='flex-row items-center justify-center gap-x-4'>
          <ToggleGroup
            value={values.activityType}
            onValueChange={(value) => setFieldValue('activityType', value)}
            type='single'
            className='gap-x-4'
          >
            <ToggleGroupItem value='bold' className='native:h-28 native:w-28 rounded-xl'>
              <ToggleGroupIcon icon={CookingPot} size={32} />
              <Text className='text-center text-xl mt-4'>Chores</Text>
            </ToggleGroupItem>
            <ToggleGroupItem value='italic' className='native:h-28 native:w-28 rounded-xl'>
              <ToggleGroupIcon icon={Gamepad2} size={32} />
              <Text className='text-center text-xl mt-4'>Play</Text>
            </ToggleGroupItem>
          </ToggleGroup>
        </View>
      </View>
    </View>
  );
};
