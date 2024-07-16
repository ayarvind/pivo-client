import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const Drawer = ({ type = 'left', swipeable = true }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      if (type === 'left' || type === 'right') {
        translateX.value = type === 'left' ? Math.min(event.translationX, 0) : Math.max(event.translationX, 0);
      } else {
        translateY.value = type === 'top' ? Math.min(event.translationY, 0) : Math.max(event.translationY, 0);
      }
    },
    onEnd: () => {
      if (type === 'left' || type === 'right') {
        if (Math.abs(translateX.value) > width / 2) {
          translateX.value = withSpring(type === 'left' ? -width : width);
        } else {
          translateX.value = withSpring(0);
        }
      } else {
        if (Math.abs(translateY.value) > height / 2) {
          translateY.value = withSpring(type === 'top' ? -height : height);
        } else {
          translateY.value = withSpring(0);
        }
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    if (type === 'left' || type === 'right') {
      return {
        transform: [{ translateX: translateX.value }],
      };
    } else {
      return {
        transform: [{ translateY: translateY.value }],
      };
    }
  });

  const handlePressOpen = () => {
    if (type === 'left' || type === 'right') {
      translateX.value = withSpring(type === 'left' ? -width : width);
    } else {
      translateY.value = withSpring(type === 'top' ? -height : height);
    }
  };

  return (
    <View style={styles.container}>
      {swipeable && (
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.drawer, animatedStyle]}>
            <Text>Drawer Content</Text>
          </Animated.View>
        </PanGestureHandler>
      )}
      {!swipeable && (
        <Animated.View style={[styles.drawer, animatedStyle]}>
          <Text>Drawer Content</Text>
        </Animated.View>
      )}
      <TouchableOpacity onPress={handlePressOpen} style={styles.button}>
        <Text>Open Drawer</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Drawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawer: {
    position: 'absolute',
    width: width,
    height: height,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  button: {
    padding: 10,
    backgroundColor: '#6200EE',
    borderRadius: 5,
    marginTop: 20,
  },
});
