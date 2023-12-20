import React from 'react';
import {
  VideoPreviewView,
  CaptureDevice,
} from '@jellyfish-dev/react-native-membrane-webrtc';
import {ActivityIndicator, StyleSheet} from 'react-native';
type Props = {currentCamera: CaptureDevice | null};
const VideoPreview = ({currentCamera}: Props) => {
  return currentCamera ? (
    <VideoPreviewView
      style={styles.membraneVideoPreview}
      mirrorVideo
      captureDeviceId={currentCamera?.id}
    />
  ) : (
    <ActivityIndicator />
  );
};
export default VideoPreview;

const styles = StyleSheet.create({
  membraneVideoPreview: {
    width: 236,
    height: 320,
  },
});
