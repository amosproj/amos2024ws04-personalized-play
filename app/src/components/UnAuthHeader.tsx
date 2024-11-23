import type { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Button } from '@shadcn/components';
import { ChevronLeft } from '@shadcn/icons';

export const UnAuthHeader: React.FC<NativeStackHeaderProps> = (props) => {
  const { navigation } = props;
  const { canGoBack, goBack } = navigation;
  if (!canGoBack()) return null;
  return (
    <Button
      variant={'ghost'}
      size={'icon'}
      className='rounded-xl px-4'
      disabled={!canGoBack()}
      onPress={goBack}
    >
      <ChevronLeft className='text-base text-foreground' />
    </Button>
  );
};
