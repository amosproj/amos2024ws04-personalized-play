// File: AuthRoutes.tsx
// Description: This file defines the navigation structure for authenticated users using React Navigation.
// It sets up a drawer navigator with routes for various authenticated screens such as Home and Profile.

import { createDrawerNavigator } from "@react-navigation/drawer";
import { Drawer, Loading } from "@src/components";
import { Collections, Screens, fireAuth, fireStore } from "@src/constants";
import {
  ActivityPlayer,
  Favorite,
  Feedback,
  Home,
  NewKid,
  NewPlay,
  Onboarding,
  Profile,
  Welcome,
  History
} from "@src/screens";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

// Define the parameter types for the AuthRoutes drawer navigator
export type AuthRoutesParams = {
  [Screens.Home]: undefined;
  [Screens.Profile]: undefined;
  [Screens.Welcome]: undefined;
  [Screens.Onboarding]: undefined;
  [Screens.ActivityPlayer]: { activityId: string };
  [Screens.Favorite]: undefined;
  [Screens.NewPlay]: undefined;
  [Screens.NewKid]: undefined;
  [Screens.History]: undefined;
  [Screens.Feedback]: { activityId: string | undefined };
};

// Create a drawer navigator for authenticated routes
const AuthDrawer = createDrawerNavigator<AuthRoutesParams>();

/**
 * Component: AuthRoutes
 * Description: This component sets up the navigation structure for authenticated users.
 * It includes routes for home and profile screens, and uses a custom header and drawer component.
 */
export const AuthRoutes: React.FC = () => {
  const [user, _] = useAuthState(fireAuth);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        if (!user) return;
        const userDocRef = doc(fireStore, Collections.Users, user.uid);
        const docData = await getDoc(userDocRef);
        setIsFirstTimeUser(!docData.exists() || !docData.get("kids"));
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  if (isLoading) {
    return (
      <Loading
        heading="Loading..."
        description="Please wait while we load the content."
      />
    );
  }

  return (
    <AuthDrawer.Navigator
      initialRouteName={isFirstTimeUser ? Screens.Welcome : Screens.Home}
      drawerContent={(props) => <Drawer {...props} />}
    >
      <AuthDrawer.Screen
        name={Screens.Welcome}
        component={Welcome}
        options={{
          headerShown: false,
          gestureHandlerProps: { enabled: false },
        }}
      />
      <AuthDrawer.Screen
        name={Screens.Home}
        component={Home}
        options={{ headerShown: false }}
      />
      <AuthDrawer.Screen
        name={Screens.Profile}
        component={Profile}
        options={{
          headerShown: false,
          gestureHandlerProps: { enabled: false },
        }}
      />
      <AuthDrawer.Screen
        name={Screens.Onboarding}
        component={Onboarding}
        options={{
          headerShown: false,
          gestureHandlerProps: { enabled: false },
        }}
      />
      <AuthDrawer.Screen
        name={Screens.ActivityPlayer}
        component={ActivityPlayer}
        options={{
          headerShown: false,
          gestureHandlerProps: { enabled: false },
        }}
      />
      <AuthDrawer.Screen
        name={Screens.Favorite}
        component={Favorite}
        options={{
          headerShown: false,
          gestureHandlerProps: { enabled: false },
        }}
      />
      <AuthDrawer.Screen
        name={Screens.NewPlay}
        component={NewPlay}
        options={{
          headerShown: false,
          gestureHandlerProps: { enabled: false },
        }}
      />
      <AuthDrawer.Screen
        name={Screens.NewKid}
        component={NewKid}
        options={{
          headerShown: false,
          gestureHandlerProps: { enabled: false },
        }}
      />
      <AuthDrawer.Screen
        name={Screens.Feedback}
        component={Feedback}
        options={{ headerShown: false, gestureHandlerProps: { enabled: false } }}
      />
      <AuthDrawer.Screen
        name={Screens.History}
        component={History}
        options={{ headerShown: false, gestureHandlerProps: { enabled: false } }}
      />
    </AuthDrawer.Navigator>
  );
};
