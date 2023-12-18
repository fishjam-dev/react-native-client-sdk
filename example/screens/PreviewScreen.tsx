import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  BackHandler,
  SafeAreaView,
  StyleSheet,
  View,
  Button,
} from 'react-native';
import {InCallButton} from '../components';

import {
  useJellyfishClient,
  VideoPreviewView,
  CaptureDevice,
} from '@jellyfish-dev/react-native-client-sdk';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AppRootStackParamList} from '../navigators/AppNavigator';

import {
  JOIN_BUTTON,
  TOGGLE_CAMERA_BUTTON,
  SWITCH_CAMERA_BUTTON,
  TOGGLE_MICROPHONE_BUTTON,
} from '../types/ComponentLabels';
import {BrandColors} from '../utils/Colors';
import {NoCameraView} from '../components/NoCameraView';

type Props = NativeStackScreenProps<AppRootStackParamList, 'Preview'>;

const PreviewScreen = ({navigation}: Props) => {
  const {
    toggleCamera,
    toggleMicrophone,
    isCameraOn,
    isMicrophoneOn,
    joinRoom,
    getCaptureDevices,
  } = useJellyfishClient();
  const [currentCamera, setCurrentCamera] = useState<CaptureDevice | null>(
    null,
  );
  const availableCameras = useRef<CaptureDevice[]>([]);

  useEffect(() => {
    console.log('INFO BEFORE GETTING CAMERAS');

    getCaptureDevices().then(devices => {
      availableCameras.current = devices;
      setCurrentCamera(devices.find(device => device.isFrontFacing) || null);
    });

    console.log('INFO AFTER GETTING CAMERAS');
    console.log(availableCameras.current);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCamera]);

  useEffect(() => {
    console.log('INFO WELCOME IN PREVIEW SCREEN');
  }, []);

  const switchCamera = useCallback(() => {
    const cameras = availableCameras.current;
    if (currentCamera === null) {
      return;
    }

    setCurrentCamera(
      cameras[
        (cameras.findIndex(device => device === currentCamera) + 1) %
          cameras.length
      ] || null,
    );
  }, [currentCamera]);

  const onJoinPressed = () => {
    joinRoom();
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
      <View style={styles.cameraPreview} accessibilityLabel={'TEST_PREVIEW'}>
        {isCameraOn ? (
          <VideoPreviewView
            style={styles.membraneVideoPreview}
            mirrorVideo
            captureDeviceId={currentCamera?.id}
          />
        ) : (
          <NoCameraView username={'username'} />
        )}
      </View>
      <View style={styles.callView}>
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
      <Button
        title="Join Room"
        onPress={onJoinPressed}
        accessibilityLabel={JOIN_BUTTON}
      />
    </SafeAreaView>
  );
};

export default PreviewScreen;

const styles = StyleSheet.create({
  callView: {display: 'flex', flexDirection: 'row', gap: 20},
  cameraPreview: {
    width: 236,
    height: 320,
    alignSelf: 'center',
    marginTop: 24,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BrandColors.darkBlue80,
    overflow: 'hidden',
  },
  membraneVideoPreview: {
    width: 236,
    height: 320,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F1FAFE',
    padding: 24,
  },
});
