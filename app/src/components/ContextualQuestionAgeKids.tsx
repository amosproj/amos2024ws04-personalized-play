import { Label, Text, Button } from "@shadcn/components";
import {
  ToggleGroup,
  ToggleGroupIcon,
  ToggleGroupItem,
} from "@shadcn/components/ui/toggle-group";
//import { RadioGroup, RadioGroupItem } from "@shadcn/components/ui/radio-group";
import { Checkbox } from "@shadcn/components/ui/checkbox";
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
import { useEffect, useState } from "react";
import { ScrollView, View, Modal } from "react-native";
import { TextInput } from "./FormikTextInput";

iconWithClassName(IdCard);
iconWithClassName(Baby);
iconWithClassName(Cake);
iconWithClassName(IconGenderMale);

export const ContextualQuestionAgeKids: React.FC<
  ContextualQuestionProps
> = () => {
  const { setFieldValue, values } = useFormikContext<OnboardingFormData>();

  //New changes
  const [modalVisible, setModalVisible] = useState(false);

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
                  <ToggleGroup
                    variant="outline"
                    value={
                      values.kidsDetails[index]?.healthConsiderations.isConsidered
                    }
                    onValueChange={(value) =>
                      setFieldValue(
                        `kidsDetails.${index}.healthConsiderations.isConsidered`,
                        value
                      )
                    }
                    type="single"
                    className="flex flex-row gap-x-2"
                  >
                    <ToggleGroupItem
                      onPress={() => setModalVisible(true)}
                      value="Yes"
                      className="rounded-xl"
                    >
                      <Label>Yes</Label>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="No" className="rounded-xl">
                      <Label>No</Label>
                    </ToggleGroupItem>
                  </ToggleGroup>

                  {/* <RadioGroup value="" onValueChange={() => {}}>
                    <View className={"flex-row gap-2 items-center"}>
                      <RadioGroupItem
                        value="Yes"
                        onPress={() => {
                          setModalVisible(true);
                        }}
                      />
                      <Label>Yes</Label>
                    </View>
                    <View className={"flex-row gap-2 items-center"}>
                      <RadioGroupItem value="No" />
                      <Label>No</Label>
                    </View>
                  </RadioGroup> */}
                  <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}
                  >
                    <View className="flex-1 bg-black/50 items-center justify-center">
                      <View className="w-11/12 bg-white p-6 rounded-lg gap-4">
                        <Text className="text-xl font-bold mb-4 text-center">
                          Select the one's that is related to you
                        </Text>
                        <View className="gap-3">
                          <View className="flex flex-row items-center gap-2 ">
                            <Checkbox
                              checked={false}
                              onCheckedChange={() => {}}
                            />
                            <Label>Developmental delays</Label>
                          </View>
                          <View className="flex flex-row items-center gap-2 ">
                            <Checkbox
                              checked={false}
                              onCheckedChange={() => {}}
                            />
                            <Label>Autism spectrum</Label>
                          </View>
                          <View className="flex flex-row items-center gap-2 ">
                            <Checkbox
                              checked={false}
                              onCheckedChange={() => {}}
                            />
                            <Label>ADHD</Label>
                          </View>
                          <View className="flex flex-row items-center gap-2">
                            <Checkbox
                              checked={false}
                              onCheckedChange={() => {}}
                            />
                            <Label>Speech or language challenges</Label>
                          </View>
                          <View className="flex flex-row items-center gap-2">
                            <Checkbox
                              checked={false}
                              onCheckedChange={() => {}}
                            />
                            <Label>Hearing impairment</Label>
                          </View>
                          <View className="flex flex-row items-center gap-2">
                            <Checkbox
                              checked={false}
                              onCheckedChange={() => {}}
                            />
                            <Label>Vision impairment</Label>
                          </View>
                          <View className="flex flex-row items-center gap-2">
                            <Checkbox
                              checked={false}
                              onCheckedChange={() => {}}
                            />
                            <Label>Motor skill challenges</Label>
                          </View>
                          <View className="flex flex-row items-center gap-2">
                            <Checkbox
                              checked={false}
                              onCheckedChange={() => {}}
                            />
                            <Label>Physical disabilities or limitations</Label>
                          </View>
                          <View className="flex flex-row items-center gap-2">
                            <Checkbox
                              checked={false}
                              onCheckedChange={() => {}}
                            />
                            <Label>Chronic illness</Label>
                          </View>
                          <View className="flex flex-row items-center gap-2">
                            <Checkbox
                              checked={false}
                              onCheckedChange={() => {}}
                            />
                            <Label>Emotional or behavioral concerns</Label>
                          </View>
                          <TextInput lable="Other" fieldName={`kidsDetails.${index}.healthConsiderations.considerations`}/>
                        </View>
                        <Button 
                          onPress={() => {
                            setModalVisible(false);
                          }}
                        >
                          <Text>Save</Text>
                        </Button>
                      </View>
                    </View>
                  </Modal>
                </View>
              </View>
            ))}
        </ScrollView>
      </View>
    </View>
  );
};
