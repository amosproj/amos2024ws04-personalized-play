import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Button, Text } from '@shadcn/components';
import { fireFunction } from '@src/constants';
import type { ContextualQuestionProps } from '@src/types';
import { httpsCallable } from 'firebase/functions';
import { useFormikContext } from 'formik';
import { X } from 'lucide-react-native';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Image, TextInput, TouchableOpacity, View } from 'react-native';
import RNFS from 'react-native-fs';
import { Loading } from './Loading';

export const ContextualQuestionDisplayItemsIdentified: React.FC<ContextualQuestionProps> = ({component,}) => {
  const { values } = useFormikContext<{
    camera: string;
    detectedItems: Array<string>;
  }>();

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState<string>('');
  const image_uri = values.camera;
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Open the bottom sheet
  const openBottomSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  // Add an item to the list
  const addItem = () => {
    if (newItem.trim()) {
      setItems((prevItems) => [...prevItems, newItem.trim()]);
      setNewItem('');
    }
  };

  // Remove an item from the list
  const removeItem = (index: number) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  // Fetch the list of items from the image
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

  // Fetch the list of items when the component is mounted
  useEffect(() => {
    if (component === 'displayItems') {
      getItemsList();
    }
  }, [component]);

  return (
    <View className="flex-1 p-4">
      {loading ? (
        <Loading />
      ) : (
        <>
          <View className="items-center mb-4">
            {image_uri ? (
              <Image
                source={{ uri: image_uri }}
                className="w-70 h-50 mb-2 mt-2 rounded-lg"
              />
            ) : (
              <Text>No image available</Text>
            )}
            <Text className="text-lg font-bold mt-3 text-center w-70">Items Detected</Text>
          </View>

          <View className="flex-1 bg-gray-100 p-4 rounded-lg mb-4 w-70">
            <FlatList
              data={items}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item }) => (
                <View className="flex-row items-center py-2 border-b border-gray-300">
                  <Text className="text-lg mr-2">•</Text>
                  <Text className="text-base">{item}</Text>
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
            snapPoints={['100%']}
            enablePanDownToClose={true}
          >
            <BottomSheetView className="flex-1 p-9 items-center">
              <Text className="text-lg font-bold mb-4">Edit Items</Text>
              <FlatList
                data={items}
                keyExtractor={(item, index) => `${item}-${index}`}
                renderItem={({ item, index }) => (
                  <View className="flex-row justify-between items-center py-2 border-b border-gray-300 w-full">
                    <Text className="text-base">{item}</Text>
                    <TouchableOpacity onPress={() => removeItem(index)}>
                      <X size={24} color="red" />
                    </TouchableOpacity>
                  </View>
                )}
              />
              <View className="mt-4 w-full">
                <Text className="text-sm font-bold mb-2">Enter Item</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-2 text-base mb-2 w-full"
                  value={newItem}
                  onChangeText={setNewItem}
                  placeholder="Enter an item"
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
