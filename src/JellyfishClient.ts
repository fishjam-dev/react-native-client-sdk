import { useEffect, useRef } from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';

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

  const connect = async (url: string, peerToken: string) => {
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
            token: peerToken,
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
        console.log('INNE', data);

        Membrane.receiveMediaEvent(data.data);
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
