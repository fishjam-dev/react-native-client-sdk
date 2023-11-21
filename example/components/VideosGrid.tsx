import {VideoRendererView} from '@jellyfish-dev/react-native-client-sdk';
import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import Animated, {FadeInDown, Layout} from 'react-native-reanimated';

type Props = {
  tracks: string[];
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
      {tracks.map(v => (
        <Animated.View
          entering={FadeInDown.duration(200)}
          layout={Layout.duration(150)}
          style={
            tracks.length > 3
              ? [styles.video2, {width: videoWidth, height: videoWidth}]
              : [styles.video1, {maxWidth: width - 20}]
          }
          key={v}>
          <AnimatedVideoRenderer
            trackId={v}
            entering={FadeInDown.duration(200)}
            layout={Layout.duration(150)}
            style={{flex: 1}}
          />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
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
});

export default VideosGrid;
