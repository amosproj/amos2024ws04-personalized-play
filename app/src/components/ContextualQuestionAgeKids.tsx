import { Button, Text } from '@shadcn/components';
import { Avatar, AvatarFallback, AvatarImage } from '@shadcn/components/ui/avatar';
import type { ContextualQuestionProps } from '@src/types';
import { useField, useFormikContext } from 'formik';
import LottieView from 'lottie-react-native';
import { useState } from 'react';
import { Modal, View } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { TextInput } from './FormikTextInput';

export const ContextualQuestionAgeKids: React.FC<ContextualQuestionProps> = (props) => {
  //use FormikContext ( setField)
  const [field] = useField('numberOfKids');
  const { onNext } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [kidInfo, setKidInfo] = useState({ name: '', age: '', gender: '' });

  const { setFieldValue, values } = useFormikContext<{
    kidsDetails: Array<{ name: string; age: string; gender: string }>;
  }>();
  const [currentKidIndex, setCurrentKidIndex] = useState(0);
  //

  const kidsData = Array.from({ length: field.value }, () => ({
    name: '',
    age: '',
    gender: ''
  }));

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

        <FlatList
          ItemSeparatorComponent={() => <View className='h-5' />}
          data={kidsData}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              className='flex-row  w-10 h-10 border-2'
              onPress={() => {
                setCurrentKidIndex(index); // Track which kid is being edited
                setModalVisible(true);
                setKidInfo(values.kidsDetails[index] || { name: '', age: '', gender: '' });
              }}
            >
              <View className='flex-row w-full h-20 border-2 border-primary items-center rounded-xl justify-center '>
                <Avatar alt='Avatar' className='w-12 h-12'>
                  <AvatarImage source={require('../../assets/boy.png')} />
                  <AvatarFallback>
                    <Text>+</Text>
                  </AvatarFallback>
                </Avatar>
                <Text>{item.name || `Kid ${index + 1}`}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(_, index) => index.toString()}
        />

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType='slide'
          onRequestClose={() => setModalVisible(false)}
        >
          <View className='flex-1 bg-black/50 items-center justify-center'>
            <View className='w-11/12 bg-white p-6 rounded-lg'>
              <Text className='text-xl font-bold mb-4 text-center'>Enter Kid's Information</Text>

              <TextInput
                fieldName='nameofkid'
                lable='Name'
                value={kidInfo.name}
                onChangeText={(text) => setKidInfo({ ...kidInfo, name: text })}
              />
              <TextInput
                fieldName='ageofkid'
                lable='Age'
                keyboardType='numeric'
                value={kidInfo.age}
                onChangeText={(text) => setKidInfo({ ...kidInfo, age: text })}
              />
              <TextInput
                fieldName='genderofkid'
                lable='Gender'
                value={kidInfo.gender}
                onChangeText={(text) => setKidInfo({ ...kidInfo, gender: text })}
              />
              <Button
                onPress={() => {
                  setModalVisible(false);
                  // Update the kid info at the current index in the 'kidsDetails' array
                  const updatedKidsDetails = [...values.kidsDetails];
                  updatedKidsDetails[currentKidIndex] = { ...kidInfo };

                  // Use setFieldValue to update 'kidsDetails' with the modified array
                  setFieldValue('kidsDetails', updatedKidsDetails);
                }}
              >
                <Text>Save</Text>
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};
