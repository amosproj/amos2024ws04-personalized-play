import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Button, Text } from '@shadcn/components';
import { fireFunction } from '@src/constants';
import type { ContextualQuestionProps } from '@src/types';
import { httpsCallable } from 'firebase/functions';
import { useFormikContext } from 'formik';
import { X } from 'lucide-react-native';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Image, TextInput, TouchableOpacity, View, Keyboard } from 'react-native';
import RNFS from 'react-native-fs';
import { Loading } from './Loading';

export const ContextualQuestionDisplayItemsIdentified: React.FC<ContextualQuestionProps> = ({ component, toggleNext }) => {
  const { setFieldValue, values } = useFormikContext<{
    camera: string;
    detectedItems: Array<string>;
  }>();

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState<string>('');
  const image_uri = values.camera;
  const bottomSheetRef = useRef<BottomSheet>(null);

  const openBottomSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const addItem = () => {
    if (newItem.trim()) {
      setItems((prevItems) => [...prevItems, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (index: number) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const getItemsList = async () => {
    setLoading(true);
    try {
      const base64Image = await RNFS.readFile(image_uri, 'base64');
      const itemsInImage = httpsCallable(fireFunction, 'itemsInImage');
      const result = await itemsInImage({ image: base64Image });
      setItems((result.data as string[]) || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (component === 'displayItems') {
      getItemsList();
    }
  }, [component]);

  // if item list is empty, disable next button
  useEffect(() => {
    if (items.length === 0) {
      setFieldValue('detectedItems', []);
      toggleNext(false);
    }
    else {
      setFieldValue('detectedItems', items);
      toggleNext(true);
    }
  }, [items]);

  return (
    <View className="flex-1 p-4 bg-white">
      {loading ? (
        <Loading />
      ) : (
        <>
          <View className="items-center mb-4">
            {image_uri ? (
              <Image
                source={{ uri: image_uri }}
                className="w-full h-48 mb-2 mt-2 rounded-lg object-cover"
              />
            ) : (
              <Text className="text-center text-gray-500">No image available</Text>
            )}
            <Text className="text-lg font-bold mt-3 text-center">Items Detected</Text>
          </View>

          <View className="flex-1 bg-gray-100 p-4 rounded-lg mb-4">
            <FlatList
              data={items}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item }) => (
                <View className="flex-row items-center py-2 border-b border-gray-300">
                  <Text className="text-lg mr-2">•</Text>
                  <Text className="text-base text-gray-800">{item}</Text>
                </View>
              )}
            />
          </View>

          <Button className="w-full" size="lg" variant="secondary" onPress={openBottomSheet}>
            <Text>Edit items</Text>
          </Button>

          <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={['50%', '90%']}
            enablePanDownToClose={true}
          >
            <BottomSheetView className="flex-1 p-4">
              <Text className="text-lg font-bold mb-4 text-center">Edit Items</Text>
              <FlatList
                data={items}
                keyExtractor={(item, index) => `${item}-${index}`}
                renderItem={({ item, index }) => (
                  <View className="flex-row justify-between items-center py-2 border-b border-gray-300">
                    <Text className="text-base text-gray-800">{item}</Text>
                    <TouchableOpacity onPress={() => removeItem(index)}>
                      <X size={24} color="red" />
                    </TouchableOpacity>
                  </View>
                )}
              />
              <View className="mt-4">
                <Text className="text-sm font-bold mb-2">Enter Item</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-2 text-base mb-2"
                  value={newItem}
                  onChangeText={setNewItem}
                  placeholder="Enter an item"
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                    addItem();
                  }}
                />
                <Button className="w-full mt-2" size="lg" onPress={addItem}>
                  <Text>Add Item</Text>
                </Button>
              </View>
            </BottomSheetView>
          </BottomSheet>
        </>
      )}
    </View>
  );
};
