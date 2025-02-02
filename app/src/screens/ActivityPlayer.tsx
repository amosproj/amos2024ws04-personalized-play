import { Marquee } from '@animatereactnative/marquee';
import { type RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Button, Text } from '@shadcn/components';
import { iconWithClassName } from '@shadcn/icons/iconWithClassName';
import { Loading } from '@src/components';
import { Screens, Stacks, fireFunction } from '@src/constants';
import { useGetActivity } from '@src/hooks';
import type { AuthRoutesParams } from '@src/routes';
import type { AppNavigation } from '@src/types';
import {
  IconBrain,
  IconHelp,
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerTrackNext,
  IconPlayerTrackPrev,
  IconReload,
  IconRepeat,
  IconXboxX
} from '@tabler/icons-react-native';
import { Audio } from 'expo-av';
import { httpsCallable } from 'firebase/functions';
import LottieView from 'lottie-react-native';
import { useMemo, useRef, useState } from 'react';
import { View } from 'react-native';

iconWithClassName(IconBrain);
iconWithClassName(IconHelp);
iconWithClassName(IconRepeat);
iconWithClassName(IconPlayerPlay);
iconWithClassName(IconPlayerPause);
iconWithClassName(IconPlayerTrackNext);
iconWithClassName(IconPlayerTrackPrev);
iconWithClassName(IconXboxX);

export const ActivityPlayer: React.FC = () => {
  const { navigate } = useNavigation<AppNavigation>();
  const { params } = useRoute<RouteProp<AuthRoutesParams>>();
  const activity = useGetActivity(params?.activityId || '');
  const sound = useRef(new Audio.Sound());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isReloading, setIsReloading] = useState(false);

  const playAudio = async (index: number) => {
    if (!activity || activity?.isLoading || activity.error || !activity?.data) return;
    try {
      let status = await sound.current.getStatusAsync();
      if (!status.isLoaded) {
        await sound.current.loadAsync({ uri: activity.data.activity.steps[index].audioUrl });
        status = await sound.current.getStatusAsync();
      }
      if (status.isLoaded && !status.isPlaying) {
        await sound.current.playAsync();
        setIsPlaying(true);
        setIsFinished(false);
        sound.current.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsFinished(true);
            setIsPlaying(false);
          }
        });
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const replayAudio = async () => {
    try {
      const status = await sound.current.getStatusAsync();
      if (status.isLoaded) {
        await sound.current.setPositionAsync(0);
        await sound.current.playAsync();
        setIsPlaying(true);
        setIsFinished(false);
      }
    } catch (error) {
      console.error('Error replaying audio:', error);
    }
  };

  const pauseAudio = async () => {
    try {
      const status = await sound.current.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        await sound.current.pauseAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error pausing audio:', error);
    }
  };

  const playNextAudio = async () => {
    if (currentStep < maxSteps - 1) {
      try {
        await sound.current.unloadAsync();
        setIsPlaying(false);
        setCurrentStep((prevStep) => prevStep + 1);
        playAudio(currentStep + 1);
      } catch (error) {
        console.error('Error playing next audio:', error);
      }
    }
  };

  const playPreviousAudio = async () => {
    if (currentStep > 0) {
      try {
        await sound.current.unloadAsync();
        setIsPlaying(false);
        setCurrentStep((prevStep) => prevStep - 1);
        playAudio(currentStep - 1);
      } catch (error) {
        console.error('Error playing previous audio:', error);
      }
    }
  };

  const reloadActivity = async () => {
    try {
      setIsReloading(true);
      const generateActivity = httpsCallable(fireFunction, 'ChorsGeneratorFlow');
      await generateActivity({ activityId: params?.activityId });
      await activity?.reload();
      await sound.current.unloadAsync();
      setIsPlaying(false);
      setIsFinished(false);
      setCurrentStep(0);
    } catch (error) {
      console.log(error);
    } finally {
      setIsReloading(false);
    }
  };

  // calculate max steps based on activity data.
  const maxSteps = useMemo(() => {
    if (!activity || activity?.isLoading || activity.error || !activity?.data) return 0;
    return activity.data.activity.steps.length || 0;
  }, [activity?.data, activity?.isLoading]);

  // return loading screen if activity is loading from firestore.
  if (activity?.isLoading) {
    return <Loading heading='Loading activity' description='Please wait...' />;
  }

  const finishSession = () => {
    navigate(Stacks.Auth, {
      screen: Screens.Feedback,
      params: { activityId: params?.activityId }
    });
  };

  const exitActivity = async () => {
    await sound.current.unloadAsync();
    setIsPlaying(false);
    setIsFinished(false);
    setIsReloading(false);
    setCurrentStep(0);
    navigate(Stacks.Auth, { screen: Screens.Home });
  };

  const isLastStep = currentStep === maxSteps - 1;

  return (
    <View className='flex flex-col flex-1 items-stretch p-6 gap-y-6'>
      <View className='flex flex-col flex-[3] items-center gap-y-4'>
        <View className='flex flex-col items-center gap-y-2'>
          <Text className='text-xl font-medium'>{activity?.data.activity.name}</Text>
          <Text className='text-sm text-center'>{activity?.data.activity.description}</Text>
        </View>
        <LottieView
          autoPlay={true}
          loop={true}
          source={require('../../assets/activity.json')}
          style={{ width: 320, height: 320 }}
        />
      </View>
      <View className='flex flex-col flex-[1] justify-end gap-y-4'>
        <View className='flex flex-row items-center justify-center gap-x-12'>
          <Text className='text-xl'>
            Step {currentStep + 1} of {maxSteps}
          </Text>
        </View>
        <View className='flex flex-row items-center justify-center gap-x-12'>
          {isPlaying && (
            <Marquee style={{ width: '70%' }} speed={0.6}>
              <Text className='text-xl'>
                {activity?.data.activity.steps[currentStep].instructions}
              </Text>
            </Marquee>
          )}
        </View>
        <View className='flex flex-row items-center justify-center gap-x-12'>
          <Button
            variant={'secondary'}
            className='native:h-20 native:w-24 rounded-xl'
            disabled={currentStep === 0 || isReloading}
            onPress={playPreviousAudio}
          >
            <IconPlayerTrackPrev className='text-base' size={28} />
          </Button>
          <Button
            variant={'default'}
            disabled={isReloading}
            className='native:h-20 native:w-20 rounded-xl'
            onPress={() => {
              if (isFinished) {
                replayAudio();
              } else if (isPlaying) {
                pauseAudio();
              } else {
                playAudio(currentStep);
              }
            }}
          >
            {isFinished ? (
              <IconRepeat className='text-base text-primary-foreground' size={28} />
            ) : isPlaying ? (
              <IconPlayerPause className='text-base text-primary-foreground' size={28} />
            ) : (
              <IconPlayerPlay className='text-base text-primary-foreground' size={28} />
            )}
          </Button>
          {isLastStep ? (
            <Button
              variant='secondary'
              className='native:h-20 native:w-24 rounded-xl'
              disabled={isPlaying}
              onPress={finishSession}
            >
              <Text>Finish</Text>
            </Button>
          ) : (
            <Button
              variant={'secondary'}
              className='native:h-20 native:w-24 rounded-xl'
              disabled={isLastStep || isReloading}
              onPress={playNextAudio}
            >
              <IconPlayerTrackNext className='text-base' size={28} />
            </Button>
          )}
        </View>
        <View className='flex flex-row items-center justify-center gap-x-12 w-full'>
          <View className='native:w-24' />
          <Button
            variant='destructive'
            className='native:h-20 native:w-20 rounded-xl'
            disabled={isReloading}
            onPress={() => exitActivity()}
          >
            <IconXboxX className='text-base text-primary-foreground' size={28} />
          </Button>
          <Button
            variant='secondary'
            className='native:h-20 native:w-24 rounded-xl'
            disabled={isPlaying || isReloading}
            onPress={reloadActivity}
          >
            <IconReload className='text-base' size={28} />
          </Button>
        </View>
      </View>
    </View>
  );
};
