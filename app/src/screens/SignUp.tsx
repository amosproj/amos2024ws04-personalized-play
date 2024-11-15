import { useNavigation } from '@react-navigation/native';
import { Text } from '@shadcn/components';
import { Asset } from 'expo-asset';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { Formik } from 'formik';
import type React from 'react';
import { useCallback, useState } from 'react';
import { Image, View } from 'react-native';
import { SubmitButton, TextInput } from 'src/components';
import * as Yup from 'yup';

import { Screens, Stacks } from '@src/constants';
import type { AppNavigation } from 'src/types';

export const SignUp: React.FC = () => {
  // Load the image asset
  const image = Asset.fromModule(require('../../assets/signup.png')).uri;

  // Define the form state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define the form data type
  type SignUpFormData = {
    email: string;
    password: string;
    confirmPassword: string;
  };

  // Initialize Firebase Auth
  const fireAuth = getAuth();
  const { navigate } = useNavigation<AppNavigation>();

  // Define the form submission handler
  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
      console.log('Submitting form:');
      // Extract the form data
      const { email, password } = data;

      // Set the submitting state to true
      setIsSubmitting(true);

      // Attempt to create a new user
      try {
        // Create a new user with email and password
        const { user } = await createUserWithEmailAndPassword(fireAuth, email, password);

        // TODO: Navigate to the login screen
        navigate(Stacks.UnAuth, { screen: Screens.SignIn });
      } catch (error) {
        console.error(error);
      }

      // Set the submitting state to false
      setIsSubmitting(false);
    },
    [fireAuth, navigate]
  );

  return (
    <View className='flex-1 flex-col justify-center'>
      <Image
        source={{ uri: image }}
        className='w-[95%] h-auto left-16 aspect-square'
        resizeMode='contain'
        key={'landing-image'}
      />
      <View style={{ padding: 16 }}>
        <Formik
          initialValues={{ email: '', password: '', confirmPassword: '' }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().min(6).required(),
            confirmPassword: Yup.string()
              .required()
              .oneOf([Yup.ref('password')], 'Passwords must match')
          })}
          onSubmit={handleSignUp}
          validateOnBlur={true}
          validateOnChange={true}
        >
          {({ handleSubmit }) => (
            <View style={{ marginBottom: 24 }}>
              <TextInput fieldName='email' lable='Email' keyboardType='email-address' />
              <TextInput fieldName='password' lable='Password' secureTextEntry={true} />
              <TextInput
                fieldName='confirmPassword'
                lable='Re-enter Password'
                secureTextEntry={true}
                submitOnEnter={true}
              />
              <SubmitButton>
                <Text>Sign up</Text>
              </SubmitButton>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};
