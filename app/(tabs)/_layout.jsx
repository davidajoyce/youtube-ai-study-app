import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import {Colors} from './../../constants/Colors'
export default function TabLayout() {
  return (
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
    }}>
        <Tabs.Screen name="mytrip"
          options={{
            tabBarLabel:'My Videos',
            tabBarIcon:({color})=><Ionicons name="videocam" 
            size={24} color={color} />
          }}
        />
    </Tabs>
  )
}