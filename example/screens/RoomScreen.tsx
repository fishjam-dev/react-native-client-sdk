import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {
  BackHandler,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {InCallButton, VideosGrid} from '../components';
import {NoCameraView} from '../components/NoCameraView';

import {
  useJellyfishClient,
  usePeers,
  useScreencast,
  ScreencastQuality,
} from '@jellyfish-dev/react-native-client-sdk';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AppRootStackParamList} from '../navigators/AppNavigator';

import {roomScreenLabels} from '../types/ComponentLabels';
import {useJellyfishExampleContext} from '../contexts/JellyfishExampleContext';
import BottomSheet from '@gorhom/bottom-sheet';
import {SoundOutputDevicesBottomSheet} from '../components/SoundOutputDevicesBottomSheet';

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
    audioSettings,
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
    navigation.navigate('Home');
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

  const bottomSheetRef = useRef<BottomSheet>(null);

  const toggleOutputSoundDevice = useCallback(async () => {
    if (Platform.OS === 'ios') {
      await audioSettings.showAudioRoutePicker();
    } else if (Platform.OS === 'android') {
      bottomSheetRef.current?.expand();
    }
  }, [audioSettings]);

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
        <InCallButton
          iconName="volume-high"
          onPress={toggleOutputSoundDevice}
        />
      </View>
      {Platform.OS === 'android' ? (
        <SoundOutputDevicesBottomSheet bottomSheetRef={bottomSheetRef} />
      ) : null}
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
