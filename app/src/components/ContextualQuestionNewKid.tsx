import { Button, Label, Text } from '@shadcn/components';
import { Checkbox } from '@shadcn/components/ui/checkbox';
import { ToggleGroup, ToggleGroupIcon, ToggleGroupItem } from '@shadcn/components/ui/toggle-group';
import { iconWithClassName } from '@shadcn/icons/iconWithClassName';
import type { Kid } from '@src/types';
import {
  IconGenderFemale,
  IconGenderMale,
  IconGenderTransgender
} from '@tabler/icons-react-native';
import { useFormikContext } from 'formik';
import LottieView from 'lottie-react-native';
import { Baby, Cake, IdCard, Stethoscope } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, ScrollView, View } from 'react-native';
import { TextInput } from './FormikTextInput';

iconWithClassName(IdCard);
iconWithClassName(Baby);
iconWithClassName(Cake);
iconWithClassName(IconGenderMale);
iconWithClassName(Stethoscope);

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

export const ContextualQuestionNewKid: React.FC = () => {
  const { setFieldValue, values } = useFormikContext<Kid>();
  const [modalVisible, setModalVisible] = useState(false);
  const [showChronic, setShowChronic] = useState(false);
  const [selectedConsiderations, setSelectedConsiderations] = useState<Array<string>>([]);

  const toggleConsideration = (consideration: string) => {
    setSelectedConsiderations((prev) =>
      prev.includes(consideration)
        ? prev.filter((item) => item !== consideration)
        : [...prev, consideration]
    );
  };

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
        <Text className='text-2xl text-center font-medium mb-6'>Tell us about your kid</Text>
        <ScrollView className='flex flex-1' horizontal={false} showsVerticalScrollIndicator={false}>
          <View className='mb-6'>
            <View className='flex items-center flex-row mb-1'>
              <Baby className='text-secondary-foreground mr-2' size={24} />
              <Label>Kid</Label>
            </View>
            <TextInput lable='Name' fieldName={'name'} leadingIcon={IdCard} />
            <View className='flex flex-row gap-x-4'>
              <TextInput
                lable='Age'
                fieldName={'age'}
                keyboardType='numeric'
                leadingIcon={Cake}
                className='flex-1'
                placeholder='Age in months'
              />
              <View className='mt-2'>
                <Label className='mb-4'>Biological Sex</Label>
                <ToggleGroup
                  value={values.biologicalSex}
                  onValueChange={(value) => setFieldValue('biologicalSex', value)}
                  type='single'
                  className='flex flex-row gap-x-2'
                >
                  <ToggleGroupItem value='male' className='rounded-xl'>
                    <ToggleGroupIcon icon={IconGenderMale} size={18} />
                  </ToggleGroupItem>
                  <ToggleGroupItem value='female' className='rounded-xl'>
                    <ToggleGroupIcon icon={IconGenderFemale} size={18} />
                  </ToggleGroupItem>
                  <ToggleGroupItem value='transgender' className='rounded-xl'>
                    <ToggleGroupIcon icon={IconGenderTransgender} size={18} />
                  </ToggleGroupItem>
                </ToggleGroup>
              </View>
            </View>
            <View className='mt-2 gap-3'>
              <View className='flex items-center flex-row mb-1'>
                <Stethoscope className='text-secondary-foreground mr-2' size={20} />
                <Label>Health Considerations</Label>
              </View>

              <Text className='primary'>
                Are there any health considerations for your child that you'd like us to know?
              </Text>
              <ToggleGroup
                variant='outline'
                value={values.healthConsiderations?.isConsidered ?? ''}
                onValueChange={(value) => setFieldValue('healthConsiderations.isConsidered', value)}
                type='single'
                className='flex flex-row gap-x-2 justify-start items-center'
              >
                <ToggleGroupItem
                  onPress={() => setModalVisible(true)}
                  value='Yes'
                  className='rounded-xl'
                >
                  <Label>Yes</Label>
                </ToggleGroupItem>
                <ToggleGroupItem value='No' className='rounded-xl'>
                  <Label>No</Label>
                </ToggleGroupItem>
              </ToggleGroup>
              <Modal
                visible={modalVisible}
                transparent={true}
                animationType='slide'
                onRequestClose={() => setModalVisible(false)}
              >
                <View className='flex-1 bg-black/50 items-center justify-center'>
                  <View className='w-11/12 bg-white p-6 rounded-lg gap-4'>
                    <Text className='text-xl mb-4 text-center'>
                      Please select relevant health concerns
                    </Text>
                    <View className='gap-3'>
                      {healthConsiderationsOptions.map((label, index) => (
                        <View
                          key={`health-option-${
                            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                            index
                          }`}
                          className='flex flex-row items-center gap-2'
                        >
                          <Checkbox
                            checked={selectedConsiderations.includes(label)}
                            onCheckedChange={() => toggleConsideration(label)}
                          />
                          <Label>{label}</Label>
                        </View>
                      ))}
                      <View className='flex flex-row items-center gap-2'>
                        <Checkbox
                          checked={selectedConsiderations.includes('Chronic illness')}
                          onCheckedChange={() => {
                            toggleConsideration('Chronic illness');
                            setShowChronic(!showChronic);
                          }}
                        />
                        <Label>Chronic illness</Label>
                      </View>
                      {showChronic && (
                        <View>
                          <TextInput
                            lable='Enter Chronic Illness'
                            fieldName={'healthConsiderations.chronicIllness'}
                          />
                        </View>
                      )}

                      <TextInput lable='Other' fieldName={'healthConsiderations.other'} />
                    </View>
                    <Button
                      onPress={() => {
                        setFieldValue('healthConsiderations.considerations', [
                          ...selectedConsiderations
                        ]);
                        setModalVisible(false);
                      }}
                    >
                      <Text>Save</Text>
                    </Button>
                  </View>
                </View>
              </Modal>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
