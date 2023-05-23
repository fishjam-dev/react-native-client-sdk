import {
  Metadata,
  ConnectionOptions,
} from '@jellyfish-dev/react-native-membrane-webrtc';
import { useEffect, useRef } from 'react';
import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-membrane' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const Membrane = NativeModules.Membrane
  ? NativeModules.Membrane
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

const eventEmitter = new NativeEventEmitter(Membrane);

/**
 * A hook used to interact with jellyfish server.
 */
export function useJellyfishClient() {
  const websocket = useRef<WebSocket | null>(null);

  const sendMediaEvent = (mediaEvent: string) => {
    const messageJS = {
      type: 'mediaEvent',
      data: mediaEvent,
    };
    websocket.current?.send(JSON.stringify(messageJS));
  };

  useEffect(() => {
    const eventListener = eventEmitter.addListener(
      'SendMediaEvent',
      sendMediaEvent
    );
    return () => eventListener.remove();
  }, []);

  /**
   * Connects to the server using the websocket connection
   *
   * @param url - websocket url
   * @param peerToken - token used to authenticate when joining the room
   * @param connectionOptions - Configuration object for the connection
   */
  const connect = async (
    url: string,
    peerToken: string,
    connectionOptions?: Partial<ConnectionOptions>
  ) => {
    websocket.current = new WebSocket(url);

    websocket.current.addEventListener('open', () => {
      console.log('open');
    });
    websocket.current.addEventListener('error', (err) => {
      console.log('error', err);
    });
    websocket.current.addEventListener('close', (event) => {
      console.log('close', event);
    });

    websocket.current.addEventListener('open', () => {
      websocket.current?.send(
        JSON.stringify({
          type: 'controlMessage',
          data: {
            type: 'authRequest',
            token: peerToken,
          },
        })
      );
    });

    websocket.current.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'controlMessage') {
        if (data.data.type === 'authenticated') {
          console.log('authenticated');
        } else if (data.data.type === 'unauthenticated') {
          console.log('authentication error');
        }
      } else {
        Membrane.receiveMediaEvent(data.data);
      }
    });

    await Membrane.create(url, connectionOptions);
  };

  /**
   * Tries to join the room. If user is accepted then {@link JellyfishClient.onJoinSuccess} will be called.
   * In other case {@link JellyfishClient.onJoinError} is invoked.
   * @param peerMetadata - Any information that other peers will receive in onPeerJoined
   * after accepting this peer
   */
  const join = async (peerMetadata: Metadata = {}) => {
    await Membrane.join(peerMetadata);
  };

  /**
   * Disconnect from the room, and close the websocket connection. Tries to leave the room gracefully, but if it fails,
   * it will close the websocket anyway.
   */
  const cleanUp = () => {
    Membrane.disconnect();
    websocket.current?.close();
    websocket.current = null;
    console.log('onDisconnected');
  };

  /**
   * Leaves the room. This function should be called when user leaves the room in a clean way e.g. by clicking a
   * dedicated, custom button `disconnect`. As a result there will be generated one more media event that should be sent
   * to the RTC Engine. Thanks to it each other peer will be notified that peer left in {@link MessageEvents.onPeerLeft},
   */
  const leave = () => {
    Membrane.disconnect();
  };

  return { connect, join, cleanUp, leave };
}
