import { forwardRef } from 'react';
import { Text, TextInput, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { cn } from '../lib';

export interface InputProps
  extends React.ComponentPropsWithoutRef<typeof TextInput> {
  errorMessages?: string;
  multiline?: boolean;
  className?: string;
}

const Input = forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  ({ className, errorMessages, multiline = false, ...props }, ref) => (
    <>
      <TextInput
        ref={ref}
        {...props}
        className={cn(`${multiline && 'h-32'}`, className)}
        style={{
          fontSize: 20
        }}
        placeholderTextColor={'#C9C9CB'}
        textAlignVertical={multiline ? 'top' : 'center'}
        multiline={multiline}
      />
      {errorMessages && (
        <View className="flex-row gap-1 mt-1">
          <AntDesign name="exclamationcircleo" size={15} color="#dc2626" />
          <Text className="text-red-600">{errorMessages}</Text>
        </View>
      )}
    </>
  )
);

export { Input };
