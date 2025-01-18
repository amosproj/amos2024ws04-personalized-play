import { Button } from '@shadcn/components/ui/button';
import { Input } from '@shadcn/components/ui/input';
import { Label } from '@shadcn/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@shadcn/components/ui/radio-group';
import { Text } from '@shadcn/components/ui/text';
import type React from 'react';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

interface ChoreTypeSelectorProps {
  onChoreSelected: (selectedChore: string) => void;
}

interface RadioGroupItemWithLabelProps {
  value: string;
  onLabelPress: () => void;
}

const RadioGroupItemWithLabel: React.FC<RadioGroupItemWithLabelProps> = ({
  value,
  onLabelPress
}) => {
  return (
    <View className='flex-row gap-2 items-center'>
      <RadioGroupItem aria-labelledby={`label-for-${value}`} value={value} />
      <Label nativeID={`label-for-${value}`} onPress={onLabelPress}>
        {value}
      </Label>
    </View>
  );
};

export const ChoreTypeSelector: React.FC<ChoreTypeSelectorProps> = ({ onChoreSelected }) => {
  const [selectedChore, setSelectedChore] = useState<string>('Cooking');
  const [customChore, setCustomChore] = useState<string>('');
  const [error, setError] = useState<string>('');

  const defaultChores = ['Cooking', 'Washing dishes', 'Doing laundry'];

  const handleChoreSelection = (value: string): void => {
    setSelectedChore(value);
    setError('');
  };

  const onLabelPress = (chore: string) => {
    return () => {
      setSelectedChore(chore);
      setError('');
    };
  };

  const handleSave = (): void => {
    if (selectedChore === 'other') {
      if (!customChore.trim()) {
        setError('Please enter a chore name');
        return;
      }
      onChoreSelected(customChore.trim());
    } else {
      onChoreSelected(selectedChore);
    }
  };

  return (
    <View className='p-4 bg-white rounded-lg w-full'>
      <ScrollView className='max-h-40'>
        <RadioGroup value={selectedChore} onValueChange={handleChoreSelection} className='gap-2'>
          {defaultChores.map((chore) => (
            <RadioGroupItemWithLabel key={chore} value={chore} onLabelPress={onLabelPress(chore)} />
          ))}
          <RadioGroupItemWithLabel value='other' onLabelPress={onLabelPress('other')} />
        </RadioGroup>
      </ScrollView>

      {selectedChore === 'other' && (
        <View className='mt-3'>
          <Input
            value={customChore}
            onChangeText={(text: string) => setCustomChore(text)}
            placeholder='Enter chore name'
            className='h-9'
          />
        </View>
      )}

      {error ? <Text className='text-red-500 mt-2 text-sm'>{error}</Text> : null}

      <Button
        className='mt-4 w-full'
        disabled={selectedChore === 'other' && !customChore}
        onPress={handleSave}
      >
        <Text>Save</Text>
      </Button>
    </View>
  );
};
