import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
const Fab = ({
    onPress,
    icon
}: {
    onPress: () => void,
    icon: string
}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity activeOpacity={0.8} style={styles.fab} onPress={onPress}>
                <Icon name={icon} size={24} color="white" />
            </TouchableOpacity>
        </View>
    )
}

export default Fab

const styles = StyleSheet.create({
    container: {
        position:'absolute',
        right:40,
        top:600,
    },
    fab: {
        width: 56,
        color:'white',
        height: 56,
        borderRadius: 28,
        backgroundColor:'black',
        justifyContent: 'center',
        alignItems: 'center',
       
    }
});
