import { FishjamContextProvider } from '@fishjam-dev/react-native-client';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import AppNavigator from './navigators/AppNavigator';

function App(): React.JSX.Element {
  return (
    <>
      <GestureHandlerRootView>
        <FishjamContextProvider>
          <AppNavigator />
        </FishjamContextProvider>
      </GestureHandlerRootView>
      <Toast />
    </>
  );
}

export default App;
