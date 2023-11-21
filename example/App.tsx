import React from 'react';
import AppProvider from './providers/AppProvider';
import AppNavigator from './navigators/AppNavigator';

function App() {
  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}

export default App;
