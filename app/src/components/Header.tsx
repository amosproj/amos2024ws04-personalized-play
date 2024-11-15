import type { DrawerHeaderProps } from '@react-navigation/drawer';
import { Text } from '@shadcn/components';
import { View } from 'react-native';

export const Header: React.FC<DrawerHeaderProps> = (props) => {
  return (
    <View className='flex h-56 items-center justify-center'>
      <Text>Header</Text>
    </View>
  );
};
