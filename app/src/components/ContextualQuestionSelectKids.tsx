import { Text } from '@shadcn/components';
import { Checkbox } from '@shadcn/components/ui/checkbox';
import { Collections, fireAuth, fireStore } from '@src/constants';
import { collection, getDocs } from 'firebase/firestore';
import LottieView from 'lottie-react-native';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { View } from 'react-native';
import { useFormikContext } from 'formik';

export const ContextualQuestionSelectKids: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<{ selectKids: string[] }>();
  const [user] = useAuthState(fireAuth);
  const [kidsNames, setKidsNames] = useState<string[]>([]);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchKids = async () => {
      try {
        if (!user) {
          console.error('User not authenticated');
          return;
        }
        const userId = user.uid;
        const kidsCollection = await getDocs(
          collection(fireStore, Collections.Users, userId, Collections.Kids)
        );

        const kids: string[] = [];
        // biome-ignore lint/complexity/noForEach: <explanation>
        kidsCollection.forEach((doc) => {
          const data = doc.data();
          if (data?.name) {
            kids.push(data.name);
          }
        });

        // Preselect all kids
        setKidsNames(kids);
        setCheckedItems(
          kids.reduce(
            (acc, kid) => {
              acc[kid] = true;
              return acc;
            },
            {} as { [key: string]: boolean }
          )
        );
        setFieldValue('selectKids', kids); // Set all kids as selected in Formik
      } catch (error) {
        console.error('Error retrieving Kids Collection:', error);
      }
    };

    fetchKids();
  }, [user, setFieldValue]);

  const handleCheckboxChange = (kid: string, isChecked: boolean) => {
    setCheckedItems((prev) => ({
      ...prev,
      [kid]: isChecked
    }));

    const updatedSelectedKids = isChecked
      ? [...values.selectKids, kid]
      : values.selectKids.filter((selectedKid) => selectedKid !== kid);

    setFieldValue('selectKids', updatedSelectedKids);
  };

  return (
    <View className='flex flex-1 items-stretch justify-center'>
      <View className='flex flex-1 flex-col items-center justify-center'>
        <LottieView
          autoPlay
          loop
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
          {kidsNames.map((kid) => (
            <View key={kid} className='flex flex-row gap-x-4'>
              <Checkbox
                checked={!!checkedItems[kid]}
                onCheckedChange={(isChecked) => handleCheckboxChange(kid, isChecked as boolean)}
              />
              <Text>{kid}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
