import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import { TouchableOpacity } from 'react-native-gesture-handler'
import DisplayImage from '../layout/DisplayImage'
import { User } from '../../interface/User'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import Media from '../layout/Media'

const ChatHeader = ({ user }: {
    user: User
}) => {
    const navigation = useNavigation<StackNavigationProp<any>>();
    console.log('+++++++++++++++++++++',user)
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => {
                navigation.goBack()
            }} style={styles.btn} touchSoundDisabled={false}>
                <Icon name='left' size={20} color='black' />
            </TouchableOpacity>
            <Media
                style={styles.image}
                mediaName={user.image}
                userId={user.id}
                />

            <View>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.status}>
                   {
                       user.status ? user.status : user.bio
                   }
                </Text>
            </View>
        </View>
    )
}

export default ChatHeader

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        backgroundColor: 'white',
    },
    name: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
    status: {
        color: 'grey',
        fontSize: 11,
    },
    image: {
        height: 40,
        marginHorizontal: 10,
        width: 40,
        borderRadius: 50,
    },
    btn: {
        padding: 10,
        borderRadius: 50,
    }
})