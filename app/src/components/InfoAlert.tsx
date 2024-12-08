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
import { iconWithClassName } from '@shadcn/icons/iconWithClassName';
import { HelpCircle, Info, X } from 'lucide-react-native';

iconWithClassName(Info);
iconWithClassName(X);
iconWithClassName(HelpCircle);

interface AlertIconDialogProps {
  title: string;
  description: string;
}

export function InfoAlertIcon({ title, description }: AlertIconDialogProps) {
  return (
    <AlertDialog>
      {/* Info Icon as Trigger */}
      <AlertDialogTrigger asChild={true}>
        <Info size={24} className='text-primary' />
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader className='flex flex-row items-center justify-between'>
          <HelpCircle size={28} className='text-primary' />
          <AlertDialogTitle className='text-xl text-primary font-medium'>{title}</AlertDialogTitle>
          <AlertDialogCancel className='border-primary rounded-xxl text-center native:w-9 native:h-9'>
            <X size='24' className='text-primary' />
          </AlertDialogCancel>
        </AlertDialogHeader>

        <AlertDialogDescription className='text-lg mb-4'>{description}</AlertDialogDescription>

        <AlertDialogFooter className='flex flex-row justify-center'>
          <AlertDialogCancel className='border-secondary bg-primary text-white rounded-xl text-center'>
            <Text className='text-xl'>Okay</Text>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
