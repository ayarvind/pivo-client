import { StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import { User } from '../../interface/User';
import { io } from '../../socket';
import { useDispatch, useSelector } from 'react-redux';

const ChatBottom = ({ user }: { user: User }) => {
    const loggedUser = useSelector((state: any) => state.user)?.user;
    const [msgText, setMsgText] = useState('');
    const sendMsg = () => {
        if (msgText.trim() === '') return;
        if(msgText === '') return;
        const msg = {
            sender: loggedUser.id,
            receiver: user.id,
            timestamp: new Date().toISOString(),
            message: {
                msgId: `${new Date().getTime()}-${loggedUser.id}`,
                type: 'TEXT',
                content: msgText,
            },
        };
        io.emit('message', msg);
        setMsgText('');
    };

    return (
        <View style={styles.parent}>
            <View style={styles.container}>
                <TextInput
                   
                    value={msgText}
                    onChangeText={setMsgText}
                    multiline={true}
                    placeholder='Chat...'
                    style={styles.input}
                />
                <TouchableOpacity style={styles.btn} touchSoundDisabled={false}>
                    <Icon name='plus' size={20} color='black' />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={sendMsg} touchSoundDisabled={false}>
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
});

export default ChatBottom;
