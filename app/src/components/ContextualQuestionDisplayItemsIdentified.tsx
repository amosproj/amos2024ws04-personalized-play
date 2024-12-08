import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Loading } from '@src/screens';
import { httpsCallable } from 'firebase/functions';
import { useFormikContext } from 'formik';
import { Button, Text } from '@shadcn/components';
import { X } from 'lucide-react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import type { ContextualQuestionProps } from '@src/types';
import { fireFunction } from '@src/constants';
import RNFS from 'react-native-fs';

export const ContextualQuestionDisplayItemsIdentified: React.FC<ContextualQuestionProps> = ({ onNext, component }) => {
  // Get the formik context and values
  const { setFieldValue, values } = useFormikContext<{ camera: string; detectedItems: any }>();

  // State for loading and items
  const [loading, setLoading] = useState(false);

  // State for items and new item input
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState<string>('');

  // Get the image URI from the form values
  const image_uri = values.camera;
  
  // Ref for the bottom sheet
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Function to handle changes in the bottom sheet index
  const handleSheetChanges = useCallback((index: number) => {
    console.log('Bottom sheet index changed:', index);
  }, []);

  // Function to open the bottom sheet
  const openBottomSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  // Function to add an item to the list
  const addItem = () => {
    if (newItem.trim()) {
      setItems((prevItems) => [...prevItems, newItem.trim()]);
      setNewItem('');
    }
  };

  // Function to remove an item from the list
  const removeItem = (index: number) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  // Function to get the list of items from the image using the Firebase function
  const getItemsList = async () => {

    // Set loading to true - show loading page
    setLoading(true);
    try {

      // Read the image file as base64
      const base64Image = await RNFS.readFile(image_uri, 'base64');

      // Call the itemsInImage function from the Firebase function
      const itemsInImage = httpsCallable(fireFunction, 'itemsInImage');
      const result: any = await itemsInImage({ image: base64Image });

      // Set the items in the state
      setItems(result.data || []);

    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      // Set loading to false - hide loading page
      setLoading(false);
    }
  };

  // Trigger an action whenever the index changes - Used to identify if the component is displayed
  useEffect(() => {

    // If the component is displayed, get the list of items
    if (component === 'displayItems') {
      getItemsList();
    }
  }, [component]); 

  // Function to save the items to the formik and continue to the next
  const saveItemsAndContinue = () => {
    setFieldValue('detectedItems', items);
    onNext();
  }

  return loading ? (
    <Loading heading="Loading..." description="Fetching data, please wait." />
  ) : (
    <View style={styles.container}>
      {/* Image and Title */}
      <View style={styles.imageContainer}>
        {image_uri ? (
          <Image source={{ uri: image_uri }} style={styles.image} />
        ) : (
          <Text>No image available</Text> 
        )}
        <Text style={styles.title}>Items Detected</Text>
      </View>

      {/* List of Items */}
      <View style={styles.listContainer}>
        <FlatList
          data={items}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.itemText}>{item}</Text>
            </View>
          )}
        />
      </View>

      {/* Confirmation Question */}
      <View style={styles.confirmationContainer}>
        <Text style={styles.confirmationText}>Do these Items look right?</Text>
        <Button className="w-full" size="lg" onPress={saveItemsAndContinue}>
          <Text>Good to go</Text>
        </Button>
      </View>

      {/* Edit Items Button  */}
      <Button
        className="w-full"
        size="lg"
        variant="secondary"
        onPress={openBottomSheet}
      >
        <Text>Edit items</Text>
      </Button>

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['100%']}
        onChange={handleSheetChanges}
        enablePanDownToClose
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text style={styles.editTitle}>Edit Items</Text>
          <FlatList
            data={items}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item, index }) => (
              <View style={styles.itemRow}>
                <Text style={styles.itemText}>{item}</Text>
                <TouchableOpacity onPress={() => removeItem(index)}>
                  <X size={24} color="red" />
                </TouchableOpacity>
              </View>
            )}
          />
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Enter Item</Text>
            <TextInput
              style={styles.input}
              value={newItem}
              onChangeText={setNewItem}
              placeholder="Enter an item"
            />
            <Button className="w-full" size="lg" onPress={addItem} style={styles.addButton}>
              <Text>Add Item</Text>
            </Button>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  image: {
    width: 280,
    height: 200,
    marginBottom: 8,
    marginTop: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
    marginTop: 12,
    textAlign: 'center',
    width: 280,
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 16,
    width: 280,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  bullet: {
    fontSize: 18,
    marginRight: 8,
  },
  itemText: {
    fontSize: 16,
  },
  confirmationContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmationText: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 30,
    textAlign: 'center',
    marginBottom: 16,
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
  editTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  inputContainer: {
    marginTop: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    marginBottom: 8,
    width: '100%',
  },
  addButton: {
    marginTop: 8,
  },
});