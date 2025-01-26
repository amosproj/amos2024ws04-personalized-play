import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@shadcn/components/ui/alert-dialog';
import { Text } from '@shadcn/components/ui/text';
import { AlertTriangle, Trash2, X } from 'lucide-react-native';

interface AlertIconDialogProps {
  title: string;
  description: string;
  onDelete: () => void; // Updated prop name for clarity
}

export function DeleteAlertIcon({ title, description, onDelete }: AlertIconDialogProps) {
  return (
    <AlertDialog>
      {/* Trigger Icon */}
      <AlertDialogTrigger asChild={true}>
        <Trash2 size={24} className='text-red-600 cursor-pointer' />
      </AlertDialogTrigger>

      <AlertDialogContent className='w-2/3 max-w-lg mx-auto'>
        <AlertDialogHeader className='flex flex-row items-center justify-between'>
          <AlertTriangle size={28} className='text-yellow-500' />
          <AlertDialogTitle className='text-xl font-semibold'>{title}</AlertDialogTitle>
          <AlertDialogCancel asChild={true}>
            <X size={24} className='text-gray-600 cursor-pointer' />
          </AlertDialogCancel>
        </AlertDialogHeader>

        <AlertDialogDescription className='text-base text-gray-700 mb-6'>
          {description}
        </AlertDialogDescription>

        <AlertDialogFooter className='flex flex-row justify-between'>
          {/* Cancel Button */}
          <AlertDialogCancel className='rounded-lg px-4 py-2'>
            <Text className='text-base text-gray-600'>Cancel</Text>
          </AlertDialogCancel>

          {/* Confirm Delete Button */}
          <AlertDialogAction
            onPress={onDelete}
            className='bg-red-600 text-white rounded-lg px-4 py-2'
          >
            <Text className='text-base bg-inherit'>Delete</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
