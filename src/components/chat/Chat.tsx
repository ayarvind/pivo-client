import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, Dimensions, ImageBackground, StyleSheet, Text, View, ScrollView } from 'react-native';
import { User } from '../../interface/User';
import { io } from '../../socket';
import { MessageProps } from '../../interface/MessageProps';
import { useSelector } from 'react-redux';
import { getMsg } from '../../user/user';
import Icon from 'react-native-vector-icons/AntDesign';
import playSound from '../../utilities/playSound';
const chatBg = require('../../../assets/chatbg.jpg');

const Chat = ({ user }: { user: User }) => {
  const [msg, setMsg] = useState<MessageProps[]>([]);
  const loggedUser = useSelector((state: any) => state.user)?.user;
  const receiverSender = `${user.id}-${loggedUser.id}`;
  const senderReceiver = `${loggedUser.id}-${user.id}`;
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  useEffect(() => {
    scrollToEnd();
  }, [])
  useEffect(() => {
    const fetchMsg = async () => {
      try {
        setLoading(true);
        const response = await getMsg(senderReceiver, receiverSender);
        setLoading(false);
        if (response.success) {
          setMsg(response.msgs);
          // Scroll to bottom on initial load
          scrollToEnd();
        } else {
          console.error('Failed to fetch messages:', response.message);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMsg();
  }, [receiverSender, senderReceiver]);

  useEffect(() => {
    const handleNewMessage = (data: MessageProps) => {
      setMsg(prevMsg => {
        if (prevMsg.some(msg => msg.message.msgId === data.message.msgId)) {
          return prevMsg; // Skip adding the message if it already exists
        }
        // play the sound
        playSound('send.mp3');
        const newMessages = [...prevMsg, data];
        // Scroll to bottom on new message
        scrollToEnd();
        return newMessages;
      });
    };

    io.on(`message:${receiverSender}`, handleNewMessage);
    io.on(`message:${senderReceiver}`, handleNewMessage);

    return () => {
      io.off(`message:${receiverSender}`, handleNewMessage);
      io.off(`message:${senderReceiver}`, handleNewMessage);
    };
  }, [receiverSender, senderReceiver]);

  // Function to scroll to the end of the ScrollView
  const scrollToEnd = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  return (
    <ImageBackground source={chatBg} style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='grey' />
        </View>
      )}
      <ScrollView showsVerticalScrollIndicator={false} ref={scrollViewRef} contentContainerStyle={styles.scrollViewContent}>
        {msg.map((message, index) => (
          <View key={index} style={[styles.messageContainer, message.sender === loggedUser.id ? styles.sender : styles.receiver]}>
            <Text style={styles.messageText}>{message.message.content}</Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              marginRight: 10,
            }}>

              <Text style={styles.timestampText}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </Text>
              <Icon style={styles.timestampText} name='check' size={11} color='black' />
            </View>
          </View>
        ))}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('window').height,
    padding: 10,
    justifyContent: 'flex-end',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    alignSelf: 'flex-start',
    maxWidth: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minWidth: 100,
    paddingBottom: 5,
    borderRadius: 10,
    marginBottom: 10,
  },
  sender: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  receiver: {
    backgroundColor: '#ECECEC',
  },
  messageText: {
    fontSize: 16,
    padding: 10,
    color: 'black',
    fontWeight: '500',
  },
  timestampText: {
    fontSize: 12,
    alignSelf: 'flex-end',
    marginRight: 10,
    color: 'grey',
  },
});

export default Chat;
