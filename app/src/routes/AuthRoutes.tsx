// File: AuthRoutes.tsx
// Description: This file defines the navigation structure for authenticated users using React Navigation.
// It sets up a drawer navigator with routes for various authenticated screens such as Home and Profile.

import { createDrawerNavigator } from '@react-navigation/drawer';
import { Drawer, Header } from '@src/components';
import { Screens } from '@src/constants';
import { Home, Profile } from '@src/screens';

// Define the parameter types for the AuthRoutes drawer navigator
export type AuthRoutesParams = {
  [Screens.Home]: undefined;
  [Screens.Profile]: undefined;
};

// Create a drawer navigator for authenticated routes
const AuthDrawer = createDrawerNavigator<AuthRoutesParams>();

/**
 * Component: AuthRoutes
 * Description: This component sets up the navigation structure for authenticated users.
 * It includes routes for home and profile screens, and uses a custom header and drawer component.
 */
export const AuthRoutes: React.FC = () => {
  return (
    <AuthDrawer.Navigator
      initialRouteName={Screens.Home}
      screenOptions={{ header: (props) => <Header {...props} /> }}
      drawerContent={(props) => <Drawer {...props} />}
    >
      <AuthDrawer.Screen name={Screens.Home} component={Home} />
      <AuthDrawer.Screen name={Screens.Profile} component={Profile} />
    </AuthDrawer.Navigator>
  );
};
