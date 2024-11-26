import { Button, Text } from '@shadcn/components';
import { Avatar, AvatarFallback, AvatarImage } from '@shadcn/components/ui/avatar';
import type { ContextualQuestionProps } from '@src/types';
import { useField, useFormikContext } from 'formik';
import LottieView from 'lottie-react-native';
import { useMemo, useRef, useState } from 'react';
import { Modal, View } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { TextInput } from './FormikTextInput';

export const ContextualQuestionAgeKids: React.FC<ContextualQuestionProps> = (props) => {
  //use FormikContext ( setField)
  const [field] = useField('numberOfKids');
  const { onNext } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const { setFieldValue, values } = useFormikContext<{
    kidsDetails: Array<{ name: string; age: string; gender: string }>;
  }>();
  const [currentKidIndex, setCurrentKidIndex] = useState(0);

  const kidsData = useMemo(
    () =>
      //values.kidsDetails ||
      Array.from({ length: field.value }, () => ({
        name: '',
        age: '',
        gender: ''
      })),
    [field.value, values.kidsDetails]
  );
  //
  const handleSaveKidInfo = (updatedInfo: {
    name: string;
    age: string;
    gender: string;
  }) => {
    if (currentKidIndex === null) return;
    const updatedKidsDetails = [...kidsData];
    updatedKidsDetails[currentKidIndex] = updatedInfo;
    setFieldValue('kidsDetails', updatedKidsDetails);
    setModalVisible(false);
    setCurrentKidIndex(0);
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
        <Text className='text-2xl text-center font-medium mb-6'>Tell us about your kids</Text>

        <FlatList
          ItemSeparatorComponent={() => <View className='h-5' />}
          data={kidsData}
          ref={flatListRef}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              className='flex-row  w-10 h-10 border-2'
              onPress={() => {
                setCurrentKidIndex(index); // Track which kid is being edited
                setModalVisible(true);
              }}
            >
              <View className='flex-row w-full h-20 border-2 border-primary items-center rounded-xl justify-around '>
                <Avatar alt='Avatar' className='w-12 h-12'>
                  <AvatarImage source={require('../../assets/boy.png')} />
                  <AvatarFallback>
                    <Text>+</Text>
                  </AvatarFallback>
                </Avatar>
                <Text>{kidsData[index].name || `Kid ${index + 1}`}</Text>
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
                value={kidsData[currentKidIndex]?.name || ''}
                onChangeText={(text) =>
                  handleSaveKidInfo({
                    ...kidsData[currentKidIndex],
                    name: text
                  })
                }
                //onChangeText={(text) => setKidInfo({ ...kidInfo, name: text })}
              />

              <TextInput
                fieldName='ageofkid'
                lable='Age'
                keyboardType='numeric'
                value={kidsData[currentKidIndex]?.age || ''}
                onChangeText={(text) =>
                  handleSaveKidInfo({
                    ...kidsData[currentKidIndex],
                    age: text
                  })
                }
              />
              <Text className='text-l font-medium mb-2  '>Gender</Text>
              <View className='h-10' />
              <View className='flex-row justify-around'>
                {/* Male Avatar */}
                <TouchableOpacity
                  className='items-center'
                  onPress={() =>
                    handleSaveKidInfo({
                      ...kidsData[currentKidIndex],
                      gender: 'Male'
                    })
                  }
                >
                  <Avatar alt='Avatar' className='w-20 h-20 rounded-full overflow-hidden'>
                    <AvatarImage source={require('../../assets/boy.png')} className='contain' />
                    <AvatarFallback>
                      <Text className=''>M</Text>
                    </AvatarFallback>
                  </Avatar>
                </TouchableOpacity>

                {/* Female Avatar */}
                <TouchableOpacity
                  className='items-center'
                  onPress={() =>
                    handleSaveKidInfo({
                      ...kidsData[currentKidIndex],
                      gender: 'Female'
                    })
                  }
                >
                  <Avatar alt='Avatar' className='w-20 h-20 rounded-full overflow-hidden'>
                    <AvatarImage source={require('../../assets/girl.png')} className='contain' />
                    <AvatarFallback>
                      <Text>F</Text>
                    </AvatarFallback>
                  </Avatar>
                </TouchableOpacity>
              </View>
              <View className='h-10' />
              <Button
                onPress={() => {
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
  );
};
