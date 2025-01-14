import { Text } from '@shadcn/components';
import { ContextualQuestionNewKid, SubmitButton } from '@src/components';
import { Collections, fireAuth, fireStore } from '@src/constants';
import type { Kid } from '@src/types';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { Formik, type FormikProps } from 'formik';
import type React from 'react';
import { useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { View } from 'react-native';
import * as Yup from 'yup';

export const NewKid: React.FC = () => {
  const formikRef = useRef<FormikProps<Kid>>(null);
  const [user] = useAuthState(fireAuth);

  /**
   * Called when the user is done with the onboarding flow.
   * @param values - The form values containing the user's input.
   */
  const onDone = async (values: Kid) => {
    const { name, age, biologicalSex, healthConsiderations } = values;
    try {
      if (!user) {
        console.error('User not authenticated');
        return;
      }
      const userId = user.uid;

      // Save the data to Firestore
      const kidsCollectionRef = collection(fireStore, Collections.Users, userId, Collections.Kids);
      const kidDocRef = doc(kidsCollectionRef);

      const kidDoc = {
        name,
        age,
        biologicalSex,
        healthConsiderations
      };

      // Use batch to save the data
      const batch = writeBatch(fireStore);
      batch.set(kidDocRef, kidDoc);
      await batch.commit();
    } catch (error) {
      console.error('Error saving data to Firestore:', error);
    }
  };

  return (
    <View className='flex flex-col flex-1 justify-start items-stretch'>
      <Formik
        initialValues={{
          name: '',
          age: 0,
          biologicalSex: 'male',
          healthConsiderations: {
            isConsidered: '',
            considerations: [],
            chronicIllness: '',
            other: ''
          }
        }}
        innerRef={formikRef}
        validationSchema={Yup.object({
          name: Yup.string().required('Name is required'),
          age: Yup.number().required('Age in months is required'),
          biologicalSex: Yup.string().required('Biological sex is required'),
          healthConsiderations: Yup.object({
            isConsidered: Yup.string(),
            considerations: Yup.array().of(Yup.string()),
            chronicIllness: Yup.string(),
            other: Yup.string()
          })
        })}
        onSubmit={onDone}
      >
        {() => (
          <View className='flex-1 w-screen'>
            <ContextualQuestionNewKid />
            <View className='flex flex-row items-center justify-end pt-4 pb-6'>
              <SubmitButton size='sm' className='h-10'>
                <Text>Save</Text>
              </SubmitButton>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};
