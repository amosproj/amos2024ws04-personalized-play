import type React from "react";
import { View, Image } from "react-native";
import { Button, Text, Input, H3 } from "@shadcn/components";

export const UserAge: React.FC = () => {
  return (
    <View className="flex-1 justify-center items-center gap-5 ">
      <Image source={require("../../assets/onboarding.jpg")} />
      <H3>Awesome! How old is she/he/they?</H3>
      <Input placeholder="Age" />
      <Button size={"lg"} className="rounded-full">
        <Text>Next</Text>
      </Button>
    </View>
  );
};
