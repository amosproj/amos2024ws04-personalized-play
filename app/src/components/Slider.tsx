import type { StyleProp, ViewStyle } from 'react-native';
import { Slider } from 'react-native-awesome-slider';
import { useSharedValue } from 'react-native-reanimated';

export const SliderExample = ({
  style,
  onSlidingComplete,
  min,
  max,
  defaultValue
}: {
  style: StyleProp<ViewStyle>;
  onSlidingComplete: (value: number) => void;
  min: number;
  max: number;
  defaultValue: number;
}) => {
  const progress = useSharedValue(defaultValue);
  const minSharedValue = useSharedValue(min);
  const maxSharedVaue = useSharedValue(max);
  return (
    <Slider
      style={style}
      onSlidingComplete={onSlidingComplete}
      theme={{
        disableMinTrackTintColor: '#000',
        maximumTrackTintColor: '#ccc',
        minimumTrackTintColor: '#620674',
        cacheTrackTintColor: '#333',
        bubbleBackgroundColor: '#666',
        heartbeatColor: '#999'
      }}
      markWidth={0}
      steps={max - min}
      progress={progress}
      minimumValue={minSharedValue}
      maximumValue={maxSharedVaue}
    />
  );
};
