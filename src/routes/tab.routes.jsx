import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
    Home,
    CostumerService,
    CreateCostumerService,
    Services,
    Employees
} from '../screens';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();

export function TabRoutes() {

    return (
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
                        <View>
                            <FontAwesome5
                                name="home"
                                color={'#ffffff'}
                                size={size}
                            />
                        </View>
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
                        <View className=" bg-white  w-14 h-14 -top-2 justify-center items-center rounded-full" >
                            <FontAwesome5
                                name="calendar-plus"
                                color={'#539DF3'}
                                size={size}
                            />
                        </View>
                    )
                }}
            />
            <Tab.Screen
                name="Services"
                component={Services}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ size }) => (
                        <View>
                            <FontAwesome5
                                name="toolbox"
                                color={'#ffffff'}
                                size={size}
                            />
                        </View>
                    )
                }}
            />
            <Tab.Screen
                name="Employees"
                component={Employees}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ size }) => (
                        <View>
                            <FontAwesome5
                                name="users"
                                color={'#ffffff'}
                                size={size}
                            />
                        </View>
                    )
                }}
            />
        </Tab.Navigator>
    );
}