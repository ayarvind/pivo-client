import { StyleSheet, Text, TouchableOpacity, View, TextInput, Image } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import { User } from '../../interface/User';
import { io } from '../../socket';
import { useDispatch, useSelector } from 'react-redux';
import selectFile from '../FileSelector';
import { uploadMedia } from '../../utilities/uploadFile';
import Snackbar from 'react-native-snackbar';

const ChatBottom = ({ user }: { user: User }) => {
    const loggedUser = useSelector((state: any) => state.user)?.user;
    const [msgText, setMsgText] = useState('');
    const [file, setFile] = useState<any>(null); // State for the selected file
    const [filePreview, setFilePreview] = useState<string | null>(null); // State for file preview
    const [messageData, setMessagesData] = useState<any>();

    const sendMsg = async () => {
        if (!msgText.trim() && !file) return;

        const msgId = `${new Date().getTime()}-${loggedUser.id}`;
        const msg = {
            sender: loggedUser.id,
            receiver: user.id,
            timestamp: new Date().toISOString(),
            message: {
                msgId,
                type: file ? 'FILE' : 'TEXT',
                content: msgText,
                fileUrl: '',
            },
        };

        if (file) {
            const extension = file.fileName?.split('.').pop();
            // get dimensions of the image
            
            const fileName = `${Date.now()}.${extension}`;
            const { data, error } = await uploadMedia(file, loggedUser.id, fileName);

            if (error) {
                Snackbar.show({
                    text: 'Failed to send file',
                    duration: Snackbar.LENGTH_SHORT,
                });
                return;
            }

            msg.message.fileUrl = fileName;
        }

        setMessagesData(msg);
        io.emit('message', msg);
        setMsgText('');
        setFile(null);
        setFilePreview(null);
    };

    const handleFileSelection = async () => {
        const selectedFile = await selectFile();
        if (selectedFile) {
            setFile(selectedFile);
            setFilePreview(selectedFile.uri || '');
        }
    };

    return (
        <View style={styles.parent}>
            <View style={styles.container}>
                {filePreview && (
                    <View style={styles.previewContainer}>
                        <Image source={{ uri: filePreview }} style={styles.previewImage} />
                        <TouchableOpacity onPress={() => { setFile(null); setFilePreview(null); }} style={styles.removePreviewBtn}>
                            <Icon name='closecircle' size={20} color='black' />
                        </TouchableOpacity>
                    </View>
                )}
                <TextInput
                    value={msgText}
                    onChangeText={setMsgText}
                    multiline={true}
                    placeholder='Chat...'
                    style={styles.input}
                />
                <TouchableOpacity onPress={handleFileSelection} style={styles.btn}>
                    <Icon name='picture' size={20} color='black' />
                </TouchableOpacity>
                <TouchableOpacity onPress={sendMsg} style={styles.btn}>
                    <Icon name='right' size={20} color='black' />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    parent: {
        flexDirection: 'column',
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 5,
        fontSize: 18,
        paddingHorizontal: 10,
    },
    btn: {
        padding: 10,
        borderRadius: 50,
    },
    previewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    previewImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 10,
    },
    removePreviewBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 50,
        padding: 5,
    },
});

export default ChatBottom;
