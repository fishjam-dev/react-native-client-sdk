import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';
import { View } from 'react-native';

import { VideoPreviewViewProps } from './RNFishjamClient.types';
import { isJest } from './utils';

const NativeView: React.ComponentType<VideoPreviewViewProps> = isJest()
  ? () => <View />
  : requireNativeViewManager('VideoPreviewViewModule');

export default React.forwardRef<
  React.ComponentType<VideoPreviewViewProps>,
  VideoPreviewViewProps
>((props, ref) => (
  // @ts-ignore
  <NativeView {...props} ref={ref} />
));
