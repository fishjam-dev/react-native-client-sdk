import * as Device from 'expo-device';
import { Alert, Platform } from 'react-native';

export const isIosSimulator = Platform.OS === 'ios' && !Device.isDevice;

export const displayIosSimulatorCameraAlert = () =>
  Alert.alert(
    'Camera not supported on iOS simulator',
    'Please run the app on a real device to use the camera',
  );
