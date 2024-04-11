import React, {useEffect, useState} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import AppProvider from './providers/AppProvider';
import AppNavigator from './navigators/AppNavigator';
import {initializeWebRTC} from '@jellyfish-dev/react-native-client-sdk';

function App(): React.JSX.Element {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initializeWebRTC();
      setInitialized(true);
    };

    init();
  }, []);

  return (
    <>
      <GestureHandlerRootView>
        {initialized ? (
          <AppProvider>
            <AppNavigator />
          </AppProvider>
        ) : null}
      </GestureHandlerRootView>
      <Toast />
    </>
  );
}

export default App;
