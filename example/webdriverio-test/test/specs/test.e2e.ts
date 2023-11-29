import {driver} from '@wdio/globals';
import {
  CONNECT_BUTTON,
  DISCONNECT_BUTTON,
  SHARE_SCREEN_BUTTON,
  SWITCH_CAMERA_BUTTON,
  TOGGLE_CAMERA_BUTTON,
  TOKEN_INPUT,
  URL_INPUT,
} from '../../../types/ComponentLabels';

import {
  platformJellyfishToken,
  tapApp,
  tapButton,
  typeToInput,
} from '../../utils';

import * as assert from 'assert';

describe('Walk through app', async () => {
  it('type jellyfish url and token', async () => {
    await driver.pause(2000);

    await typeToInput(
      driver,
      '~' + TOKEN_INPUT,
      platformJellyfishToken(driver),
    );
    assert.ok(process.env.JELLYFISH_URL !== undefined);
    await typeToInput(driver, '~' + URL_INPUT, process.env.JELLYFISH_URL);
    if (driver.isAndroid) {
      await driver.pause(10000);
    }
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
    await tapButton(driver, '~' + SWITCH_CAMERA_BUTTON);
    await tapButton(driver, '~' + SWITCH_CAMERA_BUTTON);
  });

  it('share screen', async () => {
    await tapButton(driver, '~' + SHARE_SCREEN_BUTTON);

    if (driver.isAndroid) {
      await tapButton(driver, '//*[@text="Start now"]');
      await driver.pause(2000);
      await tapButton(driver, '~' + SHARE_SCREEN_BUTTON);
    } else {
      await tapButton(
        driver,
        '//XCUIElementTypeButton[@name="Start Broadcast"]',
      );
      await tapApp(driver);
      await driver.pause(3000);
      await tapButton(driver, '~' + SHARE_SCREEN_BUTTON);
      await tapButton(
        driver,
        '//XCUIElementTypeButton[@name="Stop Broadcast"]',
      );
      await tapApp(driver);
    }

    await tapButton(driver, '~' + DISCONNECT_BUTTON);
  });
});
