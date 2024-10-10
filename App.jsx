import { SQLiteProvider } from "expo-sqlite"
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from './src/contexts';
import { Routes } from './src/routes';
import { initializeDatabase } from './src/database/initializeDatabase';

export default function App() {
  return (
    <SQLiteProvider databaseName="123Agendei.db" onInit={initializeDatabase}>
      <AppProvider>
        <Routes />
        <StatusBar style="auto" />
      </AppProvider>
    </SQLiteProvider>
  );
}
