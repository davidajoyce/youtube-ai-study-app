import { View, Text, Image, ScrollView, Button } from 'react-native'
import React, {useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { Colors } from '../../constants/Colors';
import moment from 'moment'
import FlightInfo from '../../components/TripDetails/FlightInfo';
import HotelList from '../../components/TripDetails/HotelList';
import PlannedTrip from '../../components/TripDetails/PlannedTrip';
import YoutubePlayer from "react-native-youtube-iframe";
import { YoutubeTranscript } from 'youtube-transcript';
import { TouchableOpacity } from 'react-native';

export default function TripDetails() {

    const navigation=useNavigation();
    const {trip}=useLocalSearchParams();
    const [tripDetails,setTripDetails]=useState(JSON.parse(trip));
    const playerRef = useRef();

    const formatData=(data)=>{
        return data&&JSON.parse(data);
    }
    useEffect(()=>{
        navigation.setOptions({
            headerShown:true,
            headerTransparent:true,
            headerTitle:''
        });
        
        trip&&setTripDetails(JSON.parse(trip))
        GetTranscript()
    },[trip])


    const GetTranscript = async()=>{
       console.log("attempting to get transcript")
       const transcript = await YoutubeTranscript
       .fetchTranscript('ZcZu1NYx-WE')
       .catch(e=>
        console.log(e))
       const textFromTranscript = transcript.map((item)=> item.text).join(" ");

       console.log("transcript")
       console.log(textFromTranscript)
       console.log(transcript)
       const formated = formatTranscriptForLLM(transcript)
       console.log(formated)
    }

    const formatTimestamp = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };
      
    const formatTranscriptForLLM = (transcriptData, segmentDuration = 10) => {
    let formattedTranscript = [];
    let currentSegment = {
        startOffset: transcriptData[0].offset,
        text: []
    };
    
    for (let item of transcriptData) {
        currentSegment.text.push(item.text);
    
        if (item.offset - currentSegment.startOffset >= segmentDuration) {
        formattedTranscript.push({
            timestamp: formatTimestamp(currentSegment.startOffset),
            text: currentSegment.text.join(' ')
        });
        currentSegment = {
            startOffset: item.offset,
            text: []
        };
        }
    }
    
    // Add the last segment
    if (currentSegment.text.length > 0) {
        formattedTranscript.push({
        timestamp: formatTimestamp(currentSegment.startOffset),
        text: currentSegment.text.join(' ')
        });
    }
    
    return formattedTranscript;
    };

  return tripDetails&&(
    <ScrollView>
         {/* <Image source={{uri:
        'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference='
        +formatData(tripDetails?.tripData).locationInfo?.photoRef
        +'&key='+process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}}
        style={{
            width:'100%',
                height:330,
                
        }}
        /> */}
        <YoutubePlayer
        ref={playerRef}
        height={300}
        play={false}
        videoId={"ZcZu1NYx-WE"}
        />
        <View style={{
            padding:15,
            backgroundColor:Colors.WHITE,
            height:'100%',
            marginTop:-30,
            borderTopLeftRadius:30,
            borderTopRightRadius:30
        }}> 
            {/* Play at time youtube  */}
            <TouchableOpacity 
                onPress={() => {
                    playerRef.current?.getCurrentTime().then(
                    currentTime => console.log({currentTime})
                    );

                    playerRef.current?.getDuration().then(
                        getDuration => console.log({getDuration})
                    );
                    // Time in seconds
                    playerRef.current?.seekTo(3000)
                }} 
                style={{
                    padding:20,
                    backgroundColor:Colors.PRIMARY,
                    borderRadius:15,
                    marginTop:50
                }}>
                    <Text style={{
                        color:Colors.WHITE,
                        textAlign:'center'
                    }}>Play at</Text>
            </TouchableOpacity>
            <Text>transcript</Text>
            <Text style={{
                fontSize:25,
                fontFamily:'outfit-bold'
            }}>{tripDetails?.tripPlan.travelPlan.location}</Text>
           <View style={{
            display:'flex',
            flexDirection:'row',
            gap:5,
            marginTop:5
           }}>
             <Text style={{
                fontFamily:'outfit',
                fontSize:18,
                color:Colors.GRAY
            }}>{moment(formatData(tripDetails.tripData).startDate).format('DD MMM yyyy')}</Text>
              <Text style={{
                fontFamily:'outfit',
                fontSize:18,
                color:Colors.GRAY
            }}> {moment(formatData(tripDetails.tripData)?.endDate).format('DD MMM yyyy')}</Text>
         </View>
         <Text style={{
                fontFamily:'outfit',
                fontSize:17,
                color:Colors.GRAY
            }}>🚌 {formatData(tripDetails.tripData)?.traveler?.title}</Text>
        
        
        {/* Flight Info  */}
      
        <FlightInfo flightData={tripDetails?.tripPlan?.travelPlan?.flight} />
        {/* Hotels List  */}
        <HotelList hotelList={tripDetails?.tripPlan?.travelPlan?.hotels} />
        {/* Trip Day Planner Info */}
        <PlannedTrip details={tripDetails?.tripPlan?.travelPlan?.itinerary} />
        </View>
{/* 
            <View>

            </View> */}

    </ScrollView>
  )
}