import { sendPasswordResetEmail } from '@firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@shadcn/components';
import { Mail } from '@shadcn/icons';
import { AppLogo, SubmitButton, TextInput } from '@src/components';
import { Screens, Stacks, fireAuth } from '@src/constants';
import type { AppNavigation } from '@src/types';
import { Formik } from 'formik';
import type React from 'react';
import { View } from 'react-native';
import * as Yup from 'yup';

interface ForgotPasswordFormData {
  email: string;
}

export const ForgotPassword: React.FC = () => {
  const { navigate } = useNavigation<AppNavigation>();

  const onForgotPassword = async (values: ForgotPasswordFormData) => {
    const { email } = values;
    try {
      await sendPasswordResetEmail(fireAuth, email);
      navigate(Stacks.UnAuth, { screen: Screens.SignIn });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className='flex flex-1 justify-center px-6'>
      <View className='flex flex-col justify-center items-center self-center'>
        <AppLogo height={100} width={80} />
        <Text className='text-3xl font-medium mt-4 mb-2'>Forget Password</Text>
        <Text className='text-lg mb-4'>Enter your email to reset your password.</Text>
      </View>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={Yup.object({
          email: Yup.string().email('Invalid email').required('Required')
        })}
        onSubmit={onForgotPassword}
      >
        <View className='flex flex-col justify-center items-stretch my-2'>
          <TextInput fieldName='email' lable='Email' leadingIcon={Mail} submitOnEnter={true} />
          <SubmitButton className='native:h-14 native:py-2'>
            <Text className='native:text-xl'>Send Reset Link</Text>
          </SubmitButton>
        </View>
      </Formik>
    </View>
  );
};
