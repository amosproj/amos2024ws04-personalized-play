import { H3, Input, Text } from '@shadcn/components';
import { Asset } from 'expo-asset';
import { useState } from 'react';
import { Alert, Image, Platform, ToastAndroid, View } from 'react-native';
import type { OnboardingType } from '../types/OnboardingType';

// Helper function to validate date fields
const validateDateFields = (day: string, month: string, year: string): string | null => {
  const dayInt = Number.parseInt(day);
  const monthInt = Number.parseInt(month);
  const yearInt = Number.parseInt(year);
  const today = new Date();
  const currentYear = today.getFullYear();

  // Validate if all fields are filled
  if (!day || !month || !year) return 'Please enter all fields.';

  // Validate Day (between 1 and 31)
  if (dayInt < 1 || dayInt > 31) return 'Please enter a valid day between 1 and 31.';

  // Validate Month (between 1 and 12)
  if (monthInt < 1 || monthInt > 12) return 'Please enter a valid month between 1 and 12.';

  // Validate Year (not greater than current year)
  if (yearInt > currentYear || yearInt < 1900) {
    return `Please enter a valid year between 1900 and ${currentYear}.`;
  }

  // Check if the date is valid
  const birthDate = new Date(yearInt, monthInt - 1, dayInt); // Month is 0-indexed
  if (
    birthDate.getFullYear() !== yearInt ||
    birthDate.getMonth() !== monthInt - 1 ||
    birthDate.getDate() !== dayInt
  ) {
    return 'Invalid date entered.';
  }
  // Check if the date is in the future
  if (birthDate > today) {
    return 'Date cannot be in the future';
  }

  return null; // All fields are valid
};

export const ContextualQuestionAgeKids = ({
  type,
  setCurrentScreenAnswered
}: {
  type: OnboardingType;
  setCurrentScreenAnswered: (answered: boolean) => void;
}) => {
  const [day, setDay] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [age, setAge] = useState<Date>(new Date());

  const handleSubmit = () => {
    // Validate the input fields
    const validationError = validateDateFields(day, month, year);
    if (validationError) {
      if (Platform.OS === 'android') {
        // Use ToastAndroid for Android
        ToastAndroid.showWithGravity(validationError, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
      } else {
        // Use Alert for other platforms (iOS, Web, etc.)
        Alert.alert('Invalid Input', validationError);
      }

      return;
    }

    // Parse date values
    const dayInt = Number.parseInt(day);
    const monthInt = Number.parseInt(month);
    const yearInt = Number.parseInt(year);
    const birthday = new Date(yearInt, monthInt - 1, dayInt);

    // Save the birthday
    setAge(birthday);
    type.age = birthday;
    setCurrentScreenAnswered(true);
  };

  const image = Asset.fromModule(require('../../assets/question-number-kids.png')).uri;

  return (
    <View className='bg-white h-full flex-1'>
      <View className='p-4 flex-1'>
        {/* Image Container */}
        <View className='flex-1'>
          <View className='aspect-square w-full bg-gray-200 overflow-hidden'>
            <Image source={{ uri: image }} className='w-full h-full' resizeMode='cover' />
          </View>
        </View>

        {/* Question Container */}
        <View className='mt-8 items-center gap-5'>
          <H3>Awesome! How old is she/he/they?</H3>
          <Text>Please enter child's birth date</Text>
          <View className='flex-row'>
            <Input
              placeholder='Day'
              className='flex-1 mx-1 p-2 text-center'
              value={day}
              onChangeText={(text) => setDay(text)}
              keyboardType='numeric'
              maxLength={2}
            />
            <Input
              placeholder='Month'
              className='flex-1 mx-1 p-2 text-center'
              value={month}
              onChangeText={(text) => setMonth(text)}
              keyboardType='numeric'
              maxLength={2}
            />
            <Input
              placeholder='Year'
              className='flex-1 mx-1 p-2 text-center'
              value={year}
              onChangeText={(text) => {
                setYear(text);
              }}
              onSubmitEditing={() => handleSubmit()}
              keyboardType='numeric'
              maxLength={4}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
