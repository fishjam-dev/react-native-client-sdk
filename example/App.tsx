/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  Button,
  TextInput,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  View,
} from 'react-native';

import {useJellyfishClient} from '@jellyfish-dev/react-native-client-sdk';

import {Room} from './src/Room';
import {JELLYFISH_URL} from '@env';

function App(): JSX.Element {
  const {connect, join, cleanUp} = useJellyfishClient();
  const [isConnected, setIsConnected] = useState(false);
  const [peerToken, onChangePeerToken] = React.useState('Peer token');

  useEffect(() => {
    async function request() {
      if (Platform.OS === 'ios') {
        return;
      }
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        if (
          granted[PermissionsAndroid.PERMISSIONS.CAMERA] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('You can use the camera');
        } else {
          console.log('Camera permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }

    request();
  }, []);

  const connectToRoom = async () => {
    await connect(JELLYFISH_URL, peerToken);
    setIsConnected(true);
    await join({name: 'RN mobile'});
  };

  const disconnect = async () => {
    cleanUp();
    setIsConnected(false);
  };

  return (
    <View style={styles.app}>
      {isConnected ? (
        <View style={[styles.button, styles.disconnectButton]}>
          <Button title="Disconnect" onPress={disconnect} />
        </View>
      ) : (
        <View style={styles.noCallBody}>
          <TextInput
            style={styles.input}
            onChangeText={onChangePeerToken}
            value={peerToken}
          />
          <View style={styles.button}>
            <Button title="Connect" onPress={connectToRoom} />
          </View>
        </View>
      )}

      {isConnected && (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <Room />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#BFE7F8',
  },
  noCallBody: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  input: {
    alignSelf: 'center',
    width: 200,
    height: 50,
    borderWidth: 1,
  },
  button: {
    alignSelf: 'center',
    width: 150,
    margin: 15,
  },
  disconnectButton: {
    marginTop: 30,
  },
});

export default App;
