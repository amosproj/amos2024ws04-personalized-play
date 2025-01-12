import { Button, Text } from '@shadcn/components';
import { iconWithClassName } from '@shadcn/icons/iconWithClassName';
import type { ContextualQuestionProps, OnboardingFormData } from '@src/types';
import { useFormikContext } from 'formik';
import LottieView from 'lottie-react-native';
import { BatteryCharging } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { Slider } from 'react-native-awesome-slider';
import { useSharedValue } from 'react-native-reanimated';

iconWithClassName(BatteryCharging);

export const ContextualQuestionEnergyLevel: React.FC<ContextualQuestionProps> = () => {
  const { setFieldValue, values } = useFormikContext<OnboardingFormData>();
  const [sliderValue, setSliderValue] = useState(
    ['low', 'medium', 'high'].indexOf(values.energyLevel)
  );

  const onChange = (value: number) => {
    setSliderValue(value);
    setFieldValue('energyLevel', ['low', 'medium', 'high'][value]);
  };

  const getLabel = (value: number) => {
    const labels = ['😴', '😊', '🚀'];
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
        <View className='items-stretch justify-center mt-12'>
          <Slider
            style={{ width: '80%', alignSelf: 'center' }}
            minimumValue={useSharedValue(0)}
            maximumValue={useSharedValue(2)}
            theme={{
              minimumTrackTintColor: '#620674',
              bubbleBackgroundColor: '#620674'
            }}
            progress={useSharedValue(sliderValue)}
            thumbWidth={32}
            steps={2}
            onSlidingComplete={onChange}
            markWidth={0}
            bubble={(value) => getLabel(value)}
            bubbleTextStyle={{ fontSize: 14 }}
            renderThumb={() => (
              <Button size={'icon'} className='w-8 h-8 rounded-full bg-primary'>
                <BatteryCharging className='w-4 h-4 text-white -rotate-90' size={16} />
              </Button>
            )}
          />
        </View>
      </View>
    </View>
  );
};
