import React, { useState, useEffect } from 'react';
import { Image, View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import RNFS from 'react-native-fs';

const DisplayImage = ({ imagePath, style }: { imagePath: string, style?: any }) => {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const checkFileExists = async () => {
            try {
                console.log('Checking file at path:', imagePath);
                const exists = await RNFS.exists(imagePath);
                console.log('File exists result:', exists);
                if (exists) {
                    const stat = await RNFS.stat(imagePath);
                    console.log('File stats:', stat);

                    if (stat.isFile()) {
                        setImageUri(`file://${imagePath}`);
                        setError(false);
                    } else {
                        console.log('Path is not a file:', imagePath);
                        setError(true);
                    }
                } else {
                    console.log('File does not exist at:', imagePath);
                    setError(true);
                }
            } catch (error) {
                setImageUri(null);
                console.error('Error checking file existence:', error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        checkFileExists();
    }, [imagePath]);

    if (loading) {
        return (
            <View >
                <ActivityIndicator size="small" color="#d0cece" />
            </View>
        );
    }

    

    return (
        <>
            {imageUri ? (
                <Image
                    style={[style]}
                    source={{ uri: imageUri }}
                    onError={(e) => {
                        console.error('Error loading image:', e.nativeEvent.error);
                        setError(true);
                    }}
                />
            ) : (
                <Text>Image not found</Text>
            )}
        </>
    );
};


export default DisplayImage;
