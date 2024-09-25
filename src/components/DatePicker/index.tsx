import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface DatePickerProps {
  placeholder?: string;
  errorMessage?: string | undefined;
  value: string;
  onChangeText: (text: string) => void;
  legend?: string; 
  isDisabled?: boolean; // Adiciona a propriedade isDisabled
}

export const DatePicker: React.FC<DatePickerProps> = ({
  placeholder = 'Digite aqui',
  legend = '',
  errorMessage = '',
  value,
  onChangeText,
  isDisabled = false, // Valor padrão é false
}) => {
  const [show, setShow] = useState(false);
  const [dateValue, setDateValue] = useState<Date | undefined>(undefined);

  const hasError = Boolean(errorMessage?.trim());

  const onChange = (event: any, selectedDate?: Date) => {
    setShow(false);
    if (event.type === 'set') {
      if (selectedDate) {
        setDateValue(selectedDate);
        const dateString = selectedDate.toLocaleDateString();
        onChangeText(dateString);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => !isDisabled && setShow(true)} // Permite abrir o DateTimePicker somente se não estiver desabilitado
        style={[
          styles.input, 
          hasError ? styles.errorInput : null, 
          isDisabled ? styles.disabledInput : null // Aplica estilo se desabilitado
        ]}
        disabled={isDisabled} // Desabilita o TouchableOpacity se isDisabled for true
      >
        {show ? (
          <DateTimePicker
            value={dateValue ? dateValue : new Date()}
            mode="date"
            display="default"
            onChange={onChange}
          />
        ) : (
          <Text style={{ color: value ? 'black' : '#aaa' }}>
            {value || placeholder}
          </Text>
        )}
      </TouchableOpacity>
      <Text style={hasError && styles.errorText}>
        {errorMessage}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    marginBottom: 16, 
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  disabledInput: {
    backgroundColor: '#f0f0f0', // Cor de fundo para indicar que está desabilitado
    borderColor: '#ddd', // Altera a cor da borda
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});
