import { useEffect, useRef } from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';
export {
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
} from '@jellyfish-dev/react-native-membrane-webrtc';

const Membrane = NativeModules.Membrane
  ? NativeModules.Membrane
  : new Proxy(
      {},
      {
        get() {
          throw new Error('LINKING_ERROR');
        },
      }
    );

const eventEmitter = new NativeEventEmitter(Membrane);

export function useJellyfishClient() {
  const url = 'ws://192.168.83.221:4000/socket/peer/websocket';
  const connectionOptions = {
    token: '',
    peerMetadata: { name: 'Bob' },
    isSimulcastOn: false,
  };
  const websocket = useRef<WebSocket | null>(null);

  const sendMediaEvent = (mediaEvent: string) => {
    const messageJS = {
      type: 'mediaEvent',
      data: mediaEvent,
    };

    const message = JSON.stringify(messageJS);
    console.log('SEND MEDIA EVENT', message);
    websocket.current?.send(message);
  };

  useEffect(() => {
    const eventListener = eventEmitter.addListener(
      'SendMediaEvent',
      sendMediaEvent
    );
    return () => eventListener.remove();
  }, []);

  const connect = async () => {
    websocket.current = new WebSocket(url);

    websocket.current.addEventListener('open', () => {
      console.log('OPEN');
    });
    websocket.current.addEventListener('error', (err) => {
      console.log('error', err);
    });
    websocket.current.addEventListener('close', (ev) => {
      console.log('close', ev);
    });

    websocket.current.addEventListener('open', () => {
      websocket.current?.send(
        JSON.stringify({
          type: 'controlMessage',
          data: {
            type: 'authRequest',
            token:
              'SFMyNTY.g2gDdAAAAAJkAAdwZWVyX2lkbQAAACQ5MGQ3M2FmZS05YzEwLTQ5MWQtYmI2ZS1jZTU0MmVmZTFjZDlkAAdyb29tX2lkbQAAACQ0N2VjZjg3Yy0wZjQ2LTRjZjItYTI5Yi1hOWI3ZjNiYzNmOGFuBgD5ajEziAFiAAFRgA.VmcdQQs4UDB6e3tPIX4m_Tvm2OsKg_3exwlpiofKkVQ',
          },
        })
      );
      console.log('SEND');
    });

    websocket.current.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'controlMessage') {
        if (data.data.type === 'authenticated') {
          console.log('auth good');
        } else if (data.data.type === 'unauthenticated') {
          console.log('auth error');
        }
      } else {
        console.log(data);

        Membrane.receiveMediaEvent(event.data);
      }
    });

    websocket.current.addEventListener('open', async () => {
      await Membrane.create(url, connectionOptions);
      await Membrane.join({ name: 'Bob' });
    });
  };

  const cleanUp = () => {
    Membrane.disconnect();
    websocket.current?.close();
    websocket.current = null;
    console.log('onDisconnected');
  };

  return { connect, cleanUp };
}
