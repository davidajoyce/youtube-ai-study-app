import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import {Colors} from './../../constants/Colors'
import { Ionicons } from '@expo/vector-icons';
import StartNewTripCard from '../../components/MyTrips/StartNewTripCard';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import {auth, db} from './../../configs/FirebaseConfig'
import UserTripList from '../../components/MyTrips/UserTripList';
import { useRouter } from 'expo-router';
import YoutubeVideoPreview from '../../components/YoutubeVideos/YoutubeVideoPreview';
export default function MyTrip() {

  const [userTrips,setUserTrips]=useState([]);
  const user=auth.currentUser;
  const [loading,setLoading]=useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videos, setVideos] = useState([]);

  const router=useRouter();
  useEffect(()=>{
    user&&GetMyTrips();
  },[user])

  const GetMyTrips=async()=>{ 
    setLoading(true); 
    setUserTrips([]);
    const q=query(collection(db,'UserTrips'),
    where('userEmail','==',user?.email));
    const querySnapshot=await getDocs(q);
    querySnapshot.forEach((doc) => { 
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      setUserTrips(prev=>[...prev,doc.data()])
    });
    setLoading(false);
  }

  const handleYoutubeUrlSubmit = async () => {
    if (youtubeUrl.trim() === '') return;
    console.log("youtubeUrl")
    console.log(youtubeUrl)
    if (youtubeUrl.includes('youtu.be')) {
      const urlParts = youtubeUrl.split('/');
      const idPart = urlParts[urlParts.length - 1];
      const videoId = idPart.split('?')[0]
      console.log(videoId)
      setVideos([{"id":videoId}])
    }
    setYoutubeUrl('');
  };

  const renderHeader = () => (
    <>
      <View style={{ marginBottom: 20, marginTop: 55 }}>
        <Text style={{ fontFamily: 'outfit-bold', fontSize: 18, marginBottom: 10 }}>Add YouTube Video</Text>
        <View style={{ flexDirection: 'row' }}>
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: Colors.PRIMARY,
              borderRadius: 5,
              padding: 10,
              marginRight: 10
            }}
            value={youtubeUrl}
            onChangeText={setYoutubeUrl}
            placeholder="Paste YouTube URL here"
          />
          <TouchableOpacity
            style={{
              backgroundColor: Colors.WHITE,
              justifyContent: 'center'
            }}
            onPress={handleYoutubeUrlSubmit}
          >
            <Ionicons name="add-circle" size={50} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={{
        fontFamily: 'outfit-bold',
        fontSize: 35,
        marginBottom: 20
      }}>My Videos</Text>
    </>
  );

  const renderItem = ({ item, index }) => {
    if (index < videos.length) {
      return <YoutubeVideoPreview videoId={item.id} />;
    } else {
      return <UserTripList userTrips={[item]} />;
    }
  };

  const renderFooter = () => (
    <View style={{ height: 100 }} />
  );

  const allItems = [...videos, ...userTrips];

  return (
    <FlatList
      ListHeaderComponent={renderHeader}
      data={allItems}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={loading ? null : <StartNewTripCard />}
      contentContainerStyle={{
        padding: 25,
        backgroundColor: Colors.WHITE,
      }}
    />
  );
}