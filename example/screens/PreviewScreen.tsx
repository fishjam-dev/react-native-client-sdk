import React, {useEffect, useRef, useCallback} from 'react';
import {
  BackHandler,
  SafeAreaView,
  StyleSheet,
  View,
  Button,
} from 'react-native';
import {InCallButton} from '../components';

import type {CaptureDevice} from '@jellyfish-dev/react-native-client-sdk';
import {useVideoRoomContext} from '../contexts/VideoRoomContext';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AppRootStackParamList} from '../navigators/AppNavigator';

import {previewScreenLabels} from '../types/ComponentLabels';
import {BrandColors} from '../utils/Colors';
import {NoCameraView} from '../components/NoCameraView';
import VideoPreview from '../components/VideoPreview';

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
  } = useVideoRoomContext();
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
      <View style={styles.cameraPreview}>
        {isCameraOn ? (
          <VideoPreview currentCamera={currentCamera} />
        ) : (
          <NoCameraView />
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
