import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { client } from '../../utilities/appwrite';
import { Account } from 'appwrite';
import { useNavigation } from '@react-navigation/native';

const VerticalMenu = () => {
    const navigation = useNavigation();

    const handleOptionSelect = async (value: string) => {
        if (value === 'logout') {
            try {
                const account = new Account(client);
                // Type assertion to handle method signature issues
                await account.deleteSession('current' as any);
                navigation.reset({
                    index: 0,
                    routes:[{
                        name: 'Login' as never
                    }]
                })
            } catch (error) {
                console.error('Logout failed:', error);
            }
        }else if(value === 'profile'){
            navigation.navigate('Profile' as never);
        }
    };

    return (
        <Menu>
            <MenuTrigger>
                <Icon
                    style={{
                        padding: 10,
                        marginRight: 10,
                    }}
                    color={'black'}
                    name="ellipsis-v"
                    size={18}
                />
            </MenuTrigger>
            <MenuOptions>
                <MenuOption onSelect={() => handleOptionSelect('profile')}>
                    <Text style={styles.text}>Profile</Text>
                </MenuOption>
                <MenuOption onSelect={() => handleOptionSelect('Option 2')}>
                    <Text style={styles.text}>Option 2</Text>
                </MenuOption>
                <MenuOption onSelect={() => handleOptionSelect('logout')}>
                    <Text style={styles.text}>Logout</Text>
                </MenuOption>
            </MenuOptions>
        </Menu>
    );
};

export default VerticalMenu;


const styles = StyleSheet.create({
    text: {
        padding: 8,
        fontSize: 18,
    },
})