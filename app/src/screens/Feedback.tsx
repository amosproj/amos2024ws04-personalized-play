import { type RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Button, Text } from '@shadcn/components';
import { Brain, Home, ThumbsDown, ThumbsUp } from '@shadcn/icons';
import { Loading } from '@src/components';
import { FavouriteButton } from '@src/components/FavouriteButton';
import { Screens, Stacks } from '@src/constants';
import { Collections, fireAuth, fireStore } from '@src/constants';
import type { AuthRoutesParams } from '@src/routes';
import type { AppNavigation } from '@src/types';
import { doc, updateDoc } from 'firebase/firestore';
import LottieView from 'lottie-react-native';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { TextInput, View } from 'react-native';

export const Feedback: React.FC = () => {
  const { navigate } = useNavigation<AppNavigation>();
  const { reset } = useNavigation<AppNavigation>();
  const { params } = useRoute<RouteProp<AuthRoutesParams>>();
  const activityId = params?.activityId;
  const [favourite, setFavorite] = useState<boolean>(false);
  const [message, setMessage] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [messageSubmitted, setMessageSubmitted] = useState(false);
  const [user] = useAuthState(fireAuth);

  if (!activityId) {
    navigate(Stacks.Auth, { screen: Screens.Home });
    return <Loading description={'Redirecting...'} />;
  }

  const saveInFirestore = async (data: object) => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }
    const userId = user.uid;
    try {
      const activityDocRef = doc(
        fireStore,
        Collections.Users,
        userId,
        Collections.Activities,
        activityId
      );
      await updateDoc(activityDocRef, data);
    } catch (error) {
      console.error('Error saving the feedback to Firestore:', error);
    }
  };

  const handleSubmit = async () => {
    console.log('Message submitted:', message);
    saveInFirestore({ feedbackMessage: message });
    setMessageSubmitted(true);
  };

  const handleFeedback = async (type: 'positive' | 'negative') => {
    console.log(`Feedback submitted: ${type}`);
    saveInFirestore({ feedbackType: type });
    setFeedbackSubmitted(true);
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

  //update favorite, whenever favorite status changes
  useEffect(() => {
    const updateFavorite = async () => {
      //save in firestore
      saveInFirestore({
        favorite: favourite
      });
    };
    updateFavorite();
  }, [favourite]);

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
                  <Button className='' onPress={handleSubmit} disabled={message.length === 0}>
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
          <Button
            onPress={() => onHomeButtonPress()}
            variant={'outline'}
            size={'icon'}
            className='rounded-full p-10'
          >
            <Home size={24} className='text-secondary-foreground' />
          </Button>
          <FavouriteButton
            title={'Activity saved to favorites!'}
            description={'You can view and replay this activity from your favorites!'}
            active={favourite}
            onPress={() => setFavorite(!favourite)}
          />
        </View>
      </View>
    </View>
  );
};
