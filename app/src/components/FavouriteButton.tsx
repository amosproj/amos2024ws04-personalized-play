import { Button } from '@shadcn/components';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@shadcn/components/ui/alert-dialog';
import { Text } from '@shadcn/components/ui/text';
import { iconWithClassName } from '@shadcn/icons/iconWithClassName';
import { Heart, Info, X } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

iconWithClassName(Info);
iconWithClassName(X);
iconWithClassName(Heart);

interface AlertIconDialogProps {
  title: string;
  description: string;
  active: boolean;
  onPress: () => void;
}

export function FavouriteButton({ title, description, active, onPress }: AlertIconDialogProps) {
  const [isOpen, setOpen] = useState(false);

  const onButtonPress = () => {
    if (!active) {
      setOpen(true);
    }

    onPress();
  };

  return (
    <View>
      <Button
        variant={active ? 'default' : 'outline'}
        size={'icon'}
        className='rounded-full p-10'
        onPress={() => onButtonPress()}
      >
        <Heart
          size={24}
          className={active ? 'text-primary-foreground' : 'text-secondary-foreground'}
        />
      </Button>
      <AlertDialog open={isOpen}>
        {/* Info Icon as Trigger */}

        <AlertDialogContent>
          <AlertDialogHeader className='flex flex-row items-center justify-between'>
            <AlertDialogTitle className='text-xl text-primary font-medium'>
              {title}
            </AlertDialogTitle>
            <AlertDialogCancel
              onPress={() => setOpen(false)}
              className='border-primary rounded-xxl text-center native:w-9 native:h-9'
            >
              <X size='24' className='text-primary' />
            </AlertDialogCancel>
          </AlertDialogHeader>

          <AlertDialogDescription className='text-lg mb-4'>{description}</AlertDialogDescription>

          <AlertDialogFooter className='flex flex-row justify-center'>
            <AlertDialogCancel
              onPress={() => setOpen(false)}
              className='border-secondary bg-primary text-white rounded-xl text-center'
            >
              <Text className='text-xl'>Okay</Text>
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  );
}
