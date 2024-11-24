import { Text } from "@shadcn/components";
import { useField } from "formik";
import { View } from "react-native";
import LottieView from "lottie-react-native";
import { TextInput } from './FormikTextInput';
import type { ContextualQuestionProps } from '@src/types';


export const ContextualQuestionAgeKids: React.FC<ContextualQuestionProps> = (props) => {
  const [field] = useField("numberOfKids");
  const { onNext } = props;
  return (
    <View className="flex flex-1 items-stretch justify-center">
      <View className="flex flex-1 flex-col items-center justify-center mb-4">
        <LottieView
          autoPlay={true}
          loop={true}
          source={require("../../assets/kids.json")}
          style={{ width: 320, height: 320 }}
        />
      </View>
      <View className="flex flex-1 flex-col items-stretch">
        <Text className="text-2xl text-center font-medium mb-6">
          Tell us about your kids
        </Text>
        {/* <Text>ContextualQuestionAgeKids {field.value}</Text> */}
        <TextInput
          lable='Age of kids'
          fieldName='ageOfKids'
          placeholder="DD-MM-YYYY"
          className='w-full'
          keyboardType='number-pad'
          onEnter={onNext}
        />
      </View>
    </View>
  );
};
