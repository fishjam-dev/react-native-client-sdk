import { Metadata, Endpoint } from './MembraneWebRTC.types';

export * from './MembraneWebRTC.types';
export { useAudioSettings } from './hooks/useAudioSettings';
export { useBandwidthEstimation } from './hooks/useBandwidthEstimation';
export { useCamera } from './hooks/useCamera';
export { useEndpoints as usePeers } from './hooks/useEndpoints';
export { useMicrophone } from './hooks/useMicrophone';
export { useRTCStatistics } from './hooks/useRTCStatistics';
export { useScreencast } from './hooks/useScreencast';
export { useWebRTC } from './hooks/useWebRTC';

export {
  updateAudioTrackMetadata,
  updateEndpointMetadata as updatePeerMetadata,
  updateVideoTrackMetadata,
} from './common/metadata';
export {
  initializeWebRTC,
  changeWebRTCLoggingSeverity,
  setTargetTrackEncoding,
} from './common/webRTC';

export { default as VideoPreviewView } from './VideoPreviewView';
export { default as VideoRendererView } from './VideoRendererView';
export * from './JellyfishClientContext';

export type Peer<
  MetadataType extends Metadata,
  VideoTrackMetadataType extends Metadata,
  AudioTrackMetadataType extends Metadata,
> = Endpoint<MetadataType, VideoTrackMetadataType, AudioTrackMetadataType>;

// /**
//  * This hook provides live updates of room peers.
//  * @returns An array of room peers.
//  */
// export const usePeers: <
//   MetadataType extends Types.Metadata,
//   VideoTrackMetadataType extends Types.Metadata,
//   AudioTrackMetadataType extends Types.Metadata,
// >() => Peer<MetadataType, VideoTrackMetadataType, AudioTrackMetadataType>[] =
//   useEndpoints;

// /**
//  * Function that updates peer's metadata on the server.
//  * @param metadata a map `string -> any` containing user's metadata to be sent to the server.
//  */
// export const updatePeerMetadata = updateEndpointMetadata;
