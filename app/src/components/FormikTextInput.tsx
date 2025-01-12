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
import { iconWithClassName } from '@shadcn/icons/iconWithClassName';
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
  onEnter?: () => void;
}

export const TextInput: React.FC<TextInputProps> = ({
  fieldName,
  lable,
  submitOnEnter = false,
  secureTextEntry,
  leadingIcon: LeadingIcon,
  className: textFieldClassName,
  onEnter,
  ...rest
}) => {
  const { submitForm, setSubmitting, setFieldValue } = useFormikContext();
  const [field, meta] = useField(fieldName);
  const [isTextVisible, setIsTextVisible] = useState(!secureTextEntry);

  if (LeadingIcon) {
    iconWithClassName(LeadingIcon);
  }

  const onChange = (value: string | number) =>
    setFieldValue(
      fieldName,
      rest.keyboardType === 'numeric'
        ? Number.parseInt(String(value === '' ? '0' : value), 10)
        : value
    );

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
    <View className={clsx('my-2', textFieldClassName)}>
      <Label className={clsx('pb-2', meta.error && 'text-destructive')}>{lable}</Label>
      <View
        className={clsx(
          'flex flex-row justify-center items-center rounded-xl border bg-background px-4 py-2',
          meta.error ? 'border-destructive' : 'border-input'
        )}
      >
        {LeadingIcon && (
          <LeadingIcon
            key={fieldName}
            strokeWidth={2}
            className={clsx(meta.error ? 'text-destructive' : 'text-primary')}
          />
        )}
        <Input
          {...rest}
          className={clsx('flex-1 ml-2 border-0', textFieldClassName)}
          onChangeText={onChange}
          onBlur={field.onBlur(fieldName)}
          value={field.value?.toString()}
          onSubmitEditing={submitOnEnter ? onSubmitEditing : onEnter}
          secureTextEntry={secureTextEntry ? !isTextVisible : undefined}
          autoCapitalize='none'
          autoComplete='off'
        />
        {secureTextEntry && (
          <Pressable onPress={() => setIsTextVisible(!isTextVisible)}>
            {isTextVisible ? (
              <EyeClosed
                strokeWidth={2}
                className={clsx(meta.error ? 'text-destructive' : 'text-primary')}
              />
            ) : (
              <Eye
                strokeWidth={2}
                className={clsx(meta.error ? 'text-destructive' : 'text-primary')}
              />
            )}
          </Pressable>
        )}
      </View>
      {meta.error && <Label className='py-2 text-destructive'>{meta.error}</Label>}
    </View>
  );
};
