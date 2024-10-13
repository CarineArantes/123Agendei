import { forwardRef } from 'react';
import { Text, TextInput, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

import { cn } from '../lib'

export interface InputProps
  extends React.ComponentPropsWithoutRef<typeof TextInput> {
  label?: string;
  labelClasses?: string;
  inputClasses?: string;
  errorMessages?: string;
}
const Input = forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  ({ className, label, labelClasses, inputClasses, errorMessages, ...props }, ref) => (
    <View>
      <View className={cn(`flex flex-col gap-1.5`, className)}>
        {label &&
          <Text className={cn(`text-base ${errorMessages && 'text-red-600'}`, labelClasses)}>
            {label}
          </Text>
        }
        <TextInput
          className={cn(
            inputClasses,
            `border border-input py-2.5 px-4 rounded-lg ${errorMessages && 'border-red-600'}`
          )}
          {...props}
        />
      </View>
      {errorMessages &&
        <View className=' flex-row gap-2 mt-1'>
          <AntDesign name="exclamationcircleo" size={20} color="#dc2626" />
          <Text className=' text-red-600'>
            {errorMessages}
          </Text>
        </View>
      }
    </View>
  )
);

export { Input };
