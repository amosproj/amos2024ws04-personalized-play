import { useNavigation } from '@react-navigation/native';
import { Button, Text } from '@shadcn/components';
import { ChevronLeft } from '@shadcn/icons';
import {
  ContextualQuestionActivityChoice,
  ContextualQuestionCamera,
  ContextualQuestionDisplayItemsIdentified,
  ContextualQuestionEnergyLevel,
  ContextualQuestionPlayTime,
  ContextualQuestionSelectKids,
  ContextualQuestionSkill,
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
import type { Activity, AppNavigation, NewPlayFormData } from '@src/types';
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { Formik, type FormikProps } from 'formik';
import type React from 'react';
import { useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Dimensions, FlatList, View } from 'react-native';
import * as Yup from 'yup';

//add export
export const onboardingQuestions = [
  { key: 'selectKids', component: ContextualQuestionSelectKids },
  { key: 'energyLevel', component: ContextualQuestionEnergyLevel },
  { key: 'time', component: ContextualQuestionPlayTime },
  { key: 'type', component: ContextualQuestionActivityChoice },
  { key: 'image', component: ContextualQuestionCamera },
  { key: 'objects', component: ContextualQuestionDisplayItemsIdentified },
  { key: 'skillsToBeIntegrated', component: ContextualQuestionSkill }
];

export const NewPlay: React.FC = () => {
  const flatListRef = useRef<FlatList>(null);
  const formikRef = useRef<FormikProps<NewPlayFormData>>(null);
  const [index, setIndex] = useState(0);
  const [user] = useAuthState(fireAuth);
  const { navigate } = useNavigation<AppNavigation>();

  /**
   * Called when the user is done with the onboarding flow.
   * @param values - The form values containing the user's input.
   * @returns A promise that resolves when the data is saved to Firestore.
   * @throws An error if any of the operations fail.
   */
  const onDone = async (values: NewPlayFormData) => {
    const { selectKids, type, choreType, energyLevel, time, skillsToBeIntegrated, objects } =
      values;

    try {
      if (!user) throw new Error('User not found');

      const aData: Partial<Activity> = {
        type: type,
        energyLevel: energyLevel,
        kids: selectKids,
        choreType: choreType,
        time: time,
        skillsToBeIntegrated: skillsToBeIntegrated,
        objects: objects,
        createdAt: Timestamp.now()
      };

      const userId = user.uid;
      const aColRef = collection(fireStore, Collections.Users, userId, Collections.Activities);

      // Add the activity document and get its reference
      const activity = await addDoc(aColRef, aData);

      // Then call the cloud function to generate the activity
      const generateActivity = httpsCallable(fireFunction, 'ChorsGeneratorFlow');
      await generateActivity({ activityId: activity.id });

      // Finally navigate to the activity player
      navigate(Stacks.Auth, {
        screen: Screens.ActivityPlayer,
        params: { activityId: activity.id }
      });
    } catch (error) {
      console.error('Error saving data to Firestore:', error);
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
          selectKids: [],
          energyLevel: 'medium',
          time: 10,
          type: '',
          choreType: '',
          displayItems: [],
          image: '',
          objects: [],
          skillsToBeIntegrated: [Skills.COGNITIVE, Skills.MOTOR, Skills.SOCIAL, Skills.LANGUAGE]
        }}
        innerRef={formikRef}
        validationSchema={Yup.object({
          selectKids: Yup.array().min(1, 'Required'),
          energyLevel: Yup.string().required('Required').oneOf(['low', 'medium', 'high']),
          time: Yup.number()
            .required('Required')
            .min(5, 'Must be at least 5 minutes')
            .max(30, 'Cannot be more than 30 minutes'),
          type: Yup.string().required('Required').oneOf(['chores', 'play']),
          displayItems: Yup.array().of(Yup.string()),
          image: Yup.string().required('Required'),
          objects: Yup.array().of(Yup.string()).min(1, 'Required'),
          skillsToBeIntegrated: Yup.array()
            .of(Yup.string())
            .required('Required')
            .min(1, 'Required'),
          choreType: Yup.string()
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
                <item.component onNext={onNext} component={onboardingQuestions[index].key} />
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
