import { Button, Label, Text } from '@shadcn/components';
import { Checkbox } from '@shadcn/components/ui/checkbox';
import { Toggle, ToggleIcon } from '@shadcn/components/ui/toggle';
import { ToggleGroup, ToggleGroupIcon, ToggleGroupItem } from '@shadcn/components/ui/toggle-group';
import type { ContextualQuestionProps, OnboardingFormData } from '@src/types';
import {
  IconCheck,
  IconGenderFemale,
  IconGenderMale,
  IconGenderTransgender,
  IconX
} from '@tabler/icons-react-native';
import { FieldArray, useFormikContext } from 'formik';
import LottieView from 'lottie-react-native';
import { Baby, Cake, IdCard, Stethoscope } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Modal, ScrollView, View } from 'react-native';
import { TextInput } from './FormikTextInput';

const healthConsiderationsOptions = [
  'Developmental delays',
  'Autism spectrum',
  'ADHD',
  'Speech or language challenges',
  'Hearing impairment',
  'Vision impairment',
  'Motor skill challenges',
  'Physical disabilities or limitations',
  'Emotional or behavioral concerns'
];

const KidDetails: React.FC<{ index: number; setModalKidIndex: (index: number | null) => void }> = ({
  index,
  setModalKidIndex
}) => {
  const { setFieldValue, values } = useFormikContext<OnboardingFormData>();

  return (
    <View className='mb-6'>
      <View className='flex items-center flex-row mb-1'>
        <Baby className='text-secondary-foreground mr-2' size={24} />
        <Label>Kid {index + 1}</Label>
      </View>
      <TextInput lable='Name' fieldName={`kids.${index}.name`} leadingIcon={IdCard} />
      <View className='flex flex-row gap-x-4'>
        <TextInput
          lable='Age'
          fieldName={`kids.${index}.age`}
          keyboardType='numeric'
          leadingIcon={Cake}
          className='flex-1'
          placeholder='Age in months'
        />
        <View className='mt-2'>
          <Label className='mb-4'>Biological Sex</Label>
          <ToggleGroup
            value={values.kids[index]?.biologicalSex}
            onValueChange={(value) => setFieldValue(`kids.${index}.biologicalSex`, value)}
            type='single'
            className='flex flex-row gap-x-2'
          >
            <ToggleGroupItem value='male' className='rounded-xl'>
              <ToggleGroupIcon icon={IconGenderMale} size={18} />
            </ToggleGroupItem>
            <ToggleGroupItem value='female' className='rounded-xl'>
              <ToggleGroupIcon icon={IconGenderFemale} size={18} />
            </ToggleGroupItem>
            <ToggleGroupItem value='other' className='rounded-xl'>
              <ToggleGroupIcon icon={IconGenderTransgender} size={18} />
            </ToggleGroupItem>
          </ToggleGroup>
        </View>
      </View>
      <View className='flex flex-row gap-x-4 my-2'>
        <View className='flex flex-col gap-y-2 flex-[3]'>
          <View className='flex flex-row items-center gap-x-2'>
            <Stethoscope className='text-secondary-foreground mr-2' size={20} />
            <Label>Health Considerations</Label>
          </View>
          <Text className='primary text-sm'>
            Are there any health considerations for your child that you'd like us to know?
          </Text>
        </View>
        <View className='flex flex-row gap-x-2'>
          <Toggle
            pressed={values.kids[index]?.healthConsiderations?.length > 0}
            onPressedChange={() => setModalKidIndex(index)}
            className='rounded-xl'
          >
            <ToggleIcon icon={IconCheck} size={18} />
          </Toggle>
          <Toggle
            pressed={values.kids[index]?.healthConsiderations?.length === 0}
            onPressedChange={() => setFieldValue(`kids.${index}.healthConsiderations`, [])}
            className='rounded-xl'
          >
            <ToggleGroupIcon icon={IconX} size={18} />
          </Toggle>
        </View>
      </View>
    </View>
  );
};

const HealthConsiderationsModal: React.FC<{
  isVisible: boolean;
  onClose: () => void;
  selectedOptions: string[];
  onSave: (options: string[]) => void;
}> = ({ isVisible, onClose, selectedOptions, onSave }) => {
  const [localSelection, setLocalSelection] = useState<string[]>(selectedOptions);

  const toggleOption = (option: string) => {
    setLocalSelection((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType='slide' onRequestClose={onClose}>
      <View className='flex-1 bg-black/50 items-center justify-center'>
        <View className='w-11/12 bg-white p-6 rounded-lg gap-4'>
          <Text className='text-xl mb-4 text-center'>Please select relevant health concerns</Text>
          <View className='gap-3'>
            {healthConsiderationsOptions.map((label) => (
              <View key={label} className='flex flex-row items-center gap-2'>
                <Checkbox
                  checked={localSelection.includes(label)}
                  onCheckedChange={() => toggleOption(label)}
                />
                <Label>{label}</Label>
              </View>
            ))}
          </View>
          <Button
            onPress={() => {
              onSave(localSelection);
              onClose();
            }}
          >
            <Text>Save</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export const ContextualQuestionAgeKids: React.FC<ContextualQuestionProps> = () => {
  const { setFieldValue, values } = useFormikContext<OnboardingFormData>();
  const [modalKidIndex, setModalKidIndex] = useState<number | null>(null);

  useEffect(() => {
    if (values.numberOfKids === 0) return;
    (async () => {
      const currentCount = values.kids.length;
      const desiredCount = values.numberOfKids;
      if (currentCount > desiredCount) {
        // Trim the array if too many kids exist
        await setFieldValue('kids', values.kids.slice(0, desiredCount));
      } else if (currentCount < desiredCount) {
        // Add placeholders for new kids
        const newKids = Array(desiredCount - currentCount).fill({
          name: '',
          age: 0,
          biologicalSex: 'male',
          healthConsiderations: []
        });
        await setFieldValue('kids', [...values.kids, ...newKids]);
      }
    })();
  }, [values.numberOfKids]);

  return (
    <View className='flex flex-1 items-stretch justify-center'>
      <View className='flex flex-1 flex-col items-center justify-center mb-4'>
        <LottieView
          autoPlay={true}
          loop={true}
          source={require('../../assets/kids.json')}
          style={{ width: 320, height: 320 }}
        />
      </View>
      <View className='flex flex-1 flex-col items-stretch'>
        <Text className='text-2xl text-center font-medium mb-6'>Tell us about your kids</Text>
        <ScrollView className='flex flex-1' horizontal={false} showsVerticalScrollIndicator={false}>
          <FieldArray
            name='kids'
            render={() =>
              values.numberOfKids > 0 &&
              Array(values.numberOfKids)
                .fill(0)
                .map((_, index) => (
                  <KidDetails
                    key={`kid-${index.toString()}`}
                    index={index}
                    setModalKidIndex={setModalKidIndex}
                  />
                ))
            }
          />
        </ScrollView>
        {modalKidIndex !== null && (
          <HealthConsiderationsModal
            isVisible={modalKidIndex !== null}
            onClose={() => setModalKidIndex(null)}
            selectedOptions={values.kids[modalKidIndex]?.healthConsiderations || []}
            onSave={(options) =>
              setFieldValue(`kids.${modalKidIndex}.healthConsiderations`, options)
            }
          />
        )}
      </View>
    </View>
  );
};
