import { Button } from '@shadcn/components';
import { ContextualQuestionPlayTime } from '@src/components/ContextualQuestionPlayTime';
import { useRef, useState } from 'react';
import { Animated, FlatList, Text, View, type ViewToken } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ContextualQuestionEnergyLevel } from '../components/ContextualQuestionEnergyLevel';
import { ContextualQuestionNumberKids } from '../components/ContextualQuestionNumberKids';
import Paginator from '../components/Paginator';
import { OnboardingType } from '../types/OnboardingType';

export const Onboarding: React.FC = () => {
  const [showError, setShowError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList<OnboardingQuestion>>(null);
  const onboarding = useRef(new OnboardingType()).current;
  const [successfullAnsweredScreens, setSuccessfullAnsweredScreens] = useState<number[]>([]);

  const viewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken<OnboardingQuestion>[] }) => {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  ).current;

  const setCurrentScreenAnswered = (answered: boolean) => {
    if (answered) {
      // If not already in array, add current screen index
      setSuccessfullAnsweredScreens((prev) =>
        prev.includes(currentIndex) ? prev : [...prev, currentIndex]
      );
    } else {
      // Remove current screen index if it exists
      setSuccessfullAnsweredScreens((prev) => prev.filter((index) => index !== currentIndex));
    }
  };

  const wasCurrentScreenAnswered = (): boolean => {
    return successfullAnsweredScreens.includes(currentIndex) || ONBOARDING_QUESTIONS[currentIndex].isAlwaysAnswered;
  };

  const renderItem = ({ item }: { item: OnboardingQuestion }) => (
    <View className='w-screen'>{item.screen(setCurrentScreenAnswered, onboarding)}</View>
  );

  const scrollTo = () => {
    if (!wasCurrentScreenAnswered()) {
      setShowError(true);
      return;
    }
    setShowError(false);
    if (onboarding) {
      console.log(onboarding);
    }
    const currentSlidesRef = slidesRef.current;
    if (currentIndex < ONBOARDING_QUESTIONS.length - 1 && currentSlidesRef) {
      currentSlidesRef.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  const isNextButtonAllowed = wasCurrentScreenAnswered()

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className='flex-1'>
        <View className='flex-[0.8]'>
          <FlatList
            scrollEnabled={false}
            horizontal={true}
            pagingEnabled={true}
            data={ONBOARDING_QUESTIONS}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={viewableItemsChanged}
            ref={slidesRef}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
              useNativeDriver: false
            })}
          />
        </View>
        <View className='flex-[0.2] p-4 gap-5'>
          <View className='flex-1'>
            <View className='flex-[0.5]'>
              {showError && (
                <Text className='text-center p-2 rounded border border-rose-600 text-red-700'>
                  Error
                </Text>
              )}
            </View>
            <View className='flex-[0.5] gap-5 w-full'>
              <Button disabled={!isNextButtonAllowed} onPress={(e) => scrollTo()} variant={'default'}>
                <Text className='text-white'>Next</Text>
              </Button>
              <Paginator pages={ONBOARDING_QUESTIONS.map((_, i) => i)} scrollX={scrollX} />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export interface OnboardingQuestion {
  id: string;
  isAlwaysAnswered: boolean;
  screen: (
    setCurrentScreenAnswered: (answered: boolean) => void,
    type: OnboardingType
  ) => React.JSX.Element;
}

export const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  {
    id: 'number-of-kids',
    isAlwaysAnswered: false,
    screen: (setCurrentScreenAnswered, type) => (
      <ContextualQuestionNumberKids
        setCurrentScreenAnswered={setCurrentScreenAnswered}
        type={type}
      />
    )
  },
  {
    id: 'play-time',
    isAlwaysAnswered: true,
    screen: (setCurrentScreenAnswered, type) => (
      <ContextualQuestionPlayTime setCurrentScreenAnswered={setCurrentScreenAnswered} type={type} />
    )
  },
  {
    id: 'energy-level',
    isAlwaysAnswered: true,
    screen: (setCurrentScreenAnswered, type) => (
      <ContextualQuestionEnergyLevel
        setCurrentScreenAnswered={setCurrentScreenAnswered}
        type={type}
      />
    )
  }
];
