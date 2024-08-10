import { View, Text, Image, ScrollView, Button, StyleSheet } from 'react-native'
import React, {useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { Colors } from '../../constants/Colors';
import YoutubePlayer from "react-native-youtube-iframe";
import { YoutubeTranscript } from 'youtube-transcript';
import { TouchableOpacity } from 'react-native';
import { summaryChatSession } from '../../configs/AiModal';
import { AI_SUMMARY_PROMPT } from '../../constants/Options';

export default function TripDetails() {

    const navigation=useNavigation();
    const {trip}=useLocalSearchParams();
    const [tripDetails,setTripDetails]=useState(JSON.parse(trip));
    const playerRef = useRef();
    const [videoSummary, setVideoSummary] = useState(null);

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
        try {
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
            console.log("formatted")
            console.log(formated)
            console.log("stringify formated")
            console.log(JSON.stringify(formated))


            const FINAL_PROMPT = AI_SUMMARY_PROMPT
                    .replace('{transcriptNote}', JSON.stringify(formated))
            console.log("AI_SUMMARY_PROMPT")
            console.log(FINAL_PROMPT)
            
            const result = await summaryChatSession.sendMessage(FINAL_PROMPT);
            console.log('response from gemini summary')
            console.log(result.response.text());
            const summary = JSON.parse(result.response.text());

            setVideoSummary(summary);
        } catch (error) {
            console.error('Error generating summary:', error);
            // Handle error (e.g., show an error message to the user)
        }
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

    const seekToTimestamp = (timestamp) => {
        const [minutes, seconds] = timestamp.split(':').map(Number);
        playerRef.current?.seekTo(minutes * 60 + seconds);
      };

    const TimestampButton = ({ timestamp, label }) => (
    <TouchableOpacity 
        onPress={() => seekToTimestamp(timestamp)}
        style={styles.timestampButton}
    >
        <Text style={styles.timestampText}>{label || `Watch at ${timestamp}`}</Text>
    </TouchableOpacity>
    );

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
       <View style={styles.contentContainer}>
        {videoSummary && (
          <>
            <Text style={styles.sectionTitle}>Video Overview</Text>
            <Text style={styles.overviewText}>{videoSummary.overview}</Text>

            <Text style={styles.sectionTitle}>Fundamental Concepts</Text>
            {videoSummary.fundamentalConcepts.map((concept, index) => (
              <View key={index} style={styles.conceptContainer}>
                <Text style={styles.conceptTitle}>{concept.concept}</Text>
                <Text style={styles.explanationText}>{concept.explanation}</Text>
                <TimestampButton timestamp={concept.timestamp} />
                <Text style={styles.importanceText}>Why it's important: {concept.importance}</Text>
              </View>
            ))}

            <Text style={styles.sectionTitle}>Key Points</Text>
            {videoSummary.keyPoints.map((point, index) => (
              <View key={index} style={styles.pointContainer}>
                <Text style={styles.pointText}>{point.point}</Text>
                <TimestampButton timestamp={point.timestamp} />
              </View>
            ))}

            <Text style={styles.sectionTitle}>Recurring Themes</Text>
            {videoSummary.recurringThemes.map((theme, index) => (
              <View key={index} style={styles.themeContainer}>
                <Text style={styles.themeTitle}>{theme.theme}</Text>
                <View style={styles.timestampContainer}>
                  {theme.timestamps.map((timestamp, tIndex) => (
                    <TimestampButton 
                      key={tIndex} 
                      timestamp={timestamp} 
                      label={`Instance ${tIndex + 1}`}
                    />
                  ))}
                </View>
              </View>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.WHITE,
    },
    contentContainer: {
      padding: 15,
      marginTop: -30,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      backgroundColor: Colors.WHITE,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 15,
      marginTop: 20,
      color: Colors.PRIMARY,
    },
    overviewText: {
      fontSize: 16,
      marginBottom: 20,
    },
    conceptContainer: {
      marginBottom: 20,
    },
    conceptTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    explanationText: {
      fontSize: 16,
      marginBottom: 10,
    },
    importanceText: {
      fontSize: 14,
      fontStyle: 'italic',
      marginTop: 5,
    },
    pointContainer: {
      marginBottom: 15,
    },
    pointText: {
      fontSize: 16,
      marginBottom: 5,
    },
    themeContainer: {
      marginBottom: 20,
    },
    themeTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    timestampContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    timestampButton: {
      backgroundColor: Colors.PRIMARY,
      padding: 10,
      borderRadius: 5,
      marginRight: 10,
      marginBottom: 10,
    },
    timestampText: {
      color: Colors.WHITE,
      fontWeight: 'bold',
    },
  });