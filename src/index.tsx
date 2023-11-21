import {
  Endpoint,
  updateEndpointMetadata,
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

/**
 * Function that updates peer's metadata on the server.
 * @param metadata a map `string -> any` containing user's metadata to be sent to the server.
 */
export const updatePeerMetadata = updateEndpointMetadata;