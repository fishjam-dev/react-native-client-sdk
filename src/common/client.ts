import { Metadata } from '../MembraneWebRTC.types';
import MembraneWebRTCModule from '../MembraneWebRTCModule';

export const connect = (url: string, peerToken: string) => {
  return MembraneWebRTCModule.connect(url, peerToken);
};

export const joinRoom = (peerMetadata: Metadata) => {
  return MembraneWebRTCModule.joinRoom(peerMetadata);
};

export const leaveRoom = () => {
  return MembraneWebRTCModule.leaveRoom();
};

export const cleanUp = () => {
  return MembraneWebRTCModule.cleanUp();
};
