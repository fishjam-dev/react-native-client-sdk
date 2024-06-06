import {
  useCamera,
  useFishjamClient,
  useMicrophone,
  VideoQuality,
} from '@fishjam-dev/react-native-client';
import { useCallback, useEffect } from 'react';
import { Platform } from 'react-native';

interface Props {
  isCameraAvailable: boolean;
  isMicrophoneAvailable: boolean;
}

export function useJoinRoom({
  isCameraAvailable,
  isMicrophoneAvailable,
}: Props) {
  const { join } = useFishjamClient();
  const { startCamera, getCaptureDevices } = useCamera();
  const { startMicrophone } = useMicrophone();

  const joinRoom = useCallback(async () => {
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

    await join({
      name: 'RN mobile',
    });

    await startMicrophone({
      audioTrackMetadata: { active: isMicrophoneAvailable, type: 'audio' },
      microphoneEnabled: isMicrophoneAvailable,
    });
  }, [
    isCameraAvailable,
    isMicrophoneAvailable,
    join,
    startCamera,
    startMicrophone,
  ]);

  useEffect(() => {
    joinRoom();
  }, []);
}
