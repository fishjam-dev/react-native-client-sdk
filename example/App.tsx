import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import AppNavigator from './navigators/AppNavigator';
import AppProvider from './providers/AppProvider';

function App(): React.JSX.Element {
  return (
    <>
      <GestureHandlerRootView>
        <AppProvider>
          <AppNavigator />
        </AppProvider>
      </GestureHandlerRootView>
      <Toast />
    </>
  );
}

export default App;
