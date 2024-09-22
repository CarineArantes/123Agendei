import { StyleSheet, Text, View } from 'react-native';

export function CreateCustomerService() {
  return (
    <View style={styles.container}>
      <Text>Modal screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});