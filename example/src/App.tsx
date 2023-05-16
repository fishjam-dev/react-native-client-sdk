import * as React from 'react';

import { StyleSheet, View, Button, TextInput, Text } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Room name</Text>
      <TextInput style={styles.input} />
      <Text>Username</Text>
      <TextInput style={styles.input} />
      <Button title="Connect" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: 150,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 30,
    margin: 20,
  },
});
