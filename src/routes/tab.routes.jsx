import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
    Home,
    CostumerService,
    Services,
    Employees
} from '../screens';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const Tab = createBottomTabNavigator();

export function TabRoutes() {

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#C084FC',
                    alignItems: 'center',
                    justifyContent: 'center', // Centraliza os ícones verticalmente
                    height: 60, // Aumenta a altura para dar mais espaço
                },
                tabBarIconStyle: {
                    justifyContent: 'center', // Centraliza o ícone horizontalmente
                    alignItems: 'center', // Centraliza o ícone horizontalmente
                }
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarLabel: '', // Oculta o nome da aba
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name="home" color={color} size={size} />
                    )
                }}
            />
            <Tab.Screen
                name="CostumerService"
                component={CostumerService}
                options={{
                    tabBarLabel: '', // Oculta o nome da aba
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name="headset" color={color} size={size} />
                    )
                }}
            />
            <Tab.Screen
                name="Services"
                component={Services}
                options={{
                    tabBarLabel: '', // Oculta o nome da aba
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name="toolbox" color={color} size={size} />
                    )
                }}
            />
            <Tab.Screen
                name="Employees"
                component={Employees}
                options={{
                    tabBarLabel: '', // Oculta o nome da aba
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name="users" color={color} size={size} />
                    )
                }}
            />
        </Tab.Navigator>
    );
}
