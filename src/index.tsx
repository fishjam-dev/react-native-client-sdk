import {
  Endpoint,
  Metadata,
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

type Peer<
  Q extends Metadata,
  T extends Metadata,
  P extends Metadata
> = Endpoint<Q, T, P>;

/**
 * This hook provides live updates of room peers.
 * @returns An array of room peers.
 */
export const usePeers: () => Peer<any, any, any>[] = useEndpoints;

/**
 * Function that updates peer's metadata on the server.
 * @param metadata a map `string -> any` containing user's metadata to be sent to the server.
 */
export const updatePeerMetadata = updateEndpointMetadata;
