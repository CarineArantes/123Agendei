import { SQLiteProvider } from "expo-sqlite"
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from './src/contexts';
import { Routes } from './src/routes';
import { initializeDatabase } from './src/database/initializeDatabase';
import { Platform } from "react-native";

export default function App() {
  return (
    <SQLiteProvider databaseName="123Agendei.db" onInit={initializeDatabase}>
      <AppProvider>
        <Routes />
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </AppProvider>
    </SQLiteProvider>
  );
}
