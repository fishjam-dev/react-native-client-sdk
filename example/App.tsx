import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
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
    </>
  );
}

export default App;
