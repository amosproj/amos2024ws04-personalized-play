/**
 * TextInput Component
 *
 * This component renders a text input field with optional leading icon and label.
 * It integrates with Formik for form state management and handles form submission on enter key press.
 *
 * Props:
 * - fieldName: string - The name of the field in the form.
 * - lable: string - The label text to be displayed above the input field.
 * - submitOnEnter: boolean - Whether to submit the form when the enter key is pressed.
 * - leadingIcon: LucideIcon - An optional icon component to be displayed inside the input field.
 * - ...rest: BaseTextInputProps - Other props to be passed to the Input component.
 *
 * Usage:
 * <TextInput lable="Username" fieldName="username" submitOnEnter={true} />
 */

import { Input } from '@shadcn/components/ui/input';
import { Label } from '@shadcn/components/ui/label';
import { Eye, EyeClosed } from '@shadcn/icons';
import { clsx } from 'clsx';
import { useField, useFormikContext } from 'formik';
import type { LucideIcon } from 'lucide-react-native';
import type React from 'react';
import { useCallback, useState } from 'react';
import { Pressable, View } from 'react-native';
import type { TextInputProps as BaseTextInputProps } from 'react-native';

interface TextInputProps extends BaseTextInputProps {
  fieldName: string;
  lable: string;
  submitOnEnter?: boolean;
  leadingIcon?: LucideIcon;
}

export const TextInput: React.FC<TextInputProps> = ({
  fieldName,
  lable,
  submitOnEnter = false,
  secureTextEntry,
  leadingIcon: LeadingIcon,
  className: textFieldClassName,
  ...rest
}) => {
  const { submitForm, setSubmitting } = useFormikContext();
  const [field, meta] = useField(fieldName);
  const [isTextVisible, setIsTextVisible] = useState(!secureTextEntry);

  const onSubmitEditing = useCallback(async () => {
    try {
      setSubmitting(true);
      await submitForm();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setSubmitting(false);
    }
  }, [setSubmitting, submitForm]);

  return (
    <View className='m-2'>
      <Label className={clsx('pb-2', meta.touched && meta.error && 'text-destructive')}>
        {lable}
      </Label>
      <View
        className={clsx(
          'flex flex-row justify-center items-center rounded-full border bg-background px-4 py-1',
          meta.touched && meta.error ? 'border-destructive' : 'border-input'
        )}
      >
        {LeadingIcon && (
          <LeadingIcon
            key={fieldName}
            strokeWidth={1.6}
            className={clsx(meta.touched && meta.error ? 'text-destructive' : 'text-primary')}
          />
        )}
        <Input
          {...rest}
          className={clsx('flex-1 ml-2 border-0', textFieldClassName)}
          onChangeText={field.onChange(fieldName)}
          onBlur={field.onBlur(fieldName)}
          value={field.value}
          onSubmitEditing={submitOnEnter ? onSubmitEditing : undefined}
          secureTextEntry={secureTextEntry ? !isTextVisible : undefined}
          autoCapitalize='none'
          autoComplete='off'
        />
        {secureTextEntry && (
          <Pressable onPress={() => setIsTextVisible(!isTextVisible)}>
            {isTextVisible ? <EyeClosed /> : <Eye />}
          </Pressable>
        )}
      </View>
    </View>
  );
};
