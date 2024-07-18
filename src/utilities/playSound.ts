import Sound from 'react-native-sound';

function playSound(sound:string){
    console.log('playing sound',sound);
    Sound.setCategory('Playback');
    const audio = new Sound(sound, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
            console.log('failed to load the sound', error);
            return;
        }
        audio.play((success) => {
            if (success) {
                console.log('successfully finished playing');
            } else {
                console.log('playback failed due to audio decoding errors');
            }
        });
    });
}

export default playSound;