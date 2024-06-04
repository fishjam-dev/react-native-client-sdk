import { useCallback } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import Toast from 'react-native-toast-message';
import {
  updateVideoTrackMetadata,
  useCamera,
} from '@fishjam-dev/react-native-client';

export function useToggleCamera() {
  const isIosEmulator = Platform.OS === 'ios' && !Device.isDevice;
  const { isCameraOn, toggleCamera: membraneToggleCamera } = useCamera();

  const toggleCamera = useCallback(async () => {
    if (isIosEmulator) {
      Toast.show({
        type: 'info',
        text1: 'Camera is not supported on the iOS emulator',
        text2: 'Please run the app on a real device to use the camera',
      });

      return;
    }

    await membraneToggleCamera();
    await updateVideoTrackMetadata({ active: !isCameraOn, type: 'camera' });
  }, [isCameraOn, membraneToggleCamera]);

  return { toggleCamera };
}
