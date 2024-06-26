import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';
import { View } from 'react-native';

import { VideoRendererProps } from './RNFishjamClient.types';
import { isJest } from './utils';

const NativeView: React.ComponentType<VideoRendererProps> = isJest()
  ? () => <View />
  : requireNativeViewManager('VideoRendererViewModule');

export default React.forwardRef<
  React.ComponentType<VideoRendererProps>,
  VideoRendererProps
>((props, ref) => (
  // @ts-ignore
  <NativeView {...props} ref={ref} />
));
