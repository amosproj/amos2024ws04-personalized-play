
import React, { useEffect, useState } from 'react';
import { Text } from '@shadcn/components';
import { View , ActivityIndicator, StyleSheet} from 'react-native';
import { useFonts } from 'expo-font';
import Svg, { type SvgProps, Path, G } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withRepeat, withTiming } from 'react-native-reanimated';
import "../../assets/css/AnimatedSVG.css"; // CSS for animations

const AnimatedPath = Animated.createAnimatedComponent(Path);

const AnimatedSVG: React.FC = () => {
  // Shared value for animated fill color
  const fillColor = useSharedValue("#312792");

  // Animate the fill color between two colors
  useEffect(() => {
    fillColor.value = withRepeat(
      withTiming("#FF5722", { duration: 2000 }), // Glow to orange in 2 seconds
      -1, // Infinite repeat
      true // Reverse the animation
    );
  }, []);

  // Animated props for the path
  const animatedProps = useAnimatedProps(() => ({
    fill: fillColor.value,
  }));

  return (
    <Svg
      width={78}
      height={96}
    >
      <G>
        <AnimatedPath
          d="m25.4 26.3c-7.3 0-13.2-5.9-13.2-13.2 0-7.2 5.9-13.1 13.2-13.1 7.2 0 13.1 5.9 13.1 13.1 0 7.3-5.9 13.2-13.1 13.2z"
          animatedProps={animatedProps}
        />
        <AnimatedPath
          d="m55.8 30c-7 0-12.6-5.6-12.6-12.6 0-6.9 5.6-12.5 12.6-12.5 6.9 0 12.5 5.6 12.5 12.5 0 7-5.6 12.6-12.5 12.6z"
          animatedProps={animatedProps}
        />
        <AnimatedPath
          fillRule="evenodd"
          d="m77.1 55.1c0 18-11.7 27.3-23.6 38.9-2.5 2.5-6.7 2.5-8.8 0.3-2.3-2.4-2.1-6.3 0.4-8.8l8.7-10c-3.2-4.8-8.6-8-14.8-8-6.1 0-11.6 3.2-14.7 8l8.7 10c2.5 2.5 2.7 6.4 0.4 8.8-2.1 2.2-6.3 2.2-8.8-0.3-11.9-11.6-23.6-23.4-23.6-41.4 0-11.6 10.1-22.3 21.7-22.3 7.5 0 14 3.8 17.8 9.7 3.8-3.8 9-6 14.9-6 11.6 0 21.7 9.4 21.7 21.1zm-27.9-1c0-5.6-4.5-10.2-10.2-10.2-5.6 0-10.2 4.6-10.2 10.2 0 5.7 4.6 10.2 10.2 10.2 5.7 0 10.2-4.5 10.2-10.2z"
          animatedProps={animatedProps}
        />
      </G>
    </Svg>
  );
};

export const Loading: React.FC = () => {
  // Add animation to dots
  const [dots, setDots] = useState(0); // Track the number of dots (0–3)

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
      <AnimatedSVG />
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
  },
  subText: {
    fontSize: 16,
    fontFamily: 'Inter', 
    color: '#888',
    width: 225
  },
  dots: {
    fontFamily: 'Inter', 
    color: '#888',
  },

  
});
