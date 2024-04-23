import {useEffect} from 'react';
import {Platform, PermissionsAndroid, Permission} from 'react-native';

export function usePermissionCheck() {
  useEffect(() => {
    async function request() {
      if (Platform.OS === 'ios') {
        return;
      }
      try {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA as Permission,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO as Permission,
        ]);
      } catch (err) {
        console.warn(err);
      }
    }

    request();
  }, []);
}
