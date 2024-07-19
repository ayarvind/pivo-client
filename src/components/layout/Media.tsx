import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import getMedia from '../../utilities/getMedia';
import DisplayImage from './DisplayImage';
import LinearGradient from 'react-native-linear-gradient';
const Media = ({
    mediaName,
    userId,
    resizeMode,
    style
}: {
    mediaName: string,
    userId: string,
    style: any,
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center',
}) => {
    const [media, setMedia] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const getIt = async () => {
            try {
                if (mediaName) {
                    setLoading(true);
                    const media = await getMedia(mediaName, userId);
                    if (isMounted) {
                        setMedia(media || null);
                        setLoading(false);
                    }
                }
            } catch (err) {
                if (isMounted) {
                    setError('Failed to load media');
                    setLoading(false);
                }
            }
        };

        getIt();

        return () => {
            isMounted = false;
        };
    }, [mediaName, userId]);

    if (loading) {
        return (
            <View style={[styles.loaderContainer, style]}>
                <ShimmerPlaceholder
                    LinearGradient={LinearGradient}
                    visible={false} 
                    duration={2000} 
                style={styles.shimmer} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View>
            {media ? <DisplayImage resizeMode = {resizeMode} style={style} imagePath={media} /> : null}
        </View>
    );
};

export default Media;

const styles = StyleSheet.create({
    loaderContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
    },
    shimmer: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    errorContainer: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        color: 'red',
    },
});
