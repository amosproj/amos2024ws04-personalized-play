import { Button, Text } from '@shadcn/components';
import { Camera } from '@shadcn/icons';
import { iconWithClassName } from '@shadcn/icons/iconWithClassName';
import type { ContextualQuestionProps } from '@src/types';
import { IconPhoto } from '@tabler/icons-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFormikContext } from 'formik';
import LottieView from 'lottie-react-native';
import type React from 'react';
import { useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';

iconWithClassName(IconPhoto);

export const ContextualQuestionCamera: React.FC<ContextualQuestionProps> = ({ onNext }) => {
  const { setFieldValue } = useFormikContext<{ image: string }>();
  const [isLoading, setIsLoading] = useState(false);

  const convertImageToBase64 = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      return new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
    }
  };

  const handleCameraAccess = async () => {
    setIsLoading(true);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera permissions to make this work!');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1
      });
      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        const base64Image = await convertImageToBase64(result.assets[0].uri);
        setFieldValue('image', base64Image);
        if (onNext) onNext();
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Something went wrong while taking the photo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGalleryAccess = async () => {
    setIsLoading(true);
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need gallery permissions to make this work!');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1
      });
      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        const base64Image = await convertImageToBase64(result.assets[0].uri);
        setFieldValue('image', base64Image);
        if (onNext) onNext();
      }
    } catch (error) {
      console.error('Error accessing gallery:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className='flex flex-1 items-stretch justify-center'>
      <View className='flex flex-1 flex-col items-center justify-center mb-4'>
        {isLoading ? (
          <ActivityIndicator size='large' />
        ) : (
          <LottieView
            autoPlay={true}
            loop={true}
            source={require('../../assets/activity.json')}
            style={{ width: 320, height: 320 }}
          />
        )}
      </View>
      <View className='flex flex-1 flex-col items-stretch gap-y-6'>
        <View className='flex flex-col items-center'>
          <Text className='text-2xl text-center font-medium mb-4'>
            Got some supplies nearby? Snap a pic or select one from your gallery, and we’ll turn
            them into fun ideas!
          </Text>
        </View>
        <View className='w-full flex flex-col gap-y-4'>
          <Button
            className='flex flex-row gap-x-5 rounded-xl'
            onPress={handleCameraAccess}
            disabled={isLoading}
          >
            <Camera size={24} className='text-white' />
            <Text>Take Picture</Text>
          </Button>
          <Button
            className='flex flex-row gap-x-5 rounded-xl'
            onPress={handleGalleryAccess}
            disabled={isLoading}
          >
            <IconPhoto size={24} className='text-white' />
            <Text>Select from Gallery</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};
