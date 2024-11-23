import { User } from 'lucide-react-native';
import { View } from 'react-native';
import { TextInput } from './FormikTextInput';
import { Text } from '@shadcn/components';

export const ContextualQuestionUserName: React.FC = () => {
  return (
    <View className='flex flex-1 items-stretch justify-center'>
      <Text className='text-2xl text-center font-medium mb-6'>What is your name?</Text>
      <TextInput lable='Your Name' fieldName='name' className='w-full' leadingIcon={User} />
    </View>
  );
};
