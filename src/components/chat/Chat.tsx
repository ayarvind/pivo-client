import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, Dimensions, ImageBackground, StyleSheet, Text, View, ScrollView } from 'react-native';
import { User } from '../../interface/User';
import { io } from '../../socket';
import { MessageProps } from '../../interface/MessageProps';
import { useSelector } from 'react-redux';
import { getMsg } from '../../user/user';
import Icon from 'react-native-vector-icons/AntDesign';
import playSound from '../../utilities/playSound';
import Fab from '../layout/Fab';
import Media from '../layout/Media';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
const chatBg = require('../../../assets/chatbg.jpg');

const Chat = ({ user }: { user: User }) => {
  const [msg, setMsg] = useState<MessageProps[]>([]);
  const loggedUser = useSelector((state: any) => state.user)?.user;
  const receiverSender = `${user.id}-${loggedUser.id}`;
  const senderReceiver = `${loggedUser.id}-${user.id}`;
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const navigation = useNavigation<StackNavigationProp<any>>();
  useEffect(() => {
    const fetchMsg = async () => {
      try {
        setLoading(true);
        const response = await getMsg(senderReceiver, receiverSender);
        setLoading(false);
        if (response.success) {
          setMsg(response.msgs);
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

  useEffect(() => {
    // Scroll to bottom after messages are set
    scrollToEnd();
  }, [msg]); // Dependencies: messages change

  const scrollToEnd = () => {
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, 100); // Delay scrolling to ensure content is rendered
  };

  return (
    <ImageBackground source={chatBg} style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='grey' />
        </View>
      )}
      <ScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollViewContent}
        onContentSizeChange={() => scrollToEnd()} // Ensures scroll on content size change
      >
        {msg.map((message, index) => (
          <View key={index} >

            <View style={[styles.messageContainer, message.sender === loggedUser.id ? styles.sender : styles.receiver]}>
              {
                message.message.type === 'FILE' && (
                  <>
                    {/* <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('Attachment', {
                          mediaUrl: message.message.fileUrl,
                          content: message.message.content,
                          sender: message.sender,
                          receiver: message.receiver,
                          timestamp: message.timestamp,

                        });
                      }}
                      style={styles.mediabtn}>
                      <Icon style={{
                        padding: 10,
                        backgroundColor: '#f9f9f9',
                        borderRadius: 10,

                      }} name='download' size={20} color='black' />
                      <Text>
                        An attachment is here.
                      </Text>
                    </TouchableOpacity> */}
                    <Media
                      style={{
                        width: 200,
                        height: 200,
                        borderRadius: 10,
                        backgroundColor: 'white',
                      }}
                      mediaName={message.message.fileUrl || ''}
                      userId={message.sender}
                      resizeMode='contain'
                      />
                  </>
                )
              }
              <Text style={styles.messageText}>{message.message.content}</Text>

            </View>
            <View style={styles.timestampContainer}>
              <Text style={styles.timestampText}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </Text>
              <Icon style={styles.timestampText} name='check' size={11} color='black' />
            </View>

          </View>
        ))}
      </ScrollView>
      <Fab
        style={{
          width: 25,
          height: 25,

        }}
        iconSize={15}
        icon='down'
        onPress={() => {
          scrollToEnd();
        }}
      />

    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('window').height - 119,
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
    flexDirection: 'column',
    justifyContent: 'space-between',
    minWidth: 100,
    paddingBottom: 5,
    borderRadius: 10,
  },
  sender: {
    alignSelf: 'flex-end',
    backgroundColor: '#e7e7e7',
  },
  receiver: {
    backgroundColor: 'white',
  },
  messageText: {
    fontSize: 16,
    padding: 10,
    color: 'black',
    fontWeight: '500',
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 10,
    marginVertical: 5,
  },
  timestampText: {
    fontSize: 12,
    alignSelf: 'flex-end',
    marginRight: 10,
    color: 'grey',
  },
  mediabtn: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'white',
  }

});

export default Chat;
