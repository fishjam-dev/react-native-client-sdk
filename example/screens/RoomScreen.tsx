import React, {useCallback, useEffect} from 'react';
import {BackHandler, SafeAreaView, StyleSheet, View} from 'react-native';

import {InCallButton, VideosGrid} from '../components';

import {
  useCamera,
  useJellyfishClient,
  usePeers,
  useScreencast,
} from '@jellyfish-dev/react-native-client-sdk';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AppRootStackParamList} from '../navigators/AppNavigator';

import {
  DISCONNECT_BUTTON,
  TOGGLE_CAMERA_BUTTON,
  SWITCH_CAMERA_BUTTON,
  SHARE_SCREEN_BUTTON,
} from '../types/ComponentLabels';
import LetterButton from '../components/LetterButton';
import {TrackEncoding} from '@jellyfish-dev/react-native-membrane-webrtc/src/MembraneWebRTC.types';

type Props = NativeStackScreenProps<AppRootStackParamList, 'Room'>;

const RoomScreen = ({navigation}: Props) => {
  const peers = usePeers();

  const {cleanUp} = useJellyfishClient();
  const {
    isCameraOn,
    flipCamera,
    toggleCamera,
    toggleVideoTrackEncoding,
    simulcastConfig,
  } = useCamera();
  const {isScreencastOn, toggleScreencast} = useScreencast();

  useEffect(() => {
    console.log(simulcastConfig);
  }, [simulcastConfig]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);

  const onDisconnectTap = useCallback(() => {
    cleanUp();
    navigation.goBack();
  }, [navigation, cleanUp]);

  return (
    <SafeAreaView style={styles.container}>
      <VideosGrid tracks={peers} />
      <View style={{display: 'flex', flexDirection: 'row', gap: 20}}>
        <InCallButton
          type="disconnect"
          iconName="phone-hangup"
          onPress={onDisconnectTap}
          accessibilityLabel={DISCONNECT_BUTTON}
        />
        <InCallButton
          iconName={isCameraOn ? 'camera-off' : 'camera'}
          onPress={toggleCamera}
          accessibilityLabel={TOGGLE_CAMERA_BUTTON}
        />
        <InCallButton
          iconName="camera-switch"
          onPress={flipCamera}
          accessibilityLabel={SWITCH_CAMERA_BUTTON}
        />
        <InCallButton
          iconName={isScreencastOn ? 'share-off' : 'share'}
          onPress={() =>
            toggleScreencast({
              screencastMetadata: {displayName: 'Mobile phone'},
            })
          }
          accessibilityLabel={SHARE_SCREEN_BUTTON}
        />
      </View>
      <View style={{display: 'flex', flexDirection: 'row', gap: 20}}>
        {Array<TrackEncoding>('h', 'm', 'l').map(val => {
          return (
            <LetterButton
              trackEncoding={val}
              selected={simulcastConfig.activeEncodings.includes(val)}
              onPress={() => toggleVideoTrackEncoding(val)}
            />
          );
        })}
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
});
