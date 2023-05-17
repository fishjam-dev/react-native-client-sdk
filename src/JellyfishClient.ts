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
  connect(): void {
    Membrane.create();
  }

  cleanUp() {
    try {
      this.webrtc?.leave();
      this.webrtc?.cleanUp();
    } catch (e) {
      console.warn(e);
    }
    this.websocket?.close();
    this.websocket = null;
    this.emit('onDisconnected');
  }
}
