import { Text } from '@shadcn/components';
import { useField } from 'formik';
import LottieView from 'lottie-react-native';
import { View, type ViewProps } from 'react-native';
import { Slider } from 'react-native-awesome-slider';
import { useSharedValue } from 'react-native-reanimated';

export const ContextualQuestionEnergyLevel: React.FC<ViewProps> = () => {
  const [field, , helpers] = useField('energyLevel');
  const sharedValue = useSharedValue(field.value);

  const handleSlidingComplete = (value: number) => {
    sharedValue.value = value;
    helpers.setValue(value);
  };

  const getLabel = (value: number) => {
    const labels = ['Empty fuel', 'Half-charged', 'Supercharged'];
    return labels[value];
  };

  return (
    <View className='flex flex-1 items-stretch justify-center'>
      <View className='flex flex-1 flex-col items-center justify-center mb-4'>
        <LottieView
          autoPlay={true}
          loop={true}
          source={require('../../assets/battery.json')}
          style={{ width: 320, height: 320 }}
        />
      </View>
      <View className='flex flex-1 flex-col items-stretch'>
        <Text className='text-2xl text-center font-medium mb-6'>What is your energy level?</Text>
        <Text className='text-lg text-center'>
          Empty battery or fully charged? Let us know how you're feeling today.
        </Text>
        <View className='h-[48px] items-stretch justify-center'>
          <Slider
            style={{ width: '80%', alignSelf: 'center' }}
            minimumValue={useSharedValue(0)}
            maximumValue={useSharedValue(2)}
            progress={sharedValue}
            steps={2}
            onSlidingComplete={handleSlidingComplete}
            markWidth={0}
            bubble={(value) => getLabel(value)}
          />
        </View>
      </View>
    </View>
  );
};
