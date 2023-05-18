/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  useColorScheme,
  View,
  Button,
} from 'react-native';

import {JellyfishClient} from '@jellyfish-dev/react-native-client-sdk';

import {Colors} from 'react-native/Libraries/NewAppScreen';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const client = useRef<JellyfishClient | null>(null);

  const connect = () => {
    client.current = new JellyfishClient();
    client.current.connect();
  };

  const disconnect = () => {
    if (client.current) {
      client.current.cleanUp();
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Button title="Connect" onPress={connect} />
          <Button title="Disconnect" onPress={disconnect} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
