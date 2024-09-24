import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface DatePickerProps {
  placeholder?: string;
  errorMessage?: string | undefined;
  value: string;
  onChangeText: (text: string) => void;
  legend?: string; // Função para atualizar o valor
}

export const DatePicker: React.FC<DatePickerProps> = ({
  placeholder = 'Digite aqui',
  legend = '',
  errorMessage = '',
  value,
  onChangeText,
}) => {
  const [show, setShow] = useState(false);
  const [dateValue, setDateValue] = useState<Date | undefined>(undefined); // Estado para a data

  const hasError = Boolean(errorMessage?.trim());

  const onChange = (event: any, selectedDate?: Date) => {
    setShow(false);
    if (event.type === 'set') {
      if (selectedDate) {
        setDateValue(selectedDate); // Armazena a data selecionada
        const dateString = selectedDate.toLocaleDateString(); // Formatação da data
        onChangeText(dateString); // Atualiza o valor do campo
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setShow(true)}
        style={[styles.input, hasError ? styles.errorInput : null]}>
        {show ? (
          <DateTimePicker
            value={dateValue ? dateValue : new Date()} // Usar o estado de data ou a data atual
            mode="date" // ou "time", dependendo da necessidade
            display="default"
            onChange={onChange}
          />
        )
          : <Text style={{ color: value ? 'black' : '#aaa' }}>{value || placeholder}</Text>
        }
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
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});
