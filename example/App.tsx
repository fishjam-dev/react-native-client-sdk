/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  useColorScheme,
  View,
  Button,
  StyleSheet,
} from 'react-native';

import {
  useJellyfishClient,
  VideoPreviewView,
  useRoomParticipants,
  VideoRendererView,
} from '@jellyfish-dev/react-native-client-sdk';

import {Colors} from 'react-native/Libraries/NewAppScreen';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const {connect, cleanUp} = useJellyfishClient();
  const participants = useRoomParticipants();

  const disconnect = async () => {
    cleanUp();
  };
  const debug = () => {
    console.log('xD');
    console.log(participants);
    console.log('xD');
    console.log(
      'TRACKS',
      participants.map(p => p.tracks),
    );
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
          <Button title="part" onPress={debug} />
        </View>
        {/* <VideoPreviewView style={styles.preview} /> */}
        {participants.map(p => {
          return (
            <VideoRendererView
              trackId={p.tracks.find(t => t.type === 'Video')}
              style={styles.preview}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  preview: {
    width: 200,
    height: 200,
    backgroundColor: 'red',
  },
});

export default App;
