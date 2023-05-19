import React from 'react';
import {SafeAreaView, ScrollView, View, StyleSheet} from 'react-native';

import {
  VideoRendererView,
  useRoomParticipants,
} from '@jellyfish-dev/react-native-client-sdk';
console.log('ROOM 1 ', useRoomParticipants);
export const Room = () => {
  const participants = useRoomParticipants();

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.participants}>
          {participants.map(p => {
            return p.tracks.find(t => t.type === 'Video')?.id ? (
              <VideoRendererView
                trackId={p.tracks.find(t => t.type === 'Video')!!.id}
                style={styles.video}
                key={p.tracks.find(t => t.type === 'Video')!!.id}
              />
            ) : null;
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  video: {
    width: 150,
    height: 150,
    backgroundColor: 'red',
    margin: 10,
  },
  participants: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
