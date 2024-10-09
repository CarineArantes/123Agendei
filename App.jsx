import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { Routes } from './src/routes';

export default function App() {
  return (
    <View className=" bg-red-400 flex-1 text-center justify-center">
      <Routes />
      <StatusBar style="auto" />
    </View>
  );
}
