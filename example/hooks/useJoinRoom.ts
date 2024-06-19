import {
  useCamera,
  joinRoom as jsJoinRoom,
  useMicrophone,
  VideoQuality,
} from '@fishjam-dev/react-native-client';
import notifee, {
  AndroidImportance,
  AndroidColor,
} from '@notifee/react-native';
import { useCallback } from 'react';
import { Platform } from 'react-native';

interface Props {
  isCameraAvailable: boolean;
  isMicrophoneAvailable: boolean;
}

async function startForegroundService() {
  if (Platform.OS === 'android') {
    const channelId = await notifee.createChannel({
      id: 'video_call',
      name: 'Video call',
      lights: false,
      vibration: false,
      importance: AndroidImportance.DEFAULT,
    });

    await notifee.displayNotification({
      title: 'Your video call is ongoing',
      body: 'Tap to return to the call.',
      android: {
        channelId,
        asForegroundService: true,
        ongoing: true,
        color: AndroidColor.BLUE,
        colorized: true,
        pressAction: {
          id: 'default',
        },
      },
    });
  }
}

export function useJoinRoom({
  isCameraAvailable,
  isMicrophoneAvailable,
}: Props) {
  const { startCamera, getCaptureDevices } = useCamera();
  const { startMicrophone } = useMicrophone();

  const joinRoom = useCallback(async () => {
    await startForegroundService();
    await startCamera({
      simulcastConfig: {
        enabled: true,
        activeEncodings:
          Platform.OS === 'android' ? ['l', 'm', 'h'] : ['l', 'h'],
      },
      quality: VideoQuality.HD_169,
      maxBandwidth: { l: 150, m: 500, h: 1500 },
      videoTrackMetadata: { active: isCameraAvailable, type: 'camera' },
      captureDeviceId: await getCaptureDevices().then(
        (devices) => devices.find((device) => device.isFrontFacing)?.id,
      ),
      cameraEnabled: isCameraAvailable,
    });

    await jsJoinRoom({
      name: 'RN mobile',
    });

    await startMicrophone({
      audioTrackMetadata: { active: isMicrophoneAvailable, type: 'audio' },
      microphoneEnabled: isMicrophoneAvailable,
    });
  }, [
    isCameraAvailable,
    isMicrophoneAvailable,
    jsJoinRoom,
    startCamera,
    startMicrophone,
  ]);

  return { joinRoom };
}
