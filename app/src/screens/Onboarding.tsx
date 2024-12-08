import { Button, Text } from '@shadcn/components';
import { ChevronLeft } from '@shadcn/icons';
import {
  ContextualQuestionActivityChoice,
  ContextualQuestionAgeKids,
  ContextualQuestionEnergyLevel,
  ContextualQuestionNumberKids,
  ContextualQuestionPlayTime,
  ContextualQuestionUserName,
  SubmitButton
} from '@src/components';
import { Collections, fireAuth, fireStore } from '@src/constants';
import type { OnboardingFormData } from '@src/types';
import { doc, setDoc, collection, } from 'firebase/firestore';
import { Formik, type FormikProps } from 'formik';
import type React from 'react';
import { useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Dimensions, FlatList, View } from 'react-native';
import * as Yup from 'yup';

const onboardingQuestions = [
  { key: 'name', component: ContextualQuestionUserName },
  { key: 'numberOfKids', component: ContextualQuestionNumberKids },
  { key: 'kidsDetails', component: ContextualQuestionAgeKids },
  { key: 'energyLevel', component: ContextualQuestionEnergyLevel },
  { key: 'time', component: ContextualQuestionPlayTime },
  { key: 'activityType', component: ContextualQuestionActivityChoice }
];

export const Onboarding: React.FC = () => {
  const flatListRef = useRef<FlatList>(null);
  const formikRef = useRef<FormikProps<OnboardingFormData>>(null);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false); // Loading state

  const [user] = useAuthState(fireAuth);

  const onDone = async (values: OnboardingFormData) => {
    setLoading(true); // Start loading
    try {
      if (!user) {
        console.error('User not authenticated');
        return;
      }
      const userId = user.uid;

      // Reference to the user's document in Firestore
      const userDocRef = doc(fireStore, Collections.Users, userId);

      // Save the user's data (e.g., displayName)
      await setDoc(userDocRef, { displayName: values.name }, { merge: true });

      // Reference to the Activities subcollection
      const activityCollectionRef = collection(
        fireStore,
        Collections.Users,
        userId,
        Collections.Activities
      );

      // Save the activities data (only once)
      const activityDocRef = doc(activityCollectionRef); // Auto-generate an ID for the activity
      await setDoc(activityDocRef, {
        activityType: values.activityType,
        energyLevel: values.energyLevel,
        time: values.time,
        createdAt: new Date().toISOString() // Optional: Add a timestamp
      });
      console.log('Activities data saved successfully.');

      // Reference to the Kids subcollection
      const kidsCollectionRef = collection(fireStore, Collections.Users, userId, Collections.Kids);

      // Add each kid's data (loop only for kids)
      for (const kid of values.kidsDetails) {
        const kidDocRef = doc(kidsCollectionRef); // Auto-generate an ID
        await setDoc(kidDocRef, {
          name: kid.name,
          age: kid.age,
          biologicalSex: kid.gender,
          createdAt: new Date().toISOString() // Optional: Add a timestamp
        });
        console.log(`Kid data saved successfully: ${kid.name}, ID: ${kidDocRef.id}`);
      }
    } catch (error) {
      console.error('Error saving data to Firestore:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  /**
   * Navigate to the next onboarding question.
   * Validate the current form field and only move to the next question if the field is valid.
   * If the field is invalid, do not move to the next question.
   */
  const onNext = async () => {
    if (flatListRef.current && formikRef.current) {
      try {
        // If we are on the last question, do not move to the next question
        if (index === onboardingQuestions.length - 1) return;
        // Mark the current field as touched
        await formikRef.current.setFieldTouched(onboardingQuestions[index].key, true);
        // Validate the current field
        await formikRef.current.validateField(onboardingQuestions[index].key);
        // Get the error message for the current field
        const { error } = formikRef.current.getFieldMeta(onboardingQuestions[index].key);
        // If the field is invalid, do not move to the next question
        if (error) return;
        // Scroll to the next question
        flatListRef.current.scrollToIndex({ index: index + 1, animated: true });
        // Update the current index
        setIndex(index + 1);
      } catch (error) {
        console.error('Error scrolling to index:', error);
      }
    }
  };

  /**
   * Navigate to the previous onboarding question.
   * If we are on the first question, do not move to the previous question.
   */
  const onPrevious = () => {
    if (flatListRef.current) {
      try {
        // If we are on the first question, do not move to the previous question
        if (index === 0) return;
        // Scroll to the previous question
        flatListRef.current.scrollToIndex({ index: index - 1, animated: true });
        // Update the current index
        setIndex(index - 1);
      } catch (error) {
        console.error('Error scrolling to index:', error);
      }
    }
  };

  return (
    <View className='flex flex-col flex-1 justify-start items-stretch'>
      <Formik
        initialValues={{
          name: '',
          numberOfKids: 0,
          kidsDetails: [],
          energyLevel: 1,
          time: 10,
          activityType: 'chores'
        }}
        innerRef={formikRef}
        validationSchema={Yup.object({
          name: Yup.string().required('Name is required'),
          numberOfKids: Yup.number()
            .integer('Number of kids must be an integer')
            .typeError('Number of kids must be an integer')
            .min(1, 'Minimum of 1 kid required')
            .max(3, 'Maximum of 3 kids allowed')
            .required('Number of kids is required'),
          kidsDetails: Yup.array()
            .of(
              Yup.object({
                name: Yup.string().required('Name is required'),
                age: Yup.number()
                  .typeError('Age must be a number')
                  .required('Age is required')
                  .min(1, 'Minimum age is 1 month')
                  .max(60, 'Maximum age is 60 months')
              })
            )
            .required('Kids details are required')
            .min(1, 'Minimum of 1 kid required'),
          energyLevel: Yup.number().required('Energy level is required'),
          time: Yup.number().required('Time is required'),
          activityType: Yup.string().required('Activity type is required')
        })}
        onSubmit={onDone}
        validateOnBlur={true}
        validateOnChange={true}
      >
        <>
          <FlatList
            className='flex-1'
            ref={flatListRef}
            data={onboardingQuestions}
            horizontal={true}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            snapToInterval={Dimensions.get('window').width}
            decelerationRate='fast'
            bounces={false}
            pinchGestureEnabled={false}
            keyExtractor={(item) => item.key}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View
                style={{
                  width: Dimensions.get('window').width,
                  paddingHorizontal: 24,
                  paddingTop: 24
                }}
              >
                <item.component onNext={onNext} />
              </View>
            )}
          />
          <View className='flex flex-row items-center justify-end pt-4 pb-6 relative'>
            <View className='flex flex-row justify-center items-center absolute left-1/2 -translate-x-1/2'>
              {onboardingQuestions.map((_, i) => (
                <View
                  key={`dot-${i.toString()}`}
                  style={{ opacity: i === index ? 1 : 0.12 }}
                  className='h-3 w-3 rounded-full bg-primary mr-2'
                />
              ))}
            </View>
            <View className='flex flex-row items-center justify-center pr-6'>
              <Button
                variant={'outline'}
                size={'icon'}
                className='rounded-xl mr-4'
                onPress={onPrevious}
                disabled={index === 0}
              >
                <ChevronLeft size={24} className='text-primary' />
              </Button>
              {index === onboardingQuestions.length - 1 ? (
                <SubmitButton size={'sm'} className='h-10'>
                  <Text>Save</Text>
                </SubmitButton>
              ) : (
                <Button
                  variant={'default'}
                  size={'icon'}
                  className='rounded-xl'
                  onPress={onNext}
                  disabled={index === onboardingQuestions.length - 1}
                >
                  <ChevronLeft size={24} className='rotate-180 text-primary-foreground' />
                </Button>
              )}
            </View>
          </View>
        </>
      </Formik>
    </View>
  );
};
