import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Text } from '@shadcn/components';
import { View } from 'react-native';

export const Drawer: React.FC<DrawerContentComponentProps> = (props) => {
  return (
    <View className='flex flex-1 items-center justify-center'>
      <Text>Drawer</Text>
    </View>
  );
};
