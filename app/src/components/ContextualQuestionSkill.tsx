import { useNavigation } from '@react-navigation/native';
import { Text } from '@shadcn/components';
import { Checkbox } from '@shadcn/components/ui/checkbox';
import type { AppNavigation } from '@src/types';
import LottieView from 'lottie-react-native';
import type React from 'react';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

export const ContextualQuestionSkill: React.FC = () => {
  const { navigate } = useNavigation<AppNavigation>();

  const skill = useMemo(() => {
    return ['Cognitive skills', 'Motor skills', 'Social/Emotional skills', 'Language skills'];
  }, []);
  const [checkedItems, setCheckedItems] = useState(() => {
    return skill.reduce(
      (acc, skill) => {
        acc[skill] = true; // All checkboxes are initially checked
        return acc;
      },
      {} as { [key: string]: boolean }
    );
  });
  const handleCheckboxChange = (item: string, value: boolean) => {
    setCheckedItems((prev) => ({
      ...prev,
      [item]: value
    }));
  };
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
      <View className='flex flex-col items-stretch'>
        <Text className='text-2xl text-center font-bold mt-4 mb-2'>Skills to be integrated</Text>
        <Text className='text-lg  mb-4 text-center font-medium'>
          Want to help your little one grow a specific skill? Tell us, and we'll suggest activities!
        </Text>
      </View>
      <View className='flex flex-1 flex-col gap-y-4'>
        {skill.map((item) => {
          return (
            <View key={item} className='flex flex-row  gap-x-4'>
              <Checkbox
                checked={checkedItems[item]}
                onCheckedChange={(value: boolean) => handleCheckboxChange(item, value)}
              />
              <Text>{item}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};
