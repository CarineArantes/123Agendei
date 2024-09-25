import React, { useEffect, useState, useMemo } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useConfig } from '../../contexts/config';

export function CostumerServiceList() {
    const {
        costumerServiceList,
        setCostumerServiceSelected,
        setFilterDate
    } = useConfig();

    const [expiredServices, setExpiredServices] = useState<any>([]);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);



    const isExpired = (schedulingTime: string) => {
        const [hours, minutes] = schedulingTime.split(':').map(Number);
        const schedulingDate = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
            hours, minutes
        );
        return schedulingDate < new Date();
    }

    useEffect(() => {
        const checkExpiredServices = () => {
            const expired = costumerServiceList.filter(service => isExpired(service.schedulingTime));
            setExpiredServices(expired);
        };
        checkExpiredServices();
        const intervalId = setInterval(checkExpiredServices, 60000);
        return () => clearInterval(intervalId);
    }, [costumerServiceList]);

    const onChange = (event: any, selectedDate?: Date) => {
        if (event.type === 'set' && selectedDate) {
            setDate(selectedDate);
            // Utiliza o idioma do sistema para formatar a data
            const formattedDate = selectedDate.toLocaleDateString();
            const [day, month, year] = formattedDate.split('/')
            setFilterDate(`${year}-${month}-${day}`);
        }
    };

    const showPicker = () => {
        setShowDatePicker(true);
    };

    const formatDate = (date: any) => {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    };
    const currentDate = useMemo(() => {
        const today = formatDate(new Date());
        const formattedDate = formatDate(new Date(date));
        if (today === formattedDate) {
            return 'Hoje';
        }
        const [year, month, day] = formattedDate.split('-');
        return `${day}/${month}/${year}`;
    }, [date]);



    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.datePickerContainer}>
                <TouchableOpacity style={styles.dateButton} onPress={showPicker}>
                    <Text style={styles.dateButtonText}>Selecionar Data</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode="date"
                        is24Hour={true}
                        display="default"
                        locale='pt-BR'
                        onChange={onChange}
                    />
                )}
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.sectionTitle}>
                    {currentDate}
                </Text>
                {costumerServiceList.map((costumerService) => {
                    return (
                        <TouchableOpacity
                            key={costumerService.id}
                            style={[
                                styles.card,
                                (expiredServices.includes(costumerService) && currentDate === "Hoje")&& styles.expiredCard
                            ]}
                            onPress={() => setCostumerServiceSelected(costumerService)} // Ação ao pressionar
                        >
                            <View style={styles.cardHeader}>
                                <View style={styles.clientInfo}>
                                    <Text
                                        style={styles.clientName}
                                        numberOfLines={1}  // Limita a uma linha
                                        ellipsizeMode='tail'  // Reticências no final
                                    >
                                        {costumerService.clientName}
                                    </Text>
                                    <Text
                                        style={styles.serviceType}
                                        numberOfLines={1}  // Limita a uma linha
                                        ellipsizeMode='tail'  // Reticências no final
                                    >
                                        {costumerService.serviceType}
                                    </Text>
                                </View>
                                <Text
                                    style={styles.schedulingTime}
                                >
                                    {costumerService.schedulingTime}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    datePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    scrollContainer: {
        padding: 10,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#C084FC',
        marginBottom: 15,
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,  // Para Android
    },
    expiredCard: {
        borderColor: 'red',  // Cor da borda vermelha
        borderWidth: 2,      // Largura da borda
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',  // Centraliza verticalmente os itens
        marginBottom: 10,
    },
    clientInfo: {
        flex: 1,  // Ocupa o espaço disponível à esquerda
    },
    clientName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#C084FC',
        marginBottom: 4,  // Espaçamento entre o nome e o tipo de serviço
    },
    serviceType: {
        fontSize: 16,
        color: '#C084FC',
    },
    schedulingTime: {
        fontSize: 22,  // Fonte maior para a hora
        color: '#C084FC',
        textAlign: 'right',  // Alinha à direita
        fontWeight: 'bold',  // Destaca o horário
        alignSelf: 'center',  // Centraliza verticalmente
    },
    dateButton: {
        backgroundColor: '#007BFF', // Cor de fundo
        paddingVertical: 10, // Espessura vertical
        paddingHorizontal: 15, // Espessura horizontal
        borderRadius: 5, // Borda arredondada
        elevation: 3, // Sombra para Android
    },
    dateButtonText: {
        color: '#FFFFFF', // Cor do texto
        fontSize: 16, // Tamanho do texto
        fontWeight: 'bold', // Negrito
    }
});