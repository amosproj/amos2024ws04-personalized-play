import { Button } from '@shadcn/components';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@shadcn/components/ui/alert-dialog';
import { Text } from '@shadcn/components/ui/text';
import { iconWithClassName } from '@shadcn/icons/iconWithClassName';
import type { Activity } from '@src/screens';
import type { EditAcivityFromData } from '@src/types';
import { Formik, type FormikProps } from 'formik';
import { BatteryCharging, HelpCircle, Info, TimerIcon, X } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { View } from 'react-native';
import { Slider } from 'react-native-awesome-slider';
import { useSharedValue } from 'react-native-reanimated';
import * as Yup from 'yup';
import { TextInput } from './FormikTextInput';

iconWithClassName(Info);
iconWithClassName(BatteryCharging);
iconWithClassName(HelpCircle);
iconWithClassName(X);
iconWithClassName(TimerIcon);

interface AlertIconDialogProps {
  activity: Activity;
  updateActivity: (updateData: Activity) => void;
}

export function EditActivityButton({ activity, updateActivity }: AlertIconDialogProps) {
  const formikRef = useRef<FormikProps<EditAcivityFromData>>(null);
  const [isOpen, setOpen] = useState(false);
  const [name, setName] = useState('');
  const progressEnegry = useSharedValue(1);
  const progressDuration = useSharedValue(10);

  const onDone = async (values: EditAcivityFromData) => {
    //save to firebase
    const newActivity: Activity = {
      id: activity.id,
      name: values.name,
      activityType: activity.activityType,
      duration: values.duration,
      energy: values.energy,
      favorite: activity.favorite
    };
    updateActivity(newActivity);
  };

  const getLabel = (value: number) => {
    const labels = ['😴', '😊', '🚀'];
    return labels[value];
  };

  const onChangeEnergy = (value: number) => {
    progressEnegry.value = value;
  };

  const onChangeDuration = (value: number) => {
    progressDuration.value = value;
  };

  const onSubmit = async () => {
    await formikRef.current?.submitForm();
    const valid = formikRef.current?.isValid;
    if (valid) {
      setOpen(false);
    }
  };

  const resetValues = () => {
    setName(activity.name);
    progressDuration.set(activity.duration);
    progressEnegry.set(activity.energy);
  };

  const onOpenChange = (value: boolean) => {
    setOpen(value);
    if (value) {
      //reset values when modal changes to open
      resetValues();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild={true}>
        <Button onPress={() => setOpen(true)}>
          <Text className='text-primary-foreground font-semibold'>Edit</Text>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader className='flex flex-row items-center justify-between'>
          <AlertDialogTitle className='text-xl text-primary font-medium'>
            Edit {activity.name}
          </AlertDialogTitle>
          <AlertDialogCancel
            asChild={true}
            className='border-primary rounded-xxl text-center native:w-9 native:h-9 p-0'
          >
            <Button variant='ghost'>
              <X size={24} className='text-primary' />
            </Button>
          </AlertDialogCancel>
        </AlertDialogHeader>

        <Formik
          initialValues={{
            name: activity.name || '',
            duration: activity.duration,
            energy: activity.energy
          }}
          innerRef={formikRef}
          validationSchema={Yup.object({
            name: Yup.string().required('Name is required'),
            duration: Yup.number().required('duration is required'),
            energy: Yup.number().required('duration is required')
          })}
          onSubmit={onDone}
          validateOnBlur={true}
          validateOnChange={true}
        >
          {({ handleChange, values }) => (
            <View>
              <View className='text-lg w-full'>
                <View className='w-full min-w-64 mt-4'>
                  <TextInput
                    lable='Name'
                    fieldName='name'
                    className='w-full'
                    value={name}
                    onChangeText={(value) => setName(value)}
                  />
                  <View className='mt-3 mb-10 flex flex-col gap-7'>
                    <Text className=''>Energy</Text>
                    <Slider
                      style={{ width: '100%', alignSelf: 'center' }}
                      minimumValue={useSharedValue(0)}
                      maximumValue={useSharedValue(2)}
                      theme={{
                        minimumTrackTintColor: '#620674',
                        bubbleBackgroundColor: '#620674'
                      }}
                      progress={progressEnegry}
                      thumbWidth={32}
                      steps={2}
                      onSlidingComplete={(value) => {
                        onChangeEnergy(value);
                        handleChange('energy')(value.toString());
                      }}
                      markWidth={0}
                      bubble={(value) => getLabel(value)}
                      bubbleTextStyle={{ fontSize: 14 }}
                      renderThumb={() => (
                        <Button size='icon' className='w-8 h-8 rounded-full bg-primary'>
                          <BatteryCharging className='w-4 h-4 text-white -rotate-90' size={16} />
                        </Button>
                      )}
                    />
                  </View>
                  <View className='mt-3 mb-10 flex flex-col gap-7'>
                    <Text className=''>Duration</Text>
                    <Slider
                      style={{ width: '100%', alignSelf: 'center' }}
                      minimumValue={useSharedValue(5)}
                      maximumValue={useSharedValue(30)}
                      theme={{
                        minimumTrackTintColor: '#620674',
                        bubbleBackgroundColor: '#620674'
                      }}
                      progress={progressDuration}
                      thumbWidth={32}
                      steps={25}
                      onSlidingComplete={(value) => {
                        onChangeDuration(value);
                        handleChange('duration')(value.toString());
                      }}
                      markWidth={0}
                      bubbleTextStyle={{ fontSize: 14 }}
                      bubble={(value) => `${value} min`}
                      renderThumb={() => (
                        <Button size={'icon'} className='w-8 h-8 rounded-full bg-primary'>
                          <TimerIcon className='w-4 h-4 text-white' size={16} />
                        </Button>
                      )}
                    />
                  </View>
                </View>
              </View>
              <AlertDialogFooter>
                <AlertDialogAction asChild={true}>
                  <Button onPress={onSubmit}>
                    <Text>Update</Text>
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </View>
          )}
        </Formik>
      </AlertDialogContent>
    </AlertDialog>
  );
}
