import { useNavigation } from "@react-navigation/native";
import { Button, Text } from "@shadcn/components";
import { Card, CardHeader } from "@shadcn/components/ui/card";
import { Screens, Stacks } from "@src/constants";
import type { AppNavigation } from "@src/types";
import { CircleArrowRight } from "lucide-react-native";
import { View } from "react-native";
import { getAuth, signOut } from "firebase/auth";

export const Home: React.FC = () => {
  const { navigate, reset } = useNavigation<AppNavigation>();
  const auth = getAuth();

  //Log out functionality
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        reset({
          index: 0,
          routes: [
            {
              name: Stacks.UnAuth,
              params: { screen: Screens.SignIn },
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  return (
    <View className="flex flex-1 items-center justify-center">
      <Card className="w-full max-w-sm h-20 bg-primary">
        <CardHeader className="flex-row  items-center justify-between">
          <Text className="text-primary-foreground">Wonna Play?</Text>
          <CircleArrowRight
            color="#ffffff"
            onPress={() => navigate(Stacks.Auth, { screen: Screens.NewPlay })}
          />
        </CardHeader>
      </Card>
      <Button onPress={handleLogout}>
        <Text>Log Out</Text>
      </Button>
    </View>
  );
};
