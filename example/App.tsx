import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import AppProvider from './providers/AppProvider';
import AppNavigator from './navigators/AppNavigator';

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
