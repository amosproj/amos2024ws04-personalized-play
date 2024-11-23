import { signInWithEmailAndPassword } from '@firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@shadcn/components';
import { Separator } from '@shadcn/components/ui/separator';
import { Fingerprint, Mail } from '@shadcn/icons';
import { AppLogo, GoogleSignInButton, SubmitButton, TextInput } from '@src/components';
import { Collections, Screens, Stacks, fireAuth, fireStore } from '@src/constants';
import type { AppNavigation } from '@src/types';
import { Timestamp, doc, getDoc, setDoc } from 'firebase/firestore';
import { Formik } from 'formik';
import type React from 'react';
import { Pressable, View } from 'react-native';
import * as Yup from 'yup';

interface SignInFormData {
  email: string;
  password: string;
}

export const SignIn: React.FC = () => {
  const { navigate } = useNavigation<AppNavigation>();

  /**
   * Signs in a user using email and password and then navigates to either the Welcome or Home screen.
   * If the user has no kids, it navigates to the Welcome screen. Otherwise, it navigates to the Home screen.
   * @param values - The form values containing the email and password.
   */
  const onSignIn = async (values: SignInFormData) => {
    const { email, password } = values;
    try {
      // Sign in the user using Firebase Authentication
      const { user } = await signInWithEmailAndPassword(fireAuth, email.trim(), password.trim());
      // Get the user document from Firestore
      const userDocRef = doc(fireStore, Collections.Users, user.uid);
      const docData = await getDoc(userDocRef);
      // If the user has no kids, create a new user document with the user's display name and email
      const userData = docData.exists() ? {} : { displayName: user.displayName, email: user.email };
      // Set the last sign-in timestamp for the user
      await setDoc(userDocRef, { ...userData, lastSignIn: Timestamp.now() }, { merge: true });
      // Navigate to either the Welcome or Home screen based on whether the user has kids or not
      navigate(docData.get('kids') ? Stacks.Auth : Stacks.Auth, {
        screen: docData.get('kids') ? Screens.Home : Screens.Welcome
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className='flex flex-1 justify-center px-6'>
      <View className='flex flex-col justify-center items-center self-center'>
        <AppLogo height={100} width={80} />
        <Text className='text-3xl font-medium mt-4 mb-2'>Sign In</Text>
        <Text className='text-lg mb-4'>Welcome back! Sign in to your account.</Text>
      </View>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={Yup.object({
          email: Yup.string().email('Invalid email').required('Required'),
          password: Yup.string().required('Required').min(8, 'Must be 8 characters or more')
        })}
        onSubmit={onSignIn}
      >
        <View className='flex flex-col justify-center items-stretch my-2'>
          <TextInput fieldName='email' lable='Email' leadingIcon={Mail} />
          <TextInput
            fieldName='password'
            lable='Password'
            secureTextEntry={true}
            leadingIcon={Fingerprint}
            submitOnEnter={true}
          />
          <SubmitButton className='native:h-14 native:py-2'>
            <Text className='native:text-xl'>Sign In</Text>
          </SubmitButton>
        </View>
      </Formik>
      <View className='flex flex-col justify-center items-stretch self-center my-2'>
        <View className='flex flex-row justify-center items-center mb-1'>
          <Text className='text-lg'>Don't have an account?</Text>
          <Pressable onPress={() => navigate(Stacks.UnAuth, { screen: Screens.SignUp })}>
            <Text className='text-lg text-primary ml-2'>Sign Up</Text>
          </Pressable>
        </View>
        <View className='flex flex-row justify-center items-center mt-1'>
          <Text className='text-lg'>Forgot your password?</Text>
          <Pressable onPress={() => navigate(Stacks.UnAuth, { screen: Screens.ForgotPassword })}>
            <Text className='text-lg text-primary ml-2'>Reset Password</Text>
          </Pressable>
        </View>
      </View>
      <View className='flex flex-row justify-center items-center my-4'>
        <Separator className='w-1/4' />
        <Text className='mx-4'>Or sign in with</Text>
        <Separator className='w-1/4' />
      </View>
      <GoogleSignInButton />
    </View>
  );
};
