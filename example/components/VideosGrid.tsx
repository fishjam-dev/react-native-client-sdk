import {
  Peer,
  VideoRendererView,
  setTargetTrackEncoding,
} from '@jellyfish-dev/react-native-client-sdk';
import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import Animated, {FadeInDown, Layout} from 'react-native-reanimated';
import {Metadata} from '@jellyfish-dev/react-native-membrane-webrtc';
import LetterButton from './LetterButton';

type Props = {
  tracks: Peer<Metadata, Metadata, Metadata>[];
};

const {width} = Dimensions.get('window');

const AnimatedVideoRenderer =
  // @ts-ignore
  Animated.createAnimatedComponent(VideoRendererView);

export function VideosGrid({tracks}: Props) {
  const videoWidth = (width - 40) / 2;

  return (
    <View
      style={
        tracks.length > 3 ? styles.videosContainer2 : styles.videosContainer1
      }>
      {tracks
        .filter(e => e.tracks[0])
        .map(v => {
          return (
            <Animated.View
              entering={FadeInDown.duration(200)}
              layout={Layout.duration(150)}
              style={
                tracks.length > 3
                  ? [styles.video2, {width: videoWidth, height: videoWidth}]
                  : [styles.video1, {maxWidth: width - 20}]
              }
              key={v.tracks[0]!.id}>
              <AnimatedVideoRenderer
                trackId={v.tracks[0]!.id}
                entering={FadeInDown.duration(200)}
                layout={Layout.duration(150)}
                style={{flex: 1}}
              />
              {(v.tracks[0]!.simulcastConfig?.enabled ?? false) && (
                <View style={styles.buttons}>
                  {v.tracks[0]!.simulcastConfig?.activeEncodings.map(e => (
                    <LetterButton
                      trackEncoding={e}
                      selected={v.tracks[0]?.encoding === e}
                      onPress={() => setTargetTrackEncoding(v.tracks[0]!.id, e)}
                    />
                  ))}
                </View>
              )}
            </Animated.View>
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  videosContainer1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videosContainer2: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
  },
  video1: {
    flex: 1,
    margin: 10,
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'black',
  },
  video2: {
    margin: 10,
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'black',
  },
  border: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  video: {
    flex: 1,
  },
  container: {
    position: 'relative',
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
    padding: 4,
    borderRadius: 8,
    position: 'absolute',
    opacity: 0.5,
    backgroundColor: 'white',
    right: 0,
  },
});

export default VideosGrid;
