import React, {useCallback, useEffect} from 'react';
import {BackHandler, SafeAreaView, StyleSheet, View} from 'react-native';

import {InCallButton, VideosGrid} from '../components';

import {
  useCamera,
  useJellyfishClient,
  usePeers,
  useScreencast,
} from '@jellyfish-dev/react-native-client-sdk';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppRootStackParamList} from '../../navigators/AppNavigator';

type Props = NativeStackScreenProps<AppRootStackParamList, 'Room'>;

const RoomScreen = ({navigation}: Props) => {
  const peers = usePeers();

  const {leave} = useJellyfishClient();
  const {isCameraOn, flipCamera, toggleCamera} = useCamera();
  const {isScreencastOn, toggleScreencast} = useScreencast();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);

  const onDisconnectTap = useCallback(() => {
    leave();
    navigation.goBack();
  }, [leave, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <VideosGrid
        tracks={peers.flatMap(peer =>
          peer.tracks[0]?.id !== undefined ? [peer.tracks[0].id] : [],
        )}
      />
      <View style={styles.buttonsWrapper}>
        <InCallButton
          type="disconnect"
          iconName="phone-hangup"
          onPress={onDisconnectTap}
        />
        <InCallButton
          iconName={isCameraOn ? 'camera-off' : 'camera'}
          onPress={toggleCamera}
        />
        <InCallButton iconName="camera-switch" onPress={flipCamera} />
        <InCallButton
          iconName={isScreencastOn ? 'share-off' : 'share'}
          onPress={() =>
            toggleScreencast({
              screencastMetadata: {displayName: 'Mobile phone'},
            })
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default RoomScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F1FAFE',
    padding: 24,
  },
  buttonsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
  },
});
