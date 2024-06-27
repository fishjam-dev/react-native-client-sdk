import { requireNativeModule } from 'expo-modules-core';
import { NativeModule } from 'react-native';

import { RNFishjamClient } from './RNFishjamClient.types';
import { NativeMembraneMock } from './__mocks__/native';
import { isJest } from './utils';

const nativeModule = isJest()
  ? NativeMembraneMock
  : requireNativeModule('RNFishjamClient');

export default nativeModule as RNFishjamClient & NativeModule;
