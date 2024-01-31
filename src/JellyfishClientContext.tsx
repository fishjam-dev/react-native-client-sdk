import React from 'react';

import { Metadata } from '@jellyfish-dev/react-native-client-sdk';
import { requireNativeModule, NativeModulesProxy } from 'expo-modules-core';

import { useEffect, useRef, useState } from 'react';
import { NativeEventEmitter } from 'react-native';
import { PeerMessage } from './protos/jellyfish/peer_notifications';

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

export const JellyfishContext = React.createContext<
  | {
      /**
       * Connects to the server using the websocket connection.
       * If jellyfish server is in local network, on iOS devices make sure to grant local network permission before
       * calling this function. Otherwise, the function will fail unless the user grants that permission.
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

      websocket.current?.addEventListener('message', (event) => {
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
