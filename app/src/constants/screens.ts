// File: screens.ts
// Description: This file defines enums for screen and stack names used in the application's navigation structure.
// The `Screens` enum is used to define the names of individual screens.
// The `Stacks` enum is used to define the names of navigation stacks (authenticated and unauthenticated).
// Usage:
// - The `Screens` enum is used in the `UnAuthRoutes` and `AuthRoutes` components to define the routes for various screens.
// - The `Stacks` enum is used in the `AppRoutes` component to define the main navigation stacks for authenticated and unauthenticated users.

export enum Screens {
  SignIn = "SignIn",
  SignUp = "SignUp",
  ForgotPassword = "ForgotPassword",
  ResetPassword = "ResetPassword",
  Landing = "Landing",
  Energypage = "Energypage",
  Home = "Home",
  Profile = "Profile",
}

export enum Stacks {
  UnAuth = "UnAuth",
  Auth = "Auth",
}
