import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { TextInputMask } from 'react-native-masked-text'; // Importar a biblioteca
import { Mask } from 'react-native-svg';

interface InputTextProps extends TextInputProps {
  placeholder?: string;
  errorMessage?: string | undefined;
  legend?: string;
  mask?: string;
}

export const InputText: React.FC<InputTextProps> = ({
  placeholder = 'Digite aqui',
  errorMessage = '',
  legend = '',
  onChangeText,
  onBlur,
  value,
  mask
}) => {

  const hasError = Boolean(errorMessage?.trim());

  return (
    <View style={styles.container}>
      {mask ?
        <TextInputMask
          type={'custom'}
          options={{
            mask: mask
          }}
          style={[styles.input, hasError ? styles.errorInput : null]}
          placeholder={placeholder}
          onChangeText={onChangeText}
          onBlur={onBlur}
          value={value}
        />
        : <TextInput
          style={[styles.input, hasError ? styles.errorInput : null]}
          placeholder={placeholder}
          onChangeText={onChangeText}
          onBlur={onBlur}
          value={value}
        />
      }
      <Text style={hasError && styles.errorText}>
        {errorMessage}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});
