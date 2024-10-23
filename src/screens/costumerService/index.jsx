import React, { useRef, useState, useCallback, useEffect } from "react"
import { View, Text, Pressable, FlatList, StyleSheet, Alert } from "react-native"
import { Option, ShowModal, Calendars } from "../../components"
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useCostumerServiceDatabase } from '../../database/useCostumerServiceDatabase';
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable"
import { Format } from '../../utils/format'
import { useFocusEffect } from '@react-navigation/native';
import {
    useConfig
} from '../../contexts/config';
import AntDesign from '@expo/vector-icons/AntDesign';

export function CostumerService() {

    const { setItemSelected, reload } = useConfig();

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [data, setData] = useState([])

    const openSwipeableRef = useRef(null)

    const costumerServiceDatabase = new useCostumerServiceDatabase();
    const onGetService = useCallback(async (date) => {
        const response = await costumerServiceDatabase.costumerServiceByDate(date)
        setData(response);
    }, [])
    useFocusEffect(
        useCallback(() => {
            if (!selectedDate) return
            onGetService(selectedDate);
        }, [selectedDate, reload])
    );

    const closePreviousSwipeable = (direction, open, itemID) => {
        if (direction === "left") {
            handleDelete(itemID)
        }
        if (openSwipeableRef.current && openSwipeableRef.current !== open) {
            openSwipeableRef.current.close()
        }
        openSwipeableRef.current = open
    }


    const handleDelete = async (id) => {
        Alert.alert(
            "Confirmar Exclusão",
            "Deseja realmente excluir este atendimento ?",
            [
                {
                    text: "Não",
                    style: "cancel",
                    onPress: async () => {
                        if (openSwipeableRef.current) {
                            openSwipeableRef.current.close()
                        }
                    }
                },
                {
                    text: "Sim",
                    onPress: async () => {
                        await costumerServiceDatabase.remove(id)
                        onGetService(selectedDate)
                    }
                }
            ],
            { cancelable: false }
        );
    };
    const handleEdit = (item) => {
        openSwipeableRef?.current?.close()
        setItemSelected(item)
    };
    const handlePreview = (item) => {
        openSwipeableRef?.current?.close()
        setItemSelected({
            ...item,
            preview: true,
        });
    };


    return (
        <SafeAreaView className="flex-1 p-3 bg-customGray">
            <View className="flex w-full flex-row justify-between">
                <Text className="text-3xl font-semibold text-black ">
                    Atendimentos
                </Text>
            </View>
            <View className="bg-white rounded-xl p-2 mt-4 flex flex-row">
                <Feather
                    style={{ marginRight: 5 }}
                    name="search"
                    size={24}
                    color="#C9C9CB"
                />
                <ShowModal elemment={
                    <View className='flex-row pl-3 '>
                        <Text className='text-base'>
                            {Format.date(selectedDate ?? '', 'pt-br')}
                        </Text>
                    </View>
                }>
                    <Calendars
                        onCalendarPress={({ dateString }) => {
                            setSelectedDate(dateString)
                        }}
                        value={selectedDate}
                    />
                </ShowModal>
            </View>
            {data.length > 0
                ? (<FlatList
                    data={data}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        let current
                        return (
                            <Swipeable
                                ref={(swipeable) => (current = swipeable)}
                                containerStyle={styles.swipeable}
                                renderRightActions={() => (
                                    <View style={styles.rightOptions}>
                                        <Option
                                            className="h-24"
                                            icon="edit"
                                            backgroundColor={'#539DF3'}
                                            onPress={() => handleEdit(item)}
                                        />
                                    </View>
                                )}
                                renderLeftActions={() => (
                                    <View style={styles.leftOptions}>
                                        <Option
                                            className="h-24"
                                            icon="delete"
                                            backgroundColor="#E83D55"
                                        />
                                    </View>
                                )}
                                onSwipeableWillOpen={(direction) =>
                                    closePreviousSwipeable(direction, current, item.id)
                                }
                                overshootRight={false}
                                leftThreshold={100}
                                rightThreshold={10}
                            >
                                <Pressable
                                    key={item.id}
                                    className="flex flex-row justify-between items-center p-4 bg-white rounded-xl h-24"
                                    onPress={() => handlePreview(item)}
                                >
                                    <View className="flex-1 flex-row items-center">
                                        <Text className="ml-2 text-2xl font-semibold text-colorBase">
                                            {item.servedTime}
                                        </Text>
                                        <View className="pl-2.5">
                                            <Text className="text-lg font-semibold">
                                                {item.clientName}
                                            </Text>
                                            <Text className="text-sm mt-1 text-gray-400">
                                                {item.serviceName
                                                    ? item.serviceName
                                                    : "Serviço não disponível"
                                                }
                                            </Text>
                                            <View className="flex-row justify-center items-center mt-1">
                                                <AntDesign
                                                    name="calendar"
                                                    size={18}
                                                    color="#539DF3"
                                                />
                                                <Text className="text-sm pl-1 text-gray-400">
                                                    {Format.date(item?.schedulingDate, 'pt-br')} as {item.schedulingTime}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </Pressable>
                            </Swipeable>
                        )
                    }}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                />)
                : (
                    <View className=" flex-1 justify-center items-center">
                        <Text className=" font-light text-base text-neutral-800" >
                            Nenhum Atendimento encontrado.
                        </Text>
                    </View>
                )
            }
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    swipeable: {
        backgroundColor: "#ffffff",
        borderRadius: 12,
        marginTop: 15,
    },
    content: {
        gap: 0,
    },
    rightOptions: {
        flexDirection: "row",
        backgroundColor: "#539DF3"
    },
    leftOptions: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#E83D55",
    }
})