import type { ContextualQuestionProps } from '@src/types';
import { useFormikContext } from 'formik';
import type React from 'react';
import { Image, StyleSheet, View } from 'react-native';

export const ContextualQuestionDetectedItems: React.FC<ContextualQuestionProps> = ({ onNext }) => {
  const { setFieldValue, values } = useFormikContext<{ camera: string; detectedItems: Array<string>;}>();

  return (
    <View style={styles.container}>
      {values.camera && <Image source={{ uri: values.camera }} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10
  }
});
