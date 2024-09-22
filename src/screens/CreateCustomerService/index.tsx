import { SafeAreaView, StyleSheet, Text } from 'react-native';

export function CreateCustomerService() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Modal screen</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});