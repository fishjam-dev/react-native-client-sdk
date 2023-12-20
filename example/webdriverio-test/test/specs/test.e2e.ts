import {driver} from '@wdio/globals';
import {
  connectScreenLabels,
  roomScreenLabels,
  previewScreenLabels,
} from '../../../types/ComponentLabels';

import {
  getElement,
  getWebsocketUrl,
  getHttpUrl,
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
const {URL_INPUT, TOKEN_INPUT, CONNECT_BUTTON} = connectScreenLabels;
const {
  JOIN_BUTTON,
  TOGGLE_CAMERA_BUTTON: TOGGLE_CAMERA_BUTTON_PREVIEW,
  TOGGLE_MICROPHONE_BUTTON: TOGGLE_MICROPHONE_BUTTON_PREVIEW,
} = previewScreenLabels;
const {
  SWITCH_CAMERA_BUTTON,
  TOGGLE_STATISTICS_BUTTON,
  SHARE_SCREEN_BUTTON,
  DISCONNECT_BUTTON,
  TOGGLE_CAMERA_BUTTON,
  NO_CAMERA_VIEW,
  TOGGLE_MICROPHONE_BUTTON,
  VIDEO_STATISTICS_RTC,
  AUDIO_STATISTICS_RTC,
  VIDEO_CELL,
} = roomScreenLabels;

const configParam: ConfigurationParameters = {
  accessToken: 'development',
  basePath: getHttpUrl(process.env.JELLYFISH_HOST_SERVER as string),
};
const config = new Configuration(configParam);
const createJellyfishRoom = async () => {
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
  before(async () => {
    room = await createJellyfishRoom();
    assert.ok(room !== undefined);
    peerDetail = await addPeerToRoom(room.id);
    assert.ok(peerDetail !== undefined);
  });
  it('type jellyfish url and token', async () => {
    assert.ok(peerDetail !== undefined);
    const webSocketUrl = getWebsocketUrl(
      process.env.JELLYFISH_HOST_MOBILE as string,
    );
    await typeToInput(driver, '~' + TOKEN_INPUT, peerDetail.token);
    await typeToInput(driver, '~' + URL_INPUT, webSocketUrl);
    await compareInputValue(driver, '~' + TOKEN_INPUT, peerDetail?.token);
    await compareInputValue(driver, '~' + URL_INPUT, webSocketUrl);
  });
  it('request necessary permissions and connect', async () => {
    await tapButton(driver, '~' + CONNECT_BUTTON);
    if (driver.isIOS) {
      await driver.acceptAlert();
      await tapApp(driver);
      await tapButton(driver, '~' + CONNECT_BUTTON);
      await driver.acceptAlert();
    }
  });
  it('toggle off preview camera and microphone then join the room', async () => {
    await tapButton(driver, '~' + TOGGLE_MICROPHONE_BUTTON_PREVIEW);
    await tapButton(driver, '~' + TOGGLE_CAMERA_BUTTON_PREVIEW);
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
    await getElement(driver, '~' + VIDEO_CELL + 1, true);
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
    await getElement(driver, '~' + VIDEO_CELL + 3, true);
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
  // todo fix metadata emitting
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('check if only 1 video cell', async () => {
    await getElement(driver, '~' + VIDEO_CELL + 0);
    await getElement(driver, '~' + VIDEO_CELL + 1, true);
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
