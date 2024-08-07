import { View, Text } from 'react-native'
import React, { useCallback, useState } from 'react'
import YoutubePlayer from "react-native-youtube-iframe";
import { Button } from 'react-native-web';

export default function Discover() {
  return (
    <View>
      <YoutubePlayer
        height={300}
        play={true}
        videoId={"iee2TATGMyI"}
      />
    </View>
  );
}