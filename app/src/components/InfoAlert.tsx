import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@shadcn/components/ui/alert-dialog';
import { Text } from '@shadcn/components/ui/text';
import { Info, X } from 'lucide-react-native';

interface AlertIconDialogProps {
  title: string;
  description: string;
}

export function InfoAlertIcon({ title, description }: AlertIconDialogProps) {
  return (
    <AlertDialog>
      {/* Info Icon as Trigger */}
      <AlertDialogTrigger asChild>
        <Info size={24} className='text-primary' />
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader className='flex flex-row items-center justify-between'>
          <Info size={28} className='text-primary' />
          <AlertDialogTitle className='text-xl font-medium'>{title}</AlertDialogTitle>
          <AlertDialogCancel className='border-secondary bg-secondary rounded-xl text-center native:w-12 native:h-12'>
            <X className='text-primary' />
          </AlertDialogCancel>
        </AlertDialogHeader>

        <AlertDialogDescription className='text-lg mb-4'>{description}</AlertDialogDescription>

        <AlertDialogFooter className='flex flex-row justify-center'>
          <AlertDialogCancel className='border-secondary bg-secondary text-black rounded-xl text-center'>
            <Text className='text-xl'>Okay</Text>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
