/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Button,
  TextInput,
  StyleSheet,
} from 'react-native';

import {
  useJellyfishClient,
  useRoomParticipants,
} from '@jellyfish-dev/react-native-client-sdk';
console.log('APP 1 ', useRoomParticipants);

import {Room} from './src/Room';
console.log('APP 2 ', useRoomParticipants);
import {JELLYFISH_URL} from '@env';

function App(): JSX.Element {
  const {connect, cleanUp} = useJellyfishClient();
  const [isConnected, setIsConnected] = useState(false);
  const [peerToken, onChangePeerToken] = React.useState('Peer token');
  const part = useRoomParticipants();

  const connectToRoom = () => {
    connect(JELLYFISH_URL, peerToken);
    setIsConnected(true);
    console.log('app', part);
  };

  const disconnect = async () => {
    cleanUp();
    setIsConnected(false);
  };

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <TextInput
          style={styles.input}
          onChangeText={onChangePeerToken}
          value={peerToken}
        />
        {isConnected ? (
          <Button title="Disconnect" onPress={disconnect} />
        ) : (
          <Button title="Connect" onPress={connectToRoom} />
        )}

        {isConnected && <Room />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    alignSelf: 'center',
    width: 200,
    height: 50,
    borderWidth: 1,
  },
});

export default App;
