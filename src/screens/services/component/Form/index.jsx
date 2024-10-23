import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, Pressable, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Input, Button } from '../../../../components';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from './schema';
import { useServiceDatabase } from '../../../../database/useServiceDatabase';

export const Form = (props) => {
    const { onCallback, item } = props;
    const [loading, setLoading] = useState(false);
    const serviceDataBase = useServiceDatabase();

    const { control, handleSubmit, setValue, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (!item) return;
        setValue('name', item.name);
        setValue('description', item.description);
        setValue('favorite', item.favorite === 1 ? true : false);
    }, [item]);

    const handleReset = () => {
        reset();
    };

    const onCreateService = async (data) => {
        setLoading(true);
        try {
            await serviceDataBase.create({
                name: data.name,
                description: data.description,
                favorite: data.favorite ? 1 : 0,
                active: 1,
                createAt: new Date().toISOString(),
            });
            Alert.alert('Serviço criado com sucesso!');
            handleReset();
            onCallback();
        } catch (error) {
            Alert.alert('Erro ao criar serviço!');
            console.log('error', error);
        } finally {
            setLoading(false);
        }
    };

    const onUpdateService = async (data) => {
        setLoading(true);
        try {
            await serviceDataBase.update({
                id: item.id,
                name: data.name,
                description: data.description,
                favorite: data.favorite ? 1 : 0,
                active: 1,
            });
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
                <View pointerEvents={isPreview ? 'none' : 'auto'}>
                    <View className='bg-white rounded-xl pt-3 pl-4 pr-1 pb-3'>
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
                        <View className='w-full h-0.5 bg-customGray2 mt-2 mb-2' />
                        <Controller
                            control={control}
                            name="description"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    placeholder='Descrição...'
                                    numberOfLines={4}
                                    multiline={true}
                                    onBlur={onBlur}
                                    onChangeText={(text) => onChange(text)}
                                    value={value}
                                    errorMessages={errors.description?.message}
                                />
                            )}
                        />
                    </View>
                    <View className='mt-3'>
                        <View className='flex-row justify-between bg-white rounded-xl p-3 items-center'>
                            <Text className='text-lg'>Adicionar aos favoritos</Text>
                            <Controller
                                control={control}
                                name="favorite"
                                render={({ field: { onChange, value } }) => (
                                    <Pressable onPress={() => onChange(!value)}>
                                        <AntDesign
                                            name={value ? "star" : "staro"}
                                            size={30}
                                            color="#C084FC"
                                        />
                                    </Pressable>
                                )}
                            />
                        </View>
                    </View>
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
