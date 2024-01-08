import React, {useCallback, useEffect, useState} from 'react';

import {
  useCamera,
  useMicrophone,
  useJellyfishClient,
  useScreencast,
  useAudioSettings,
  CaptureDevice,
  updateVideoTrackMetadata,
  updateAudioTrackMetadata,
} from '@jellyfish-dev/react-native-client-sdk';
//
// import {
//   ScreencastQuality,
//   VideoQuality,
// } from '@jellyfish-dev/react-native-membrane-webrtc';

import {Platform} from 'expo-modules-core';

type VideoRoomState = 'BeforeMeeting' | 'InMeeting' | 'AfterMeeting';

const JellyfishExampleContext = React.createContext<
  | {
      isCameraOn: boolean;
      toggleCamera: () => void;
      isMicrophoneOn: boolean;
      toggleMicrophone: () => void;
      isScreencastOn: boolean;
      toggleScreencastAndUpdateMetadata: () => void;
      joinRoom: () => Promise<void>;
      flipCamera: () => void;
      getCaptureDevices: () => Promise<CaptureDevice[]>;
      setCurrentCamera: React.Dispatch<
        React.SetStateAction<CaptureDevice | null>
      >;
      currentCamera: CaptureDevice | null;
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
  } = useCamera();
  const {toggleMicrophone: membraneToggleMicrophone, startMicrophone} =
    useMicrophone();
  const {isScreencastOn, toggleScreencast: membraneToggleScreencast} =
    useScreencast();
  useAudioSettings();
  const [videoRoomState, setVideoRoomState] =
    useState<VideoRoomState>('BeforeMeeting');

  const joinRoom = useCallback(async () => {
    await join({
      name: 'RN mobile',
    });

    // await startCamera({
    //   simulcastConfig: {
    //     enabled: true,
    //     activeEncodings:
    //       Platform.OS === 'android' ? ['l', 'm', 'h'] : ['l', 'h'],
    //   },
    //   quality: VideoQuality.HD_169,
    //   maxBandwidth: {l: 150, m: 500, h: 1500},
    //   videoTrackMetadata: {active: isCameraOn, type: 'camera'},
    //   captureDeviceId: currentCamera?.id,
    //   cameraEnabled: isCameraOn,
    // });
    await startMicrophone({
      audioTrackMetadata: {active: isMicrophoneOn, type: 'audio'},
      microphoneEnabled: isMicrophoneOn,
    });
    setVideoRoomState('InMeeting');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCameraOn, isMicrophoneOn]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCameraOn, videoRoomState]);

  const toggleMicrophone = useCallback(async () => {
    if (videoRoomState === 'InMeeting') {
      await membraneToggleMicrophone();
      await updateAudioTrackMetadata({
        active: !isMicrophoneOn,
        type: 'audio',
      });
    }
    setIsMicrophoneOn(!isMicrophoneOn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMicrophoneOn, videoRoomState]);

  const toggleScreencastAndUpdateMetadata = useCallback(() => {
    // membraneToggleScreencast({
    //   screencastMetadata: {
    //     displayName: 'presenting',
    //     type: 'screensharing',
    //     active: 'true',
    //   },
    //   quality: ScreencastQuality.HD15,
    // });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    joinRoom,
    flipCamera,
    toggleCamera,
    toggleMicrophone,
    toggleScreencastAndUpdateMetadata,
    isCameraOn,
    isMicrophoneOn,
    isScreencastOn,
    currentCamera,
    setCurrentCamera,
    getCaptureDevices,
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
