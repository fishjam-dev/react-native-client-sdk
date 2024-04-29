import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {SoundOutputDevicesSection} from './SoundOutputDevicesSection';
import React, {useCallback, useState} from 'react';
import {StyleSheet} from 'react-native';

export const SoundOutputDevicesBottomSheet = ({
  bottomSheetRef,
}: {
  bottomSheetRef: React.RefObject<BottomSheet>;
}) => {
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1);

  const handleSheetChanges = useCallback((index: number) => {
    setBottomSheetIndex(index);
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      index={bottomSheetIndex}
      snapPoints={[300]}
      backgroundStyle={styles.bottomSheetWrapper}>
      <BottomSheetView>
        <SoundOutputDevicesSection />
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetWrapper: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: 'white',
  },
});
