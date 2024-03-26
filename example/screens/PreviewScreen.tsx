import React, {useCallback, useEffect, useRef} from 'react';
import {
  BackHandler,
  Button,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {InCallButton} from '../components';

import {
  CaptureDevice,
  TrackEncoding,
} from '@jellyfish-dev/react-native-client-sdk';
import {useJellyfishExampleContext} from '../contexts/JellyfishExampleContext';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AppRootStackParamList} from '../navigators/AppNavigator';

import {previewScreenLabels} from '../types/ComponentLabels';
import {BrandColors} from '../utils/Colors';
import {NoCameraView} from '../components/NoCameraView';
import VideoPreview from '../components/VideoPreview';
import LetterButton from '../components/LetterButton';

type Props = NativeStackScreenProps<AppRootStackParamList, 'Preview'>;
const {
  JOIN_BUTTON,
  TOGGLE_CAMERA_BUTTON,
  SWITCH_CAMERA_BUTTON,
  TOGGLE_MICROPHONE_BUTTON,
} = previewScreenLabels;
const PreviewScreen = ({navigation}: Props) => {
  const {
    toggleCamera,
    toggleMicrophone,
    isCameraOn,
    isMicrophoneOn,
    joinRoom,
    getCaptureDevices,
    setCurrentCamera,
    currentCamera,
    localCameraSimulcastConfig,
    toggleLocalCameraTrackEncoding,
  } = useJellyfishExampleContext();

  const availableCameras = useRef<CaptureDevice[]>([]);

  useEffect(() => {
    getCaptureDevices().then(devices => {
      availableCameras.current = devices;
      setCurrentCamera(devices.find(device => device.isFrontFacing) || null);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchCamera = useCallback(() => {
    const cameras = availableCameras.current;
    if (currentCamera === null) {
      return;
    }

    //todo Switches between front-facing and back-facing cameras or displays a list of available cameras.
    setCurrentCamera(
      cameras[
        (cameras.findIndex(device => device === currentCamera) + 1) %
          cameras.length
      ] || null,
    );
  }, [currentCamera, setCurrentCamera]);

  const onJoinPressed = async () => {
    await joinRoom();
    navigation.navigate('Room');
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraPreview}>
        {isCameraOn ? (
          <VideoPreview currentCamera={currentCamera} />
        ) : (
          <NoCameraView />
        )}
      </View>
      <View style={styles.mediaButtonsWrapper}>
        <InCallButton
          iconName={isMicrophoneOn ? 'microphone' : 'microphone-off'}
          onPress={toggleMicrophone}
          accessibilityLabel={TOGGLE_MICROPHONE_BUTTON}
        />
        <InCallButton
          iconName={isCameraOn ? 'camera' : 'camera-off'}
          onPress={toggleCamera}
          accessibilityLabel={TOGGLE_CAMERA_BUTTON}
        />
        <InCallButton
          iconName="camera-switch"
          onPress={switchCamera}
          accessibilityLabel={SWITCH_CAMERA_BUTTON}
        />
      </View>
      <View style={styles.simulcastButtonsWrapper}>
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
      <View style={styles.joinButton}>
        <Button
          title="Join Room"
          onPress={onJoinPressed}
          accessibilityLabel={JOIN_BUTTON}
        />
      </View>
    </SafeAreaView>
  );
};

export default PreviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F1FAFE',
    padding: 24,
  },
  cameraPreview: {
    flex: 6,
    margin: 24,
    alignSelf: 'stretch',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BrandColors.darkBlue80,
    overflow: 'hidden',
  },
  mediaButtonsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    flex: 1,
  },
  simulcastButtonsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    flex: 1,
  },
  joinButton: {
    flex: 1,
  },
});
