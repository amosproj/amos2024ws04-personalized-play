import { Text } from '@shadcn/components';
import type { ContextualQuestionProps } from '@src/types';
import { Baby } from 'lucide-react-native';
import { View } from 'react-native';
import { TextInput } from './FormikTextInput';

export const ContextualQuestionNumberKids: React.FC<ContextualQuestionProps> = (props) => {
  const { onNext } = props;
  return (
    <View className='flex flex-1 items-stretch justify-center'>
      <Text className='text-2xl text-center font-medium mb-6'>How many kids do you have?</Text>
      <TextInput
        lable='Number of kids'
        fieldName='numberOfKids'
        className='w-full'
        keyboardType='number-pad'
        leadingIcon={Baby}
        onEnter={onNext}
      />
    </View>
  );
};
