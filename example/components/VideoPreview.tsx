import React from 'react';
import {
  VideoPreviewView,
  CaptureDevice,
  VideoLayout,
} from '@jellyfish-dev/react-native-client-sdk';
import {ActivityIndicator, StyleSheet} from 'react-native';
type Props = {
  currentCamera: CaptureDevice | null;
  videoLayout?: VideoLayout | undefined;
  mirrorVideo?: boolean;
};
const VideoPreview = ({currentCamera, videoLayout, mirrorVideo}: Props) => {
  return currentCamera ? (
    <VideoPreviewView
      style={styles.membraneVideoPreview}
      captureDeviceId={currentCamera?.id}
      mirrorVideo={mirrorVideo}
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
