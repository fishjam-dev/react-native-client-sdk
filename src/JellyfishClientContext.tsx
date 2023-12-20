import React, { useCallback } from 'react';

import {
  Metadata,
  useAudioSettings,
  VideoQuality,
  CaptureDevice,
  updateVideoTrackMetadata,
  updateAudioTrackMetadata,
  useCamera,
  useMicrophone,
  useScreencast,
  ScreencastQuality,
} from '@jellyfish-dev/react-native-membrane-webrtc';

import {
  requireNativeModule,
  NativeModulesProxy,
  Platform,
} from 'expo-modules-core';

import { useEffect, useRef, useState } from 'react';
import { NativeEventEmitter } from 'react-native';
import { PeerMessage } from './protos/jellyfish/peer_notifications';

type VideoroomState = 'BeforeMeeting' | 'InMeeting' | 'AfterMeeting';
const membraneModule = requireNativeModule('MembraneWebRTC');

const eventEmitter = new NativeEventEmitter(
  membraneModule ?? NativeModulesProxy.MembraneWebRTC
);

const generateMessage = (event: WebSocketCloseEvent) => {
  return (
    'WebSocket was closed: ' +
    [event.message, event.code, event.reason].filter((i) => !!i).join(' ')
  );
};
const JellyfishContext = React.createContext<
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
      /**
       * Connects to the server using the websocket connection.
       *
       * @param url - websocket url
       * @param peerToken - token used to authenticate when joining the room
       */
      connect: (url: string, peerToken: string) => Promise<void>;

      /**
       * Tries to join the room. If user is accepted then onJoinSuccess will be called.
       * In other case onJoinError is invoked.
       * @param peerMetadata - Any information that other peers will receive in onPeerJoined
       * after accepting this peer.
       */

      join: (peerMetadata: Metadata) => Promise<void>;
      /**
       * Disconnect from the room, and close the websocket connection. Tries to leave the room gracefully, but if it fails,
       * it will close the websocket anyway.
       */
      cleanUp: () => void;

      /**
       * Leaves the room. This function should be called when user leaves the room in a clean way e.g. by clicking a
       * dedicated, custom button `disconnect`. As a result there will be generated one more media event that should be sent
       * to the RTC Engine. Thanks to it each other peer will be notified that peer left in MessageEvents.onPeerLeft.
       */
      leave: () => void;
      error: string | null;
    }
  | undefined
>(undefined);

const JellyfishContextProvider = (props: any) => {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
  const [currentCamera, setCurrentCamera] = useState<CaptureDevice | null>(
    null
  );
  const {
    toggleCamera: membraneToggleCamera,
    startCamera,
    flipCamera,
    getCaptureDevices,
  } = useCamera();
  const { toggleMicrophone: membraneToggleMicrophone, startMicrophone } =
    useMicrophone();
  const { isScreencastOn, toggleScreencast: membraneToggleScreencast } =
    useScreencast();
  useAudioSettings();
  const [videoroomState, setVideoroomState] =
    useState<VideoroomState>('BeforeMeeting');
  const [error, setError] = useState<string | null>(null);
  const websocket = useRef<WebSocket | null>(null);

  const sendMediaEvent = ({ event }: { event: string }) => {
    if (websocket.current?.readyState !== WebSocket.OPEN) {
      return;
    }
    const message = PeerMessage.encode({
      mediaEvent: { data: event },
    }).finish();
    websocket.current?.send(message);
  };

  useEffect(() => {
    const eventListener = eventEmitter.addListener(
      'SendMediaEvent',
      sendMediaEvent
    );
    return () => eventListener.remove();
  }, []);

  const connect = async (url: string, peerToken: string) => {
    setError(null);
    websocket.current = new WebSocket(url);

    const processIncomingMessages = new Promise<void>((resolve, reject) => {
      websocket.current?.addEventListener('close', (event) => {
        if (event.code !== 1000 || event.isTrusted === false) {
          setError(generateMessage(event));
          reject(new Error(generateMessage(event)));
        }
      });

      websocket.current?.addEventListener('open', () => {
        const message = PeerMessage.encode({
          authRequest: {
            token: peerToken,
          },
        }).finish();
        websocket.current?.send(message);
      });

      websocket.current?.addEventListener('message', async (event) => {
        const uint8Array = new Uint8Array(event.data);
        try {
          const data = PeerMessage.decode(uint8Array);
          if (data.authenticated !== undefined) {
            resolve();
          } else if (data.authRequest !== undefined) {
            reject(
              new Error('Received unexpected control message: authRequest')
            );
          } else if (data.mediaEvent !== undefined) {
            membraneModule.receiveMediaEvent(data.mediaEvent.data);
          }
        } catch (e) {
          setError(String(e));
        }
      });
    });

    await processIncomingMessages;
    await membraneModule.create();
  };

  const joinRoom = useCallback(async () => {
    await join({ name: 'RN mobile' });

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
    await startMicrophone({
      audioTrackMetadata: { active: isMicrophoneOn, type: 'audio' },
      microphoneEnabled: isMicrophoneOn,
    });
    setVideoroomState('InMeeting');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCameraOn, isMicrophoneOn]);

  useEffect(() => {
    getCaptureDevices().then((devices) => {
      setCurrentCamera(devices.find((device) => device.isFrontFacing) || null);
    });
  });
  const toggleCamera = useCallback(async () => {
    if (videoroomState === 'InMeeting') {
      await membraneToggleCamera();
      await updateVideoTrackMetadata({ active: !isCameraOn, type: 'camera' });
    }
    setIsCameraOn(!isCameraOn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCameraOn, videoroomState]);

  const toggleMicrophone = useCallback(async () => {
    if (videoroomState === 'InMeeting') {
      await membraneToggleMicrophone();
      await updateAudioTrackMetadata({
        active: !isMicrophoneOn,
        type: 'audio',
      });
    }
    setIsMicrophoneOn(!isMicrophoneOn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMicrophoneOn, videoroomState]);

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

  const join = async (peerMetadata: Metadata = {}) => {
    setError(null);
    await membraneModule.connect(peerMetadata);
  };

  const cleanUp = () => {
    setError(null);
    membraneModule.disconnect();
    websocket.current?.close();
    websocket.current = null;
  };

  const leave = () => {
    setError(null);
    membraneModule.disconnect();
  };

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
    connect,
    join,
    cleanUp,
    leave,
    error,
  };

  return (
    <JellyfishContext.Provider value={value}>
      {props.children}
    </JellyfishContext.Provider>
  );
};

function useJellyfishClient() {
  const context = React.useContext(JellyfishContext);
  if (context === undefined) {
    throw new Error(
      'useJellyfishClient must be used within a JellyfishContextProvider'
    );
  }
  return context;
}

export { JellyfishContextProvider, useJellyfishClient };
