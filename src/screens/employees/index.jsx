import React, { useRef, useState, useCallback, useMemo } from "react"
import { View, Text, Pressable, FlatList, StyleSheet, Alert } from "react-native"
import { Input, Modal, Option, Avatar } from "../../components"
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { Form } from './component/Form'
import { useEmployeesDatabase } from '../../database/useEmployeesDatabase';
import { useFocusEffect } from '@react-navigation/native';
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable"

export function Employees() {

    const [data, setData] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const [itemSelected, setItemSelected] = useState(null)
    const [search, setSearch] = useState('')

    const openSwipeableRef = useRef(null)

    const employeeData = new useEmployeesDatabase();

    const onGet = useCallback(async () => {
        const response = await employeeData.findAllEmployeesWithServices()
        setData(response);
    }, [])
    useFocusEffect(
        useCallback(() => {
            onGet();
        }, [onGet])
    );
    const onCallback = () => {
        onGet()
        setOpenModal(false)
        setItemSelected(null)
    }

    const closePreviousSwipeable = (direction, open, itemID) => {
        if (direction === "left") {
            handleDelete(itemID)
        }
        if (openSwipeableRef.current && openSwipeableRef.current !== open) {
            openSwipeableRef.current.close()
        }
        openSwipeableRef.current = open
    }

    const handleOpenModal = () => {
        openSwipeableRef?.current?.close()
        setItemSelected(null)
        setOpenModal(true)
    };
    const handleDelete = async (id) => {
        Alert.alert(
            "Confirmar Exclusão",
            "Você realmente deseja excluir este colaborador?",
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
                        const result = await employeeData.remove(id);
                        if (result.status === 'success') {
                            onGet()
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };
    const handleEdit = (item) => {
        openSwipeableRef?.current?.close()
        setItemSelected(item)
        setOpenModal(true)
    };
    const handlePreview = (item) => {
        openSwipeableRef?.current?.close()
        setItemSelected({
            ...item,
            preview: true,
        });
        setOpenModal(true)
    };

    const renderItem = useMemo(() => {
        if (search === '') return data
        return data.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }, [search, data])

    const titleModal = () => {
        if (itemSelected) {
            return itemSelected.preview ? 'Colaborador' : 'Editar Colaborador'
        }
        return 'Novo Colaborador'
    }


    return (
        <>
            <SafeAreaView className="flex-1 p-3 bg-customGray">
                <View className="flex w-full flex-row justify-between">
                    <Text className="text-3xl font-semibold text-black ">
                        Colaboradores
                    </Text>
                    <Pressable
                        className="flex justify-end flex-row"
                    >
                        <Ionicons
                            name="add-circle"
                            size={40}
                            color="#C084FC"
                            onPress={handleOpenModal}
                        />
                    </Pressable>
                </View>
                <View className="bg-white rounded-xl p-2 mt-4 flex flex-row">
                    <Feather
                        style={{ marginRight: 5 }}
                        name="search"
                        size={24}
                        color="#C9C9CB"
                    />
                    <Input
                        placeholder="Buscar"
                        onChangeText={setSearch}
                        value={search}
                    />
                </View>
                {renderItem.length > 0
                    ? (<FlatList
                        data={renderItem}
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
                                                icon="edit"
                                                backgroundColor={'#539DF3'}
                                                onPress={() => handleEdit(item)}
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
                                        closePreviousSwipeable(direction, current, item.id)
                                    }
                                    overshootRight={false}
                                    leftThreshold={100}
                                    rightThreshold={10}
                                >
                                    <Pressable
                                        key={item.id}
                                        className="flex flex-row justify-between items-center pl-2 bg-white rounded-xl h-20"
                                        onPress={() => handlePreview(item)}
                                    >
                                        <View className="flex-1 flex-row items-center">
                                            <Avatar name={item.name} />
                                            <Text className="ml-2 text-lg font-semibold">{item.name}</Text>
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
                                Nenhum colaborador encontrado.
                            </Text>
                        </View>
                    )
                }
            </SafeAreaView>
            <Modal
                visible={openModal}
                onRequestClose={() => setOpenModal(false)}
                title={titleModal()}
            >
                <Form
                    onCallback={onCallback}
                    item={itemSelected}
                />
            </Modal>
        </>
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
    },
    leftOptions: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#E83D55",
    }
})