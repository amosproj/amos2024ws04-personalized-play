import { Text } from '@shadcn/components';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import{Formik} from 'formik';
import * as Yup from 'yup';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppRoutesParams } from '@src/routes';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Screens, Stacks } from '@src/constants/screens';
import {  AppLogo, SubmitButton } from '@src/components';
import { useCallback } from 'react';
import { TextInput } from '@src/components';
import { fireAuth } from '@src/constants';
import { Fingerprint, Mail } from '@shadcn/icons';

type LoginFormData ={
  email: string;
  password: string; 
}
export const SignIn: React.FC = () => {

  const {navigate} = useNavigation<NativeStackNavigationProp<AppRoutesParams>>();
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
      password: Yup.string().required(),
    })}
    onSubmit={handleLogin}
    validateOnBlur={true}
    validateOnChange={true}
    >
      <View className='flex flex-1 flex-col px-4 justify-center'>
        <AppLogo height={80} width={200} style={{alignSelf: 'center'}} />
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

