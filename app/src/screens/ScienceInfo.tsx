import { useNavigation } from '@react-navigation/native';
import { Button, Text } from '@shadcn/components';
import { Screens, Stacks } from '@src/constants';
import { Collections, fireAuth, fireStore } from '@src/constants';
import type { AppNavigation } from '@src/types';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { TextInput, View, TouchableOpacity, ScrollView } from 'react-native';
import LottieView from 'lottie-react-native';

export const ScienceInfo: React.FC = () => {
  const { reset } = useNavigation<AppNavigation>();
  const [user] = useAuthState(fireAuth);
  const [expandedSections, setExpandedSections] = useState([false, false, false, false, false]);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const onHomeButtonPress = () => {
    reset({
      index: 0,
      routes: [
        {
          name: Stacks.Auth,
          params: { screen: Screens.Home },
        },
      ],
    });
  };

  return (
    <View className="flex flex-1 items-stretch px-4">
      {/* Lottie Animation - fixed height */}
      <View className="flex flex-[0.3] items-center justify-end mt-20">
        <LottieView
          autoPlay={true}
          loop={true}
          source={require('../../assets/science.json')}
          style={{ width: 200, height: 200 }}
        />
      </View>

      <View className="flex flex-[0.7]">
        <ScrollView className="flex flex-col" contentContainerStyle={{ gap: 12, paddingTop: 16 }}>
          <View className="flex flex-col items-center">
            <Text className="text-2xl text-center font-medium mb-4">
              How this session has helped in your child's growth?
            </Text>
          </View>

          {/* Expandable Sections */}
          {['Cognitive skills', 'Motor skills', 'Social/Emotional skills', 'Language skills'].map((title, index) => (
            <View key={index} className="w-full">
              <TouchableOpacity
                onPress={() => toggleSection(index)}
                className="bg-gray-200 p-4 rounded-md shadow-md"
              >
                <Text className="text-lg font-medium">
                  {title} {expandedSections[index] ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>
              {expandedSections[index] && (
                <View className="bg-gray-100 p-4 mt-2 rounded-md">
                  <Text className="text-base">
                    This is the content of Section {index + 1}.
                  </Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};
