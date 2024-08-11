import { useRouter } from 'expo-router';
import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function YoutubeVideoPreview ({ videoId }) {

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
  const router = useRouter();

  const handlePress = () => {
    console.log("videoId is: ", videoId)
    router.push({pathname:'/trip-details',params:{
        videoIdFrom:JSON.stringify(videoId)
    }})
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <Image source={{ uri: thumbnailUrl }} style={styles.thumbnail} />
      <View style={styles.playButton}>
        <Text style={styles.playButtonText}>▶</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  playButtonText: {
    color: 'white',
    fontSize: 24,
  },
  title: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
