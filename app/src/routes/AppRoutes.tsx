// File: AppRoutes.tsx
// Description: This file defines the main navigation structure for the application using React Navigation.
// It sets up a stack navigator with two main routes: Authenticated (AuthRoutes) and Unauthenticated (UnAuthRoutes).
// The navigation flow is determined based on the user's authentication state, which is managed using Firebase Authentication.

import type { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Loading } from '@src/components';
import { Stacks, fireAuth } from '@src/constants';
import { useAuthState } from 'react-firebase-hooks/auth';
import { AuthRoutes, type AuthRoutesParams } from './AuthRoutes';
import { UnAuthRoutes, type UnAuthRoutesParams } from './UnAuthRoutes';

// Define the parameter types for the AppRoutes stack navigator
export type AppRoutesParams = {
  [Stacks.UnAuth]: NavigatorScreenParams<UnAuthRoutesParams>;
  [Stacks.Auth]: NavigatorScreenParams<AuthRoutesParams>;
};

// Create a stack navigator for the app routes
const AppRoutesStack = createNativeStackNavigator<AppRoutesParams>();

/**
 * Component: AppRoutes
 * Description: This component sets up the main navigation structure for the application.
 * It uses Firebase Authentication to determine the user's authentication state and navigates
 * to the appropriate stack (Authenticated or Unauthenticated) based on that state.
 *
 * The `AuthRoutes` component is used to define the navigation structure for authenticated users,
 * including routes for home and profile screens.
 *
 * The `UnAuthRoutes` component is used to define the navigation structure for unauthenticated users,
 * including routes for sign-in, sign-up, forgot password, and reset password screens.
 */
export const AppRoutes: React.FC = () => {
  // Use Firebase Authentication to get the current user and loading state
  const [user, loading] = useAuthState(fireAuth);

  // Show a loading screen while the authentication state is being determined
  if (loading) {
    return <Loading heading='Loading...' description='Please wait while we load the content.' />;
  }

  // Set up the stack navigator with the appropriate initial route based on the user's authentication state
  return (
    <AppRoutesStack.Navigator
      initialRouteName={!loading && user?.uid ? Stacks.Auth : Stacks.UnAuth}
    >
      <AppRoutesStack.Screen
        name={Stacks.UnAuth}
        component={UnAuthRoutes}
        options={{ headerShown: false }}
      />
      <AppRoutesStack.Screen
        name={Stacks.Auth}
        component={AuthRoutes}
        options={{ headerShown: false }}
      />
    </AppRoutesStack.Navigator>
  );
};
