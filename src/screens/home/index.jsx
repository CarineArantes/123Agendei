import React, { useRef, useState, useCallback, useEffect } from "react"
import { View, Text, Pressable, StyleSheet, Alert } from "react-native"
import { Option, ExpandableCalendarScreen } from "../../components"
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable"
import { useCostumerServiceDatabase } from '../../database/useCostumerServiceDatabase';
import {
    useConfig
} from '../../contexts/config';
import {
    cn
} from '../../lib/utils';

export function Home() {

    const { setItemSelected, reload } = useConfig();

    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
    const [items, setItems] = useState([]);
    const [time, setTime] = useState(null);

    useEffect(() => {
        const checkExpiredServices = () => {
            const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setTime(currentTime);
        };
        checkExpiredServices();
        const intervalId = setInterval(checkExpiredServices, 1000);
        return () => clearInterval(intervalId);
    }, [items]);


    const costumerServiceDatabase = useCostumerServiceDatabase();
    const onGetService = useCallback(async (selectedDate) => {
        setCurrentDate(selectedDate);
        const response = await costumerServiceDatabase.schedulingByDate(selectedDate);
        const formattedItems = response.reduce((acc, item) => {
            const date = item.schedulingDate;
            const hour = item.schedulingTime;
            const data = item
            const existingSection = acc.find(section => section.title === date);
            if (existingSection) {
                existingSection.data.push({ hour, data });
            } else {
                acc.push({
                    title: date,
                    data: [{ hour, data }]
                });
            }
            return acc;
        }, []);
        setItems(formattedItems);
    }, []);
    useFocusEffect(
        useCallback(() => {
            onGetService(currentDate);
        }, [reload])
    );

    const openSwipeableRef = useRef(null)

    const closePreviousSwipeable = (direction, open, itemID) => {
        if (direction === "left") {
            handleDelete(itemID)
        }
        if (openSwipeableRef.current && openSwipeableRef.current !== open) {
            openSwipeableRef.current.close()
        }
        openSwipeableRef.current = open
    };

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
                        onGetService(currentDate)
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

    const renderItem = ({ item }) => {
        return (
            <Swipeable
                ref={(swipeable) => (current = swipeable)}
                containerStyle={styles.swipeable}
                renderRightActions={() => (
                    <View style={styles.rightOptions}>
                        <Option
                            icon="edit"
                            backgroundColor={'#539DF3'}
                            onPress={() => handleEdit(item.data)}
                        />
                    </View>
                )}
                renderLeftActions={() => (
                    <View style={styles.leftOptions}>
                        <Option
                            icon="delete"
                            backgroundColor="#E83D55"
                        />
                    </View>
                )}
                onSwipeableWillOpen={(direction) =>
                    closePreviousSwipeable(direction, current, item.data.id)
                }
                overshootRight={false}
                leftThreshold={100}
                rightThreshold={10}
            >
                <Pressable
                    key={item.data.id}
                    className={cn("flex flex-row justify-between items-center pl-2 rounded-xl h-20 bg-white", (time >= item.data.schedulingTime && currentDate === new Date().toISOString().split('T')[0] ) ? "border border-red-400" : "")}
                    onPress={() => handlePreview(item.data)}
                >
                    <View className="flex-1 flex-row items-center">
                        <Text className="ml-2 text-2xl font-semibold text-colorBase">
                            {item.data.schedulingTime}
                        </Text>
                        <View className="pl-2.5">
                            <Text className="text-lg font-semibold">
                                {item.data.clientName}
                            </Text>
                            <Text className="text-sm mt-1 text-gray-400">
                                {item.data.serviceName
                                    ? item.data.serviceName
                                    : "Serviço não disponível"
                                }
                            </Text>
                        </View>
                    </View>
                </Pressable>
            </Swipeable>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-customGray">
            <View className="flex w-full p-3 flex-row justify-between">
                <Text className="text-3xl font-semibold text-black ">
                    Agendamentos
                </Text>
            </View>
            <ExpandableCalendarScreen
                items={items}
                renderItem={renderItem}
                onChangeDate={(date) => onGetService(date)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    swipeable: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        marginTop: 15,
    },
    content: {
        gap: 0,
    },
    rightOptions: {
        flexDirection: "row",
    },
    leftOptions: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#E83D55",
    }
})