import {VideoRendererView} from '@jellyfish-dev/react-native-client-sdk';
import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import Animated, {FadeInDown, Layout} from 'react-native-reanimated';
import {roomScreenLabels} from '../types/ComponentLabels';

type Props = {
  tracks: string[];
};

const {width} = Dimensions.get('window');
const {VIDEO_CELL} = roomScreenLabels;
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
      {tracks.map((v, idx) => (
        <View accessibilityLabel={VIDEO_CELL + idx} key={v}>
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
              // @ts-ignore
              trackId={v}
              entering={FadeInDown.duration(200)}
              layout={Layout.duration(150)}
              style={styles.animatedView}
            />
          </Animated.View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  animatedView: {flex: 1},
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
