import { useNavigation } from '@react-navigation/native';
import { Button, Text } from '@shadcn/components';
import { Screens, Stacks } from '@src/constants';
import type { AppNavigation } from '@src/types';
import { View } from 'react-native';

export const Home: React.FC = () => {
  const { navigate } = useNavigation<AppNavigation>();
  return (
    <View className='flex flex-1 items-center justify-center'>
      <Text>Home</Text>
      <Button
        onPress={async () =>
          navigate(Stacks.Auth, {
            screen: Screens.ActivityPlayer,
            params: { activityId: 'dE5hYZ0i0c7LaKtFxV5d' }
          })
        }
      >
        <Text>Press me</Text>
      </Button>
    </View>
  );
};
