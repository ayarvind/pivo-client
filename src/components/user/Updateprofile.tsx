import { Modal, StyleSheet, Text, BackHandler, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
import Snackbar from 'react-native-snackbar';
import { updateUser } from '../../user/user';
import { SET_USER } from '../../redux/actions/userAction';
interface UpdateProfileProps {
    visible: boolean;
    onClose: () => void;
}

const UpdateProfile: React.FC<UpdateProfileProps> = ({ visible, onClose }) => {
    const user = useSelector((state: any) => state?.user)?.user;
    const [name, setName] = useState(user.name);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const handleBackPress = useCallback(() => {
        Snackbar.show({
            text: 'Please enter your name',
            duration: Snackbar.LENGTH_SHORT
        });
        return true;
    }, []);

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        };
    }, [handleBackPress]);

    const saveData = async () => {
        if (!name) {
            dispatch({
                type: SET_USER,
                payload: { ...user, name }
            })
            Snackbar.show({
                text: 'Please enter your name',
                duration: Snackbar.LENGTH_SHORT
            });


            return;
        }
        setLoading(true);
        const response = await updateUser(name)
        setLoading(false);

        if (response) {

            dispatch({
                type: SET_USER,
                payload: { ...user, name }
            })

            Snackbar.show({
                text: 'Name updated successfully',
                duration: Snackbar.LENGTH_SHORT
            });
            onClose();
            
        }
        
        

    }

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.header}>Hey,</Text>
                    <Text>What is your name?</Text>
                    <View style={styles.inputFieldContainer}>
                        <Icon name="user" size={24} color="black" />
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        {
                            loading ? (
                                <ActivityIndicator size="small" color="grey" />
                            ) : null
                        }
                        <TouchableOpacity onPress={saveData} style={styles.btn} activeOpacity={0.7} >
                            <Text style={styles.btnText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default UpdateProfile;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '90%',
        padding: 20,
        backgroundColor: 'white',
    },
    header: {
        fontSize: 32,
        color: 'black',
        fontWeight: 'bold',
    },
    inputFieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 5,
        height: 50,
        borderColor: '#d0d0d0',
        borderWidth: 1,
        marginTop: 10,
        paddingHorizontal: 10,
    },
    input: {
        height: 50,
        flex: 1,
        fontSize: 18,
        paddingLeft: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
        gap: 10,
    },
    btn: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        backgroundColor: 'black',
    },
    btnText: {
        color: 'white',
    },
});
