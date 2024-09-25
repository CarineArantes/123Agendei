import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home } from './home';
import { CostumerServiceCreate } from '@screens';
import { Modal } from '@components';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useConfig } from '../../contexts/config';

enum ScreensKeys {
    Home = 'Atendimentos',
    Create = 'Criar Atendimento',
}

const Tab = createBottomTabNavigator();


export function TabRoutersLayout() {

    const {
        onReloadCostumerServiceList,
        costumerServiceSelected,
        setCostumerServiceSelected
    } = useConfig();

    const [isModalVisible, setModalVisible] = useState(false);

    const openModal = () => { 
        setCostumerServiceSelected(null);
        setModalVisible(true) 
    };
    const closeModal = () => { 
        setCostumerServiceSelected(null);
        setModalVisible(false)
     };

    useEffect(() => {
        onReloadCostumerServiceList();
    }, []);

    useEffect(() => {
        if (costumerServiceSelected) {
            setModalVisible(true)
        }
    }, [costumerServiceSelected]);

    return (
        <>
            <Tab.Navigator
                initialRouteName={ScreensKeys.Home} // Definindo Home como rota inicial
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: '#C084FC',
                        borderTopWidth: 0,
                        elevation: 0,
                        alignItems: 'center',
                    }
                }}
            >
                <Tab.Screen
                    name={ScreensKeys.Home}
                    component={Home}
                    options={{
                        tabBarButton: () => null, // Oculta a aba da Home
                    }}
                />
                <Tab.Screen
                    name={ScreensKeys.Create}
                    component={View} // Componente vazio
                    options={{
                        tabBarButton: (props) => (
                            // Abre o modal quando clicar na aba
                            <TouchableOpacity
                                {...props}
                                onPress={openModal}
                                style={styles.TabCreateCustomerService}
                                activeOpacity={1}
                            >
                                <FontAwesome
                                    name="calendar-plus-o"
                                    size={24}
                                    color="#539DF3"
                                />
                            </TouchableOpacity>
                        )
                    }}
                />
            </Tab.Navigator>


            <Modal
                visible={isModalVisible}
                transparent={false}
                animationType="slide"
                onRequestClose={closeModal}
            >
                <CostumerServiceCreate
                    costumerService={costumerServiceSelected}
                    callback={() => {
                        onReloadCostumerServiceList();
                        closeModal();
                    }}
                />
            </Modal>
        </>

    )
}

const styles = StyleSheet.create({
    TabCreateCustomerService: {
        top: -30,
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        backgroundColor: '#ffffff',
    }
})