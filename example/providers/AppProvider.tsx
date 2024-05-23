import { FishjamContextProvider } from '@fishjam-dev/react-native-client-sdk';
import React from 'react';

import { FishjamExampleContextProvider } from '../contexts/FishjamExampleContext';
import type { AppParentNode } from '../types/AppParentNode';

const AppProvider: React.FC<AppParentNode> = ({ children }) => {
  return (
    <FishjamContextProvider>
      <FishjamExampleContextProvider>{children}</FishjamExampleContextProvider>
    </FishjamContextProvider>
  );
};

export default AppProvider;
