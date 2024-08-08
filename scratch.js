import React, { useState, useEffect } from 'react';

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

const TranscriptFormatter = ({ transcriptData }) => {
  const [formattedTranscript, setFormattedTranscript] = useState([]);
  const [llmInput, setLlmInput] = useState('');

  useEffect(() => {
    const formatted = formatTranscriptForLLM(transcriptData);
    setFormattedTranscript(formatted);
    setLlmInput(formatted.map(segment => `[${segment.timestamp}] ${segment.text}`).join('\n'));
  }, [transcriptData]);
