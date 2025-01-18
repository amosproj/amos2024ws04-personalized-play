import { useNavigation } from '@react-navigation/native';
import { Text } from '@shadcn/components';
import { Card, CardHeader } from '@shadcn/components/ui/card';
import { Screens, Stacks } from '@src/constants';
import type { AppNavigation } from '@src/types';
import { CircleArrowRight } from 'lucide-react-native';
import { View } from 'react-native';

export const Home: React.FC = () => {
  const { navigate } = useNavigation<AppNavigation>();

  return (
    <View className='flex flex-1 items-center justify-center'>
      <Card className='w-full max-w-sm h-20 bg-primary'>
        <CardHeader className='flex-row  items-center justify-between'>
          <Text className='text-primary-foreground'>Wonna Play?</Text>
          <CircleArrowRight
            color='#ffffff'
            onPress={() => navigate(Stacks.Auth, { screen: Screens.NewPlay })}
          />
        </CardHeader>
      </Card>
      <Card className='w-full max-w-sm h-20 bg-primary'>
        <CardHeader className='flex-row  items-center justify-between'>
          <Text className='text-primary-foreground'>Profile</Text>
          <CircleArrowRight
            color='#ffffff'
            onPress={() => navigate(Stacks.Auth, { screen: Screens.Profile })}
          />
        </CardHeader>
      </Card>
    </View>
  );
};
