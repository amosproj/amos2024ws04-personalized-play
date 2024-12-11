import { Button, Text } from '@shadcn/components';
import { Camera } from '@shadcn/icons';
import type { ContextualQuestionProps } from '@src/types';
import * as ImagePicker from 'expo-image-picker';
import { useFormikContext } from 'formik';
import LottieView from 'lottie-react-native';
import type React from 'react';
import { View } from 'react-native';

export const ContextualQuestionCamera: React.FC<ContextualQuestionProps> = ({ onNext }) => {
  const { setFieldValue, values } = useFormikContext<{ camera: string }>();

  const takePhoto = async () => {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1
    });

    if (!result.canceled) {
      setFieldValue('camera', result.assets[0].uri);
      onNext();
    }
  };

  return (
    <View className='flex flex-1 items-stretch justify-center'>
      <View className='flex flex-1 flex-col items-center justify-center mb-4'>
        <LottieView
          autoPlay={true}
          loop={true}
          source={require('../../assets/activity.json')}
          style={{ width: 320, height: 320 }}
        />
      </View>
      <View className='flex flex-1 flex-col items-stretch gap-y-6'>
        <View className='flex flex-col items-center'>
          <Text className='text-2xl text-center font-medium mb-4'>
            Got some supplies nearby? Snap a pic, and we’ll turn them into fun ideas!
          </Text>
        </View>
        <View className='w-full'>
          <Button className='flex flex-row gap-x-5' onPress={takePhoto}>
            <Camera size={24} className='text-white' />
            <Text>Take Picture</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};
