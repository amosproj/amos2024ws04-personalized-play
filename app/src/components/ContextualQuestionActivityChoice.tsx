import { Text } from '@shadcn/components';
import { useFormikContext } from 'formik';
import LottieView from 'lottie-react-native';
import { TouchableOpacity, View, type ViewProps } from 'react-native';

export const ContextualQuestionActivityChoice: React.FC<ViewProps> = () => {
  const { setFieldValue, values } = useFormikContext<{ activityType: string }>();
  console.log(values.activityType);
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
        <View className='flex flex-1 flex-col items-center'>
          <View className='flex-row space-x-4'>
            {/* Chores Button */}
            <TouchableOpacity
              onPress={() => setFieldValue('activityType', 'chores')}
              className={`w-32 h-24 m-4 rounded-lg justify-center items-center ${
                values.activityType === 'chores' ? 'bg-primary' : 'bg-secondary'
              }`}
            >
              <Text
                className={`font-bold text-lg ${
                  values.activityType === 'chores' ? 'text-white' : 'text-black'
                }`}
              >
                Chores
              </Text>
            </TouchableOpacity>
            {/* Freeplay Button */}
            <TouchableOpacity
              onPress={() => setFieldValue('activityType', 'freeplay')}
              className={`w-32 h-24 m-4 rounded-lg justify-center items-center ${
                values.activityType === 'freeplay' ? 'bg-primary' : 'bg-secondary'
              }`}
            >
              <Text
                className={` font-bold text-lg ${
                  values.activityType === 'freeplay' ? 'text-white' : 'text-black'
                }`}
              >
                Freeplay
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
