import {Capabilities} from '@wdio/types';
import * as assert from 'assert';

const TIMEOUT = 2000;
const INTERVAL = 2000;

type TimeoutConfig = {
  timeout: number;
  timeoutMsg: string;
  interval: number;
};

const findTimeoutConfig = (selector: string) => {
  return {
    timeout: TIMEOUT,
    timeoutMsg: `Element with selector ${selector} not found within the specified time`,
    interval: INTERVAL,
  };
};

const getElement = async (
  driver: WebdriverIO.Browser,
  selector: string,
  shouldExist: boolean = true,
  timeout: TimeoutConfig = findTimeoutConfig(selector),
) => {
  const element = await driver.$(selector);
  if (shouldExist) {
    await element.waitForExist(timeout);
    assert.ok(element);
  }
  return element;
};

const typeToInput = async (
  driver: WebdriverIO.Browser,
  selector: string,
  text: string,
) => {
  const input = await getElement(driver, selector);
  await input.setValue(text);
};

const compareInputValue = async (
  driver: WebdriverIO.Browser,
  selector: string,
  aspectedValue: string | undefined,
) => {
  assert.equal(await getInputValue(driver, selector), aspectedValue);
};

const getInputValue = async (driver: WebdriverIO.Browser, selector: string) => {
  const element = await getElement(driver, selector);
  return await element.getText();
};

const tapButton = async (driver: WebdriverIO.Browser, selector: string) => {
  const button = await getElement(driver, selector);
  await button.click();
};

const tapApp = async (driver: WebdriverIO.Browser) => {
  await driver.touchPerform([
    {action: 'press', options: {x: 100, y: 100}},
    {action: 'release'},
  ]);
};
const getBasePath = () => {
  return '10.0.2.2';
};

const getWebsocketUrl = (secure: boolean = false) =>
  `${secure ? 'wss' : 'ws'}://${getBasePath()}:5002/socket/peer/websocket`;

const getAndroidDeviceCapabilities = (
  name: string,
): Capabilities.RemoteCapability => {
  return {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': name,
    'appium:autoGrantPermissions': true,
    'appium:app': process.env.ANDROID_APP_PATH,
    'appium:newCommandTimeout': TIMEOUT,
  };
};

const getIosDeviceCapabilities = (
  id: string,
  teamId?: string,
): Capabilities.RemoteCapability => {
  return {
    platformName: 'iOS',
    'appium:automationName': 'XCUITest',
    'appium:udid': id,
    'appium:app': process.env.IOS_APP_PATH,
    'appium:newCommandTimeout': TIMEOUT,
    'appium:xcodeOrgId': teamId,
    'appium:xcodeSigningId': 'App Developer',
  };
};

const getCapabilityIfDeviceAvailable = (
  deviceName: string | undefined,
  capabilityGetter: (deviceName: string) => Capabilities.RemoteCapability,
): Capabilities.RemoteCapability | undefined => {
  return deviceName ? capabilityGetter(deviceName) : undefined;
};

const androidDeviceName = process.env.ANDROID_DEVICE_NAME;
const iosDeviceId = process.env.IOS_DEVICE_ID;
const teamId = process.env.IOS_TEAM_ID;

const capabilities: Capabilities.RemoteCapabilities = [
  getCapabilityIfDeviceAvailable(
    androidDeviceName,
    getAndroidDeviceCapabilities,
  ),
  getCapabilityIfDeviceAvailable(iosDeviceId, id =>
    getIosDeviceCapabilities(id, teamId),
  ),
].filter(object => object !== undefined) as Capabilities.RemoteCapabilities;

export {
  tapApp,
  typeToInput,
  tapButton,
  getBasePath,
  getElement,
  getInputValue,
  compareInputValue,
  findTimeoutConfig,
  getWebsocketUrl,
  capabilities,
};
