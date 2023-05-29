import WS from 'jest-websocket-mock';
import { renderHook, act } from '@testing-library/react';
import { JellyfishContextProvider, useJellyfishClient } from '..';
import { PeerMessage } from '../protos/jellyfish/peer_notifications';
import { NativeModules } from 'react-native';

let sendEvent: null | ((mediaEvent: string) => void) = null;

jest.mock('@jellyfish-dev/react-native-membrane-webrtc');
jest.mock('react-native', () => ({
  NativeModules: {
    Membrane: {
      receiveMediaEvent: jest.fn(),
      create: jest.fn(),
    },
  },
  Platform: {
    select: jest.fn(),
  },
  NativeEventEmitter: jest.fn().mockImplementation(() => ({
    addListener: jest.fn((_, _sendEvent) => {
      sendEvent = _sendEvent;
      return { remove: jest.fn() };
    }),
  })),
  UIManager: {
    getViewManagerConfig: jest.fn(),
  },
}));

function encodePeerMessage(peerMessage: object) {
  const encodedAsNodeBuffer = PeerMessage.encode(peerMessage).finish();

  const newBuffer = new ArrayBuffer(encodedAsNodeBuffer.byteLength);
  const newBufferView = new Uint8Array(newBuffer);
  newBufferView.set(encodedAsNodeBuffer, 0);

  return newBuffer;
}

describe('JellyfishClient', () => {
  afterEach(() => {
    WS.clean();
  });

  const setUpAndConnect = async () => {
    const server = new WS('ws://localhost:1234');

    const { result } = renderHook(() => useJellyfishClient(), {
      wrapper: JellyfishContextProvider,
    });

    const connectPromise = result.current.connect(
      'ws://localhost:1234',
      'token',
      {}
    );

    await server.connected;

    const msg = await server.nextMessage;

    expect(msg).toEqual(
      PeerMessage.encode({
        authRequest: { token: 'token' },
      }).finish()
    );

    server.send(
      encodePeerMessage({
        authenticated: true,
      })
    );

    await connectPromise;

    return { server, result };
  };

  it('connects and resolves', async () => {
    await setUpAndConnect();
  });

  it('rejects if socket error', async () => {
    const server = new WS('ws://localhost:1234');

    const {
      result: {
        current: { connect },
      },
    } = renderHook(() => useJellyfishClient(), {
      wrapper: JellyfishContextProvider,
    });

    const connectPromise = connect('ws://localhost:1234', 'token', {});

    act(() => {
      server.error({ code: 1234, reason: 'An error', wasClean: false });
    });

    await expect(connectPromise).rejects.toThrow(
      new Error('WebSocket was closed: 1234 An error')
    );
  });

  it('returns error if it happens after a connection is established', async () => {
    const { server, result } = await setUpAndConnect();
    act(() => {
      server.error({ code: 3000, reason: 'An error', wasClean: false });
    });
    expect(result.current.error).toEqual('3000 An error');
  });

  it('sends media event', async () => {
    const { server } = await setUpAndConnect();

    sendEvent?.('join');

    const msg = await server.nextMessage;

    expect(msg).toEqual(
      PeerMessage.encode({
        mediaEvent: { data: 'join' },
      }).finish()
    );
  });

  it('receives media event', async () => {
    const { server } = await setUpAndConnect();

    const receivePromise = new Promise((resolve) => {
      NativeModules.Membrane.receiveMediaEvent.mockImplementation(resolve);
    });

    server.send(
      encodePeerMessage({
        mediaEvent: {
          data: 'sdpOffer',
        },
      })
    );

    await receivePromise;

    expect(NativeModules.Membrane.receiveMediaEvent).toHaveBeenCalledWith(
      'sdpOffer'
    );
  });
});
