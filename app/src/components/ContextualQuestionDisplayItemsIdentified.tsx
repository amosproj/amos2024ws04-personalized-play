import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Button, Text } from '@shadcn/components';
import { Separator } from '@shadcn/components/ui/separator';
import { iconWithClassName } from '@shadcn/icons/iconWithClassName';
import { fireFunction } from '@src/constants';
import type { ContextualQuestionProps, OnboardingFormData } from '@src/types';
import { IconEdit, IconObjectScan } from '@tabler/icons-react-native';
import { httpsCallable } from 'firebase/functions';
import { Formik, useFormikContext } from 'formik';
import { X } from 'lucide-react-native';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Image, View } from 'react-native';
import * as Yup from 'yup';
import { SubmitButton } from './FormikSubmitButton';
import { TextInput } from './FormikTextInput';
import { Loading } from './Loading';

iconWithClassName(IconEdit);
iconWithClassName(IconObjectScan);

export const ContextualQuestionDisplayItemsIdentified: React.FC<ContextualQuestionProps> = () => {
  const { setFieldValue, values } = useFormikContext<OnboardingFormData>();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState<string>('');
  const bottomSheetRef = useRef<BottomSheet>(null);
  const openBottomSheet = useCallback(() => bottomSheetRef.current?.expand(), []);

  const getItemsList = useCallback(async (image: string) => {
    try {
      setLoading(true);
      const itemsInImage = httpsCallable(fireFunction, 'itemsInImage');
      const result = await itemsInImage({ image });
      setItems((result.data as string[]) || []);
    } catch (error) {
      console.error('Error fetching items:');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (values.image) getItemsList(values.image.substring(values.image.indexOf(',') + 1));
  }, [values.image]);

  useEffect(() => {
    setFieldValue('objects', items);
  }, [items.length]);

  if (loading) {
    return <Loading heading='Fetching Items' description='Please wait while we fetch the items.' />;
  }

  return (
    <View className='flex flex-1 items-stretch justify-center'>
      <View className='flex items-center justify-center self-center mb-4'>
        {values.image ? (
          <>
            <Image source={{ uri: values.image }} className='w-[280px] h-[200px] rounded-xl mb-2' />
            <Text className='text-sm text-gray-500'>Image uploaded</Text>
          </>
        ) : (
          <Text>No image available</Text>
        )}
      </View>
      <View className='flex-row justify-between items-center mb-4'>
        <View className='flex flex-col flex-1'>
          <View className='flex-row items-center'>
            <IconObjectScan size={18} />
            <Text className='text-2xl text-center font-medium ml-2'>Items</Text>
          </View>
          <Text className='text-sm text-gray-500'>Items identified in the image</Text>
        </View>
        <Button size={'icon'} variant={'ghost'} className='rounded-xl' onPress={openBottomSheet}>
          <IconEdit size={18} />
        </Button>
      </View>
      <View className='flex-1'>
        <FlatList
          data={items}
          keyExtractor={(item, index) => `${item}-${index}`}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className='flex flex-row py-2'>
              <Text className='text-xl mr-2'>•</Text>
              <Text className='text-base'>{item}</Text>
            </View>
          )}
        />
      </View>
      <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={['80%']} enablePanDownToClose={true}>
        <BottomSheetView className='flex-1 items-center'>
          <Text className='text-2xl text-center font-medium'>Edit Items</Text>
          <Text className='text-sm text-gray-500 mb-4'>Edit the items identified in the image</Text>
          <FlatList
            data={items}
            keyExtractor={(item, index) => `${item}-${index}`}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View className='flex flex-col w-full'>
                <View className='flex flex-row justify-between items-center w-full py-1'>
                  <Text className='text-base mr-2'>{item}</Text>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='rounded-xl'
                    onPress={() => {
                      setItems((prevItems) => prevItems.filter((_, i) => i !== index));
                    }}
                  >
                    <X size={18} color='red' />
                  </Button>
                </View>
                {index !== items.length - 1 && <Separator />}
              </View>
            )}
          />
          <View className='mt-4 w-full'>
            <Formik
              initialValues={{ item: '' }}
              validationSchema={Yup.object({
                item: Yup.string().required('Item is required')
              })}
              onSubmit={(values) => setItems((prevItems) => [...prevItems, values.item])}
            >
              <>
                <TextInput fieldName='item' lable='Add Item' leadingIcon={IconObjectScan} />
                <SubmitButton size='lg' className='w-full' shouldResetForm={true}>
                  <Text>Add Item</Text>
                </SubmitButton>
              </>
            </Formik>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};
