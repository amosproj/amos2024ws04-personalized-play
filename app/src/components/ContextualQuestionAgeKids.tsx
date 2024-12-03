import { Label, Text } from "@shadcn/components";
import {
  ToggleGroup,
  ToggleGroupIcon,
  ToggleGroupItem,
} from "@shadcn/components/ui/toggle-group";
import { RadioGroup, RadioGroupItem } from "@shadcn/components/ui/radio-group";
import { iconWithClassName } from "@shadcn/icons/iconWithClassName";
import type { ContextualQuestionProps, OnboardingFormData } from "@src/types";
import {
  IconGenderFemale,
  IconGenderMale,
  IconGenderTransgender,
} from "@tabler/icons-react-native";
import { useFormikContext } from "formik";
import LottieView from "lottie-react-native";
import { Baby, Cake, IdCard } from "lucide-react-native";
import { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { TextInput } from "./FormikTextInput";

iconWithClassName(IdCard);
iconWithClassName(Baby);
iconWithClassName(Cake);
iconWithClassName(IconGenderMale);

export const ContextualQuestionAgeKids: React.FC<ContextualQuestionProps> = (
  props
) => {
  const { setFieldValue, values } = useFormikContext<OnboardingFormData>();

  //
  const { onNext } = props;
  const onChange = (value: string | undefined) => {
    if (!value) return;
    setFieldValue("activityType", value);
    onNext();
  };

  useEffect(() => {
    if (values.numberOfKids === 0) return;
    (async () => {
      if (values.kidsDetails.length > values.numberOfKids) {
        await setFieldValue(
          "kidsDetails",
          values.kidsDetails.slice(0, values.numberOfKids)
        );
      }
    })();
  }, [values.numberOfKids]);

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
        <ScrollView
          className="flex flex-1"
          horizontal={false}
          showsVerticalScrollIndicator={false}
        >
          {Array(values.numberOfKids)
            .fill(0)
            .map((_, index) => (
              <View key={`kid-${index.toString()}`} className="mb-6">
                <View className="flex items-center flex-row mb-1">
                  <Baby className="text-secondary-foreground mr-2" size={24} />
                  <Label>Kid {index + 1}</Label>
                </View>
                <TextInput
                  lable="Name"
                  fieldName={`kidsDetails.${index}.name`}
                  leadingIcon={IdCard}
                />
                <View className="flex flex-row gap-x-4">
                  <TextInput
                    lable="Age"
                    fieldName={`kidsDetails.${index}.age`}
                    keyboardType="numeric"
                    leadingIcon={Cake}
                    className="flex-1"
                    placeholder="Age in months"
                  />
                  <View className="mt-2">
                    <Label className="mb-4">Gender</Label>
                    <ToggleGroup
                      value={values.kidsDetails[index]?.gender}
                      onValueChange={(value) =>
                        setFieldValue(`kidsDetails.${index}.gender`, value)
                      }
                      type="single"
                      className="flex flex-row gap-x-2"
                    >
                      <ToggleGroupItem value="male" className="rounded-xl">
                        <ToggleGroupIcon icon={IconGenderMale} size={18} />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="female" className="rounded-xl">
                        <ToggleGroupIcon icon={IconGenderFemale} size={18} />
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="transgender"
                        className="rounded-xl"
                      >
                        <ToggleGroupIcon
                          icon={IconGenderTransgender}
                          size={18}
                        />
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </View>
                </View>
                <View className="mt-2 gap-3">
                  <Label>Health Considerations</Label>
                  <Text>
                    Are there any health considerations for your child that
                    you'd like us to know?
                  </Text>

                  <RadioGroup value="" onValueChange={() => {}}>
                    <View className={"flex-row gap-2 items-center"}>
                      <RadioGroupItem value="Yes" />
                      <Label>Yes</Label>
                    </View>
                    <View className={"flex-row gap-2 items-center"}>
                      <RadioGroupItem value="No" />
                      <Label>No</Label>
                    </View>
                  </RadioGroup>
                </View>
              </View>
            ))}
        </ScrollView>
      </View>
    </View>
  );
};
