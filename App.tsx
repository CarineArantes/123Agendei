import { config } from '@gluestack-ui/config';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { TabRoutersLayout } from '@app'
import { NavigationContainer } from '@react-navigation/native';
import { SQLiteProvider } from "expo-sqlite"
import { initializeDatabase } from './src/database/initializeDatabase';
import {
  ConfigProvider
} from './src/contexts'

export default function App() {
  return (
    <SQLiteProvider databaseName="123Agendei.db" onInit={initializeDatabase}>
      <ConfigProvider>
        <GluestackUIProvider config={config}>
          <NavigationContainer>
            <TabRoutersLayout />
          </NavigationContainer>
        </GluestackUIProvider>
      </ConfigProvider>
    </SQLiteProvider>
  );
}