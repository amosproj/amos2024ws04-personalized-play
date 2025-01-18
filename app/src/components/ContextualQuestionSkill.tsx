import { Text } from '@shadcn/components';
import { Checkbox } from '@shadcn/components/ui/checkbox';
import { Skills } from '@src/constants';
import type { OnboardingFormData } from '@src/types';
import { useFormikContext } from 'formik';
import LottieView from 'lottie-react-native';
import type React from 'react';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

export const ContextualQuestionSkill: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<OnboardingFormData>();
  const [selectedSkills, setSelectedSkills] = useState(values.skillsToBeIntegrated);

  useEffect(() => {
    setFieldValue('skillsToBeIntegrated', selectedSkills);
  }, [selectedSkills.length]);

  return (
    <View className='flex flex-1 items-stretch justify-center '>
      <View className='flex flex-1 flex-col items-center justify-center mb-4'>
        <LottieView
          autoPlay={true}
          loop={true}
          source={require('../../assets/skill.json')}
          style={{ width: 220, height: 220 }}
        />
      </View>
      <View className='flex flex-1 flex-col items-stretch'>
        <Text className='text-2xl text-center font-medium mb-6'>Skills to be integrated</Text>
        <Text className='text-lg text-center'>
          Select the skills you would like to integrate into your activity.
        </Text>
        <View className='flex flex-1 flex-col gap-y-4 mt-12'>
          {Object.values(Skills).map((item) => {
            return (
              <View key={item} className='flex flex-row gap-x-4'>
                <Checkbox
                  checked={values.skillsToBeIntegrated.includes(item)}
                  disabled={
                    values.skillsToBeIntegrated.length === 1 &&
                    values.skillsToBeIntegrated.includes(item)
                  }
                  onCheckedChange={(value: boolean) => {
                    if (value) {
                      setSelectedSkills([...selectedSkills, item]);
                    } else {
                      setSelectedSkills(selectedSkills.filter((skill) => skill !== item));
                    }
                  }}
                />
                <Text>{item}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};
