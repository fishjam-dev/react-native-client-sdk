import React, {useCallback, useEffect, useMemo} from 'react';
import {BackHandler, SafeAreaView, StyleSheet, View} from 'react-native';
import {InCallButton, VideosGrid} from '../components';
import {NoCameraView} from '../components/NoCameraView';

import {
  useJellyfishClient,
  usePeers,
  useScreencast,
  ScreencastQuality,
  TrackEncoding,
} from '@jellyfish-dev/react-native-client-sdk';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AppRootStackParamList} from '../navigators/AppNavigator';

import {roomScreenLabels} from '../types/ComponentLabels';
import {useJellyfishExampleContext} from '../contexts/JellyfishExampleContext';

type Props = NativeStackScreenProps<AppRootStackParamList, 'Room'>;
const {
  DISCONNECT_BUTTON,
  TOGGLE_CAMERA_BUTTON,
  SWITCH_CAMERA_BUTTON,
  SHARE_SCREEN_BUTTON,
  TOGGLE_MICROPHONE_BUTTON,
  NO_CAMERA_VIEW,
} = roomScreenLabels;

import LetterButton from '../components/LetterButton';

const RoomScreen = ({navigation}: Props) => {
  const peers = usePeers();
  const tracks = useMemo(
    () =>
      peers.flatMap(peer =>
        peer.tracks.filter(
          t => t.metadata.type !== 'audio' && (t.metadata.active ?? true),
        ),
      ),
    [peers],
  );
  const {cleanUp} = useJellyfishClient();
  const {toggleScreencast, isScreencastOn} = useScreencast();
  const {
    isCameraOn,
    isMicrophoneOn,
    toggleMicrophone,
    toggleCamera,
    flipCamera,
    localCameraSimulcastConfig,
    toggleLocalCameraTrackEncoding,
  } = useJellyfishExampleContext();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);

  const onDisconnectPress = useCallback(() => {
    cleanUp();
    navigation.navigate('Connect');
  }, [navigation, cleanUp]);

  const onToggleScreenCast = useCallback(() => {
    toggleScreencast({
      screencastMetadata: {
        displayName: 'presenting',
        type: 'screensharing',
        active: !isScreencastOn,
      },
      quality: ScreencastQuality.HD15,
    });
  }, [isScreencastOn, toggleScreencast]);

  return (
    <SafeAreaView style={styles.container}>
      {tracks.length > 0 ? (
        <VideosGrid tracks={tracks} />
      ) : (
        <NoCameraView username="username" accessibilityLabel={NO_CAMERA_VIEW} />
      )}

      <View style={styles.callView}>
        <InCallButton
          type="disconnect"
          iconName="phone-hangup"
          onPress={onDisconnectPress}
          accessibilityLabel={DISCONNECT_BUTTON}
        />
        <InCallButton
          iconName={isMicrophoneOn ? 'microphone-off' : 'microphone'}
          onPress={toggleMicrophone}
          accessibilityLabel={TOGGLE_MICROPHONE_BUTTON}
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
          onPress={onToggleScreenCast}
          accessibilityLabel={SHARE_SCREEN_BUTTON}
        />
      </View>
      <View style={{display: 'flex', flexDirection: 'row', gap: 20}}>
        {Array<TrackEncoding>('h', 'm', 'l').map(val => {
          return (
            <LetterButton
              trackEncoding={val}
              selected={localCameraSimulcastConfig.activeEncodings.includes(
                val,
              )}
              onPress={() => toggleLocalCameraTrackEncoding(val)}
            />
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default RoomScreen;

const styles = StyleSheet.create({
  callView: {display: 'flex', flexDirection: 'row', gap: 10},
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F1FAFE',
    padding: 24,
  },
});
