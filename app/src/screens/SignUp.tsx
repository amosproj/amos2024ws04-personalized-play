import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@shadcn/components';
import { Fingerprint, Mail } from '@shadcn/icons';
import { AppLogo, SubmitButton, TextInput } from '@src/components';
import { Screens, Stacks, fireAuth } from '@src/constants';
import type { AppNavigation } from '@src/types';
import { Formik } from 'formik';
import type React from 'react';
import { Alert, Pressable, View } from 'react-native';
import * as Yup from 'yup';

interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export const SignUp: React.FC = () => {
  const { navigate, reset } = useNavigation<AppNavigation>();

  const onSignUp = async (values: SignUpFormData) => {
    const { email, password } = values;
    try {
      await createUserWithEmailAndPassword(fireAuth, email.trim(), password.trim());
      await signInWithEmailAndPassword(fireAuth, email.trim(), password.trim());
      reset({ index: 0, routes: [{ name: Stacks.Auth }] });
    } catch (error) {
      console.error(error);
      Alert.alert('Sign Up Error', (error as Error).message);
    }
  };

  return (
    <View className='flex flex-1 justify-center px-6'>
      <View className='flex flex-col justify-center items-center self-center'>
        <AppLogo height={100} width={80} />
        <Text className='text-3xl font-medium mt-4 mb-2'>Sign Up</Text>
        <Text className='text-lg mb-4'>Signup to get started with our amazing app.</Text>
      </View>
      <Formik
        initialValues={{ email: '', password: '', confirmPassword: '' }}
        validationSchema={Yup.object({
          email: Yup.string()
            .matches(/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/, 'Invalid email')
            .required('Required'),
          password: Yup.string().required('Required').min(8, 'Must be 8 characters or more'),
          confirmPassword: Yup.string()
            .required('Required')
            .min(8, 'Must be 8 characters or more')
            .oneOf([Yup.ref('password')], 'Passwords must match')
        })}
        onSubmit={onSignUp}
      >
        <View className='flex flex-col justify-center items-stretch my-2'>
          <TextInput fieldName='email' lable='Email' leadingIcon={Mail} />
          <TextInput
            fieldName='password'
            lable='Password'
            secureTextEntry={true}
            leadingIcon={Fingerprint}
          />
          <TextInput
            fieldName='confirmPassword'
            lable='Confirm Password'
            secureTextEntry={true}
            leadingIcon={Fingerprint}
            submitOnEnter={true}
          />
          <SubmitButton className='native:h-14 native:py-2'>
            <Text className='native:text-xl'>Sign Up</Text>
          </SubmitButton>
        </View>
      </Formik>
      <View className='flex flex-row justify-center items-center mt-2'>
        <Text className='text-lg'>Already have an account?</Text>
        <Pressable onPress={() => navigate(Stacks.UnAuth, { screen: Screens.SignIn })}>
          <Text className='text-lg text-primary ml-2'>Sign In</Text>
        </Pressable>
      </View>
    </View>
  );
};
