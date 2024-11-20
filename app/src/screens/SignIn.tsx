import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text } from '@shadcn/components';
import { Fingerprint, Mail } from '@shadcn/icons';
import { AppLogo, SubmitButton } from '@src/components';
import { TextInput } from '@src/components';
import { fireAuth } from '@src/constants';
import { Screens, Stacks } from '@src/constants/screens';
import type { AppRoutesParams } from '@src/routes';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Formik } from 'formik';
import { useCallback } from 'react';
import { View } from 'react-native';
import * as Yup from 'yup';

type LoginFormData = {
  email: string;
  password: string;
};
export const SignIn: React.FC = () => {
  const { navigate } = useNavigation<NativeStackNavigationProp<AppRoutesParams>>();
  const handleLogin = useCallback(
    async (data: LoginFormData) => {
      const { email, password } = data;
      try {
        await signInWithEmailAndPassword(fireAuth, email, password);
        navigate(Stacks.Auth, { screen: Screens.Home });
      } catch (error) {
        console.error(error);
      }
    },
    [fireAuth, navigate]
  );
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email().required(),
        password: Yup.string().required()
      })}
      onSubmit={handleLogin}
      validateOnBlur={true}
      validateOnChange={true}
    >
      <View className='flex flex-1 flex-col px-4 justify-center'>
        <AppLogo height={80} width={200} style={{ alignSelf: 'center' }} />
        <TextInput
          fieldName='email'
          lable='Email'
          keyboardType='email-address'
          leadingIcon={Mail}
        />
        <TextInput
          fieldName='password'
          lable='Password'
          submitOnEnter={true}
          leadingIcon={Fingerprint}
        />
        <SubmitButton>
          <Text>Sign In</Text>
        </SubmitButton>
      </View>
    </Formik>
  );
};
