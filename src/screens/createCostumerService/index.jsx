import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, Pressable, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Input, Button, InputMask, Calendars, TimePicker, ShowModal, List } from '../../components';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from './schema';
import { useServiceDatabase } from '../../database/useServiceDatabase';
import { useEmployeesDatabase } from '../../database/useEmployeesDatabase';
import { useCostumerServiceDatabase } from '../../database/useCostumerServiceDatabase';
import { Format } from '../../utils/format';
import AntDesign from '@expo/vector-icons/AntDesign';
import { cn } from '../../lib';
import { format } from 'date-fns';
import { useConfig } from '../../contexts/config';

export const CreateCostumerService = (props) => {

    const { item } = props;
    const { onReload } = useConfig();

    const refName = useMemo(() => {
        return item?.servedAt ? 'Atendimento' : 'Agendamento';
    }, [item])

    const [loading, setLoading] = useState(false);
    const [optionsEmployees, setOptionsEmployees] = useState([]);
    const [optionsServices, setOptionsServices] = useState([]);

    const serviceDataBase = useServiceDatabase();
    const employeesDataBase = useEmployeesDatabase();
    const costumerServiceDatabase = useCostumerServiceDatabase();


    const { control, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });

    const schedulingDate = watch("schedulingDate");
    const serviceId = watch("serviceId");


    const mountedOptions = (data) => {
        const options = data.map(service => {
            return {
                value: service.id,
                label: service.name
            };
        });
        return options
    };
    const onGetOptions = useCallback(async () => {
        const [resp1, resp2] = await Promise.all([
            serviceDataBase.findAllOrderedByName(),
            employeesDataBase.findAllEmployeesWithServices()
        ]);
        setOptionsServices(mountedOptions(resp1))
        setOptionsEmployees(resp2)
    }, [])
    useEffect(() => {
        onGetOptions();
    }, [])

    const onSetValues = useCallback((dataItem) => {
        setValue('clientName', dataItem.clientName);
        setValue('clientPhone', dataItem.clientPhone);
        setValue('schedulingDate', dataItem.schedulingDate);
        setValue('schedulingTime', dataItem.schedulingTime);
        if (dataItem.serviceName) setValue('serviceId', dataItem.serviceId);
        if (dataItem.employeeName) setValue('employeeId', dataItem.employeeId);
    }, [])
    useEffect(() => {
        if (!item) {
            handleReset();
            return;
        }
        onSetValues(item)
    }, [item]);

    const handleReset = () => {
        const today = new Date();
        reset({
            schedulingDate: format(today, 'yyyy-MM-dd'),
            schedulingTime: today
        });
    };

    const onVerification = async (data) => {
        const rep = await costumerServiceDatabase.verificationDateAndTime(
            data.schedulingDate,
            data.schedulingTime,
            item?.id ?? 0
        );
        return rep;
    }
    const handleStart = async () => {
        setLoading(true);
        try {
            await costumerServiceDatabase.startCostumerService(item.id);
            Alert.alert('Atendimento Iniciado com sucesso!');
            handleReset();
            onReload();
        } catch (error) {
            Alert.alert('Erro ao iniciar Atendimento!');
            console.log('error', error);
        } finally {
            setLoading(false);
        }
    }
    const onCreateService = async (data) => {
        setLoading(true);
        try {
            await costumerServiceDatabase.create(data);
            Alert.alert(`${refName} criado com sucesso!`);
            handleReset();
            onReload();
        } catch (error) {
            Alert.alert(`Erro ao criar ${refName} serviço!`);
            console.log('error', error);
        } finally {
            setLoading(false);
        }
    };
    const onUpdateService = async (data) => {
        setLoading(true);
        try {
            await costumerServiceDatabase.update(data, item.id);
            Alert.alert(`${refName} atualizado com sucesso!`);
            handleReset();
            onReload();
        } catch (error) {
            Alert.alert(`Erro ao atualizar ${refName}!`);
            console.log('error', error);
        } finally {
            setLoading(false);
        }
    };
    const onSave = (data) => {
        if (item) return onUpdateService(data);
        onCreateService(data);
    }
    const onSubmit = async(data) => {
        if (!item?.servedAt) {
            const verification = await onVerification(data);
            if (!verification) {
                Alert.alert(
                    "Atenção",
                    "Já existe um agendamento para este horário, deseja continuar ?",
                    [
                        {
                            text: "Não",
                            style: "cancel",
                            onPress: async () => { 
                            }
                        },
                        {
                            text: "Sim",
                            onPress: async () => {
                                onSave(data)
                            }
                        }
                    ],
                    { cancelable: false }
                );
                return;
            }
            onSave(data)
            return;
        } else {
            onSave(data)
        }
    };


    const isPreview = useMemo(() => {
        return item?.preview ? true : false;
    }, [item]);

    const customOptionsEmployee = useMemo(() => {
        const sorted = [...optionsEmployees].sort((a, b) => {
            const hasAffinityA = a.affinity.includes(serviceId) ? 0 : 1;
            const hasAffinityB = b.affinity.includes(serviceId) ? 0 : 1;
            return hasAffinityA - hasAffinityB;
        });
        return mountedOptions(sorted)
    }, [serviceId, optionsEmployees])

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className='flex-1 flex-grow justify-between p-4'>
                <View pointerEvents={isPreview ? 'none' : 'auto'}>
                    <View className='bg-white rounded-xl pt-3 pl-4 pr-1 pb-3'>
                        <Controller
                            control={control}
                            name="clientName"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    placeholder='Nome do Cliente'
                                    onBlur={onBlur}
                                    onChangeText={(text) => onChange(text.replace(/\s\s+/g, ' '))}
                                    value={value}
                                    errorMessages={errors.clientName?.message}
                                />
                            )}
                        />
                        <View className='w-full h-0.5 bg-customGray2 mt-2 mb-2' />
                        <Controller
                            control={control}
                            name="clientPhone"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <InputMask
                                    mask={'(99) 99999-9999'}
                                    placeholder="Telefone do cliente"
                                    errorMessages={errors.clientPhone?.message}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                />
                            )}
                        />
                    </View>
                    <View className='bg-white rounded-xl mt-3 pt-2 pl-4 pr-1 pb-2'>
                        <View className='flex-row items-center justify-between'>
                            <Text className='text-lg'>Data e Hora</Text>
                            <View className='flex-row justify-between mr-1'>
                                <ShowModal elemment={
                                    <View className='flex-row items-center rounded-lg bg-customGray3 pt-1.5 pb-1.5 pl-2 pr-2 mr-1'>
                                        <Text className={cn('text-base')}>
                                            {Format.date(schedulingDate ?? '', 'pt-br')}
                                        </Text>
                                    </View>
                                }>
                                    <Controller
                                        control={control}
                                        name="schedulingDate"
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <Calendars
                                                onCalendarPress={({ dateString }) => {
                                                    onChange(dateString);
                                                }}
                                                value={value}
                                                onBlur={onBlur}
                                                errorMessages={errors.schedulingDate?.message}
                                            />
                                        )}
                                    />
                                </ShowModal>
                                <Controller
                                    control={control}
                                    name="schedulingTime"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TimePicker
                                            value={value}
                                            onChangeText={(newValue) => {
                                                onChange(newValue);
                                            }}
                                            onBlur={onBlur}
                                            errorMessages={errors.schedulingTime?.message}
                                        />
                                    )}
                                />
                            </View>
                        </View>
                    </View>
                    <View className='bg-white rounded-xl mt-3 pt-2 pl-4 pr-1 pb-2'>
                        <View className={`flex-row items-center ${optionsServices?.length === 0 ? ' opacity-50' : ''}`} pointerEvents={optionsServices?.length === 0 ? 'none' : 'auto'}>
                            <Text className='text-lg'>Tipo de Serviço</Text>
                            <Controller
                                control={control}
                                name="serviceId"
                                render={({ field: { onChange, value } }) => (
                                    <List
                                        selectedValue={value}
                                        onSelect={onChange}
                                        options={optionsServices}
                                        placeholder='Selecionar'
                                        defaultLabel={'Serviço não disponível'}
                                    />
                                )}
                            />
                        </View>
                        {errors.serviceId?.message &&
                            <View className="flex-row gap-1 mt-1">
                                <AntDesign name="exclamationcircleo" size={15} color="#dc2626" />
                                <Text className="text-red-600">{errors.serviceId?.message}</Text>
                            </View>
                        }
                    </View>
                    <View className='bg-white rounded-xl mt-3 pt-2 pl-4 pr-1 pb-2'>
                        <View className={`flex-row items-center ${(!serviceId && customOptionsEmployee?.length === 0) ? ' opacity-50' : ''}`} pointerEvents={(!serviceId && customOptionsEmployee?.length === 0) ? 'none' : 'auto'}>
                            <Text className='text-lg'>Colaborador</Text>
                            <Controller
                                control={control}
                                name="employeeId"
                                render={({ field: { onChange, value } }) => (
                                    <List
                                        selectedValue={value}
                                        onSelect={onChange}
                                        options={customOptionsEmployee}
                                        placeholder='Selecionar'
                                        defaultLabel={'Colaborador não disponível'}
                                    />
                                )}
                            />
                        </View>
                        {errors.employeeId?.message &&
                            <View className="flex-row gap-1 mt-1">
                                <AntDesign name="exclamationcircleo" size={15} color="#dc2626" />
                                <Text className="text-red-600">{errors.employeeId?.message}</Text>
                            </View>
                        }
                    </View>
                    {!isPreview &&
                        <View className='flex-row justify-start mt-5'>
                            <Pressable onPress={handleReset}>
                                <Text className='flex text-colorBase2 text-lg'>Limpar</Text>
                            </Pressable>
                        </View>
                    }
                </View>
                {!isPreview
                    ? <View className='mb-3'>
                        <Button
                            label={item ? `Atualizar ${refName}` : `Criar ${refName}`}
                            onPress={handleSubmit(onSubmit)}
                        />
                    </View>
                    : <>
                        {!item.servedAt &&
                            <View className='mb-3'>
                                <Button
                                    label={'Iniciar Atendimento'}
                                    onPress={() => handleStart()}
                                />
                            </View>
                        }
                    </>
                }
            </View>
        </TouchableWithoutFeedback >
    );
};
