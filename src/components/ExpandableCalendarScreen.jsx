import React, { useState, useCallback } from 'react';
import { Text, View } from 'react-native';
import {
    ExpandableCalendar,
    AgendaList,
    CalendarProvider,
    LocaleConfig
} from 'react-native-calendars';
import { ptBR } from '../lib/localeCalendarConfig';

LocaleConfig.locales['pt-br'] = ptBR;
LocaleConfig.defaultLocale = 'pt-br';

const ITEMS = [
    {
        title: '2024-10-12',
        data: [
            { hour: '12:00', description: 'Reunião com equipe de desenvolvimento' },
            { hour: '14:00', description: 'Apresentação de projeto para o cliente' }
        ]
    },
    {
        title: '2024-10-13',
        data: [
            { hour: '09:00', description: 'Planejamento semanal' },
            { hour: '11:00', description: 'Reunião com equipe de marketing' }
        ]
    },
    {
        title: '2024-10-14',
        data: [
            { hour: '10:00', description: 'Revisão de código' },
            { hour: '13:00', description: 'Sessão de brainstorming para nova funcionalidade' }
        ]
    }
];

export function ExpandableCalendarScreen(props) {

    const [selectedDate, setSelectedDate] = useState(ITEMS[0]?.title);

    const filteredItems = ITEMS.filter(item => item.title === selectedDate);

    const renderItem = useCallback(({ item }) => {
        return (
            <Text>

            </Text>
        );
    }, []);

    const onDateChanged = (date) => {
        setSelectedDate(date);
    };

    return (
        <CalendarProvider
            date={selectedDate}
            onDateChanged={onDateChanged}
            showTodayButton
            className=" bg-transparent"
        >
            <ExpandableCalendar firstDay={1} />
            {filteredItems.length > 0 ? (
                <AgendaList
                    sections={filteredItems}
                    renderItem={renderItem}
                    sectionStyle={{
                        backgroundColor: 'transparent',
                        color: '#C084FC',
                        fontSize: 16,
                    }}
                />
            ) : (
                <View className=" flex-1 justify-center items-center">
                    <Text className=" font-light text-base text-neutral-800" >
                        Nenhum agendamento encontrado.
                    </Text>
                </View>
            )}
        </CalendarProvider>
    );
}