import { NavigationContainer } from '@react-navigation/native';
import { Tabs } from './tabs';

export function AppNavigator() {

  return (
    <NavigationContainer>
      <Tabs />
    </NavigationContainer>
  );
}