import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Button, Text } from '@shadcn/components';
import { fireFunction } from '@src/constants';
import type { ContextualQuestionProps } from '@src/types';
import { httpsCallable } from 'firebase/functions';
import { useFormikContext } from 'formik';
import { X } from 'lucide-react-native';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import RNFS from 'react-native-fs';
import Svg, { G, Circle, Path } from 'react-native-svg';

export const ContextualQuestionDisplayItemsIdentified: React.FC<ContextualQuestionProps> = ({
  onNext,
  component
}) => {
  // Get the formik context and values
  const { setFieldValue, values } = useFormikContext<{
    camera: string;
    detectedItems: Array<string>;
  }>();

  // State for loading and items
  const [loading, setLoading] = useState(false);

  // State for items and new item input
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState<string>('');

  // Get the image URI from the form values
  const image_uri = values.camera;

  // Ref for the bottom sheet
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Animated value for the pulse animation
  const pulseAnim = useRef(new Animated.Value(1)).current;

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
      const result = await itemsInImage({ image: base64Image });

      // Set the items in the state
      setItems((result.data as string[]) || []);
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
  };

  // Pulse Animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        })
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View style={styles.container}>
      {/* Loading State */}
      {loading ? (
        <View style={styles.flexCenter}>
          <Animated.View
            style={[
              styles.svgContainer,
              {
                transform: [{ scale: pulseAnim }]
              }
            ]}
          >
            <Svg width={120} height={150} viewBox='0 0 80 100'>
              <G transform='translate(-12.439 -2.524)' fill='#620674'>
                <Circle cx={36.468} cy={15.509} r={13.009} />
                <Circle cx={66.557} cy={19.764} r={12.451} />
                <Path d='M66.155 36.183c-5.752 0-10.951 2.158-14.729 5.921-3.714-5.784-10.199-9.62-17.584-9.62-11.537 0-21.522 10.584-21.522 22.124 0 17.818 11.598 29.489 23.34 40.989 2.533 2.481 6.664 2.492 8.77.283 2.28-2.388 2.074-6.225-.434-8.734l-8.621-9.878c3.131-4.747 8.512-7.88 14.625-7.88s11.493 3.132 14.624 7.879l-8.621 9.879c-2.508 2.51-2.714 6.347-.436 8.734 2.107 2.209 6.239 2.198 8.772-.283 11.741-11.5 23.34-20.706 23.34-38.525.001-11.538-9.986-20.889-21.524-20.889M50 66.207c-5.579 0-10.104-4.524-10.104-10.104S44.421 45.999 50 45.999c5.58 0 10.104 4.523 10.104 10.104S55.58 66.207 50 66.207' />
              </G>
            </Svg>
          </Animated.View>
          <Text style={styles.loadingText}>Loading...</Text>
          <Text style={styles.loadingSubText}>Please wait while we load the list of items.</Text>
        </View>
      ) : (
        // Main Content
        <>
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
            <Button className='w-full' size='lg' onPress={saveItemsAndContinue}>
              <Text>Good to go</Text>
            </Button>
          </View>

          {/* Edit Items Button */}
          <Button className='w-full' size='lg' variant='secondary' onPress={openBottomSheet}>
            <Text>Edit items</Text>
          </Button>

          {/* Bottom Sheet */}
          <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={['100%']}
            onChange={handleSheetChanges}
            enablePanDownToClose={true}
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
                      <X size={24} color='red' />
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
                  placeholder='Enter an item'
                />
                <Button className='w-full' size='lg' onPress={addItem} style={styles.addButton}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16
  },
  image: {
    width: 280,
    height: 200,
    marginBottom: 8,
    marginTop: 8,
    borderRadius: 8
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
    marginTop: 12,
    textAlign: 'center',
    width: 280
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 16,
    width: 280
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  bullet: {
    fontSize: 18,
    marginRight: 8
  },
  itemText: {
    fontSize: 16
  },
  confirmationContainer: {
    alignItems: 'center',
    marginBottom: 16
  },
  confirmationText: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 30,
    textAlign: 'center',
    marginBottom: 16
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center'
  },
  editTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%'
  },
  inputContainer: {
    marginTop: 16,
    width: '100%'
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    marginBottom: 8,
    width: '100%'
  },
  addButton: {
    marginTop: 8
  },
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    lineHeight: 30
  },
  loadingSubText: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 16
  },

  svgContainer: {
    marginBottom: 16
  }
});
