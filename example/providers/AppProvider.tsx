import {JellyfishContextProvider} from '@jellyfish-dev/react-native-client-sdk';
import {VideoRoomContextProvider} from '../contexts/VideoRoomContext';
import type {AppParentNode} from '../types/AppParentNode';
import React from 'react';

const AppProvider: React.FC<AppParentNode> = ({children}) => {
  return (
    <JellyfishContextProvider>
      <VideoRoomContextProvider>
        <>{children}</>
      </VideoRoomContextProvider>
    </JellyfishContextProvider>
  );
};

export default AppProvider;
