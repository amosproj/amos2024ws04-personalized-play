import { Text } from '@shadcn/components';
import LottieView from 'lottie-react-native';
import { View, type ViewProps } from 'react-native';

export const ContextualQuestionActivityChoice: React.FC<ViewProps> = () => {
  return (
    <View className='flex flex-1 items-stretch justify-center'>
      <View className='flex flex-1 flex-col items-center justify-center mb-4'>
        <LottieView
          autoPlay={true}
          loop={true}
          source={require('../../assets/battery.json')}
          style={{ width: 320, height: 320 }}
        />
      </View>
      <View className='flex flex-1 flex-col items-stretch'>
        <Text className='text-2xl text-center font-medium mb-6'>
          What kind of play would you like?
        </Text>
        <Text className='text-lg text-center'>
          Feeling like tackling some chores or just having fun with free play?
        </Text>
        <View className='h-[48px] items-stretch justify-center'>{/*Insert comp here*/}</View>
      </View>
    </View>
  );
};
