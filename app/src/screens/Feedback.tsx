import { Button, Text } from '@shadcn/components';
import { Brain, Heart, Home, ThumbsDown, ThumbsUp } from '@shadcn/icons';
import LottieView from 'lottie-react-native';
import type React from 'react';
import { useState } from 'react';
import { TextInput, View } from 'react-native';

export const Feedback: React.FC = () => {
  const [favourite, setFavourite] = useState<boolean>(false);
  const [message, setMessage] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [messageSubmitted, setMessageSubmitted] = useState(false);

  const handleSubmit = () => {
    // Here you would typically send the message to your backend
    console.log('Message submitted:', message);
    setMessageSubmitted(true);
  };

  const handleFeedback = (type: 'positive' | 'negative') => {
    // Here you would typically send the feedback to your backend
    console.log(`Feedback submitted: ${type}`);
    setFeedbackSubmitted(true);
  };

  return (
    <View className='flex flex-1 items-stretch px-4'>
      {/* Lottie Animation - fixed height */}
      <View className='flex flex-[0.3] items-center justify-end'>
        <LottieView
          autoPlay={true}
          loop={true}
          source={require('../../assets/activity.json')}
          style={{ width: 200, height: 200 }}
        />
      </View>

      {/* Main feedback section - fixed height */}
      <View className='flex flex-[0.7] flex-col items-center justify-start gap-y-6 mt-4'>
        <View className='flex flex-col items-center gap-y-4'>
          <Text className='text-2xl text-center font-medium mb-6'>
            What did you think of this activity?
          </Text>

          {/* Feedback buttons container with fixed height */}
          <View className='h-16 flex justify-center'>
            {!feedbackSubmitted ? (
              <View className='flex flex-row w-full gap-x-5'>
                <Button
                  className='flex flex-row gap-x-5 flex-1'
                  variant={'default'}
                  onPress={() => handleFeedback('positive')}
                >
                  <ThumbsUp size={24} className='text-primary-foreground' />
                  <Text className='text-primary-foreground'>I loved it</Text>
                </Button>

                <Button
                  className='flex flex-row gap-x-5 flex-1'
                  variant={'outline'}
                  onPress={() => handleFeedback('negative')}
                >
                  <ThumbsDown size={24} className='text-secondary-foreground' />
                  <Text className='text-secondary-foreground'>It could be better</Text>
                </Button>
              </View>
            ) : (
              <Text className='text-xl text-center font-medium text-primary'>
                Thank you for your feedback!
              </Text>
            )}
          </View>
        </View>

        {/* Optional feedback section with fixed height */}
        <View className='flex flex-col w-full gap-y-4'>
          <Text className='text-xl text-center font-medium'>
            Would you like to leave us a message?
          </Text>

          {/* Message input container with fixed height */}
          <View className='h-48 flex justify-start'>
            {!messageSubmitted ? (
              <>
                <TextInput
                  className='w-full p-4 border border-primary rounded-lg min-h-[120px]'
                  multiline={true}
                  numberOfLines={4}
                  placeholder='Write your feedback here...'
                  value={message}
                  onChangeText={setMessage}
                />

                <View className='flex flex-row justify-end mt-4'>
                  <Button className='' onPress={handleSubmit}>
                    <Text className='text-primary-foreground'>Submit</Text>
                  </Button>
                </View>
              </>
            ) : (
              <View className='h-full flex flex-col justify-center'>
                <Text className='text-xl text-center font-medium text-primary mx-20'>
                  Thank you! Your feedback has been received!
                </Text>
              </View>
            )}
          </View>
        </View>

        <View className='w-full flex flex-row justify-around'>
          <Button variant={'outline'} size={'icon'} className='rounded-full p-10'>
            <Brain size={24} className='text-secondary-foreground' />
          </Button>
          <Button variant={'outline'} size={'icon'} className='rounded-full p-10'>
            <Home size={24} className='text-secondary-foreground' />
          </Button>
          <Button
            variant={favourite ? 'default' : 'outline'}
            size={'icon'}
            className='rounded-full p-10'
            onPress={() => setFavourite(!favourite)}
          >
            <Heart
              size={24}
              className={favourite ? 'text-primary-foreground' : 'text-secondary-foreground'}
            />
          </Button>
        </View>
      </View>
    </View>
  );
};
