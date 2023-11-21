import React, {useState} from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import Button from './Button';
import {BarCodeScanner} from 'expo-barcode-scanner';

type Props = {
  onCodeScanned: (code: string) => void;
};

export function QRCodeScanner({onCodeScanned}: Props) {
  const [isBarcodeScannerVisible, setIsBarcodeScannerVisible] = useState(false);

  const onPress = async () => {
    if (isBarcodeScannerVisible) {
      setIsBarcodeScannerVisible(false);
      return;
    }
    const {status} = await BarCodeScanner.requestPermissionsAsync();
    if (status === 'granted') {
      setIsBarcodeScannerVisible(true);
    }
  };

  const onBarCodeScanned = ({data}: {data: string}) => {
    onCodeScanned(data);
    setIsBarcodeScannerVisible(false);
  };

  return (
    <>
      <Modal
        visible={isBarcodeScannerVisible}
        onRequestClose={() => setIsBarcodeScannerVisible(false)}
        animationType="slide"
        presentationStyle="pageSheet">
        <View style={styles.barcodeWrapper}>
          <BarCodeScanner
            onBarCodeScanned={onBarCodeScanned}
            style={styles.barcode}
          />
        </View>
      </Modal>
      <Button onPress={onPress} title="Scan QR code" />
    </>
  );
}

export default QRCodeScanner;

const styles = StyleSheet.create({
  barcode: {
    flex: 1,
  },
  barcodeWrapper: {
    backgroundColor: 'black',
    flex: 1,
  },
});
