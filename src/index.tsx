import {
  Endpoint,
  useEndpoints,
} from '@jellyfish-dev/react-native-membrane-webrtc';

export * from './JellyfishClientContext';
export {
  useAudioSettings,
  updateAudioTrackMetadata,
  useCamera,
  useMicrophone,
  useScreencast,
  updateVideoTrackMetadata,
  useBandwidthEstimation,
  updateEndpointMetadata,
  useRTCStatistics,
  changeWebRTCLoggingSeverity,
  VideoRendererView,
  VideoPreviewView,
} from '@jellyfish-dev/react-native-membrane-webrtc';

type Peer = Endpoint;

/**
 * This hook provides live updates of room peers.
 * @returns An array of room peers.
 */
export const usePeers: () => Peer[] = useEndpoints;
