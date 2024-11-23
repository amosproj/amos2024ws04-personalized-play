import { Text } from '@shadcn/components';
import { useField } from 'formik';
import { View } from 'react-native';

export const ContextualQuestionAgeKids: React.FC = () => {
  const [field] = useField('numberOfKids');
  return (
    <View className='flex flex-1 items-stretch justify-center'>
      <Text className='text-2xl text-center font-medium mb-6'>Tell us about your kids</Text>
      <Text>ContextualQuestionAgeKids {field.value}</Text>
    </View>
  );
};
