import { Text } from '@shadcn/components';
import type { ContextualQuestionProps } from '@src/types';
import { User } from 'lucide-react-native';
import { View } from 'react-native';
import { TextInput } from './FormikTextInput';

export const ContextualQuestionUserName: React.FC<ContextualQuestionProps> = (props) => {
  const { onNext } = props;
  return (
    <View className='flex flex-1 items-stretch justify-center'>
      <Text className='text-2xl text-center font-medium mb-6'>What is your name?</Text>
      <TextInput
        lable='Your Name'
        fieldName='name'
        className='w-full'
        leadingIcon={User}
        onEnter={onNext}
      />
    </View>
  );
};
