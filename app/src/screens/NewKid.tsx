import { useNavigation } from '@react-navigation/native';
import { Button, Text } from '@shadcn/components';
import { ChevronLeft } from '@shadcn/icons';
import {
  ContextualQuestionAgeKids,
  ContextualQuestionNumberNewKids,
  SubmitButton
} from '@src/components';
import { Collections, Screens, Stacks, fireAuth, fireStore } from '@src/constants';
import type { AppNavigation, NewKidFormData } from '@src/types';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { Formik, type FormikProps } from 'formik';
import type React from 'react';
import { useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Dimensions, FlatList, View } from 'react-native';
import * as Yup from 'yup';

const NewKidQuestions = [
  { key: 'numberOfKids', component: ContextualQuestionNumberNewKids },
  { key: 'kids', component: ContextualQuestionAgeKids }
];

export const NewKid: React.FC = () => {
  const flatListRef = useRef<FlatList>(null);
  const formikRef = useRef<FormikProps<NewKidFormData>>(null);
  const [index, setIndex] = useState(0);
  const [user] = useAuthState(fireAuth);
  const { navigate } = useNavigation<AppNavigation>();

  /**
   * Called when the user is done with the NewKid flow.
   * @param values - The form values containing the user's input.
   * @returns A promise that resolves when the data is saved to Firestore.
   * @throws An error if any of the operations fail.
   */
  const onDone = async (values: NewKidFormData) => {
    const { kids } = values;
    try {
      if (!user) throw new Error('User not found');

      const kColRef = collection(fireStore, Collections.Users, user.uid, Collections.Kids);
      const batch = writeBatch(fireStore);

      // Add each kid document to the batch
      for (const kid of kids) {
        const newKidRef = doc(kColRef); // Generate a new document reference
        batch.set(newKidRef, kid);
      }

      // Commit the batch
      await batch.commit();

      navigate(Stacks.Auth, {
        screen: Screens.Profile
      });

      formikRef.current?.resetForm();
      setIndex(0);
      flatListRef.current?.scrollToIndex({ index: 0, animated: false });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  /**
   * Navigate to the next NewKid question.
   * Validate the current form field and only move to the next question if the field is valid.
   * If the field is invalid, do not move to the next question.
   */
  const onNext = async () => {
    if (flatListRef.current && formikRef.current) {
      try {
        // If we are on the last question, do not move to the next question
        if (index === NewKidQuestions.length - 1) return;
        // Mark the current field as touched
        await formikRef.current.setFieldTouched(NewKidQuestions[index].key, true);
        // Validate the current field
        await formikRef.current.validateField(NewKidQuestions[index].key);
        // Get the error message for the current field
        const { error } = formikRef.current.getFieldMeta(NewKidQuestions[index].key);
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
   * Navigate to the previous NewKid question.
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
          numberOfKids: 1,
          kids: []
        }}
        validationSchema={Yup.object({
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
          )
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
            data={NewKidQuestions}
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
                <item.component onNext={onNext} component={NewKidQuestions[index].key} />
              </View>
            )}
          />
          <View className='flex flex-row items-center justify-between pt-4 pb-6 px-6'>
            <View className='flex flex-row justify-center items-center'>
              {NewKidQuestions.map((_, i) => (
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
              {index === NewKidQuestions.length - 1 ? (
                <SubmitButton size={'sm'} className='h-10'>
                  <Text>Save</Text>
                </SubmitButton>
              ) : (
                <Button
                  variant={'default'}
                  size={'icon'}
                  className='rounded-xl'
                  onPress={onNext}
                  disabled={index === NewKidQuestions.length - 1}
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
