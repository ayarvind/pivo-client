import { Dimensions, StyleSheet, View, KeyboardAvoidingView, Platform, Text } from 'react-native';
import React, { useEffect } from 'react';
import { NavigationProp, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { SET_CURRENT_CHAT_USER } from '../redux/actions/currentChatAction';
import ChatBottom from '../components/chat/ChatBottom';
import { ScrollView } from 'react-native-gesture-handler';
import Chat from '../components/chat/Chat';

const ChatScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const user = useRoute().params as any;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: SET_CURRENT_CHAT_USER,
      payload: user,
    });
  }, [user]);
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80} // Adjust this value as needed
    >
      <View style={styles.chatContainer}>
        <ScrollView>
          
          <Chat
            user={user}
          />
        </ScrollView>
      </View>
      <ChatBottom user={user} />
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: Dimensions.get('window').height,
  },
  chatContainer: {
    flex: 1,
    width: '100%',
  },
});
