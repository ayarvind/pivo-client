import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

const logo = require('../../assets/logo.png')

const Splash = () => {
  return (
    <View style={styles.container}>
      <Image 
        source={logo}
        style={{width: 100, height: 100}}
      />
    </View>
  )
}

export default Splash

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: 'white', 
    justifyContent: 'center',
    alignItems: 'center',
      },
})
