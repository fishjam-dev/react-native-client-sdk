// package: fishjam
// file: protos/fishjam/peer_notifications.proto

import * as jspb from 'google-protobuf';

export class PeerMessage extends jspb.Message {
  hasAuthenticated(): boolean;
  clearAuthenticated(): void;
  getAuthenticated(): PeerMessage.Authenticated | undefined;
  setAuthenticated(value?: PeerMessage.Authenticated): void;

  hasAuthRequest(): boolean;
  clearAuthRequest(): void;
  getAuthRequest(): PeerMessage.AuthRequest | undefined;
  setAuthRequest(value?: PeerMessage.AuthRequest): void;

  hasMediaEvent(): boolean;
  clearMediaEvent(): void;
  getMediaEvent(): PeerMessage.MediaEvent | undefined;
  setMediaEvent(value?: PeerMessage.MediaEvent): void;

  getContentCase(): PeerMessage.ContentCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PeerMessage.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: PeerMessage,
  ): PeerMessage.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: PeerMessage,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): PeerMessage;
  static deserializeBinaryFromReader(
    message: PeerMessage,
    reader: jspb.BinaryReader,
  ): PeerMessage;
}

export namespace PeerMessage {
  export type AsObject = {
    authenticated?: PeerMessage.Authenticated.AsObject;
    authRequest?: PeerMessage.AuthRequest.AsObject;
    mediaEvent?: PeerMessage.MediaEvent.AsObject;
  };

  export class Authenticated extends jspb.Message {
    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Authenticated.AsObject;
    static toObject(
      includeInstance: boolean,
      msg: Authenticated,
    ): Authenticated.AsObject;
    static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
    static extensionsBinary: {
      [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
    };
    static serializeBinaryToWriter(
      message: Authenticated,
      writer: jspb.BinaryWriter,
    ): void;
    static deserializeBinary(bytes: Uint8Array): Authenticated;
    static deserializeBinaryFromReader(
      message: Authenticated,
      reader: jspb.BinaryReader,
    ): Authenticated;
  }

  export namespace Authenticated {
    export type AsObject = object;
  }

  export class AuthRequest extends jspb.Message {
    getToken(): string;
    setToken(value: string): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AuthRequest.AsObject;
    static toObject(
      includeInstance: boolean,
      msg: AuthRequest,
    ): AuthRequest.AsObject;
    static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
    static extensionsBinary: {
      [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
    };
    static serializeBinaryToWriter(
      message: AuthRequest,
      writer: jspb.BinaryWriter,
    ): void;
    static deserializeBinary(bytes: Uint8Array): AuthRequest;
    static deserializeBinaryFromReader(
      message: AuthRequest,
      reader: jspb.BinaryReader,
    ): AuthRequest;
  }

  export namespace AuthRequest {
    export type AsObject = {
      token: string;
    };
  }

  export class MediaEvent extends jspb.Message {
    getData(): string;
    setData(value: string): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): MediaEvent.AsObject;
    static toObject(
      includeInstance: boolean,
      msg: MediaEvent,
    ): MediaEvent.AsObject;
    static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
    static extensionsBinary: {
      [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
    };
    static serializeBinaryToWriter(
      message: MediaEvent,
      writer: jspb.BinaryWriter,
    ): void;
    static deserializeBinary(bytes: Uint8Array): MediaEvent;
    static deserializeBinaryFromReader(
      message: MediaEvent,
      reader: jspb.BinaryReader,
    ): MediaEvent;
  }

  export namespace MediaEvent {
    export type AsObject = {
      data: string;
    };
  }

  export enum ContentCase {
    CONTENT_NOT_SET = 0,
    AUTHENTICATED = 1,
    AUTH_REQUEST = 2,
    MEDIA_EVENT = 3,
  }
}
