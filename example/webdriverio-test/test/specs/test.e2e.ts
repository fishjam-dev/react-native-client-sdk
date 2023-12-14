import {driver} from '@wdio/globals';
import {
  CONNECT_BUTTON,
  DISCONNECT_BUTTON,
  JOIN_BUTTON,
  SHARE_SCREEN_BUTTON,
  SWITCH_CAMERA_BUTTON,
  TOGGLE_CAMERA_BUTTON,
  TOGGLE_MICROPHONE_BUTTON,
  TOKEN_INPUT,
  URL_INPUT,
  VIDEO_STATISTICS_RTC,
  AUDIO_STATISTICS_RTC,
  TOGGLE_STATISTICS_BUTTON,
  NO_CAMERA_VIEW,
  VIDEO_CELL,
} from '../../../types/ComponentLabels';

import {
  getElement,
  getWebsocketUrl,
  tapApp,
  tapButton,
  typeToInput,
  compareInputValue,
} from '../../utils';

import {
  AddPeerRequest,
  Configuration,
  ConfigurationParameters,
  PeerDetailsResponseData,
  Room,
  RoomApiFp,
} from '../../../server-api';

import * as assert from 'assert';

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
    const webSocketUrl = getWebsocketUrl();
    await typeToInput(driver, '~' + TOKEN_INPUT, peerDetail.token);
    await typeToInput(driver, '~' + URL_INPUT, webSocketUrl);
    await compareInputValue(driver, '~' + TOKEN_INPUT, peerDetail?.token);
    await compareInputValue(driver, '~' + URL_INPUT, webSocketUrl);
  });
  it('request necesary permissions and connect', async () => {
    await tapButton(driver, '~' + CONNECT_BUTTON);
    if (driver.isIOS) {
      await driver.acceptAlert();
      await tapApp(driver);
      await tapButton(driver, '~' + CONNECT_BUTTON);
      await driver.acceptAlert();
    }
  });
  it('toggle off preview camera and microphone then join the room', async () => {
    await tapButton(driver, '~' + TOGGLE_MICROPHONE_BUTTON);
    await tapButton(driver, '~' + TOGGLE_CAMERA_BUTTON);
    await tapButton(driver, '~' + JOIN_BUTTON);
  });
  it('check if no camera view', async () => {
    await getElement(driver, '~' + NO_CAMERA_VIEW);
  });
  it('toggle camera on', async () => {
    await tapButton(driver, '~' + TOGGLE_CAMERA_BUTTON);
  });
  it('check if only one video cell', async () => {
    await getElement(driver, '~' + VIDEO_CELL + 0);
    await getElement(driver, '~' + VIDEO_CELL + 1, false);
  });
  it('switch camera', async () => {
    await tapButton(driver, '~' + SWITCH_CAMERA_BUTTON);
    await tapButton(driver, '~' + SWITCH_CAMERA_BUTTON);
  });
  it('screen share on', async () => {
    await tapButton(driver, '~' + SHARE_SCREEN_BUTTON);
    if (driver.isAndroid) {
      await tapButton(driver, '//*[@text="Start now"]');
    } else {
      await tapButton(
        driver,
        '//XCUIElementTypeButton[@name="Start Broadcast"]',
      );
      await tapApp(driver);
      await tapButton(
        driver,
        '//XCUIElementTypeButton[@name="Stop Broadcast"]',
      );
    }
  });
  it('check if two video cells', async () => {
    await getElement(driver, '~' + VIDEO_CELL + 0);
    await getElement(driver, '~' + VIDEO_CELL + 1);
    await getElement(driver, '~' + VIDEO_CELL + 3, false);
  });
  it('toggle video statistics on ', async () => {
    await tapButton(driver, '~' + TOGGLE_STATISTICS_BUTTON);
    await tapButton(driver, '~' + VIDEO_STATISTICS_RTC);
  });
  it('toggle video statistics off ', async () => {
    await tapButton(driver, '~' + VIDEO_STATISTICS_RTC);
    await tapButton(driver, '~' + TOGGLE_STATISTICS_BUTTON);
  });
  it('toggle camera off', async () => {
    await tapButton(driver, '~' + TOGGLE_CAMERA_BUTTON);
    await getElement(driver, '~' + NO_CAMERA_VIEW);
  });
  it('check if only 1 video cell', async () => {
    await getElement(driver, '~' + VIDEO_CELL + 0);
    await getElement(driver, '~' + VIDEO_CELL + 1, false);
  });
  it('screen share off', async () => {
    await tapButton(driver, '~' + SHARE_SCREEN_BUTTON);
    await tapApp(driver);
  });
  it('check if no camera view again', async () => {
    await getElement(driver, '~' + NO_CAMERA_VIEW);
  });
  it('toggle video statistics on again ', async () => {
    await tapButton(driver, '~' + TOGGLE_STATISTICS_BUTTON);
    await tapButton(driver, '~' + VIDEO_STATISTICS_RTC);
  });
  it('toggle video statistics off again ', async () => {
    await tapButton(driver, '~' + VIDEO_STATISTICS_RTC);
    await tapButton(driver, '~' + TOGGLE_STATISTICS_BUTTON);
  });
  it('toggle microphone on', async () => {
    await tapButton(driver, '~' + TOGGLE_MICROPHONE_BUTTON);
  });
  it('toggle audio statistics on ', async () => {
    await tapButton(driver, '~' + TOGGLE_STATISTICS_BUTTON);
    await tapButton(driver, '~' + AUDIO_STATISTICS_RTC);
  });
  it('toggle audio statistics off ', async () => {
    await tapButton(driver, '~' + AUDIO_STATISTICS_RTC);
    await tapButton(driver, '~' + TOGGLE_STATISTICS_BUTTON);
  });
  it('toggle microphone off', async () => {
    await tapButton(driver, '~' + TOGGLE_MICROPHONE_BUTTON);
  });
  it('toggle audio statistics on again', async () => {
    await tapButton(driver, '~' + TOGGLE_STATISTICS_BUTTON);
    await tapButton(driver, '~' + AUDIO_STATISTICS_RTC);
  });
  it('toggle audio statistics off again', async () => {
    await tapButton(driver, '~' + AUDIO_STATISTICS_RTC);
    await tapButton(driver, '~' + TOGGLE_STATISTICS_BUTTON);
  });
  it('disconnect from room', async () => {
    await tapButton(driver, '~' + DISCONNECT_BUTTON);
  });
});
