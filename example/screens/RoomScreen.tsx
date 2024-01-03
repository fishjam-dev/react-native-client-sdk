import React, {useCallback, useEffect} from 'react';
import {BackHandler, SafeAreaView, StyleSheet, View} from 'react-native';
import {InCallButton, VideosGrid} from '../components';
import {NoCameraView} from '../components/NoCameraView';

import {
  useCamera,
  useMicrophone,
  useJellyfishClient,
  usePeers,
  useScreencast,
} from '@jellyfish-dev/react-native-client-sdk';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AppRootStackParamList} from '../navigators/AppNavigator';

import {roomScreenLabels} from '../types/ComponentLabels';

type Props = NativeStackScreenProps<AppRootStackParamList, 'Room'>;
const {
  DISCONNECT_BUTTON,
  TOGGLE_CAMERA_BUTTON,
  SWITCH_CAMERA_BUTTON,
  SHARE_SCREEN_BUTTON,
  TOGGLE_MICROPHONE_BUTTON,
  NO_CAMERA_VIEW,
} = roomScreenLabels;

const RoomScreen = ({navigation}: Props) => {
  const peers = usePeers();
  const {leave} = useJellyfishClient();
  const {isCameraOn, flipCamera, toggleCamera} = useCamera();
  const {isScreencastOn, toggleScreencast} = useScreencast();
  const {isMicrophoneOn, toggleMicrophone} = useMicrophone();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);
  const onDisconnectPress = useCallback(() => {
    leave();
    navigation.navigate('Connect');
  }, [navigation, leave]);

  return (
    <SafeAreaView style={styles.container}>
      {isCameraOn ? (
        <VideosGrid
          tracks={
            peers
              .flatMap(peer =>
                peer.tracks
                  .filter(t => t.metadata.type !== 'audio')
                  .map(t => t.id),
              )
              .filter(t => t) as string[]
          }
        />
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
          onPress={() =>
            toggleScreencast({
              screencastMetadata: {displayName: 'Mobile phone'},
            })
          }
          accessibilityLabel={SHARE_SCREEN_BUTTON}
        />
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
