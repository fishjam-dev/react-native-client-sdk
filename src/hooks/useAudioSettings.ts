import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import {
  AudioOutputDevice,
  AudioOutputDeviceType,
  AudioSessionMode,
} from '../RNFishjamClient.types';
import RNFishjamClientModule from '../RNFishjamClientModule';
import { ReceivableEvents, eventEmitter } from '../common/eventEmitter';

/**
 * This hook manages audio settings.
 */
export function useAudioSettings() {
  const [selectedAudioOutputDevice, setSelectedAudioOutputDevice] =
    useState<AudioOutputDevice | null>(null);
  const [availableDevices, setAvailableDevices] = useState<AudioOutputDevice[]>(
    [],
  );

  type onAudioDeviceEvent = {
    AudioDeviceUpdate: {
      selectedDevice: AudioOutputDevice;
      availableDevices: AudioOutputDevice[];
    };
  };

  const onAudioDevice = useCallback((event: onAudioDeviceEvent) => {
    setSelectedAudioOutputDevice(event.AudioDeviceUpdate.selectedDevice);
    setAvailableDevices(event.AudioDeviceUpdate.availableDevices);
  }, []);

  useEffect(() => {
    const eventListener = eventEmitter.addListener(
      ReceivableEvents.AudioDeviceUpdate,
      onAudioDevice,
    );
    RNFishjamClientModule.startAudioSwitcher();
    return () => {
      eventListener.remove();
      if (Platform.OS === 'android') {
        RNFishjamClientModule.stopAudioSwitcher();
      }
    };
  }, []);

  /**
   * [Android only] selects output audio device.
   * For detecting and selecting bluettoth devices make sure you have the BLUETOOTH_CONNECT permission.
   */
  const selectOutputAudioDevice = useCallback(
    async (device: AudioOutputDeviceType) => {
      if (Platform.OS === 'ios') {
        throw Error(
          'selectOutputAudioDevice function is supported only on Android. ' +
            'To select an output audio device on iOS use selectAudioSessionMode or showAudioRoutePicker functions',
        );
      }
      await RNFishjamClientModule.setOutputAudioDevice(device);
    },
    [],
  );

  /**
   * [iOS only] selects audio session mode. For more information refer to Apple's documentation:
   *  https://developer.apple.com/documentation/avfaudio/avaudiosession/mode/
   *
   */
  const selectAudioSessionMode = useCallback(
    async (audioSessionMode: AudioSessionMode) => {
      if (Platform.OS === 'android') {
        throw Error('selectAudioSessionMode function is supported only on iOS');
      }
      await RNFishjamClientModule.selectAudioSessionMode(audioSessionMode);
    },
    [],
  );

  /**
   * [iOS only] Shows a picker modal that allows user to select output audio device. For more
   * information refer to Apple's documentation: https://developer.apple.com/documentation/avkit/avroutepickerview
   */
  const showAudioRoutePicker = useCallback(async () => {
    if (Platform.OS === 'android') {
      throw Error(
        'showAudioRoutePicker function is supported only on iOS. ' +
          'To select an output audio device on Android use selectOutputAudioDevice function',
      );
    }
    await RNFishjamClientModule.showAudioRoutePicker();
  }, []);

  return {
    /**
     * currently selected output audio device
     */
    selectedAudioOutputDevice,
    /**
     * [Android only] available audio output devices to be set
     */
    availableDevices,
    selectOutputAudioDevice,
    selectAudioSessionMode,
    showAudioRoutePicker,
  };
}
