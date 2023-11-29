/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {JellyfishContextProvider} from '@jellyfish-dev/react-native-client-sdk';
import ConnectScreen from './src/ConnectScreen';

function App(): React.JSX.Element {
  return (
    <JellyfishContextProvider>
      <ConnectScreen />
    </JellyfishContextProvider>
  );
}

export default App;
