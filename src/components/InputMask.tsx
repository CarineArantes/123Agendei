import { forwardRef } from 'react';
import { Text, TextInput, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { TextInputMask } from 'react-native-masked-text';
import { cn } from '../lib';

export interface InputProps
    extends React.ComponentPropsWithoutRef<typeof TextInput> {
    errorMessages?: string;
    className?: string;
    mask: string;
    onChangeText: (text: string) => void;
    value: string;
}

const InputMask = forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
    ({ className, errorMessages, mask, onChangeText, value, ...props }, ref) => (
        <>
            <TextInputMask
                type={'custom'}
                {...props}
                options={{
                    mask: mask
                }}
                style={{
                    fontSize: 20
                }}
                onChangeText={onChangeText}
                placeholderTextColor={'#C9C9CB'}
                value={value}
            />
            {errorMessages && (
                <View className="flex-row gap-1 mt-1">
                    <AntDesign name="exclamationcircleo" size={15} color="#dc2626" />
                    <Text className="text-red-600">{errorMessages}</Text>
                </View>)
            }
        </>
    )
);

export { InputMask };
