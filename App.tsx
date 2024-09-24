import { config } from '@gluestack-ui/config';
import { Box, GluestackUIProvider, Text } from '@gluestack-ui/themed';
import { TabRoutersLayout } from '@app'
import { NavigationContainer } from '@react-navigation/native';


export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <NavigationContainer>
        <TabRoutersLayout />
      </NavigationContainer>
    </GluestackUIProvider>
  );
}