import {
  updateAudioTrackMetadata,
  useMicrophone,
} from '@fishjam-dev/react-native-client';
import { useCallback } from 'react';

export function useToggleMicrophone() {
  const { isMicrophoneOn, toggleMicrophone: membraneToggleMicrophone } =
    useMicrophone();

  const toggleMicrophone = useCallback(async () => {
    await membraneToggleMicrophone();
    await updateAudioTrackMetadata({
      active: !isMicrophoneOn,
      type: 'audio',
    });
  }, [isMicrophoneOn, membraneToggleMicrophone]);

  return { toggleMicrophone };
}
