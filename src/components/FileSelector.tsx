import { launchImageLibrary, Asset } from 'react-native-image-picker';

const selectFile = (): Promise<Asset> => {
  return new Promise((resolve, reject) => {
    launchImageLibrary(
      {
        selectionLimit: 1,
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
          reject(new Error('User cancelled image picker'));
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
          reject(new Error(response.errorMessage));
        } else if (response.assets && response.assets.length > 0) {
          const file = response.assets[0];
          console.log('Selected file:', file);
          resolve(file);
        } else {
          console.log('Unknown response from image picker');
          reject(new Error('Unknown response from image picker'));
        }
      }
    );
  });
};

export default selectFile;