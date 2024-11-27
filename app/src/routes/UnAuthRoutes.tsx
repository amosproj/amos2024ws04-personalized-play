// File: UnAuthRoutes.tsx
// Description: This file defines the navigation structure for unauthenticated users using React Navigation.
// It sets up a stack navigator with routes for various authentication-related screens such as SignIn, SignUp, ForgotPassword, etc.

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UnAuthHeader } from '@src/components';
import { Screens } from '@src/constants';
import { ForgotPassword, Loading, ResetPassword, SignIn, SignUp } from '@src/screens';
import type React from 'react';

// Define the parameter types for the UnAuthRoutes stack navigator
export type UnAuthRoutesParams = {
  [Screens.SignIn]: undefined;
  [Screens.SignUp]: undefined;
  [Screens.ForgotPassword]: undefined;
  [Screens.Loading]: undefined;
  [Screens.ResetPassword]: { oobCode: string };
};

// Create a stack navigator for unauthenticated routes
const UnAuthStack = createNativeStackNavigator<UnAuthRoutesParams>();

/**
 * Component: UnAuthRoutes
 * Description: This component sets up the navigation structure for unauthenticated users.
 * It includes routes for sign-in, sign-up, forgot password, and reset password screens.
 */
export const UnAuthRoutes: React.FC = () => {
  return (
    <UnAuthStack.Navigator
      initialRouteName={Screens.SignIn}
      screenOptions={{ headerShown: true, header: (props) => <UnAuthHeader {...props} /> }}
    >
      <UnAuthStack.Screen name={Screens.SignIn} component={SignIn} />
      <UnAuthStack.Screen name={Screens.SignUp} component={SignUp} />
      <UnAuthStack.Screen name={Screens.ForgotPassword} component={ForgotPassword} />
      <UnAuthStack.Screen name={Screens.ResetPassword} component={ResetPassword} />
      <UnAuthStack.Screen
        name={Screens.Loading}
        component={Loading}
        options={{ headerShown: false }}
      />
    </UnAuthStack.Navigator>
  );
};
