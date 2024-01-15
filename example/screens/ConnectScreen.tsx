import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Permission,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {URL_INPUT, TOKEN_INPUT, CONNECT_BUTTON} from '../types/ComponentLabels';

import {
  useCamera,
  useJellyfishClient,
} from '@jellyfish-dev/react-native-client-sdk';

import {Button, TextInput, QRCodeScanner, DismissKeyboard} from '../components';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppRootStackParamList} from '../navigators/AppNavigator';

type Props = NativeStackScreenProps<AppRootStackParamList, 'Connect'>;

const ConnectScreen = ({navigation}: Props) => {
  const {connect, join, error} = useJellyfishClient();
  const [peerToken, onChangePeerToken] = useState(
    'SFMyNTY.g2gDdAAAAAJkAAdwZWVyX2lkbQAAACQyMWRjOTA0YS0xYjFiLTQ4YjctYTI1YS04MGQyNmZkZmM5MmRkAAdyb29tX2lkbQAAACQ4MTc3ZjNhNi0wYzA1LTQ5ODktYjBhNS1lMzc3MDA3NGU4ZDNuBgBVjuT4jAFiAAFRgA.6T3R7J3Ubf-DG1B_Mx2utfPCN6TP6vLUH76W3dyK5hI',
  );
  const [jellyfishUrl, onChangeJellyfishUrl] = useState(
    'ws://192.168.83.13:5002/socket/peer/websocket',
  );
  // const [jellyfishUrl, onChangeJellyfishUrl] = useState(JELLYFISH_URL ?? '');
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
      await connect(jellyfishUrl, peerToken);
      await startCamera({
        simulcastConfig: {
          enabled: true,
          activeEncodings: ['m'],
        },
      });
      await join({name: 'RN mobile'});
      navigation.navigate('Room');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <DismissKeyboard>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {error && <Text style={styles.errorMessage}>{error}</Text>}
          <Image
            style={styles.logo}
            source={require('../assets/jellyfish-logo.png')}
            resizeMode="contain"
            resizeMethod="scale"
          />
          <TextInput
            onChangeText={onChangeJellyfishUrl}
            value={jellyfishUrl}
            accessibilityLabel={URL_INPUT}
            placeholder="Jellyfish url"
          />
          <TextInput
            onChangeText={onChangePeerToken}
            value={peerToken}
            accessibilityLabel={TOKEN_INPUT}
            placeholder="Peer token"
          />
          <Button
            title="Connect"
            onPress={connectToRoom}
            accessibilityLabel={CONNECT_BUTTON}
          />
          <QRCodeScanner onCodeScanned={onChangePeerToken} />
        </View>
      </SafeAreaView>
    </DismissKeyboard>
  );
};

export default ConnectScreen;

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#BFE7F8',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#BFE7F8',
    padding: 20,
    gap: 24,
  },
  errorMessage: {
    color: 'black',
    textAlign: 'center',
    margin: 25,
    fontSize: 20,
  },
  logo: {
    width: windowWidth - 40,
  },
});
