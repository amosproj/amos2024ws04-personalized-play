import type React from "react";
import { View, Image } from "react-native";
import { Button, Text, Input, H3 } from "@shadcn/components";


import { useState } from "react";

export const UserAge: React.FC = () => {
  const[date,setDate]=useState(new Date());
  const[showPicker,setShowPicker]=useState(false);
  
  return (
    <View className="flex-1 justify-center items-center gap-5 ">
      <Image source={require("../../assets/onboarding.jpg")} />
      <H3>Awesome! How old is she/he/they?</H3>
      <Input placeholder="Day" className="w-2/3" />
      <Input placeholder="Month"  className="w-2/3" />
      <Input placeholder="Year"  className="w-2/3" />
    

      <Button size={"lg"} className="rounded-full w-2/3">
        <Text>Next</Text>
      </Button>
    </View>
  );
};
