import {
  useCamera,
  useMicrophone,
  useFishjamClient,
  useAudioSettings,
  updateVideoTrackMetadata,
  updateAudioTrackMetadata,
  CaptureDevice,
  VideoQuality,
  SimulcastConfig,
  TrackEncoding,
  CameraConfig,
  Metadata,
  AudioOutputDevice,
  AudioOutputDeviceType,
  AudioSessionMode,
} from '@fishjam-dev/react-native-client';
import * as Device from 'expo-device';
import { Platform } from 'expo-modules-core';
import React, { useCallback, useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import notifee, {
  AndroidImportance,
  AndroidColor,
} from '@notifee/react-native';

type VideoRoomState = 'BeforeMeeting' | 'InMeeting' | 'AfterMeeting';

type AudioSettings = {
  selectedAudioOutputDevice: AudioOutputDevice | null;
  availableDevices: AudioOutputDevice[];
  selectOutputAudioDevice: (device: AudioOutputDeviceType) => Promise<void>;
  selectAudioSessionMode: (audioSessionMode: AudioSessionMode) => Promise<void>;
  showAudioRoutePicker: () => Promise<void>;
};

const FishjamExampleContext = React.createContext<
  | {
      isCameraOn: boolean;
      toggleCamera: () => void;
      isMicrophoneOn: boolean;
      toggleMicrophone: () => void;
      joinRoom: () => Promise<void>;
      startCamera: <CameraConfigMetadataType extends Metadata>(
        config?: Partial<CameraConfig<CameraConfigMetadataType>>,
      ) => Promise<void>;
      flipCamera: () => void;
      getCaptureDevices: () => Promise<CaptureDevice[]>;
      setCurrentCamera: React.Dispatch<
        React.SetStateAction<CaptureDevice | null>
      >;
      currentCamera: CaptureDevice | null;
      localCameraSimulcastConfig: SimulcastConfig;
      toggleLocalCameraTrackEncoding: (
        encoding: TrackEncoding,
      ) => Promise<void>;
      audioSettings: AudioSettings;
    }
  | undefined
>(undefined);

const isIosEmulator = Platform.OS === 'ios' && !Device.isDevice;

const FishjamExampleContextProvider = (props: any) => {
  const { join } = useFishjamClient();
  const [isCameraOn, setIsCameraOn] = useState(!isIosEmulator);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
  const [currentCamera, setCurrentCamera] = useState<CaptureDevice | null>(
    null,
  );
  const {
    toggleCamera: membraneToggleCamera,
    startCamera,
    flipCamera,
    getCaptureDevices,
    simulcastConfig: localCameraSimulcastConfig,
    toggleVideoTrackEncoding: toggleLocalCameraTrackEncoding,
  } = useCamera();
  const { toggleMicrophone: membraneToggleMicrophone, startMicrophone } =
    useMicrophone();
  const audioSettings = useAudioSettings();
  const [videoRoomState, setVideoRoomState] =
    useState<VideoRoomState>('BeforeMeeting');

  const startForegroundService = async () => {
    if (Platform.OS != 'android') return;
    const channelId = await notifee.createChannel({
      id: 'video_call',
      name: 'Video call',
      lights: false,
      vibration: false,
      importance: AndroidImportance.DEFAULT,
    });

    await notifee.displayNotification({
      title: 'Your video call is ongoing',
      body: 'Tap to return to the call.',
      android: {
        channelId,
        asForegroundService: true,
        ongoing: true,
        color: AndroidColor.BLUE,
        colorized: true,
        pressAction: {
          id: 'default',
        },
      },
    });
  };

  const joinRoom = useCallback(async () => {
    await startForegroundService();
    await startCamera({
      simulcastConfig: {
        enabled: true,
        activeEncodings:
          Platform.OS === 'android' ? ['l', 'm', 'h'] : ['l', 'h'],
      },
      quality: VideoQuality.HD_169,
      maxBandwidth: { l: 150, m: 500, h: 1500 },
      videoTrackMetadata: { active: isCameraOn, type: 'camera' },
      captureDeviceId: currentCamera?.id,
      cameraEnabled: isCameraOn,
    });

    await join({
      name: 'RN mobile',
    });

    await startMicrophone({
      audioTrackMetadata: { active: isMicrophoneOn, type: 'audio' },
      microphoneEnabled: isMicrophoneOn,
    });
    setVideoRoomState('InMeeting');
  }, [
    currentCamera?.id,
    isCameraOn,
    isMicrophoneOn,
    join,
    startCamera,
    startMicrophone,
  ]);

  useEffect(() => {
    getCaptureDevices().then((devices) => {
      setCurrentCamera(devices.find((device) => device.isFrontFacing) || null);
    });
  }, [getCaptureDevices]);

  const toggleCamera = useCallback(async () => {
    if (isIosEmulator) {
      Toast.show({
        type: 'info',
        text1: 'Camera is not supported on the iOS emulator',
        text2: 'Please run the app on a real device to use the camera',
      });

      return;
    }

    if (videoRoomState === 'InMeeting') {
      await membraneToggleCamera();
      await updateVideoTrackMetadata({ active: !isCameraOn, type: 'camera' });
    }

    setIsCameraOn(!isCameraOn);
  }, [isCameraOn, membraneToggleCamera, videoRoomState]);

  const toggleMicrophone = useCallback(async () => {
    if (videoRoomState === 'InMeeting') {
      await membraneToggleMicrophone();
      await updateAudioTrackMetadata({
        active: !isMicrophoneOn,
        type: 'audio',
      });
    }
    setIsMicrophoneOn(!isMicrophoneOn);
  }, [isMicrophoneOn, membraneToggleMicrophone, videoRoomState]);

  const value = {
    joinRoom,
    flipCamera,
    toggleCamera,
    toggleMicrophone,
    startCamera,
    isCameraOn,
    isMicrophoneOn,
    currentCamera,
    setCurrentCamera,
    getCaptureDevices,
    localCameraSimulcastConfig,
    toggleLocalCameraTrackEncoding,
    audioSettings,
  };

  return (
    <FishjamExampleContext.Provider value={value}>
      {props.children}
    </FishjamExampleContext.Provider>
  );
};

function useFishjamExampleContext() {
  const context = React.useContext(FishjamExampleContext);
  if (context === undefined) {
    throw new Error(
      'useFishjamExampleContext must be used within a FishjamExampleContextProvider',
    );
  }
  return context;
}

export { FishjamExampleContextProvider, useFishjamExampleContext };
