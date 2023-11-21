import {JellyfishContextProvider} from '@jellyfish-dev/react-native-client-sdk';
import {AppParentNode} from '../types/AppParentNode';
import React from 'react';

const AppProvider: React.FC<AppParentNode> = ({children}) => {
  return (
    <JellyfishContextProvider>
      <>{children}</>
    </JellyfishContextProvider>
  );
};

export default AppProvider;
