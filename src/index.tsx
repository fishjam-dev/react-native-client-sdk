import { useJellyfishClient } from './JellyfishClient';
import {
  Metadata,
  ConnectionOptions,
  useRoomParticipants,
  useAudioSettings,
  useAudioTrackMetadata,
  useCameraState,
  useMicrophoneState,
  useScreencast,
  useVideoTrackMetadata,
  useSimulcast,
  useBandwidthEstimation,
  useBandwidthLimit,
  useRTCStatistics,
  changeWebRTCLoggingSeverity,
  VideoRendererView,
  VideoPreviewView,
  Participant,
  AudioOutputDevice,
  AudioOutputDeviceType,
  AudioSessionMode,
  ScreencastOptions,
  TrackEncoding,
  SimulcastConfig,
  RTCStats,
  LoggingSeverity,
  VideoRendererProps,
  VideoPreviewViewProps,
} from '@jellyfish-dev/react-native-membrane-webrtc';
import React from 'react';
import { HostComponent } from 'react-native/types';

const JellyfishContext = React.createContext<
  | {
      connect: (
        url: string,
        peerToken: string,
        connectionOptions: Partial<ConnectionOptions>
      ) => Promise<void>;
      join: (peerMetadata: Metadata) => Promise<void>;
      cleanUp: () => void;
      leave: () => void;
      error: string | null;
      useRoomParticipants: () => Participant[];
      useAudioSettings: () => {
        selectedAudioOutputDevice: AudioOutputDevice | null;
        availableDevices: AudioOutputDevice[];
        selectOutputAudioDevice: (
          device: AudioOutputDeviceType
        ) => Promise<void>;
        selectAudioSessionMode: (
          audioSessionMode: AudioSessionMode
        ) => Promise<void>;
        showAudioRoutePicker: () => Promise<void>;
      };
      useAudioTrackMetadata: () => {
        updateAudioTrackMetadata: (metadata: Metadata) => Promise<void>;
      };
      useCameraState: () => {
        isCameraOn: boolean;
        toggleCamera: () => Promise<void>;
      };
      useMicrophoneState: () => {
        isMicrophoneOn: boolean;
        toggleMicrophone: () => Promise<void>;
      };
      useScreencast: () => {
        isScreencastOn: boolean;
        toggleScreencast: (
          screencastOptions?: Partial<ScreencastOptions> | undefined
        ) => Promise<void>;
        updateScreencastTrackMetadata: (metadata: Metadata) => Promise<void>;
        toggleScreencastTrackEncoding: (
          encoding: TrackEncoding
        ) => Promise<void>;
        simulcastConfig: SimulcastConfig;
        setScreencastTrackEncodingBandwidth: (
          encoding: TrackEncoding,
          bandwidth: number
        ) => Promise<void>;
        setScreencastTrackBandwidth: (bandwidth: number) => Promise<void>;
      };
      useVideoTrackMetadata: () => {
        updateVideoTrackMetadata: (metadata: Metadata) => Promise<void>;
      };
      useSimulcast: () => {
        simulcastConfig: SimulcastConfig;
        setTargetTrackEncoding: (
          trackId: string,
          encoding: TrackEncoding
        ) => Promise<void>;
        toggleVideoTrackEncoding: (encoding: TrackEncoding) => Promise<void>;
        setVideoTrackEncodingBandwidth: (
          encoding: TrackEncoding,
          bandwidth: number
        ) => Promise<void>;
      };
      useBandwidthEstimation: () => {
        estimation: number | null;
      };
      useBandwidthLimit: () => {
        setVideoTrackBandwidth: (bandwidth: number) => Promise<void>;
      };
      useRTCStatistics: (refreshInterval: number) => {
        statistics: RTCStats[];
      };
      changeWebRTCLoggingSeverity: (severity: LoggingSeverity) => Promise<void>;
      VideoRendererView: HostComponent<VideoRendererProps> | (() => never);
      VideoPreviewView: HostComponent<VideoPreviewViewProps> | (() => never);
    }
  | undefined
>(undefined);

const JellyfishContextProvider = (props: any) => {
  const { connect, join, cleanUp, leave, error } = useJellyfishClient();

  const value = {
    connect,
    join,
    cleanUp,
    leave,
    error,
    useRoomParticipants,
    useAudioSettings,
    useAudioTrackMetadata,
    useCameraState,
    useMicrophoneState,
    useScreencast,
    useVideoTrackMetadata,
    useSimulcast,
    useBandwidthEstimation,
    useBandwidthLimit,
    useRTCStatistics,
    changeWebRTCLoggingSeverity,
    VideoRendererView,
    VideoPreviewView,
  };

  return (
    <JellyfishContext.Provider value={value}>
      {props.children}
    </JellyfishContext.Provider>
  );
};

function useJellyfishState() {
  const context = React.useContext(JellyfishContext);
  if (context === undefined) {
    throw new Error('useJellyfishState must be used within a JellyfishContext');
  }
  return context;
}

export { JellyfishContextProvider, useJellyfishState };
