import { JellyfishContextProvider } from '@jellyfish-dev/react-native-client-sdk';
import React from 'react';

import { JellyfishExampleContextProvider } from '../contexts/JellyfishExampleContext';
import type { AppParentNode } from '../types/AppParentNode';

const AppProvider: React.FC<AppParentNode> = ({ children }) => {
  return (
    <JellyfishContextProvider>
      <JellyfishExampleContextProvider>
        {children}
      </JellyfishExampleContextProvider>
    </JellyfishContextProvider>
  );
};

export default AppProvider;
