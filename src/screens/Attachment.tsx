import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Media from '../components/layout/Media';

const Attachment = () => {
    const params = useRoute().params as any;
    console.log(params);
    const { mediaUrl, sender, receiver, timestamp, content } = params
   
    return (
        <View style={styles.container}>
            <Media
                mediaName={mediaUrl}
                style={[styles.image]}
                userId={sender}
                resizeMode='contain'
            />
            <View style={styles.details}>
               {
                     content && <Text style={styles.content}>{content}</Text>
               }
                <Text style={styles.timestamp}>
                    {new Date(timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </Text>
            </View>
        </View>
    );
};

export default Attachment;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        padding: 20,
    },
    image: {
        width: '100%',
        height: '80%', // Adjust as needed to ensure the image doesn't take the entire screen
        borderRadius: 10,
        marginBottom: 20,
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    content: {
        fontSize: 16,
        color: 'white',
    },
    timestamp: {
        fontSize: 14,
        color: 'white',
    },
});
