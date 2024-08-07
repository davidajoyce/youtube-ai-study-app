import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import {Colors} from './../../constants/Colors'
export default function TabLayout() {
  return (
    <Tabs screenOptions={{
        headerShown:false,
        tabBarActiveTintColor:Colors.PRIMARY
    }}>
        <Tabs.Screen name="tripdetails"
          options={{
            tabBarLabel:'Summary',
            tabBarIcon:({color})=><Ionicons name="location-sharp" 
            size={24} color={color} />
          }}
        />
        <Tabs.Screen name="questions"
        options={{
          tabBarLabel:'Q&A',
          tabBarIcon:({color})=><Ionicons name="globe-sharp" 
          size={24} color={color} />
        }}
        />
        <Tabs.Screen name="chat"
        options={{
          tabBarLabel:'Chat',
          tabBarIcon:({color})=><Ionicons name="people-circle" 
          size={24} color={color} />
        }}
        />
    </Tabs>
  )
}