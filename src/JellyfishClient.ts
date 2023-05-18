import { NativeModules } from 'react-native';

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

export class JellyfishClient {
  url = 'ws://localhost:4000/socket/peer/websocket';
  connectionOptions = {
    token: '',
    peerMetadata: { name: 'Bob' },
    isSimulcastOn: false,
  };
  websocket: WebSocket | null = null;

  connect = async () => {
    this.websocket = new WebSocket(this.url);

    this.websocket.addEventListener('open', () => {
      console.log('OPEN');
    });
    this.websocket.addEventListener('error', () => {
      console.log('error');
    });
    this.websocket.addEventListener('close', () => {
      console.log('close');
    });

    this.websocket.addEventListener('open', () => {
      this.websocket?.send(
        JSON.stringify({
          type: 'controlMessage',
          data: {
            type: 'authRequest',
            token:
              'SFMyNTY.g2gDdAAAAAJkAAdwZWVyX2lkbQAAACRiNzkwYzY2MC0xZTZhLTQ5NjctODIxZi02ZDQyNzE5ZGJiZjdkAAdyb29tX2lkbQAAACQ3ZThmM2RhYS1hOGIzLTQ1MDUtYTZiNC1iNWVmYmIwMDg1NjduBgAciwkuiAFiAAFRgA.o1W2fTWF_vd5O6xw70KxBr4fMyWe9GB6uYavoQxjbBs',
          },
        })
      );
      console.log('SEND');
    });

    this.websocket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'controlMessage') {
        if (data.data.type === 'authenticated') {
          console.log('auth good');
        } else if (data.data.type === 'unauthenticated') {
          console.log('auth error');
        }
      } else {
        Membrane.receiveMediaEvent(event.data);
      }
    });

    await Membrane.create(this.url, this.connectionOptions);
    this.websocket.addEventListener('open', async () => {
      await Membrane.join({ name: 'Bob' });
    });
  };

  cleanUp() {
    Membrane.disconnect();
    this.websocket?.close();
    this.websocket = null;
    console.log('onDisconnected');
  }
}
