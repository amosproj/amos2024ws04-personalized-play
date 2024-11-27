import { Text } from '@shadcn/components';
import type { ContextualQuestionProps } from '@src/types';
import LottieView from 'lottie-react-native';
import { Baby } from 'lucide-react-native';
import { View } from 'react-native';
import { TextInput } from './FormikTextInput';

export const ContextualQuestionNumberKids: React.FC<ContextualQuestionProps> = (props) => {
  const { onNext } = props;
  return (
    <View className='flex flex-1 items-stretch justify-center'>
      <View className='flex flex-1 flex-col items-center justify-center mb-4'>
        <LottieView
          autoPlay={true}
          loop={true}
          source={require('../../assets/kids.json')}
          style={{ width: 320, height: 320 }}
        />
      </View>
      <View className='flex flex-1 flex-col items-stretch'>
        <Text className='text-2xl text-center font-medium mb-6'>How many kids do you have?</Text>
        <TextInput
          lable='Number of kids'
          fieldName='numberOfKids'
          className='w-full'
          keyboardType='numeric'
          leadingIcon={Baby}
          onEnter={onNext}
        />
      </View>
    </View>
  );
};
