import React, { useState } from 'react';
import { Text, View, Platform } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';

interface TimePickerProps {
  errorMessages?: string | undefined;
  value: string;
  onChangeText: (text: string) => void;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  errorMessages = '',
  value,
  onChangeText,
}) => {

  function timeStringToDate(timeString: string): Date {
    try {
      const [hours, minutes] = timeString?.split(':').map(Number);
      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);
      date.setSeconds(0);
      return date;
    } catch {
      const timeString = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      onChangeText(timeString);
      return new Date()
    }
  }

  const onChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      const timeString = selectedDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      onChangeText(timeString);
    }
  };

  return (
    <>
      <DateTimePicker
        value={timeStringToDate(value)}
        mode="time"
        display="default"
        onChange={onChange}
        is24Hour={true}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          maxHeight: 40,
        }}
      />
      {errorMessages && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
          <AntDesign name="exclamationcircleo" size={15} color="#dc2626" />
          <Text style={{ color: '#dc2626', marginLeft: 5 }}>{errorMessages}</Text>
        </View>
      )}
    </>
  );
};
