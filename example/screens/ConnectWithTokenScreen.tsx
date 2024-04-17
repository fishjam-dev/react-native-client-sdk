import React, {useState} from 'react';
import {
  Dimensions,
  Image,
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
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {TabParamList} from '../navigators/AppNavigator';
import {CompositeScreenProps} from '@react-navigation/native';
import {usePermissionCheck} from '../hooks/usePermissionCheck';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'ConnectWithToken'>,
  NativeStackScreenProps<AppRootStackParamList>
>;

const {URL_INPUT, TOKEN_INPUT, CONNECT_BUTTON} = connectScreenLabels;
const ConnectScreen = ({navigation}: Props) => {
  const {connect} = useJellyfishClient();
  const [connectionError, setConnectionError] = useState<string | undefined>(
    undefined,
  );

  const [peerToken, onChangePeerToken] = useState('');
  const [jellyfishUrl, onChangeJellyfishUrl] = useState(
    process.env.JELLYFISH_URL ?? '',
  );

  usePermissionCheck();

  const onTapConnectButton = async () => {
    try {
      await connect(jellyfishUrl.trim(), peerToken.trim());
      navigation.navigate('Preview');
    } catch (e) {
      const message =
        'message' in (e as Error) ? (e as Error).message : 'Unknown error';
      setConnectionError(message);
    }
  };

  return (
    <DismissKeyboard>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {connectionError && (
            <Text style={styles.errorMessage}>{connectionError}</Text>
          )}
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
