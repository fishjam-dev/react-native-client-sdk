import {JellyfishContextProvider} from 'client-sdk/src';
import {JellyfishExampleContextProvider} from '../contexts/JellyfishExampleContext';
import type {AppParentNode} from '../types/AppParentNode';
import React from 'react';

const AppProvider: React.FC<AppParentNode> = ({children}) => {
  return (
    <JellyfishContextProvider>
      <JellyfishExampleContextProvider>
        {children}
      </JellyfishExampleContextProvider>
    </JellyfishContextProvider>
  );
};

export default AppProvider;
