import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface TimePickerProps {
  placeholder?: string;
  errorMessage?: string | undefined;
  value: string;
  onChangeText: (text: string) => void; // Função para atualizar o valor
  legend?: string;
  isDisabled?: boolean; // Adiciona a propriedade isDisabled
}

export const TimePicker: React.FC<TimePickerProps> = ({
  placeholder = 'Selecione a hora',
  errorMessage = '',
  legend = '',
  value,
  onChangeText,
  isDisabled = false, // Valor padrão é false
}) => {
  const [show, setShow] = useState(false);
  const [timeValue, setTimeValue] = useState<Date | undefined>(undefined);

  const hasError = Boolean(errorMessage?.trim());

  const onChange = (event: any, selectedDate?: Date) => {
    setShow(false);
    if (event.type === 'set') {
      if (selectedDate) {
        setTimeValue(selectedDate);
        const timeString = selectedDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        onChangeText(timeString);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => !isDisabled && setShow(true)} // Permite abrir o TimePicker somente se não estiver desabilitado
        style={[
          styles.input,
          hasError ? styles.errorInput : null,
          isDisabled ? styles.disabledInput : null, // Aplica estilo se desabilitado
        ]}
        disabled={isDisabled} // Desabilita o TouchableOpacity se isDisabled for true
      >
        {show ? (
          <DateTimePicker
            value={timeValue ? timeValue : new Date()} // Usa o estado de hora ou a hora atual
            mode="time" // Modo para seleção de hora
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
