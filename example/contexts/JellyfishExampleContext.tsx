import React, {useCallback, useEffect, useState} from 'react';

import {
  useCamera,
  useMicrophone,
  useJellyfishClient,
  useAudioSettings,
  updateVideoTrackMetadata,
  updateAudioTrackMetadata,
  CaptureDevice,
  VideoQuality,
  SimulcastConfig,
  TrackEncoding,
} from '@jellyfish-dev/react-native-client-sdk';

import {Platform} from 'expo-modules-core';
import {
  CameraConfig,
  Metadata,
} from '@jellyfish-dev/react-native-membrane-webrtc/build/MembraneWebRTC.types';

type VideoRoomState = 'BeforeMeeting' | 'InMeeting' | 'AfterMeeting';

const JellyfishExampleContext = React.createContext<
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
    }
  | undefined
>(undefined);

const JellyfishExampleContextProvider = (props: any) => {
  const {join} = useJellyfishClient();
  const [isCameraOn, setIsCameraOn] = useState(true);
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
  const {toggleMicrophone: membraneToggleMicrophone, startMicrophone} =
    useMicrophone();
  useAudioSettings();
  const [videoRoomState, setVideoRoomState] =
    useState<VideoRoomState>('BeforeMeeting');

  const joinRoom = useCallback(async () => {
    await startCamera({
      simulcastConfig: {
        enabled: true,
        activeEncodings:
          Platform.OS === 'android' ? ['l', 'm', 'h'] : ['l', 'h'],
      },
      quality: VideoQuality.HD_169,
      maxBandwidth: {l: 150, m: 500, h: 1500},
      videoTrackMetadata: {active: isCameraOn, type: 'camera'},
      captureDeviceId: currentCamera?.id,
      cameraEnabled: isCameraOn,
    });

    await join({
      name: 'RN mobile',
    });

    await startMicrophone({
      audioTrackMetadata: {active: isMicrophoneOn, type: 'audio'},
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
    getCaptureDevices().then(devices => {
      setCurrentCamera(devices.find(device => device.isFrontFacing) || null);
    });
  }, [getCaptureDevices]);

  const toggleCamera = useCallback(async () => {
    if (videoRoomState === 'InMeeting') {
      await membraneToggleCamera();
      await updateVideoTrackMetadata({active: !isCameraOn, type: 'camera'});
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
  };

  return (
    <JellyfishExampleContext.Provider value={value}>
      {props.children}
    </JellyfishExampleContext.Provider>
  );
};

function useJellyfishExampleContext() {
  const context = React.useContext(JellyfishExampleContext);
  if (context === undefined) {
    throw new Error(
      'useJellyfishExampleContext must be used within a JellyfishExampleContextProvider',
    );
  }
  return context;
}

export {JellyfishExampleContextProvider, useJellyfishExampleContext};
