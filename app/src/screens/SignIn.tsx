import { signInWithEmailAndPassword } from '@firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@shadcn/components';
import { Separator } from '@shadcn/components/ui/separator';
import { Fingerprint, Mail } from '@shadcn/icons';
import { AppLogo, GoogleSignInButton, SubmitButton, TextInput } from '@src/components';
import { Screens, Stacks, fireAuth } from '@src/constants';
import type { AppNavigation } from '@src/types';
import { Formik } from 'formik';
import type React from 'react';
import { Alert, Pressable, View } from 'react-native';
import * as Yup from 'yup';

interface SignInFormData {
  email: string;
  password: string;
}

export const SignIn: React.FC = () => {
  const { navigate, reset } = useNavigation<AppNavigation>();

  /**
   * Signs in a user using email and password and then navigates to either the Welcome or Home screen.
   * If the user has no kids, it navigates to the Welcome screen. Otherwise, it navigates to the Home screen.
   * @param values - The form values containing the email and password.
   */
  const onSignIn = async (values: SignInFormData) => {
    const { email, password } = values;
    try {
      await signInWithEmailAndPassword(fireAuth, email.trim(), password.trim());
      reset({ index: 0, routes: [{ name: Stacks.Auth }] });
    } catch (error) {
      Alert.alert('Sign In Error', (error as Error).message);
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
          email: Yup.string()
            .matches(/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/, 'Invalid email')
            .required('Required'),
          password: Yup.string().required('Required').min(8, 'Must be 8 characters or more')
        })}
        onSubmit={onSignIn}
      >
        <View className='flex flex-col justify-center items-stretch my-2'>
          <TextInput
            fieldName='email'
            lable='Email'
            leadingIcon={Mail}
            keyboardType='email-address'
          />
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
      <View className='flex flex-row justify-center items-center self-center my-2'>
        <Text className='text-lg'>Don't have an account?</Text>
        <Pressable onPress={() => navigate(Stacks.UnAuth, { screen: Screens.SignUp })}>
          <Text className='text-lg text-primary ml-2'>Sign Up</Text>
        </Pressable>
      </View>
      <View className='flex flex-row justify-center items-center mt-2 mb-4'>
        <Separator className='w-1/4' />
        <Text className='mx-4'>Or</Text>
        <Separator className='w-1/4' />
      </View>
      <GoogleSignInButton />
    </View>
  );
};
