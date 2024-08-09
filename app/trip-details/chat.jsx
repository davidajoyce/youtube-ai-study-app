import { View, Text } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { chatGeneralSession } from '../../configs/AiModal';

export default function ChatSession() {

  const [messages, setMessages] = useState([])
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ])
  }, [])

  const onSend = useCallback(async (newMessages = []) => {
    // Add user message to the chat
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages)
    );

    const userMessage = newMessages[0].text;

    try {
      // Send message to AI and get response
      const result = await chatGeneralSession.sendMessage(userMessage);
      const aiResponse = result.response.text();

      // Create AI message object
      const aiMessage = {
        _id: Math.round(Math.random() * 1000000),
        text: aiResponse,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'AI Assistant',
          avatar: 'https://placeimg.com/140/140/tech',
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
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  )
}