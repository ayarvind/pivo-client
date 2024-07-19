import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import Login from './screens/Login';
import Home from './screens/Home';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import { Account, AppwriteException } from 'appwrite';
import { client } from './utilities/appwrite';
import HeaderMenuOpener from './components/home/HeaderMenuOpener';
import Snackbar from 'react-native-snackbar';
import ProfileScren from './screens/ProfileScren';
import ContactListScreen from './screens/ContactListScreen';
import ChatScreen from './screens/ChatScreen';
import { useSelector } from 'react-redux';
import ChatHeader from './components/chat/ChatHeader';
import Attachment from './screens/Attachment';
const Stack = createStackNavigator();

const Main = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [initialRoute, setInitialRoute] = useState('Login');
    const currentUser = useSelector((state: any) => state.currentChat)?.currentChat;
    useEffect(() => {
        const checkToken = async () => {
            const account = new Account(client);
            try {
                await account.get();
                setInitialRoute('Home');
                Snackbar.show({
                    text: 'Welcome back!',
                    duration: Snackbar.LENGTH_SHORT,
                })
            } catch (error: AppwriteException | any) {
                setInitialRoute('Login');
                Snackbar.show({
                    text: 'Please login to continue',
                    duration: Snackbar.LENGTH_SHORT,
                })

            } finally {
                setIsLoading(false);
            }
        };



        checkToken();
    }, []);



    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="grey" />
            </View>
        );
    }

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor:'white',
                },
                headerTitleStyle: {
                    color: '#000',
                },
            }}
        initialRouteName={initialRoute}>
            <Stack.Screen name="Home" options={{
                headerRight: () => <HeaderMenuOpener />
            }} component={Home} />
            <Stack.Screen name="Contact" options={{
                title: 'Select contact'
            }} component={ContactListScreen} />
            <Stack.Screen options={{
                title: '',
                headerLeft: () => <ChatHeader user={currentUser} />
            }} name='Chat' component={ChatScreen} />
            <Stack.Screen name='Profile' component={ProfileScren} />
            <Stack.Screen options={{
                headerShown: false
            }} name='Attachment' component={Attachment}/>
            <Stack.Screen name="Login" options={{
                headerShown: false
            }} component={Login} />
        </Stack.Navigator>
    );
};
export default Main;

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
