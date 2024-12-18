import { useNavigation } from '@react-navigation/native';
import { Button, Text } from '@shadcn/components';
import { Screens, Stacks } from '@src/constants';
import { fireAuth } from '@src/constants';
import type { AppNavigation } from '@src/types';
import LottieView from 'lottie-react-native';
import type React from 'react';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ScrollView, TouchableOpacity, View } from 'react-native';

const sectionData = [
  { id: 'cognitive', title: 'Cognitive skills' },
  { id: 'motor', title: 'Motor skills' },
  { id: 'social', title: 'Social/Emotional skills' },
  { id: 'language', title: 'Language skills' }
];

export const ScienceInfo: React.FC = () => {
  const { reset } = useNavigation<AppNavigation>();
  const [user] = useAuthState(fireAuth);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const onHomeButtonPress = () => {
    reset({
      index: 0,
      routes: [
        {
          name: Stacks.Auth,
          params: { screen: Screens.Home }
        }
      ]
    });
  };

  return (
    <View className='flex flex-1 items-stretch px-4'>
      {/* Lottie Animation - fixed height */}
      <View className='flex flex-[0.3] items-center justify-end mt-20'>
        <LottieView
          autoPlay={true}
          loop={true}
          source={require('../../assets/science.json')}
          style={{ width: 200, height: 200 }}
        />
      </View>

      <View className='flex flex-[0.7]'>
        <ScrollView className='flex flex-col' contentContainerStyle={{ gap: 12, paddingTop: 16 }}>
          <View className='flex flex-col items-center'>
            <Text className='text-2xl text-center font-medium mb-4'>
              How this session has helped in your child's growth?
            </Text>
          </View>

          {/* Expandable Sections */}
          {sectionData.map(({ id, title }) => (
            <View key={id} className='w-full'>
              <TouchableOpacity
                onPress={() => toggleSection(id)}
                className='bg-gray-200 p-4 rounded-md shadow-md'
              >
                <Text className='text-lg font-medium'>
                  {title} {expandedSections[id] ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>
              {expandedSections[id] && (
                <View className='bg-gray-100 p-4 mt-2 rounded-md'>
                  <Text className='text-base'>This is the content of Section {title}.</Text>
                </View>
              )}
            </View>
          ))}
          <Button 
            className='w-full mt-3'
            size={'lg'}
            onPress={() => onHomeButtonPress()}
          >
            <Text>Done</Text>
          </Button>
        </ScrollView>

      </View>
    </View>
  );
};
