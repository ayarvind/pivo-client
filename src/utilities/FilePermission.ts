import { PermissionsAndroid } from 'react-native';

const requestExternalStoragePermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
                title: 'External Storage Permission',
                message: 'This app needs access to your external storage to read files.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can read the external storage');
        } else {
            console.log('External storage permission denied');
        }
    } catch (err) {
        console.warn(err);
    }
};

export default requestExternalStoragePermission;
