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
import {Button, TextInput, DismissKeyboard} from '../components';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppRootStackParamList} from '../navigators/AppNavigator';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {TabParamList} from '../navigators/AppNavigator';
import {CompositeScreenProps} from '@react-navigation/native';
import {usePermissionCheck} from '../hooks/usePermissionCheck';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'ConnectWithRoomManager'>,
  NativeStackScreenProps<AppRootStackParamList>
>;

const {URL_INPUT, TOKEN_INPUT, CONNECT_BUTTON} = connectScreenLabels;

async function getJellyFishServer(
  roomManagerUrl: string,
  roomName: string,
  userName: string,
) {
  const url = roomManagerUrl.endsWith('/')
    ? roomManagerUrl
    : roomManagerUrl + '/';
  const result = await fetch(
    `${url}rooms/${roomName.trim()}/users/${userName.trim()}`,
  );

  const tokenData = (await result.json()) as {
    url: string;
    token: string;
  };

  return {
    jellyfishUrl: tokenData.url,
    token: tokenData.token,
  };
}

const ConnectScreen = ({navigation}: Props) => {
  const {connect} = useJellyfishClient();
  const [connectionError, setConnectionError] = useState<string | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(false);

  const [roomManagerUrl, setRoomManagerUrl] = useState(
    process.env.ROOM_MANAGER_URL ?? '',
  );
  const [roomName, setRoomName] = useState('');
  const [userName, setUserName] = useState('');

  usePermissionCheck();

  const onTapConnectButton = async () => {
    try {
      setConnectionError(undefined);
      setLoading(true);
      const {jellyfishUrl, token} = await getJellyFishServer(
        roomManagerUrl,
        roomName,
        userName,
      );

      await connect(jellyfishUrl, token);

      navigation.navigate('Preview');
    } catch (e) {
      const message =
        'message' in (e as Error) ? (e as Error).message : 'Unknown error';
      setConnectionError(message);
    } finally {
      setLoading(false);
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
            onChangeText={setRoomManagerUrl}
            value={roomManagerUrl}
            accessibilityLabel={URL_INPUT}
            placeholder="Room Manager URL"
          />
          <TextInput
            onChangeText={setRoomName}
            accessibilityLabel={URL_INPUT}
            placeholder="Room Name"
          />
          <TextInput
            onChangeText={setUserName}
            accessibilityLabel={TOKEN_INPUT}
            placeholder="User Name"
          />
          <Button
            title="Connect"
            onPress={onTapConnectButton}
            accessibilityLabel={CONNECT_BUTTON}
            disabled={loading}
          />
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
