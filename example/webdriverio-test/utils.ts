import {Capabilities} from '@wdio/types';
import * as assert from 'assert';

const BREAK_TIME = 1000;

async function typeToInput(
  driver: WebdriverIO.Browser,
  identifier: string,
  text: string,
) {
  const input = await driver.$(identifier);
  assert.ok(await input.isExisting());
  await input.setValue(text);
  await driver.pause(BREAK_TIME);
}

async function tapButton(driver: WebdriverIO.Browser, identifier: string) {
  const button = await driver.$(identifier);
  assert.ok(await button.isExisting());
  await button.click();
  await driver.pause(BREAK_TIME);
}

async function tapApp(driver: WebdriverIO.Browser) {
  await driver.touchPerform([
    {action: 'press', options: {x: 100, y: 100}},
    {action: 'release'},
  ]);
  await driver.pause(BREAK_TIME);
}

function platformJellyfishToken(driver: WebdriverIO.Browser): string {
  if (driver.isAndroid) {
    assert.ok(process.env.ANDROID_JELLYFISH_TOKEN !== undefined);
    return process.env.ANDROID_JELLYFISH_TOKEN;
  }
  assert.ok(process.env.IOS_JELLYFISH_TOKEN !== undefined);
  return process.env.IOS_JELLYFISH_TOKEN ?? '';
}

function getAndroidDeviceCapabilities(
  name: string,
): Capabilities.RemoteCapability {
  return {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': name,
    'appium:autoGrantPermissions': true,
    'appium:app': process.env.ANDROID_APP_PATH,
    'appium:newCommandTimeout': 2000,
  };
}

function getIosDeviceCapabilities(
  id: string,
  teamId?: string,
): Capabilities.RemoteCapability {
  return {
    platformName: 'iOS',
    'appium:automationName': 'XCUITest',
    'appium:udid': id,
    'appium:app': process.env.IOS_APP_PATH,
    'appium:newCommandTimeout': 2000,
    'appium:xcodeOrgId': teamId,
    'appium:xcodeSigningId': 'App Developer',
  };
}

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

export {tapApp, typeToInput, tapButton, platformJellyfishToken, capabilities};
