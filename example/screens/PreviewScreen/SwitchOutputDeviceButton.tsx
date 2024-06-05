import { InCallButton } from '../../components';
import React, { RefObject, useCallback } from 'react';
import { Platform } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { previewScreenLabels } from '../../types/ComponentLabels.ts';
import { useAudioSettings } from '@fishjam-dev/react-native-client';

export const SwitchOutputDeviceButton = (props: {
  bottomSheetRef: RefObject<BottomSheet>;
}) => {
  const audioSettings = useAudioSettings();
  const { bottomSheetRef } = props;
  const { SELECT_AUDIO_OUTPUT } = previewScreenLabels;

  const toggleOutputSoundDevice = useCallback(async () => {
    if (Platform.OS === 'ios') {
      await audioSettings.showAudioRoutePicker();
    } else if (Platform.OS === 'android') {
      bottomSheetRef.current?.expand();
    }
  }, [bottomSheetRef, audioSettings]);

  return (
    <InCallButton
      iconName="volume-high"
      onPress={toggleOutputSoundDevice}
      accessibilityLabel={SELECT_AUDIO_OUTPUT}
    />
  );
};
