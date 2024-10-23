import React, { useRef, useState, useCallback, useMemo, useEffect } from "react"
import { View, Text, Pressable, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Input, Button, Select, } from '../../../../components';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from './schema';
import { useServiceDatabase } from '../../../../database/useServiceDatabase';
import { useEmployeesDatabase } from '../../../../database/useEmployeesDatabase';

export const Form = (props) => {

    const { onCallback, item } = props;

    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);

    const serviceDataBase = useServiceDatabase();
    const employeesDatabase = new useEmployeesDatabase();

    const { control, handleSubmit, setValue, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });

    const mountedOptions = (services) => {
        const options = services.map(service => {
            return {
                value: service.id,
                label: service.name
            };
        });
        setOptions(options);
    };
    const onGetService = useCallback(async () => {
        mountedOptions(await serviceDataBase.findAllOrderedByName());
    }, [])
    useEffect(() => {
        onGetService()
    }, []);

    useEffect(() => {
        if (!item) return;
        setValue('name', item.name);
        if (item?.affinity?.length > 0 && options?.length > 0) {
            const affinity = item.affinity.map(id => {
                return options?.find(option => option?.value === id);
            });
            setValue('serviceSelected', affinity);
        }
    }, [item, options]);

    const handleReset = () => {
        reset();
    };

    const onCreateService = async (data) => {
        setLoading(true);
        try {
            const employee = await employeesDatabase.create({
                name: data.name,
                active: 1,
                createAt: new Date().toISOString(),
            });
            if (employee?.employeeID && data?.serviceSelected?.length > 0) {
                const servicesIDs = data.serviceSelected.map(service => service.value);
                await employeesDatabase.addAffinity(employee.employeeID, servicesIDs);
            }
            Alert.alert('Colaborador adicionado com sucesso!');
            handleReset();
            onCallback();
        } catch (error) {
            Alert.alert('Erro ao adicionado colaborador!');
            console.log('error', error);
        } finally {
            setLoading(false);
        }
    };

    const onUpdateService = async (data) => {
        setLoading(true);
        try {
            await employeesDatabase.update({
                id: item.id,
                name: data.name,
                active: 1
            });
            await employeesDatabase.removeAffinity(item.id);
            if (data?.serviceSelected?.length > 0) {
                const servicesIDs = data.serviceSelected.map(service => service?.value);
                await employeesDatabase.addAffinity(item.id, servicesIDs);
            }   
            Alert.alert('Serviço atualizado com sucesso!');
            handleReset();
            onCallback();
        } catch (error) {
            Alert.alert('Erro ao atualizar serviço!');
            console.log('error', error);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = (data) => {
        if (item) return onUpdateService(data);
        onCreateService(data);
    };

    const isPreview = useMemo(() => {
        return item?.preview ? true : false;
    }, [item]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className='flex-1 flex-grow justify-between p-4'>
                <View>
                    <View className='bg-white rounded-xl pt-3 pl-4 pr-1 pb-3' pointerEvents={isPreview ?'none' :'auto'}>
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    placeholder='Nome'
                                    onBlur={onBlur}
                                    onChangeText={(text) => onChange(text.replace(/\s\s+/g, ' '))}
                                    value={value}
                                    errorMessages={errors.name?.message}
                                />
                            )}
                        />
                    </View>
                    {options.length > 0 &&
                        <View className='bg-white rounded-xl mt-3 pt-3 pl-4 pr-4 pb-3'>
                            <Controller
                                control={control}
                                name="serviceSelected"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Select
                                        label="Preferência"
                                        options={options}
                                        selectedValue={value}
                                        onSelect={selectedValue => {
                                            onChange(selectedValue);
                                        }}
                                        onBlur={onBlur}
                                        isPreview={isPreview}
                                    />
                                )}
                            />
                        </View>
                    }
                    {!isPreview &&
                        <View className='flex-row justify-start mt-5'>
                            <Pressable onPress={handleReset}>
                                <Text className='flex text-colorBase2 text-lg'>Limpar</Text>
                            </Pressable>
                        </View>
                    }
                </View>
                {!isPreview &&
                    <>
                        <View className='mb-3'>
                            <Button
                                label='Salvar'
                                onPress={handleSubmit(onSubmit)}
                            />
                        </View>
                    </>
                }
            </View>
        </TouchableWithoutFeedback>
    );
};
