import { View, Text, ScrollView, StyleSheet, Dimensions, ActivityIndicator } from 'react-native'
import React, {useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { Colors } from '../../constants/Colors';
import YoutubePlayer from "react-native-youtube-iframe";
import { YoutubeTranscript } from 'youtube-transcript';
import { TouchableOpacity } from 'react-native';
import { summaryChatSession } from '../../configs/AiModal';
import { AI_SUMMARY_PROMPT } from '../../constants/Options';
import { auth, db } from './../../configs/FirebaseConfig'
import { collection, getDocs, orderBy, query, where, and, doc, setDoc  } from 'firebase/firestore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function TripDetails() {
    const navigation=useNavigation();
    const {videoIdFrom}=useLocalSearchParams();
    console.log("videoIdFrom")
    console.log(videoIdFrom)
    const videoId = JSON.parse(videoIdFrom)
    console.log("videoId")
    console.log(videoId)
    // const [tripDetails,setTripDetails]=useState(JSON.parse(trip));
    const playerRef = useRef();
    const [videoSummary, setVideoSummary] = useState(null);
    const scrollViewRef = useRef();
    const [loading, setLoading] = useState(true);
    const user = auth.currentUser;
    // console.log("user")
    // console.log(user)
    // const videoId = 'ZcZu1NYx-WE'

    const formatData=(data)=>{
        return data&&JSON.parse(data);
    }
    useEffect(()=>{
        navigation.setOptions({
            headerShown:true,
            headerTransparent:true,
            headerTitle:''
        });
        
        // trip&&setTripDetails(JSON.parse(trip))
        console.log("GetTranscript")
        GetTranscript()
    },[])


    const GetTranscript = async()=>{
        setLoading(true);

        console.log("about to query")
        console.log(user?.email)
        console.log(videoId)
        const q=query(collection(db,'UserVideoSummaries'),
        and(
            where('userEmail','==',user?.email),
            where('videoId','==',videoId)
        ));

        console.log('about to query the docs')
        const querySnapshot=await getDocs(q);
        querySnapshot.forEach((doc) => { 
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        });

        if(querySnapshot.empty){
            try {
                console.log("attempting to get transcript")
                const transcript = await YoutubeTranscript
                .fetchTranscript(videoId)
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

                // Convert the transcript array to a string format
                const transcriptString = formated.map(item => 
                    `${item.timestamp}: ${item.text}`
                ).join('\n');

                // Function to format seconds to MM:SS
                const formatTime = (seconds) => {
                    const minutes = Math.floor(seconds / 60);
                    const remainingSeconds = Math.floor(seconds % 60);
                    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
                };

                // Calculate video length and third points
                // const videoLength = formatTime(videoLengthInSeconds);
                // const firstThird = formatTime(videoLengthInSeconds / 3);
                // const secondThird = formatTime((videoLengthInSeconds / 3) * 2);


                const FINAL_PROMPT = AI_SUMMARY_PROMPT
                        .replace('{transcriptNote}', transcriptString)
                console.log("AI_SUMMARY_PROMPT")
                console.log(FINAL_PROMPT)
                
                const result = await summaryChatSession.sendMessage(FINAL_PROMPT);
                console.log('response from gemini summary')
                console.log(result.response.text());
                const summary = JSON.parse(result.response.text());

                const docId = (Date.now()).toString();
                const result_ = await setDoc(doc(db, "UserVideoSummaries", docId), {
                    userEmail: user.email,
                    videoId: videoId,
                    videoSummary: summary,// AI Result 
                    docId: docId
                }).then(resp=>{

                }).catch(e=>
                    console.log(e)
                )
                setVideoSummary(summary);
            } catch (error) {
                console.error('Error generating summary:', error);
                // Handle error (e.g., show an error message to the user)
            } finally{
                setLoading(false)
            }
        } else{
            const firstDoc = querySnapshot.docs[0];
            console.log(doc.id, " => ", firstDoc.data());
            setVideoSummary(firstDoc.data().videoSummary);
            setLoading(false);
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
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      };

    const TimestampButton = ({ timestamp, label }) => (
    <TouchableOpacity 
        onPress={() => seekToTimestamp(timestamp)}
        style={styles.timestampButton}
    >
        <Text style={styles.timestampText}>{label || `Play ${timestamp}`}</Text>
    </TouchableOpacity>
    );

    if (loading) {
        return (
          <View style={styles.videoContainer}>
            <YoutubePlayer
                ref={playerRef}
                height={styles.videoPlayer.height}
                width={styles.videoPlayer.width}
                play={false}
                videoId={videoId}
            />
            <ActivityIndicator size="large" color={Colors.PRIMARY} />
            <Text style={styles.loadingText}>Generating Summary...</Text>
          </View>
        );
      }

  return (
    <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.videoContainer}>
            <YoutubePlayer
            ref={playerRef}
            height={styles.videoPlayer.height}
            width={styles.videoPlayer.width}
            play={false}
            videoId={videoId}
            />
        </View>
       <View style={styles.contentContainer}>
        {videoSummary && (
          <>
            <Text style={styles.sectionTitle}>Video Overview</Text>
            <Text style={styles.overviewText}>{videoSummary.overview}</Text>

            <Text style={styles.sectionTitle}>Key Points</Text>
            {videoSummary.keyPoints.map((point, index) => (
              <View key={index} style={styles.pointContainer}>
                <Text style={styles.pointText}>{point.point}</Text>
                <View style={styles.timestampContainer}>
                  {point.timestamps.map((timestamp, tIndex) => (
                    <TimestampButton 
                      key={tIndex} 
                      timestamp={timestamp} 
                    />
                  ))}
                </View>
              </View>
            ))}

            <Text style={styles.sectionTitle}>Fundamental Concepts</Text>
            {videoSummary.fundamentalConcepts.map((concept, index) => (
              <View key={index} style={styles.conceptContainer}>
                <Text style={styles.conceptTitle}>{concept.concept}</Text>
                <Text style={styles.explanationText}>{concept.explanation}</Text>
                <View style={styles.timestampContainer}>
                  {concept.timestamps.map((timestamp, tIndex) => (
                    <TimestampButton 
                      key={tIndex} 
                      timestamp={timestamp} 
                    />
                  ))}
                </View>
                <Text style={styles.importanceText}>Why it's important: {concept.importance}</Text>
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
    scrollContent: {
        flexGrow: 1,
    },
    videoContainer: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH * 9 / 16, // 16:9 aspect ratio
        marginTop: 50, // Pull down the video a bit
      },
    videoPlayer: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH * 9 / 16,
    },
    contentContainer: {
      padding: 15,
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
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        fontFamily: 'outfit-medium',
      },
  });