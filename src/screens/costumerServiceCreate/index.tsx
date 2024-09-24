import { View, Button, StyleSheet, ScrollView } from 'react-native';
import { InputText, DatePicker, TimePicker } from '@components';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    FormSchema,
    Form,
    defaultFormValues
} from './schema';
import {
    useCostumerServiceDatabase,
    CostumerServiceDatabase
} from '../../database/useProductDatabase';

export function CostumerServiceCreate() {
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<Form>({
        resolver: zodResolver(FormSchema),
        defaultValues: defaultFormValues
    });


    const onSubmit = (data: Form) => {
        // create(data);
    };

    async function create(data: Form) {
        const costumerServiceDatabase = useCostumerServiceDatabase()
        try {
            const response = await costumerServiceDatabase.create({
                clientName: data.clientName,
                clientPhone: data.clientPhone,
                schedulingDate: data.schedulingDate,
                schedulingTime: data.schedulingTime,
                serviceType: data.serviceType
            })
            if (response?.status === 'success') {
                console.log('Cadastro realizado com sucesso')
            }
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.form}>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <InputText
                            style={styles.input} // Adicionando estilo
                            placeholder="Nome do cliente"
                            errorMessage={errors.clientName?.message ?? ''}
                            onChangeText={onChange} // Atualiza o valor do campo
                            onBlur={onBlur}
                            legend=' '
                            value={value} // Mantém o valor controlado
                        />
                    )}
                    name="clientName"
                />
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <InputText
                            style={styles.input} // Adicionando estilo
                            placeholder="Telefone do cliente"
                            errorMessage={errors.clientPhone?.message ?? ''}
                            legend=' '
                            onChangeText={onChange} // Atualiza o valor do campo
                            onBlur={onBlur}
                            value={value} // Mantém o valor controlado
                        />
                    )}
                    name="clientPhone"
                />
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <DatePicker
                            placeholder="Data"
                            errorMessage={errors.schedulingDate?.message ?? ''}
                            legend=' '
                            value={value || ''} // Passa o valor atual ou uma string vazia
                            onChangeText={(text: string) => {
                                onChange(text); // Atualiza o valor do campo
                            }}
                        />
                    )}
                    name="schedulingDate"
                />
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TimePicker
                            placeholder="Hora"
                            errorMessage={errors.schedulingTime?.message ?? ''}
                            legend=' '
                            value={value || ''} // Passa o valor atual ou uma string vazia
                            onChangeText={(text: string) => {
                                onChange(text); // Atualiza o valor do campo
                            }}
                        />
                    )}
                    name="schedulingTime"
                />
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <InputText
                            style={styles.input} // Adicionando estilo
                            placeholder="Tipo de serviço"
                            errorMessage={errors.serviceType?.message ?? ''}
                            legend=' '
                            onChangeText={onChange} // Atualiza o valor do campo
                            onBlur={onBlur}
                            value={value} // Mantém o valor controlado
                        />
                    )}
                    name="serviceType"
                />
                <Button title="Submit" onPress={handleSubmit(onSubmit)} />
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
});
