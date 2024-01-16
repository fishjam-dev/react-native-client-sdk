import {driver} from '@wdio/globals';
import type {Suite} from 'mocha';
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
  // compareInputValue,
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
  SHARE_SCREEN_BUTTON,
  DISCONNECT_BUTTON,
  TOGGLE_CAMERA_BUTTON,
  NO_CAMERA_VIEW,
  TOGGLE_MICROPHONE_BUTTON,
  VIDEO_CELL,
} = roomScreenLabels;

type Test = {
  name: string;
  run: () => Promise<void>;
  skip: boolean;
};

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

const tests: Test[] = [
  {
    name: 'create room and peer to obtain credentials',
    run: async () => {
      room = await createJellyfishRoom();
      assert.ok(room !== undefined);
      peerDetail = await addPeerToRoom(room.id);
      assert.ok(peerDetail !== undefined);
    },
    skip: false,
  },
  {
    name: 'type jellyfish url and token',
    run: async () => {
      assert.ok(peerDetail !== undefined);
      const webSocketUrl = getWebsocketUrl(
        process.env.JELLYFISH_HOST_MOBILE as string,
      );
      await typeToInput(driver, '~' + TOKEN_INPUT, peerDetail.token);
      await typeToInput(driver, '~' + URL_INPUT, webSocketUrl);
      // await compareInputValue(driver, '~' + TOKEN_INPUT, peerDetail?.token);
      // await compareInputValue(driver, '~' + URL_INPUT, webSocketUrl);
    },
    skip: false,
  },
  {
    name: 'request necessary permissions and connect',
    run: async () => {
      await tapButton(driver, '~' + CONNECT_BUTTON);
      if (driver.isIOS) {
        await driver.acceptAlert();
        await tapApp(driver);
        await tapButton(driver, '~' + CONNECT_BUTTON);
        await driver.pause(200);
        await driver.acceptAlert();
      }
    },
    skip: false,
  },

  {
    name: 'toggle off preview camera and microphone then join the room',
    run: async () => {
      await tapButton(driver, '~' + TOGGLE_MICROPHONE_BUTTON_PREVIEW);
      await tapButton(driver, '~' + TOGGLE_CAMERA_BUTTON_PREVIEW);
      await tapButton(driver, '~' + JOIN_BUTTON);
      if (driver.isIOS) {
        await driver.pause(200);
        await driver.acceptAlert();
      }
    },
    skip: false,
  },
  {
    name: 'check if no camera view',
    run: async () => {
      await getElement(driver, '~' + NO_CAMERA_VIEW);
    },
    skip: false,
  },
  {
    name: 'toggle camera on',
    run: async () => {
      await tapButton(driver, '~' + TOGGLE_CAMERA_BUTTON);
    },
    skip: false,
  },
  {
    name: 'check if only one video cell',
    run: async () => {
      await getElement(driver, '~' + VIDEO_CELL + 0);
      await getElement(driver, '~' + VIDEO_CELL + 1, true);
    },
    skip: false,
  },
  {
    name: 'switch camera',
    run: async () => {
      await tapButton(driver, '~' + SWITCH_CAMERA_BUTTON);
    },
    skip: false,
  },
  {
    name: 'screen share on',
    run: async () => {
      await tapButton(driver, '~' + SHARE_SCREEN_BUTTON);
      if (driver.isAndroid) {
        await tapButton(driver, '//*[@text="Start now"]');
      } else {
        await tapButton(
          driver,
          '//XCUIElementTypeButton[@name="Start Broadcast"]',
        );
        await driver.pause(200);
        await tapApp(driver);
      }
    },
    skip: process.env.GITHUB_ACTIONS === 'true',
  },

  {
    name: 'check if two video cells',
    run: async () => {
      await getElement(driver, '~' + VIDEO_CELL + 0);
      await getElement(driver, '~' + VIDEO_CELL + 1);
      await getElement(driver, '~' + VIDEO_CELL + 3, true);
    },
    skip: process.env.GITHUB_ACTIONS === 'true',
  },
  {
    name: 'toggle camera off',
    run: async () => {
      await tapButton(driver, '~' + TOGGLE_CAMERA_BUTTON);
      await driver.pause(200);
      await tapButton(
        driver,
        '//XCUIElementTypeButton[@name="Stop Broadcast"]',
      );
      await getElement(driver, '~' + NO_CAMERA_VIEW);
    },
    skip: false,
  },
  {
    name: 'check if only 1 video cell',
    run: async () => {
      await getElement(driver, '~' + VIDEO_CELL + 0);
      await getElement(driver, '~' + VIDEO_CELL + 1, true);
    },
    skip: true, // todo fix metadata emitting
  },
  {
    name: 'screen share off',
    run: async () => {
      await tapButton(driver, '~' + SHARE_SCREEN_BUTTON);
      await tapApp(driver);
    },
    skip: process.env.GITHUB_ACTIONS === 'true',
  },
  {
    name: 'check if no camera view again',
    run: async () => {
      await getElement(driver, '~' + NO_CAMERA_VIEW);
    },
    skip: false,
  },
  {
    name: 'toggle microphone on',
    run: async () => {
      await tapButton(driver, '~' + TOGGLE_MICROPHONE_BUTTON);
    },
    skip: false,
  },
  {
    name: 'toggle microphone off',
    run: async () => {
      await tapButton(driver, '~' + TOGGLE_MICROPHONE_BUTTON);
    },
    skip: false,
  },
  {
    name: 'disconnect from room',
    run: async () => {
      await tapButton(driver, '~' + DISCONNECT_BUTTON);
    },
    skip: false,
  },
];
describe('Walk through app', async function (this: Suite): Promise<void> {
  tests.forEach(({name, run, skip}) => {
    const testFunction = skip ? it.skip : it;
    testFunction(name, async () => {
      await run();
    }).retries(4);
  });
});
