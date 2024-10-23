import { Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { Modal } from '../components';
import {
    Home,
    CostumerService,
    CreateCostumerService,
    Services,
    Employees
} from '../screens';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useConfig } from '../contexts/config';

const Tab = createBottomTabNavigator();

export function TabRoutes() {

    const { itemSelected, handleModalVisible, modalVisible } = useConfig();

    const titleModal = useMemo(() => {
        const refName = itemSelected?.servedAt ? 'Atendimento' : 'Agendamento';
        if (itemSelected) {
            return itemSelected?.preview ? refName : `Editar ${refName}`
        }
        return `Novo ${refName}`
    }, [itemSelected])

    return (
        <>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: '#C084FC',
                        height: 60,
                        paddingBottom: 10,
                    },
                    tabBarItemStyle: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                    tabBarIconStyle: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={Home}
                    options={{
                        tabBarLabel: '',
                        tabBarIcon: ({ size }) => (
                            <FontAwesome5
                                name="home"
                                color={'#ffffff'}
                                size={size}
                            />
                        )
                    }}
                />
                <Tab.Screen
                    name="CostumerService"
                    component={CostumerService}
                    options={{
                        tabBarLabel: '',
                        tabBarIcon: ({ size }) => (
                            <View>
                                <FontAwesome5
                                    name="headset"
                                    color={'#ffffff'}
                                    size={size}
                                />
                            </View>
                        )
                    }}
                />

                <Tab.Screen
                    name='CreateCostumerService'
                    component={CreateCostumerService}
                    options={{
                        tabBarLabel: '',
                        tabBarIcon: ({ size }) => (
                            <Pressable
                                className=" bg-white  w-14 h-14 -top-2 justify-center items-center rounded-full"
                                onPress={() => handleModalVisible(true)}
                            >
                                <FontAwesome5
                                    name="calendar-plus"
                                    color={'#539DF3'}
                                    size={size}
                                />
                            </Pressable>
                        )
                    }}
                />
                <Tab.Screen
                    name="Services"
                    component={Services}
                    options={{
                        tabBarLabel: '',
                        tabBarIcon: ({ size }) => (
                            <FontAwesome5
                                name="toolbox"
                                color={'#ffffff'}
                                size={size}
                            />
                        )
                    }}
                />
                <Tab.Screen
                    name="Employees"
                    component={Employees}
                    options={{
                        tabBarLabel: '',
                        tabBarIcon: ({ size }) => (
                            <FontAwesome5
                                name="users"
                                color={'#ffffff'}
                                size={size}
                            />
                        )
                    }}
                />
            </Tab.Navigator>
            <Modal
                title={titleModal}
                visible={modalVisible}
                transparent={false}
                animationType="slide"
                onRequestClose={() => handleModalVisible(false)}
            >
                {modalVisible &&
                    <CreateCostumerService
                        item={itemSelected}
                    />
                }
            </Modal>
        </>
    );
}