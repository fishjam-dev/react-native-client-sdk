import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  Button,
  TextInput,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  View,
  Permission,
  Text,
} from 'react-native';

import {
  useJellyfishClient,
  useCamera,
  VideoPreviewView,
} from '@jellyfish-dev/react-native-client-sdk';

import {Room} from './Room';
import {JELLYFISH_URL} from '@env';

function ConnectScreen(): JSX.Element {
  const {connect, join, cleanUp, error} = useJellyfishClient();
  const [isConnected, setIsConnected] = useState(false);
  const [peerToken, onChangePeerToken] = React.useState('');
  const {startCamera} = useCamera();

  useEffect(() => {
    async function request() {
      if (Platform.OS === 'ios') {
        return;
      }
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA as Permission,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO as Permission,
        ]);
        if (
          granted[PermissionsAndroid.PERMISSIONS.CAMERA as Permission] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO as Permission] ===
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
    try {
      await connect(
        JELLYFISH_URL,
        'SFMyNTY.g2gDdAAAAAJkAAdwZWVyX2lkbQAAACRlMjU2MGJmZC1mMmM1LTQ2ZmItYmZjYi1iNzk0ZjY4MmY0MjBkAAdyb29tX2lkbQAAACQzN2U3NjE2OS0wZjhhLTQwMDUtOTUxZS1kYzc2OWQ5OTIyMzFuBgAeX6BtiQFiAAFRgA.f5Q6fWY-0jOdRWLyk0SMs3xi3l1M4xQfmsbQE8DxSBw',
      );
      setIsConnected(true);
      await startCamera();
      await join({name: 'RN mobile'});
    } catch (e) {
      console.log(e);
    }
  };

  const disconnect = async () => {
    cleanUp();
    setIsConnected(false);
  };

  return (
    <View style={styles.app}>
      <Text style={styles.errorMessage}>{error}</Text>
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
            placeholder="Peer token"
            placeholderTextColor="#000"
          />
          <View style={styles.button}>
            <Button title="Connect" onPress={connectToRoom} />
          </View>
        </View>
      )}

      <View style={styles.videoContainer}>
        <VideoPreviewView style={{flex: 1}}></VideoPreviewView>
      </View>

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
    color: 'black',
  },
  button: {
    alignSelf: 'center',
    width: 150,
    margin: 15,
  },
  disconnectButton: {
    marginTop: 30,
  },
  errorMessage: {
    color: 'black',
    textAlign: 'center',
    margin: 25,
    fontSize: 20,
  },
  videoContainer: {
    width: 150,
    height: 150,
    margin: 10,
    backgroundColor: 'grey',
  },
});

export default ConnectScreen;
