import { Text } from '@shadcn/components';
import type { ContextualQuestionProps } from '@src/types';
import LottieView from 'lottie-react-native';
import { User } from 'lucide-react-native';
import { View } from 'react-native';
import { TextInput } from './FormikTextInput';

export const ContextualQuestionUserName: React.FC<ContextualQuestionProps> = (props) => {
  const { onNext } = props;
  return (
    <View className='flex flex-1 items-stretch justify-center'>
      <View className='flex flex-1 flex-col items-center justify-center mb-4'>
        <LottieView
          autoPlay={true}
          loop={true}
          source={require('../../assets/hello.json')}
          style={{ width: 320, height: 320 }}
        />
      </View>
      <View className='flex flex-1 flex-col items-stretch'>
        <Text className='text-2xl text-center font-medium mb-6'>What is your name?</Text>
        <TextInput
          lable='Your Name'
          fieldName='displayName'
          className='w-full'
          leadingIcon={User}
          onEnter={onNext}
        />
      </View>
    </View>
  );
};
