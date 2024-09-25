import { View, Button, ScrollView, TouchableOpacity, Text, Alert } from 'react-native';
import { InputText, DatePicker, TimePicker } from '@components';
import { StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormSchema, Form, defaultFormValues } from './schema';
import { useCostumerServiceDatabase, CostumerServiceDatabase } from '../../database/useCostumerServiceDatabase';
import ToastManager, { Toast } from 'toastify-react-native';
import { Dimensions } from 'react-native';
import { useEffect, useMemo, useState } from 'react';

export function CostumerServiceCreate(props:
    {
        callback: () => void,
        costumerService: CostumerServiceDatabase | null
    }
) {
    const { callback, costumerService } = props;
    const { width } = Dimensions.get('window');
    const costumerServiceDatabase = useCostumerServiceDatabase();

    const [inProcess, setInProcess] = useState(false);
    const [alowEdit, setAlowEditEdit] = useState(false);
    const isEditing = useMemo(() => costumerService !== null, [costumerService]);

    const formattedDate = (date: string | undefined) => {
        if (!date) {
            return '';
        }
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    }

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<Form>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            ...costumerService,
            schedulingDate: formattedDate(costumerService?.schedulingDate) ?? defaultFormValues.schedulingDate,
        } ?? defaultFormValues
    });



    async function handleRemove() {
        if (!costumerService) {
            return;
        }

        Alert.alert(
            "Confirmar remoção",
            "Você tem certeza que deseja remover este atendimento?",
            [
                {
                    text: "Não",
                    onPress: () => console.log("Remoção cancelada"),
                    style: "cancel"
                },
                {
                    text: "Sim",
                    onPress: async () => {
                        onRemove();
                    }
                }
            ],
            { cancelable: false }
        );
    }


    const onSubmit = (data: Form) => {
        if (isEditing) {
            update(data);
            return;
        }
        create(data);
    };
    async function create(data: Form) {
        setInProcess(true);
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
                    setInProcess(false);
                }, 2500);
                return;
            }
            Toast.error(response.message, 'top');
            setInProcess(false);
        } catch (error) {
            console.log(error);
        }
    }
    async function update(data: Form) {
        if (!costumerService) {
            return
        }
        try {
            setInProcess(true);
            const response = await costumerServiceDatabase.update({
                id: costumerService?.id,
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
                    setInProcess(false);
                }, 2500);
                return;
            }
            Toast.error(response.message, 'top');
            setInProcess(false);
        } catch (error) {
            console.log(error);
        }
    }
    async function onRemove() {
        if (!costumerService) {
            return
        }
        try {
            setInProcess(true);
            const response = await costumerServiceDatabase.remove(costumerService.id);
            if (response?.status === 'success') {
                Toast.success(response.message, 'top');
                setTimeout(() => {
                    callback();
                    setInProcess(false);
                }, 2500);
                return;
            }
            Toast.error(response.message, 'top');
            setInProcess(false);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleCancelEdit() {
        setAlowEditEdit(false);
        reset({
            ...costumerService,
            schedulingDate: formattedDate(costumerService?.schedulingDate) ?? defaultFormValues.schedulingDate,
        });
    }

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            style={{ opacity: inProcess ? 0.5 : 1 }}
            pointerEvents={inProcess ? 'none' : 'auto'}
        >

            <ToastManager
                position="top"
                width={width - 30}
            />
            <View style={styles.form} pointerEvents={inProcess ? 'none' : 'auto'}>
                <View pointerEvents={!alowEdit && isEditing ? 'none' : 'auto'} style={{ opacity: !alowEdit && isEditing ? 0.5 : 1 }}>
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

                </View>
                {isEditing && !alowEdit
                    ? (
                        <>
                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={() => setAlowEditEdit(true)}
                            >
                                <Text style={styles.buttonText}>Editar Atendimento</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={() => handleRemove()}
                            >
                                <Text style={styles.buttonText}>Excluir</Text>
                            </TouchableOpacity>
                        </>

                    )
                    : (
                        <>
                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
                                <Text style={styles.buttonText}>
                                    {isEditing ? 'Atualizar' : 'Cadastrar'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.simpleButton]}
                                onPress={() => {
                                    if (isEditing) {
                                        handleCancelEdit();
                                        return;
                                    }
                                    reset();
                                }}
                            >
                                <Text style={styles.simpleButtonText}>
                                    {isEditing ? 'Cancelar' : 'Limpar'}
                                </Text>
                            </TouchableOpacity>
                        </>
                    )
                }
            </View>
        </ScrollView >
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