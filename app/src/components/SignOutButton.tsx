import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useNavigation } from "@react-navigation/native";
import { Button, Text } from "@shadcn/components";
import { Stacks, fireAuth,Screens } from "@src/constants";
import type { AppNavigation } from "@src/types";
import { View } from "react-native";
import { signOut } from "firebase/auth";


export const SignOutButton: React.FC = () => {
  const { reset } = useNavigation<AppNavigation>();

  const handleLogout = async () => {
    try {
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
      }

      // Sign out from Firebase
      await signOut(fireAuth);
      console.log("Firebase sign-out successful");

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
    <View className="flex w-full justify-center mt-6 mb-2">
      <Button className="w-1/3" onPress={handleLogout}>
        <Text>Log Out</Text>
      </Button>
    </View>
  );
};
