import { Button, Text } from "@shadcn/components";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@shadcn/components/ui/alert-dialog";
import { iconWithClassName } from "@shadcn/icons/iconWithClassName";
import type { ContextualQuestionProps } from "@src/types";
import { useFormikContext } from "formik";
import LottieView from "lottie-react-native";
import { HelpCircle, TimerIcon, X } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { Slider } from "react-native-awesome-slider";
import { useSharedValue } from "react-native-reanimated";
import { InfoAlertIcon } from "./InfoAlert";

iconWithClassName(TimerIcon);

export const ContextualQuestionPlayTime: React.FC<
  ContextualQuestionProps
> = () => {
  const { setFieldValue, values } = useFormikContext<{ time: number }>();
  const [sliderValue, setSliderValue] = useState(values.time);

  const onChange = (value: number) => {
    setSliderValue(value);
    setFieldValue("time", value);
  };

  return (
    <View className="flex flex-1 items-stretch justify-center">
      <View className="flex flex-1 flex-col items-center justify-center mb-4">
        <LottieView
          autoPlay={true}
          loop={true}
          source={require("../../assets/time.json")}
          style={{ width: 300, height: 300 }}
        />
      </View>
      <View className="flex flex-1 flex-col items-stretch">
        <View className="items-center">
          <Text className="text-2xl text-center font-medium mb-6">
            How much time can you sneak in today?
          </Text>
          <InfoAlertIcon
            title={"What does this mean?"}
            description={
              "When set to 30+ minutes, this tailors activities with additional steps or extensions to keep playtime engaging and meaningful for longer sessions."
            }
          />
        </View>

        <Text className="text-lg text-center" />
        <View className="items-stretch justify-center mt-12">
          <Slider
            style={{ width: "80%", alignSelf: "center" }}
            minimumValue={useSharedValue(5)}
            maximumValue={useSharedValue(30)}
            theme={{
              minimumTrackTintColor: "#620674",
              bubbleBackgroundColor: "#620674",
            }}
            progress={useSharedValue(sliderValue)}
            thumbWidth={32}
            steps={25}
            onSlidingComplete={onChange}
            markWidth={0}
            bubbleTextStyle={{ fontSize: 14 }}
            bubble={(value) => `${value} min`}
            renderThumb={() => (
              <Button size={"icon"} className="w-8 h-8 rounded-full bg-primary">
                <TimerIcon className="w-4 h-4 text-white" size={16} />
              </Button>
            )}
          />
        </View>
        <View className="flex flex-row justify-between mx-5 mt-6">
          <View className="font-medium flex flex-row w-full justify-between">
            <Text className="text-xl">5 min</Text>
            <Text className="text-xl">30 min+</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
