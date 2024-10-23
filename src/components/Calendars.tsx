import {
    Calendar,
    LocaleConfig
} from 'react-native-calendars';
import { ptBR } from '../lib/localeCalendarConfig';
import { Text, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

LocaleConfig.locales['pt-br'] = ptBR;
LocaleConfig.defaultLocale = 'pt-br';

type CalendarsProps = {
    onCalendarPress: (day: any) => void;
    value: string;
    errorMessages?: string;
}

export function Calendars(props: CalendarsProps) {
    const { onCalendarPress, errorMessages, value } = props;
    return (
        <>
            <Calendar
                onDayPress={onCalendarPress}
                markedDates={{
                    [value || '']: {
                        selected: true,
                    }
                }}
            />
            {errorMessages && (
                <View className="flex-row gap-1 mt-1">
                    <AntDesign name="exclamationcircleo" size={15} color="#dc2626" />
                    <Text className="text-red-600">{errorMessages}</Text>
                </View>)
            }
        </>
    )
}