
import React, { useEffect, useState } from 'react';
import { Text } from '@shadcn/components';
import { Image, View , StyleSheet} from 'react-native';
import { useFonts } from 'expo-font';
import { Asset } from 'expo-asset';


export const Loading: React.FC = () => {
  // Add animation to dots
  const [dots, setDots] = useState(0); // Track the number of dots (0–3)

  // Load the image asset
  const image = Asset.fromModule(require('../../assets/mumbilogo-grey-animated.gif')).uri;

  // Load the Inter font
  const [fontsLoaded] = useFonts({
    Inter: require('../../assets/fonts/Inter-Regular.ttf'),
    'Inter-Bold': require('../../assets/fonts/Inter-Bold.ttf'),
  });

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots < 3 ? prevDots + 1 : 0));
    }, 500); // Update every 500ms

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: image }}
        className='w-[40%] h-auto aspect-square'
        resizeMode='contain'
        key={'landing-image'}
      />
      <Text style={styles.loadingText}>Loading</Text>
      <Text style={styles.subText}>Suggesting playtime activity
        <Text style={styles.dots}>{'.'.repeat(dots).padEnd(3, ' ')}</Text>
        
      </Text> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff', 
    height: '100%',
  },
  spinner: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 28,
    fontFamily: 'Inter-Bold', 
    color: '#000',
    marginBottom: 5,
    fontWeight: 'bold',
    height: 40,
    lineHeight: 34, 
    marginTop: 40
  },
  subText: {
    fontSize: 16,
    fontFamily: 'Inter', 
    color: '#888',
    width: 225,
    marginTop: 15
  },
  dots: {
    fontFamily: 'Inter', 
    color: '#888',
  },

  
});
