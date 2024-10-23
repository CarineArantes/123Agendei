import React, { useState } from 'react';
import { Text, View } from 'react-native';
import {
    ExpandableCalendar,
    AgendaList,
    CalendarProvider,
    LocaleConfig
} from 'react-native-calendars';
import { ptBR } from '../lib/localeCalendarConfig';
import { Format } from '../utils/format';
// Configuração de local
LocaleConfig.locales['pt-br'] = ptBR;
LocaleConfig.defaultLocale = 'pt-br';

export function ExpandableCalendarScreen(props) {

    const { items, renderItem, onChangeDate } = props;
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const onDateChanged = (date) => {
        setSelectedDate(date);
        onChangeDate(date);
    };

    const renderSectionHeader = (section) => {
        const title = section === new Date().toISOString().split('T')[0]
            ? 'Hoje'
            : Format.date(section, 'pt-br');
        return (
            <Text className='text-colorBase font-bold text-lg'>
                {title}
            </Text>
        );
    }
    return (
        <CalendarProvider
            date={selectedDate}
            onDateChanged={onDateChanged}
            showTodayButton={false}
        >
            <ExpandableCalendar firstDay={1} />
            {items?.length > 0 ? (
                <AgendaList
                    sections={items}
                    renderItem={renderItem}
                    style={{
                        padding: 10,
                    }}
                    renderSectionHeader={renderSectionHeader}
                />
            ) : (
                <View className="flex-1 justify-center items-center">
                    <Text className="font-light text-base text-neutral-800">
                        Nenhum agendamento encontrado.
                    </Text>
                </View>
            )}
        </CalendarProvider>
    );
}
