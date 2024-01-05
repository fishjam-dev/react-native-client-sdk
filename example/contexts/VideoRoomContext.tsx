import React, {useCallback} from 'react';
import {useJellyfishClient} from '../../src/JellyfishClientContext';

import {
  useCamera,
  useMicrophone,
  useScreencast,
  useAudioSettings,
  CaptureDevice,
  updateVideoTrackMetadata,
  updateAudioTrackMetadata,
} from '@jellyfish-dev/react-native-client-sdk';

import {
  ScreencastQuality,
  VideoQuality,
} from '@jellyfish-dev/react-native-membrane-webrtc';

import {Platform} from 'expo-modules-core';

import {useEffect, useState} from 'react';

type VideoRoomState = 'BeforeMeeting' | 'InMeeting' | 'AfterMeeting';

const VideoRoomContext = React.createContext<
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

const VideoRoomContextProvider = (props: any) => {
  const jellyfishClient = useJellyfishClient();
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
  const [VideoRoomState, setVideoRoomState] =
    useState<VideoRoomState>('BeforeMeeting');

  const joinRoom = useCallback(async () => {
    await jellyfishClient.join({
      name: 'RN mobile',
    });

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
  });
  const toggleCamera = useCallback(async () => {
    if (VideoRoomState === 'InMeeting') {
      await membraneToggleCamera();
      await updateVideoTrackMetadata({active: !isCameraOn, type: 'camera'});
    }
    setIsCameraOn(!isCameraOn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCameraOn, VideoRoomState]);

  const toggleMicrophone = useCallback(async () => {
    if (VideoRoomState === 'InMeeting') {
      await membraneToggleMicrophone();
      await updateAudioTrackMetadata({
        active: !isMicrophoneOn,
        type: 'audio',
      });
    }
    setIsMicrophoneOn(!isMicrophoneOn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMicrophoneOn, VideoRoomState]);

  const toggleScreencastAndUpdateMetadata = useCallback(() => {
    membraneToggleScreencast({
      screencastMetadata: {
        displayName: 'presenting',
        type: 'screensharing',
        active: 'true',
      },
      quality: ScreencastQuality.HD15,
    });
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
    <VideoRoomContext.Provider value={value}>
      {props.children}
    </VideoRoomContext.Provider>
  );
};

function useVideoRoomContext() {
  const context = React.useContext(VideoRoomContext);
  if (context === undefined) {
    throw new Error(
      'useVideoRoomContext must be used within a VideoRoomContextProvider',
    );
  }
  return context;
}

export {VideoRoomContextProvider, useVideoRoomContext};
