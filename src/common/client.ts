import { Metadata } from '../RNFishjamClient.types';
import RNFishjamClientModule from '../RNFishjamClientModule';

export const connect = (url: string, peerToken: string) => {
  return RNFishjamClientModule.connect(url, peerToken);
};

export const joinRoom = (peerMetadata: Metadata) => {
  return RNFishjamClientModule.joinRoom(peerMetadata);
};

export const leaveRoom = () => {
  return RNFishjamClientModule.leaveRoom();
};

export const cleanUp = () => {
  return RNFishjamClientModule.cleanUp();
};
