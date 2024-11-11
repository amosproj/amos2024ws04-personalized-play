import { Asset } from "expo-asset";
import React from "react";
import { Text, View, Image } from "react-native";
import {
  ToggleGroup,
  ToggleGroupItem,
  ToggleGroupIcon,
} from "@shadcn/components/ui/toggle-group";
import { Laugh, Smile, Meh, Frown, Angry } from "@shadcn/icons";
import { Button } from "@shadcn/components";

export const Energypage: React.FC = () => {
  const image = Asset.fromModule(require("../../assets/landing.png")).uri;
  const [value, setValue] = React.useState<string[]>([]);

  return (
    <View className="flex-1 justify-center items-center">
      <Image source={{ uri: image }} className="w-[350] h-[500] m-4" />
      <Text className="font-bold text-2xl">How are you feeling right now?</Text>
      <ToggleGroup
        value={value}
        onValueChange={setValue}
        type="single"
        className="m-4"
      >
        <ToggleGroupItem value="angry" aria-label="Toggle angry">
          <ToggleGroupIcon icon={Angry} size={42} />
        </ToggleGroupItem>
        <ToggleGroupItem value="frown" aria-label="Toggle frown">
          <ToggleGroupIcon icon={Frown} size={42} />
        </ToggleGroupItem>
        <ToggleGroupItem value="meh" aria-label="Toggle meh">
          <ToggleGroupIcon icon={Meh} size={42} />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle smile">
          <ToggleGroupIcon icon={Smile} size={42} />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle happy">
          <ToggleGroupIcon icon={Laugh} size={42} />
        </ToggleGroupItem>
      </ToggleGroup>

      <Button size={"lg"} className="rounded-full m-4">
        <Text>Next</Text>
      </Button>
    </View>
  );
};
