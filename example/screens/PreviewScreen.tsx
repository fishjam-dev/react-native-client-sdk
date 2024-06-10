import { CaptureDevice, TrackEncoding } from '@fishjam-dev/react-native-client';
import BottomSheet from '@gorhom/bottom-sheet';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useCallback } from 'react';
import {
  BackHandler,
  Button,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { InCallButton } from '../components';
import LetterButton from '../components/LetterButton';
import { NoCameraView } from '../components/NoCameraView';
import { SoundOutputDevicesBottomSheet } from '../components/SoundOutputDevicesBottomSheet';
import VideoPreview from '../components/VideoPreview';
import { useFishjamExampleContext } from '../contexts/FishjamExampleContext';
import type { AppRootStackParamList } from '../navigators/AppNavigator';
import { previewScreenLabels } from '../types/ComponentLabels';
import { BrandColors } from '../utils/Colors';

type Props = NativeStackScreenProps<AppRootStackParamList, 'Preview'>;
const {
  JOIN_BUTTON,
  TOGGLE_CAMERA_BUTTON,
  SWITCH_CAMERA_BUTTON,
  TOGGLE_MICROPHONE_BUTTON,
  SELECT_AUDIO_OUTPUT,
} = previewScreenLabels;

const PreviewScreen = ({ navigation }: Props) => {
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
    audioSettings,
  } = useFishjamExampleContext();

  const availableCameras = useRef<CaptureDevice[]>([]);

  useEffect(() => {
    getCaptureDevices().then((devices) => {
      availableCameras.current = devices;
      setCurrentCamera(devices.find((device) => device.isFrontFacing) || null);
    });
  }, [getCaptureDevices, setCurrentCamera]);

  const switchCamera = useCallback(() => {
    const cameras = availableCameras.current;
    if (currentCamera === null) {
      return;
    }

    //todo Switches between front-facing and back-facing cameras or displays a list of available cameras.
    setCurrentCamera(
      cameras[
        (cameras.findIndex((device) => device === currentCamera) + 1) %
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

  const bottomSheetRef = useRef<BottomSheet>(null);

  const toggleOutputSoundDevice = useCallback(async () => {
    if (Platform.OS === 'ios') {
      await audioSettings.showAudioRoutePicker();
    } else if (Platform.OS === 'android') {
      bottomSheetRef.current?.expand();
    }
  }, [audioSettings]);

  const body = (
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
        <InCallButton
          iconName="volume-high"
          onPress={toggleOutputSoundDevice}
          accessibilityLabel={SELECT_AUDIO_OUTPUT}
        />
      </View>
      <View style={styles.simulcastButtonsWrapper}>
        {(['h', 'm', 'l'] as TrackEncoding[]).map((val) => {
          return (
            <LetterButton
              trackEncoding={val}
              key={`encoding-${val}`}
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

      {Platform.OS === 'android' && (
        <SoundOutputDevicesBottomSheet bottomSheetRef={bottomSheetRef} />
      )}
    </SafeAreaView>
  );

  if (Platform.OS === 'android') {
    return (
      <TouchableWithoutFeedback onPress={() => bottomSheetRef.current?.close()}>
        {body}
      </TouchableWithoutFeedback>
    );
  }
  return body;
};

export default PreviewScreen;

const styles = StyleSheet.create({
  callView: { display: 'flex', flexDirection: 'row', gap: 20 },
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
