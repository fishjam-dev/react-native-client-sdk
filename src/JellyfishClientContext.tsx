import React from 'react';

import {
  Metadata,
  ConnectionOptions,
} from '@jellyfish-dev/react-native-membrane-webrtc';
import { useJellyfishClient } from './JellyfishClient';

const JellyfishContext = React.createContext<
  | {
      connect: (
        url: string,
        peerToken: string,
        connectionOptions: Partial<ConnectionOptions>
      ) => Promise<void>;
      join: (peerMetadata: Metadata) => Promise<void>;
      cleanUp: () => void;
      leave: () => void;
      error: string | null;
    }
  | undefined
>(undefined);

const JellyfishContextProvider = (props: any) => {
  const { connect, join, cleanUp, leave, error } = useJellyfishClient();

  const value = {
    connect,
    join,
    cleanUp,
    leave,
    error,
  };

  return (
    <JellyfishContext.Provider value={value}>
      {props.children}
    </JellyfishContext.Provider>
  );
};

function useJellyfishState() {
  const context = React.useContext(JellyfishContext);
  if (context === undefined) {
    throw new Error('useJellyfishState must be used within a JellyfishContext');
  }
  return context;
}

export { JellyfishContextProvider, useJellyfishState };
