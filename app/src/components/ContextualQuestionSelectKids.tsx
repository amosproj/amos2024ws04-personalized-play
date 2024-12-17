import { Text } from '@shadcn/components';
import { Checkbox } from '@shadcn/components/ui/checkbox';
import { Collections, fireAuth, fireStore } from '@src/constants';
import { collection, getDocs } from 'firebase/firestore';
import LottieView from 'lottie-react-native';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { View } from 'react-native';

export const ContextualQuestionSelectKids: React.FC = () => {
  const [user] = useAuthState(fireAuth);
  const [kidsNames, setKidsNames] = useState(Array<string>);

  useEffect(() => {
    try {
      if (!user) {
        console.error('User not authenticated');
        return;
      }
      const userId = user.uid;
      getKids(userId);
    } catch (error) {
      console.error('Error retrieving Kids Collection');
    }
  }, []);

  async function getKids(userId: string) {
    const kidsCollection = await getDocs(
      collection(fireStore, Collections.Users, userId, Collections.Kids)
    );
    // biome-ignore lint/complexity/noForEach: <explanation>
    kidsCollection.forEach(async (kid) => {
      const name: string = await kid.get('name');
      setKidsNames((kidsNames) => [...kidsNames, name]);
    });
  }

  const [checkedItems, setCheckedItems] = useState(() => {
    return kidsNames.reduce(
      (acc, kid) => {
        acc[kid] = true; // All checkboxes are initially checked
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
    <View className='flex flex-1 items-stretch justify-center'>
      <View className='flex flex-1 flex-col items-center justify-center'>
        <LottieView
          autoPlay={true}
          loop={true}
          source={require('../../assets/activity.json')}
          style={{ width: 320, height: 320 }}
        />
      </View>
      <View className='flex flex-1 flex-col items-stretch gap-y-6 mb-4'>
        <View className='flex flex-col items-center gap-y-6'>
          <Text className='text-2xl text-center font-medium'>Select Kids</Text>
          <Text className='text-lg text-center'>Select the kiddos keeping you busy today.</Text>
        </View>
        <View className='flex-col justify-center gap-y-4'>
          {kidsNames.map((item) => {
            return (
              <View key={item} className='flex flex-row gap-x-4'>
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
    </View>
  );
};
