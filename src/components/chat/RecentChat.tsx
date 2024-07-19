import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { User } from '../../interface/User';
import { getRecentsChats, getUser } from '../../user/user';
import DisplayImage from '../layout/DisplayImage';
import getMedia from '../../utilities/getMedia';
import Media from '../layout/Media';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
const RecentChat = ({ user }: { user: User }) => {
    const [recent, setRecent] = useState([]);
    const [users, setUsers] = useState<{ [key: string]: any }>({});
    const navigation = useNavigation<StackNavigationProp<any>>();
    useEffect(() => {
        const fetchChats = async () => {
            const chats = await getRecentsChats(user?.id);
            if (chats.success) {
                setRecent(chats.chats);

                const userPromises = chats.chats.map((chat: any) => getUser(chat.userId));
                const userResults = await Promise.all(userPromises);
                const userMap = userResults.reduce((acc, data, index) => {
                    if (data.success) {
                        acc[chats.chats[index].userId] = data.user;
                    }
                    return acc;
                }, {});
                setUsers(userMap);
            }
        };
        fetchChats();
    }, [user?.id]);

    const renderItem = ({ item }: { item: any }) => {
        const chatUser = users[item.userId];
        return (
            <TouchableOpacity disabled={
                !chatUser
            }
                onPress={() => {
                    const userProps = {
                        id: chatUser.id,
                        name: chatUser.name,
                        phone: chatUser.phone,
                        image: chatUser.image,
                        bio: chatUser.bio
                    }
                    navigation.navigate('Chat', userProps)
                }}
                style={styles.chatItem}>

                <Media
                    style={styles.image}
                    mediaName={chatUser?.image}
                    userId={chatUser?.id}
                />
                <View>
                    <Text style={styles.chatUserName}>{chatUser ? chatUser.name : chatUser?.phone}</Text>
                    <Text style={styles.lastMessage}>{item.lastMessage.content}</Text>

                </View>
                {item.unreadCount > 0 && (
                    <>
                        {
                            <View style={{ backgroundColor: 'black', padding: 5, borderRadius: 50, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={styles.unreadCount}>{item.unreadCount}</Text>
                            </View>
                        }
                    </>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={recent}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
            />
        </View>
    );
};

export default RecentChat;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
        width: '100%',
        backgroundColor: '#f9f9f9'
    },
    chatItem: {
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'white',
        marginVertical: 1,

    },
    chatUserName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    lastMessage: {
        fontSize: 12,
        color: '#555',
    },
    unreadCount: {
        fontSize: 12,
        color: 'white',
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 50,

    }
});
