import {driver} from '@wdio/globals';
import {
  CONNECT_BUTTON,
  DISCONNECT_BUTTON,
  SWITCH_CAMERA_BUTTON,
  TOGGLE_CAMERA_BUTTON,
  TOKEN_INPUT,
  URL_INPUT,
} from '../../../types/ComponentLabels';

import {tapApp, tapButton, typeToInput} from '../../utils';

import * as assert from 'assert';
import {
  AddPeerRequest,
  Configuration,
  ConfigurationParameters,
  PeerDetailsResponseData,
  Room,
  RoomApiFp,
} from '../../server-api';

const createJellysifhRoom = async () => {
  const configParam: ConfigurationParameters = {
    accessToken: 'development',
    basePath: `http://localhost:5002`,
  };
  const config = new Configuration(configParam);
  const {createRoom} = RoomApiFp(config);
  const createRoomFunction = await createRoom();
  try {
    const response = await createRoomFunction();
    return response.data.data.room;
  } catch (e) {
    console.log(e);
    return;
  }
};
const addPeerToRoom = async (
  roomId: string,
  enableSimulcast: boolean = true,
) => {
  const configParam: ConfigurationParameters = {
    accessToken: 'development',
    basePath: `http://localhost:5002`,
  };
  const config = new Configuration(configParam);
  const {addPeer} = RoomApiFp(config);
  const addPeerRequest: AddPeerRequest = {
    type: 'webrtc',
    options: {enableSimulcast: enableSimulcast},
  };
  const addPeerFunction = await addPeer(roomId, addPeerRequest);
  try {
    const response = await addPeerFunction();
    return response.data.data;
  } catch (e) {
    console.log(e);
    return;
  }
};

var peerDetail: PeerDetailsResponseData | undefined;
var room: Room | undefined;

describe('Walk through app', async () => {
  it('create room and peer to obtain credentials', async () => {
    room = await createJellysifhRoom();
    assert.ok(room !== undefined);
    peerDetail = await addPeerToRoom(room.id);
    assert.ok(peerDetail !== undefined);
  });
  it('type jellyfish url and token', async () => {
    assert.ok(peerDetail !== undefined);
    const webSocketUrl = 'ws://10.0.2.2:5002/socket/peer/websocket';
    await typeToInput(driver, '~' + TOKEN_INPUT, peerDetail.token);
    await typeToInput(driver, '~' + URL_INPUT, webSocketUrl);
  });
  it('connect, request necesary permissions and move to room', async () => {
    await tapButton(driver, '~' + CONNECT_BUTTON);

    if (driver.isIOS) {
      await driver.acceptAlert();
      await tapApp(driver);
      await tapButton(driver, '~' + CONNECT_BUTTON);
      await driver.acceptAlert();
    }
  });
  it('toggle camera', async () => {
    await tapButton(driver, '~' + TOGGLE_CAMERA_BUTTON);
    await tapButton(driver, '~' + TOGGLE_CAMERA_BUTTON);
  });
  it('switch camera', async () => {
    await tapButton(driver, '~b' + SWITCH_CAMERA_BUTTON);
    await tapButton(driver, '~' + SWITCH_CAMERA_BUTTON);
  });

  it('share screen', async () => {
    await tapButton(driver, '~' + DISCONNECT_BUTTON);
  });
});
