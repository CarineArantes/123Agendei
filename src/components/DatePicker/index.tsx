import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface DatePickerProps {
  placeholder?: string;
  errorMessage?: string | undefined;
  value: string;
  onChangeText: (text: string) => void;
  legend?: string; 
  isDisabled?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  placeholder = 'Digite aqui',
  legend = '',
  errorMessage = '',
  value,
  onChangeText,
  isDisabled = false,
}) => {
  const [show, setShow] = useState(false);
  const [dateValue, setDateValue] = useState<Date | undefined>(undefined);

  const hasError = Boolean(errorMessage?.trim());

  const onChange = (event: any, selectedDate?: Date) => {
    setShow(false);
    if (event.type === 'set' && selectedDate) {
      setDateValue(selectedDate);
      // Utiliza o idioma do sistema para formatar a data
      const formattedDate = selectedDate.toLocaleDateString();
      onChangeText(formattedDate);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => !isDisabled && setShow(true)}
        style={[
          styles.input, 
          hasError ? styles.errorInput : null, 
          isDisabled ? styles.disabledInput : null
        ]}
        disabled={isDisabled}
      >
        {show ? (
          <DateTimePicker
            value={dateValue ? dateValue : new Date()}
            mode="date"
            display="default"
            onChange={onChange}
            locale='pt-BR'
          />
        ) : (
          <Text style={{ color: value ? 'black' : '#aaa' }}>
            {value || placeholder}
          </Text>
        )}
      </TouchableOpacity>
      {hasError && (
        <Text style={styles.errorText}>
          {errorMessage}
        </Text>
      )}
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
    backgroundColor: '#f0f0f0',
    borderColor: '#ddd',
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});
