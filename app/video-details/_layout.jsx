import React, { useCallback } from 'react'
import { Tabs, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import {Colors} from './../../constants/Colors'
import { VideoProvider } from '../../context/VideoContext';
export default function TabLayout() {
  const { videoIdFrom } = useLocalSearchParams();

  const renderTabBarIcon = useCallback(({ name, color }) => (
    <Ionicons name={name} size={28} color={color} />
  ), []);

  return (
    <VideoProvider>
      <Tabs 
      screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.PRIMARY,
          tabBarStyle: {
            height: 70, // Increase the height of the tab bar
          },
          tabBarItemStyle: {
            padding: 10, // Add padding to increase touchable area
          },
          tabBarLabelStyle: {
            fontSize: 14, // Increase font size of the label
            marginBottom: 1, // Adjust label position
          },
          tabBarIconStyle: {
            marginTop: 1, // Adjust icon position
          },
        }}
      initialRouteName="videodetails"
      >
          <Tabs.Screen name="videodetails"
            options={{
              tabBarLabel:'Summary',
              tabBarIcon:({color})=><Ionicons name="book" 
              size={24} color={color} />
            }}
            initialParams={{ videoIdFrom }}
          />
          <Tabs.Screen name="questions"
          options={{
            tabBarLabel:'Q&A',
            tabBarIcon: ({ color }) => renderTabBarIcon({ name: "globe-sharp", color }),
          }}
          />
          <Tabs.Screen name="chat"
          options={{
            tabBarLabel:'Chat',
            tabBarIcon: ({ color }) => renderTabBarIcon({ name: "people-circle", color }),
          }}
          />
      </Tabs>
    </VideoProvider>
  )
}