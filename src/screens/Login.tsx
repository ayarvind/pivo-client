import { StyleSheet, Text, View, Image, TextInput, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import React, { useEffect } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import { Account, ID } from 'appwrite';
import { client } from '../utilities/appwrite';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { apiKey, server } from '../../app.json'
import axios from 'axios';
import { NavigationProp } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import Snackbar from 'react-native-snackbar';
const welcomeImage = require('../../assets/welcome.jpg');

const Login = ({ navigation }: {
    navigation: NavigationProp<any>
}) => {
    const [verifying, setVerifying] = React.useState(false);
    const [phone, setPhone] = React.useState('');
    const [code, setCode] = React.useState('');
    const [step, setStep] = React.useState(1);
    const [error, setError] = React.useState('');
    const [token, setToken] = React.useState<any>();
    const dispatch = useDispatch();
    const [loading, setLoading] = React.useState(false);

    const handleSendCode = async () => {
        setVerifying(true);
        const phoneRegExp = /^[6-9]\d{9}$/;
        const phoneSchema = yup.string().matches(phoneRegExp, 'Phone number is not valid');

        try {
            await phoneSchema.validate(phone);
            setError('');
            const account = new Account(client);
            const token = await account.createPhoneToken(
                ID.unique(),
                `+91${phone}`
            );

            console.log(token);

            if (token.$id) {
                setToken(token)
                setStep(2);
            } else {
                setError('Error sending code');
            }
        } catch (err: unknown) {
            setError(err as string);
        } finally {
            setVerifying(false);
        }
    };

    const handleVerifyCode = async () => {
        if (!token) {
            setError('Something went wrong');
            return;
        }
        setVerifying(true);
        const account = new Account(client);
       
        try {
           
            const url = `${server}/login`;
            console.log('making request to: ', url)
            console.log(token);
            const tokenResponse = await axios.post(url, {
                phone: phone,
                id:token.userId
            }, {
                headers: {
                    'api-key': apiKey
                }
            });
            if(tokenResponse.data.success){
                 await account.createSession(
                    token.userId,
                    code
                );
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                });
                
            }else{
                setError('Can not connect to server');
            }



            


        } catch (err) {
           
            setError('Something went wrong, please try again.');
            Snackbar.show({
                text: 'Something went wrong, please try again.',
                duration: Snackbar.LENGTH_SHORT,
            })
        } finally {
            setVerifying(false);
        }
    };

    return (
        <>
            {
                !loading ? (
                    <ScrollView>
                        <View style={styles.container}>
                            <Image source={welcomeImage} style={styles.image} />
                            <Text style={styles.title}>Welcome to Pivo</Text>
                            <View style={styles.inputContainer}>
                                <Text style={{ marginBottom: 20 }}>We respect your privacy, which is why your chats are end-to-end encrypted. Now, enjoy chatting with your friends and family without any hesitation about privacy.</Text>
                                {step === 1 && (
                                    <>
                                        <Text style={{ marginBottom: 20 }}>Login to your account</Text>
                                        <View style={styles.inputFieldContainer}>
                                            <Icon style={styles.icon} name='phone' size={20} color="black" />
                                            <TextInput
                                                editable={!verifying}
                                                style={styles.input}
                                                keyboardType="phone-pad"
                                                placeholder="Phone number"
                                                value={phone}
                                                onChangeText={setPhone}
                                            />
                                        </View>
                                        <TouchableOpacity style={styles.button} onPress={handleSendCode} activeOpacity={0.3}>
                                            <Text style={styles.btnText}>SEND CODE</Text>
                                            <Icon color={'white'} name="arrowright" size={20} />
                                        </TouchableOpacity>
                                    </>
                                )}
                                {step === 2 && (
                                    <>
                                        <Text style={{ marginBottom: 20 }}>Enter the verification code sent to your phone</Text>
                                        <View style={styles.inputFieldContainer}>
                                            <Icon style={styles.icon} name='lock' size={20} color="black" />
                                            <TextInput
                                                editable={!verifying}
                                                style={styles.input}
                                                placeholder="Verification code"
                                                value={code}
                                                onChangeText={setCode}
                                            />
                                        </View>
                                        <TouchableOpacity style={styles.button} onPress={handleVerifyCode} activeOpacity={0.3}>
                                            <Text style={styles.btnText}>VERIFY CODE</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                                {error && (
                                    <Text style={{
                                        color: 'red',
                                        marginTop: 20,
                                    }}>
                                        <Icon name="warning" size={20} color="red" /> {error}
                                    </Text>
                                )}
                                {verifying && <ActivityIndicator style={{ marginTop: 20 }} size="large" color="grey" />}
                            </View>
                        </View>
                    </ScrollView>
                ) : (
                    <>
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size="large" color="grey" />
                        </View>
                    </>
                )
            }
        </>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
        height:Dimensions.get('window').height
    },
    image: {
        width: '100%',
        height: 300,
        marginBottom: 20,
    },
    title: {
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'black',
    },
    inputContainer: {
        width: '100%',
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
        paddingHorizontal: 10,
    },
    input: {
        height: 50,
        flex: 1,
        fontSize: 18,
        paddingLeft: 10,
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        height: 50,
        gap: 10,
        borderRadius: 5,
        backgroundColor: 'black',
    },
    btnText: {
        color: 'white',
        fontSize: 18,
    },
    icon: {
        backgroundColor: '#efeeee',
        padding: 10,
        borderRadius: 50,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
