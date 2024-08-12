import React, { useRef, useEffect, useImperativeHandle, forwardRef, useState } from 'react';
import { Platform, View, Dimensions } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

const WebYouTubePlayer = forwardRef(({ videoId, height, width, onReady, ...props }, ref) => {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const [playerDimensions, setPlayerDimensions] = useState({ width: '100%', height: '315px' });
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadYouTubeScript = () => {
      return new Promise((resolve) => {
        if (window.YT) {
          resolve(window.YT);
          return;
        }
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        window.onYouTubeIframeAPIReady = () => resolve(window.YT);
      });
    };

    const initializePlayer = async () => {
      await loadYouTubeScript();
      if (!isMounted) return;

      if (playerRef.current) {
        playerRef.current.destroy();
      }

      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: videoId,
        events: {
          'onReady': (event) => {
            if (isMounted) {
              setPlayerReady(true);
              if (onReady) onReady(event);
              updatePlayerSize();
            }
          },
        },
      });
    };

    const updatePlayerSize = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        const height = width * 9 / 16; // 16:9 aspect ratio
        setPlayerDimensions({ width: `${width}px`, height: `${height}px` });
      }
    };

    initializePlayer();
    window.addEventListener('resize', updatePlayerSize);

    return () => {
      isMounted = false;
      window.removeEventListener('resize', updatePlayerSize);
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, onReady]);

  useImperativeHandle(ref, () => ({
    seekTo: (seconds, allowSeekAhead) => {
      if (playerRef.current && playerRef.current.seekTo) {
        playerRef.current.seekTo(seconds, allowSeekAhead);
      }
    },
  }));

  return (
    <div ref={containerRef} style={{ width: '100%', maxWidth: '100%' }}>
      <div id="youtube-player" style={{ width: playerDimensions.width, height: playerDimensions.height }}></div>
    </div>
  );
});

const CustomYouTubePlayer = forwardRef((props, ref) => {
  const Comp = Platform.select({
    web: WebYouTubePlayer,
    default: YoutubePlayer,
  });

  return <Comp {...props} ref={ref} />;
});

export default CustomYouTubePlayer;