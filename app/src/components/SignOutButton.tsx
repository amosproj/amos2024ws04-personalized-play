import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useNavigation } from "@react-navigation/native";
import { Button, Text } from "@shadcn/components";
import { Screens, Stacks, fireAuth } from "@src/constants";
import type { AppNavigation } from "@src/types";
import Constants from "expo-constants";
import { signOut } from "firebase/auth";
import { DoorOpen } from "lucide-react-native";
import { View } from "react-native";

export const SignOutButton: React.FC = () => {
  const { reset } = useNavigation<AppNavigation>();

  const handleLogout = async () => {
    try {
      GoogleSignin.configure({
        webClientId: Constants.expoConfig?.extra?.googleAuthClientId,
        offlineAccess: true,
      });

      // Check if a user is signed in
      if (!fireAuth.currentUser) {
        console.log("No user is currently signed in.");
        return;
      }

      // Check if the user is signed in with Google
      const isGoogleUser = fireAuth.currentUser.providerData.some(
        (provider) => provider.providerId === "google.com"
      );
      console.log("Is Google User:", isGoogleUser);

      // Sign out from Google if applicable
      if (isGoogleUser) {
        await GoogleSignin.signOut();
        console.log("Google sign-out successful");
      } else {
        // Sign out from Firebase
        await signOut(fireAuth);
        console.log("Firebase sign-out successful");
      }

      // Reset navigation to SignIn screen
      reset({
        index: 0,
        routes: [
          {
            name: Stacks.UnAuth,
            params: { screen: Screens.SignIn },
          },
        ],
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <View className="w-full flex flex-row justify-start mt-6 mb-2">
      <Button
        className="bg-white border border-primary flex flex-row gap-x-3"
        onPress={handleLogout}
      >
        <DoorOpen size={18} className="text-primary" />
        <Text className="text-primary">Logout</Text>
      </Button>
    </View>
  );
};
