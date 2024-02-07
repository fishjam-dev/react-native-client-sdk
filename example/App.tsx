import React from 'react';
import AppProvider from './providers/AppProvider';
import AppNavigator from './navigators/AppNavigator';

function App(): React.JSX.Element {
  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}

export default App;
