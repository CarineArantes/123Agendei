import {
    SafeAreaView,
    Text,
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import { useConfig } from '../../contexts/config';

export function CostumerServiceList() {
    const {
        costumerServiceList,
        setCostumerServiceSelected
    } = useConfig();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.sectionTitle}>
                    Hoje
                </Text>
                {costumerServiceList.map((costumerService) => {
                    return (
                        <TouchableOpacity
                            key={costumerService.id}
                            style={styles.card} // Mantenha o estilo do card
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
    scrollContainer: {
        padding: 10,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
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
        color: '#333',
        marginBottom: 4,  // Espaçamento entre o nome e o tipo de serviço
    },
    serviceType: {
        fontSize: 16,
        color: '#555',
    },
    schedulingTime: {
        fontSize: 22,  // Fonte maior para a hora
        color: '#333',
        textAlign: 'right',  // Alinha à direita
        fontWeight: 'bold',  // Destaca o horário
        alignSelf: 'center',  // Centraliza verticalmente
    },
});
