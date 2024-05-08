import React from 'react';
import {
  VideoPreviewView,
  CaptureDevice,
  VideoLayout,
} from 'client-sdk/src';
import {ActivityIndicator, StyleSheet} from 'react-native';
type Props = {
  currentCamera: CaptureDevice | null;
  videoLayout?: VideoLayout | undefined;
};
const VideoPreview = ({currentCamera, videoLayout}: Props) => {
  return currentCamera ? (
    <VideoPreviewView
      style={styles.membraneVideoPreview}
      mirrorVideo
      captureDeviceId={currentCamera?.id}
      videoLayout={videoLayout}
    />
  ) : (
    <ActivityIndicator />
  );
};
export default VideoPreview;

const styles = StyleSheet.create({
  membraneVideoPreview: {
    width: '100%',
    height: '100%',
  },
});
