import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/AntDesign';
import { updateUser } from '../user/user';
import { uploadMedia } from '../utilities/uploadFile';
import Snackbar from 'react-native-snackbar';
import getMedia from '../utilities/getMedia';
const userImage = require('../../assets/user.png');

const ProfileScreen = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state?.user?.user);
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [image, setImage] = useState(user?.image || null);
    const [loading, setLoading] = useState(!user);
    const [file, setFile] = useState<any>(null);
    const [fileName_, setFileName_] = useState<string>("");

    const handleSave = async () => {
        setLoading(true);
        try {
            let fileName  = user.image;
            let uploadedImage = null;
            if (file && image !== user.image) {
                const extension = file.fileName?.split('.').pop();
                fileName = `${Date.now()}.${extension}`;
                setFileName_(fileName);
                
                const { data, error } = await uploadMedia(file, user.id, fileName);
                if (error) {
                    Snackbar.show({
                        text: 'Failed to upload image',
                        duration: Snackbar.LENGTH_SHORT
                    })
                }
    
                uploadedImage = await getMedia(fileName, user.id);
                setImage(uploadedImage);
            }
            console.log(image)
    
            const data = {
                name: name !== user.name ? name : "",
                bio: bio !== user.bio ? bio : "",
                image:  fileName !== user.image ? fileName : "",
            };
    
            const response = await updateUser(data.name, data.image, data.bio);
            if (response.success) {
                dispatch({
                    type: 'SET_USER',
                    payload: { ...user, ...response.user, image:uploadedImage ? uploadedImage : user.image }
                });
                setEditing(false);
            } else {
                Snackbar.show({
                    text: 'Failed to update user profile',
                    duration: Snackbar.LENGTH_SHORT
                });
            }
        } catch (error) {
            console.error(error);
            const errorMessage = (error as Error).message || 'An error occurred';
            Snackbar.show({
                text: errorMessage,
                duration: Snackbar.LENGTH_SHORT
            });
        } finally {
            setLoading(false);
        }
    };
    

    const handleImagePicker = () => {
        launchImageLibrary({
            selectionLimit: 1,
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 200,
            maxWidth: 200,
        }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else if (response.assets) {
                setFile(response.assets[0]);
                setImage(response.assets[0].uri);
                console.log(response.assets[0]);
            } else {
                console.log('Unknown response from image picker');
            }
        });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="black" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
           
            <View style={styles.header}>
                <TouchableOpacity onPress={() => { if (editing) handleImagePicker(); }}>
                    {image ? (
                        <Image
                            style={styles.image}
                            source={{ uri: image.startsWith('file:///') ? image : `file:///${image}` }}
                        />
                    ) : (
                        <Image
                            style={styles.image}
                            source={userImage}
                        />
                    )}
                </TouchableOpacity>
                {editing ? (
                    <TextInput
                        style={[styles.input, styles.inputEditing]}
                        value={name}
                        onChangeText={setName}
                    />
                ) : (
                    <Text style={styles.nameText}>{user.name}</Text>
                )}
            </View>
            <View style={styles.bioContainer}>
                <Text style={styles.bioLabel}>Bio</Text>
                {editing ? (
                    <TextInput
                        style={[styles.input, styles.inputEditing, styles.bioInput]}
                        value={bio}
                        onChangeText={setBio}
                    />
                ) : (
                    <Text style={styles.bioText}>{user.bio}</Text>
                )}
            </View>
            {loading && (
                <ActivityIndicator size="large" color="black" />
            )}
            {editing ? (
                <TouchableOpacity onPress={handleSave} style={styles.btn} activeOpacity={0.8}>
                    <Icon name="save" size={20} color="white" />
                    <Text style={styles.btnText}>Save</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={() => setEditing(true)} style={styles.btn} activeOpacity={0.8}>
                    <Icon name="edit" size={20} color="white" />
                    <Text style={styles.btnText}>Edit</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    },
    header: {
        marginTop: 20,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 80,
        height: 80,
        marginRight: 10,
        borderRadius: 40,
    },
    input: {
        padding: 10,
        fontSize: 20,
        flex: 1,
    },
    inputEditing: {
        backgroundColor: '#f9f9f9',
    },
    nameText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    bioContainer: {
        marginTop: 20,
        paddingBottom: 10,
        height: 100,
    },
    bioLabel: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    bioInput: {
        fontSize: 16,
    },
    bioText: {
        fontSize: 16,
    },
    btn: {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    btnText: {
        color: 'white',
        fontSize: 18,
        marginLeft: 10,
    },
});

export default ProfileScreen;
