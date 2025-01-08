import { Button } from '@shadcn/components';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@shadcn/components/ui/alert-dialog';
import { Text } from '@shadcn/components/ui/text';
import { iconWithClassName } from '@shadcn/icons/iconWithClassName';
import { BatteryCharging, CookingPot, HelpCircle, Info, TimerIcon, X } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ChoreTypeSelector } from './ChoreTypeSelector';

iconWithClassName(Info);
iconWithClassName(BatteryCharging);
iconWithClassName(HelpCircle);
iconWithClassName(X);
iconWithClassName(TimerIcon);

interface AlertIconDialogProps {
  onFinish: (chore: string) => void; //called when a chore was selected in modal from radio group
  onPress: () => void; //called directly after press before the modal opens
  activityType: string;
}

export function ChoresButtonModal({ onFinish, onPress, activityType }: AlertIconDialogProps) {
  const [isOpen, setOpen] = useState(false);

  const IconWrapper = ({ children }: { children: ReactNode }) => (
    <View className='flex items-center justify-center'>{children}</View>
  );

  const handlePress = () => {
    onPress();
    setOpen(true);
  };

  const onChoreSelected = (chore: string) => {
    setOpen(false);
    onFinish(chore);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild={true}>
        <TouchableOpacity
          onPress={() => handlePress()}
          className={`h-28 w-28 rounded-xl flex items-center justify-center ${
            activityType === 'chores' ? 'bg-secondary' : 'bg-white'
          }`}
        >
          <IconWrapper>
            <CookingPot size={32} />
          </IconWrapper>
          <Text className='text-center text-md mt-4'>Chores</Text>
        </TouchableOpacity>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader className='flex flex-row items-center justify-between'>
          <AlertDialogTitle className='text-xl text-primary font-medium'>
            Select Chore
          </AlertDialogTitle>
          <AlertDialogCancel
            asChild={true}
            className='border-primary rounded-xxl text-center native:w-9 native:h-9 p-0'
          >
            <Button variant='ghost'>
              <X size={24} className='text-primary' />
            </Button>
          </AlertDialogCancel>
        </AlertDialogHeader>

        <View className='min-w-60'>
          <ChoreTypeSelector onChoreSelected={(chore) => onChoreSelected(chore)} />
        </View>
      </AlertDialogContent>
    </AlertDialog>
  );
}
