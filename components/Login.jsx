import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions, SafeAreaView } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import { useRouter } from 'expo-router'

export default function Login() {

    const router=useRouter();
    const { height } = useWindowDimensions();
  return (
    <SafeAreaView style={styles.safeArea}>
    <ScrollView contentContainerStyle={{ minHeight: height }}>
        <Image source={require('./../assets/images/cover_photo_2.png')}
            style={{
                width:'100%',
                height:520
            }}
        />
        <View style={styles.container}>
            <Text style={{
                fontSize:30,
                fontFamily:'outfit-bold',
                textAlign:'center',
                marginTop:10
            }}>Youtube AI Study App</Text>

            <Text style={{
                fontFamily:'outfit',
                fontSize:17,
                textAlign:'center',
               color:Colors.GRAY,
               marginTop:20
            }}>Learn from your youtube videos, get unique insights, quiz yourself or chat to your youtube videos</Text>
       
            <TouchableOpacity style={styles.button}
                onPress={()=>router.push('auth/sign-in')}
            >
                <Text style={{color:Colors.WHITE,
                textAlign:'center',
                fontFamily:'outfit',
                fontSize:17
                }}>Get Started</Text>
            </TouchableOpacity>
    
        </View>
    </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.WHITE,
    },
    container:{
        backgroundColor:Colors.WHITE,
        marginTop:-20,
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
        height:'100%',
        padding:25
    },
    button:{
        padding:15,
        backgroundColor:Colors.PRIMARY,
        borderRadius:99,
        marginTop:'20%'
    }
})