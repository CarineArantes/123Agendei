import { View, Button, ScrollView, TouchableOpacity, Text } from 'react-native';
import { InputText, DatePicker, TimePicker } from '@components';
import { StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormSchema, Form, defaultFormValues } from './schema';
import { useCostumerServiceDatabase } from '../../database/useCostumerServiceDatabase';
import ToastManager, { Toast } from 'toastify-react-native';
import { Dimensions } from 'react-native';

export function CostumerServiceCreate(props: { callback: () => void; }) {
    const { callback } = props;
    const { width } = Dimensions.get('window');
    const costumerServiceDatabase = useCostumerServiceDatabase();

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isValid }
    } = useForm<Form>({
        resolver: zodResolver(FormSchema),
        defaultValues: defaultFormValues
    });

    const onSubmit = (data: Form) => {
        create(data);
    };

    async function create(data: Form) {
        try {
            const response = await costumerServiceDatabase.create({
                clientName: data.clientName,
                clientPhone: data.clientPhone,
                schedulingDate: data.schedulingDate,
                schedulingTime: data.schedulingTime,
                serviceType: data.serviceType
            });
            if (response?.status === 'success') {
                Toast.success(response.message, 'top');
                setTimeout(() => {
                    callback();
                }, 2500);
                return;
            }
            Toast.error(response.message, 'top');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <ToastManager
                position="top"
                width={width - 30}
            />
            <View style={styles.form}>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <InputText
                            style={styles.input}
                            placeholder="Nome do cliente"
                            errorMessage={errors.clientName?.message ?? ''}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            legend=' '
                            value={value}
                        />
                    )}
                    name="clientName" />

                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <InputText
                            style={styles.input}
                            mask={'+55 (99) 99999-9999'}
                            placeholder="Telefone do cliente"
                            errorMessage={errors.clientPhone?.message ?? ''}
                            legend=' '
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                        />
                    )}
                    name="clientPhone" />

                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <DatePicker
                            placeholder="Data"
                            errorMessage={errors.schedulingDate?.message ?? ''}
                            legend=' '
                            value={value || ''}
                            onChangeText={(text: string) => {
                                onChange(text);
                            }} />
                    )}
                    name="schedulingDate" />

                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TimePicker
                            placeholder="Hora"
                            errorMessage={errors.schedulingTime?.message ?? ''}
                            legend=' '
                            value={value || ''}
                            onChangeText={(text: string) => {
                                onChange(text);
                            }} />
                    )}
                    name="schedulingTime" />

                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <InputText
                            style={styles.input}
                            placeholder="Tipo de serviço"
                            errorMessage={errors.serviceType?.message ?? ''}
                            legend=' '
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                        />
                    )}
                    name="serviceType" />

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
                    <Text style={styles.buttonText}>Enviar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.simpleButton]}
                    onPress={() => reset()}
                >
                    <Text style={styles.simpleButtonText}>Apagar Campos</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 16,
    },
    form: {
        flex: 1,
        alignItems: 'stretch',
    },
    input: {
        width: '100%',
        marginBottom: 16,
    },
    submitButton: {
        backgroundColor: '#007BFF', // Azul
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonText: {
        color: '#FFFFFF', // Texto branco
        fontWeight: 'bold',
    },
    simpleButton: {
        backgroundColor: '#FFFFFF', // Fundo branco
        borderColor: '#FFD700', // Cor da borda amarela
        borderWidth: 2, // Largura da borda
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    simpleButtonText: {
        color: '#FFD700', // Cor do texto amarelo
    }
});
