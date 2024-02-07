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

import {connectScreenLabels} from '../types/ComponentLabels';

import {useJellyfishClient} from '@jellyfish-dev/react-native-client-sdk';

import {Button, TextInput, QRCodeScanner, DismissKeyboard} from '../components';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppRootStackParamList} from '../navigators/AppNavigator';

type Props = NativeStackScreenProps<AppRootStackParamList, 'Connect'>;

const {URL_INPUT, TOKEN_INPUT, CONNECT_BUTTON} = connectScreenLabels;
const ConnectScreen = ({navigation}: Props) => {
  const {connect, error} = useJellyfishClient();
  const [peerToken, onChangePeerToken] = useState('');
  const [jellyfishUrl, onChangeJellyfishUrl] = useState(
    process.env.JELLYFISH_URL ?? '',
  );
  useEffect(() => {
    async function request() {
      if (Platform.OS === 'ios') {
        return;
      }
      try {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA as Permission,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO as Permission,
        ]);
      } catch (err) {
        console.warn(err);
      }
    }

    request();
  }, []);

  const onTapConnectButton = async () => {
    try {
      await connect(jellyfishUrl.trim(), peerToken.trim());
      navigation.navigate('Preview');
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
            onPress={onTapConnectButton}
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
