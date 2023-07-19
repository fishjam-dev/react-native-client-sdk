import React from 'react';
import {SafeAreaView, ScrollView, View, StyleSheet} from 'react-native';

import {
  useEndpoints,
  VideoRendererView,
} from '@jellyfish-dev/react-native-client-sdk';

export const Room = () => {
  const endpoints = useEndpoints();

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.participants}>
          {endpoints.map(e => {
            const trackId = e.tracks.find(
              t => t.type === 'Video' || t.metadata.type === 'camera',
            )?.id;

            return trackId ? (
              <View style={styles.videoContainer} key={trackId}>
                <VideoRendererView trackId={trackId} style={styles.video} />
              </View>
            ) : null;
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  video: {
    flex: 1,
  },
  participants: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoContainer: {
    width: 150,
    height: 150,
    margin: 10,
    backgroundColor: 'grey',
  },
});
