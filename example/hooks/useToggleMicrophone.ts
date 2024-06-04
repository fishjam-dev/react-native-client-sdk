import { useCallback } from 'react';
import {
  updateAudioTrackMetadata,
  useMicrophone,
} from '@fishjam-dev/react-native-client';

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
