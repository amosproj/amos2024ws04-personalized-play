import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { useFormikContext } from 'formik';
import { Button, Text } from '@shadcn/components';
import { X } from 'lucide-react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import type { ContextualQuestionProps } from '@src/types';

export const ContextualQuestionDisplayItemsIdentified: React.FC<ContextualQuestionProps> = ({ onNext }) => {
  const { setFieldValue, values } = useFormikContext<{ camera: string; detectedItems: string }>();

  const base64Image = values.camera;

  const [items, setItems] = useState<string[]>([
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5',
    'Item 6',
  ]);

  const [newItem, setNewItem] = useState<string>('');
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('Bottom sheet index changed:', index);
  }, []);

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

  return (
    <View style={styles.container}>
      {/* Image and Title */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: base64Image }} style={styles.image} />
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
        <Button className="w-full" size="lg" onPress={onNext}>
          <Text>Good to go</Text>
        </Button>
      </View>

      {/* Edit Items Button */}
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