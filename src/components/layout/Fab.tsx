import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
const Fab = ({
    onPress,
    icon,
    style,
    iconSize
}: {
    onPress: () => void,
    icon: string,
    style?:any,
    iconSize?:number
}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity activeOpacity={0.8} style={[styles.fab,style]} onPress={onPress}>
                <Icon name={icon} size={
                    iconSize ? iconSize : 21
                } color="white" />
            </TouchableOpacity>
        </View>
    )
}

export default Fab

const styles = StyleSheet.create({
    container: {
        position:'absolute',
        right:20,
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
