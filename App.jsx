import { SQLiteProvider } from "expo-sqlite"
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from './src/contexts';
import { Routes } from './src/routes';
import { initializeDatabase } from './src/database/initializeDatabase';
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler"

export default function App() {
  return (
    <SQLiteProvider databaseName="123Agendei.db" onInit={initializeDatabase}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppProvider>
          <Routes />
          <StatusBar style={'dark'} />
        </AppProvider>
      </GestureHandlerRootView>
    </SQLiteProvider>
  );
}
