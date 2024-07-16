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
const Stack = createStackNavigator();

const Main = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [initialRoute, setInitialRoute] = useState('Login');

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
        <Stack.Navigator initialRouteName={initialRoute}>
            <Stack.Screen name="Home" options={{
                headerRight: () => <HeaderMenuOpener />
            }} component={Home} />
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