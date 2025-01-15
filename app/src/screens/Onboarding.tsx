import { useNavigation } from '@react-navigation/native';
import { Button, Text } from '@shadcn/components';
import { ChevronLeft } from '@shadcn/icons';
import {
  ContextualQuestionActivityChoice,
  ContextualQuestionAgeKids,
  ContextualQuestionCamera,
  ContextualQuestionDisplayItemsIdentified,
  ContextualQuestionEnergyLevel,
  ContextualQuestionNumberKids,
  ContextualQuestionPlayTime,
  ContextualQuestionSkill,
  ContextualQuestionUserName,
  SubmitButton
} from '@src/components';
import {
  Collections,
  Screens,
  Skills,
  Stacks,
  fireAuth,
  fireFunction,
  fireStore
} from '@src/constants';
import type { Activity, AppNavigation, Kid, OnboardingFormData, User } from '@src/types';
import { addDoc, collection, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { Formik, type FormikProps } from 'formik';
import type React from 'react';
import { useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Dimensions, FlatList, View } from 'react-native';
import * as Yup from 'yup';

export let activityDocRefId: string;

const onboardingQuestions = [
  { key: 'displayName', component: ContextualQuestionUserName },
  { key: 'numberOfKids', component: ContextualQuestionNumberKids },
  { key: 'kids', component: ContextualQuestionAgeKids },
  { key: 'time', component: ContextualQuestionPlayTime },
  { key: 'energyLevel', component: ContextualQuestionEnergyLevel },
  { key: 'type', component: ContextualQuestionActivityChoice },
  { key: 'skillsToBeIntegrated', component: ContextualQuestionSkill },
  { key: 'image', component: ContextualQuestionCamera },
  { key: 'objects', component: ContextualQuestionDisplayItemsIdentified }
];

export const Onboarding: React.FC = () => {
  const flatListRef = useRef<FlatList>(null);
  const formikRef = useRef<FormikProps<OnboardingFormData>>(null);
  const [index, setIndex] = useState(0);
  const [user] = useAuthState(fireAuth);
  const { navigate } = useNavigation<AppNavigation>();

  /**
   * Called when the user is done with the onboarding flow.
   * @param values - The form values containing the user's input.
   * @returns A promise that resolves when the data is saved to Firestore.
   * @throws An error if any of the operations fail.
   */
  const onDone = async (values: OnboardingFormData) => {
    const { displayName, kids, energyLevel, time, type, skillsToBeIntegrated, objects } = values;
    const uData: Partial<User> = { displayName, isOnboarded: true };
    const kData: Kid[] = kids;
    const aData: Partial<Activity> = { energyLevel, time, type, objects, skillsToBeIntegrated };
    try {
      if (!user) throw new Error('User not found');
      const uDocRef = doc(fireStore, Collections.Users, user.uid);
      const aColRef = collection(fireStore, Collections.Users, user.uid, Collections.Activities);
      const kColRef = collection(fireStore, Collections.Users, user.uid, Collections.Kids);
      const batch = writeBatch(fireStore);
      const [_, activity] = await Promise.all([
        updateDoc(uDocRef, uData),
        addDoc(aColRef, aData),
        kData.map((kid) => addDoc(kColRef, kid))
      ]);
      batch.commit();
      const generateActivity = httpsCallable(fireFunction, 'ChorsGeneratorFlow');
      await generateActivity({ activityId: activity.id });
      navigate(Stacks.Auth, {
        screen: Screens.ActivityPlayer,
        params: { activityId: activity.id }
      });
    } catch (error) {
      console.error('Error saving data:', error);
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
        if (error) {
          console.log(error);
          return;
        }
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
          displayName: user?.displayName || '',
          numberOfKids: 1,
          kids: [],
          energyLevel: 'medium',
          time: 15,
          type: 'chores',
          objects: [],
          image: '',
          skillsToBeIntegrated: [Skills.COGNITIVE, Skills.MOTOR, Skills.SOCIAL, Skills.LANGUAGE]
        }}
        validationSchema={Yup.object({
          displayName: Yup.string().required('Required'),
          numberOfKids: Yup.number()
            .required('Required')
            .min(1, 'Must have at least 1 kid')
            .max(3, 'Cannot have more than 5 kids'),
          kids: Yup.array().of(
            Yup.object({
              name: Yup.string().required('Required'),
              biologicalSex: Yup.string().required('Required').oneOf(['male', 'female', 'other']),
              age: Yup.number()
                .required('Required')
                .min(1, 'Must be at least 1 month')
                .max(60, 'Cannot be more than 60 months'),
              healthConsiderations: Yup.array().of(Yup.string()).notRequired()
            })
          ),
          time: Yup.number()
            .required('Required')
            .min(5, 'Must be at least 5 minutes')
            .max(30, 'Cannot be more than 30 minutes'),
          energyLevel: Yup.string().required('Required').oneOf(['low', 'medium', 'high']),
          type: Yup.string().required('Required').oneOf(['chores', 'play']),
          skillsToBeIntegrated: Yup.array()
            .of(Yup.string())
            .required('Required')
            .min(1, 'Required'),
          image: Yup.string().required('Required'),
          objects: Yup.array().of(Yup.string()).min(1, 'Required')
        })}
        innerRef={formikRef}
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
                <item.component onNext={onNext} component={onboardingQuestions[index].key} />
              </View>
            )}
          />
          <View className='flex flex-row items-center justify-between pt-4 pb-6 px-6'>
            <View className='flex flex-row justify-center items-center'>
              {onboardingQuestions.map((_, i) => (
                <View
                  key={`dot-${i.toString()}`}
                  style={{ opacity: i === index ? 1 : 0.12 }}
                  className='h-3 w-3 rounded-full bg-primary mr-2'
                />
              ))}
            </View>
            <View className='flex flex-row items-center justify-center'>
              <Button
                variant={'outline'}
                size={'icon'}
                className='rounded-xl mr-2'
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
