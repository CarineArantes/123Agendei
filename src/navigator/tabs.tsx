import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Modal } from '../components';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Screens from '../screens';
import FontAwesome from '@expo/vector-icons/FontAwesome';

enum ScreensKeys {
  Home = 'Atendimentos',
  Create = 'Criar Atendimento',
}

const TabComponent = createBottomTabNavigator();

export function Tabs() {

  const [isModalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
    <>
      <TabComponent.Navigator
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
        <TabComponent.Screen
          name={ScreensKeys.Home}
          component={Screens.Home}
          options={{
            tabBarButton: () => null, // Oculta a aba da Home
          }}
        />
        <TabComponent.Screen
          name={ScreensKeys.Create}
          component={View} // Componente vazio
          options={{
            tabBarButton: (props) => (
              // Abre o modal quando clicar na aba
              <TouchableOpacity
                {...props}
                onPress={openModal}
                style={styles.TabCreateCustomerService}
              >
                <FontAwesome name="calendar-plus-o" size={24} color="#539DF3" />
              </TouchableOpacity>
            )
          }}
        />
      </TabComponent.Navigator>
      <Modal
        visible={isModalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <Screens.CreateCustomerService />
      </Modal>
    </>
  )
};

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