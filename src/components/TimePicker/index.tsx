import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface TimePickerProps {
  placeholder?: string;
  errorMessage?: string | undefined;
  value: string;
  onChangeText: (text: string) => void; // Função para atualizar o valor
  legend?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  placeholder = 'Selecione a hora',
  errorMessage = '',
  legend = '',
  value,
  onChangeText,
}) => {
  const [show, setShow] = useState(false);
  const [timeValue, setTimeValue] = useState<Date | undefined>(undefined); // Estado para a hora

  const hasError = Boolean(errorMessage?.trim());

  const onChange = (event: any, selectedDate?: Date) => {
    setShow(false);
    if (event.type === 'set') {
      if (selectedDate) {
        setTimeValue(selectedDate); // Armazena a hora selecionada
        const timeString = selectedDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }); // Formatação da hora
        onChangeText(timeString); // Atualiza o valor do campo
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
            value={timeValue ? timeValue : new Date()} // Usar o estado de hora ou a hora atual
            mode="time" // Modo para seleção de hora
            display="default"
            onChange={onChange}
          />
        ) : (
          <Text style={{ color: value ? 'black' : '#aaa' }}>{value || placeholder}</Text>
        )}
      </TouchableOpacity>
      {hasError || legend &&
        <Text style={hasError && styles.errorText}>
          {hasError ? errorMessage : legend}
        </Text>
      }
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
