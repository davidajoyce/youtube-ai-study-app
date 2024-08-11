import { View, Text, Dimensions, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { GiftedChat, Bubble, Composer } from 'react-native-gifted-chat'
import { chatGeneralSession } from '../../configs/AiModal';
import Markdown from 'react-native-markdown-display';
import { Colors } from '../../constants/Colors';
import { useVideo } from '../../context/VideoContext';
import { auth, db } from './../../configs/FirebaseConfig'
import { collection, getDocs, orderBy, query, where, and, doc, setDoc  } from 'firebase/firestore';


export default function ChatSession() {
  console.ignoreLogs = ['Warning:'];

  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  const [messages, setMessages] = useState([])
  const { videoId } = useVideo();
  console.log("chat videoId: ", videoId)
  const [transcript, setTranscript] = useState('');
  const user = auth.currentUser;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Ask me a question about the video',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'AI Assistant',
        },
      },
    ])
    GetTranscript()
  }, [videoId, user])

  const GetTranscript = useCallback(async()=>{
    if (!videoId || !user?.email) return;
    setIsLoading(true);
    const q=query(collection(db,'UserVideoTranscript'),
        and(
            where('userEmail','==',user?.email),
            where('videoId','==',videoId)
        ));
    const querySnapshot=await getDocs(q);

    const firstDoc = querySnapshot.docs[0];
    if (!querySnapshot.empty) {
        const firstDoc = querySnapshot.docs[0];
        console.log("transcript for chat", firstDoc.data());
        setTranscript(firstDoc.data().transcript);
    } else {
        console.log("No transcript found");
        setTranscript('');
    }
    setIsLoading(false);
  }, [videoId, user]);

  const markdownStyles = (isAI) => ({
    body: {
      fontSize: 16, // Increase base font size
      fontFamily: isAI ? 'outfit-regular' : undefined,
      color: isAI ? Colors.PRIMARY : Colors.WHITE,
    },
    heading1: {
      fontSize: 24, // Larger font size for h1
      fontFamily:'outfit-regular'
    },
    heading2: {
      fontSize: 22, // Larger font size for h2
      fontFamily:'outfit-regular'
    },
    strong: {
      fontSize: 18, // Larger font size for bold text
      fontFamily:'outfit-regular'
    },
  });

  const renderComposer = (props) => (
    <Composer
      {...props}
      textInputStyle={{
        fontFamily: 'outfit-regular', // Change this to your preferred font
        fontSize: 18, // Adjust the font size as needed
        color: Colors.PRIMARY, // Change the text color if desired
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 12,
      }}
      placeholderTextColor="outfit-regular" // Change the placeholder text color if desired
    />
  );

  const renderMessageText = (props) => {
    const isAI = props.currentMessage.user._id === 2;
    return (
      <View style={{ padding: 5 }}>
        <Markdown style={markdownStyles(isAI)}>{props.currentMessage.text}</Markdown>
      </View>
    );
  };

  const renderAvatar = () => null;

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: Colors.LIGHT_GRAY,
            borderWidth: 1,
            borderRadius: 15,
            marginLeft: 2,
            marginRight: 15,
            // maxWidth: SCREEN_WIDTH * 0.8
          },
          right: {
            backgroundColor: Colors.PRIMARY,
            borderWidth: 1,
            borderRadius: 15,
            marginLeft:2,
            marginRight: 10,
            // maxWidth: SCREEN_WIDTH * 0.8
          },
        }}
        renderMessageText={renderMessageText}
      />
    );
  };

  const onSend = useCallback(async (newMessages = []) => {
    // Add user message to the chat
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages)
    );

  
    if (!transcript) {
    console.log("No transcript available");
    return;
    }

    const userMessage = newMessages[0].text;

    console.log("transcript for chat")
    console.log(transcript)
    const messageToSend = 'Based on the following video transcript:' 
    + transcript + 'answer the following question:'
    + userMessage;
    console.log("message to send")
    console.log(messageToSend)

    try {
      // Send message to AI and get response
      const result = await chatGeneralSession.sendMessage(messageToSend);
      const aiResponse = result.response.text();

      // Create AI message object
      const aiMessage = {
        _id: Math.round(Math.random() * 1000000),
        text: aiResponse,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'AI Assistant',
        },
      };

      // Add AI response to the chat
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [aiMessage])
      );
    } catch (error) {
      console.error('Error in AI communication:', error);
      // Optionally, add an error message to the chat
      const errorMessage = {
        _id: Math.round(Math.random() * 1000000),
        text: 'Sorry, I encountered an error. Please try again.',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'AI Assistant',
          avatar: 'https://placeimg.com/140/140/tech',
        },
      };
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [errorMessage])
      );
    }
  }, []);

  return (
    <View style={styles.container}>
        <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
            _id: 1,
        }}
        renderBubble={renderBubble}
        renderAvatar={renderAvatar}
        listViewProps={{
            style: styles.chatBackground,
        }}
        />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.WHITE,
    },
    chatBackground: {
      backgroundColor: Colors.WHITE,
    },
  });