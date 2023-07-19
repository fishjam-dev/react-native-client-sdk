import React, {useEffect} from 'react';
import {SafeAreaView, ScrollView, View, StyleSheet} from 'react-native';

import * as Jelly from '@jellyfish-dev/react-native-client-sdk';

export const Room = () => {
  const endpoints = Jelly.useEndpoints();

  useEffect(() => {
    console.log(endpoints.map(e => [e, e.tracks.map(t => t.id)]));
  }, [endpoints]);

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.participants}>
          {endpoints.map(p => {
            // console.log(p.tracks);
            const trackId = p.tracks.find(
              t => t.type === 'Video' || t.metadata.type === 'camera',
            )?.id;

            console.log('TRACK ID', trackId);

            return trackId ? (
              <View style={styles.videoContainer} key={trackId}>
                <Jelly.VideoRendererView
                  trackId={trackId}
                  style={styles.video}
                />
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
    width: '100%',
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
