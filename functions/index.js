const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const { YoutubeTranscript } = require('youtube-transcript');
const port = 3000

const app = express();

// Enable CORS for all routes
app.use(cors({ origin: true }));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

app.get('/youtube-transcript', async (req, res) => {
  try {
    const videoId = req.query.v;
    if (!videoId) {
      return res.status(400).send('Missing video ID');
    }

    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    res.json(transcript);
  } catch (error) {
    console.error('Error fetching YouTube transcript:', error);
    res.status(500).send('Error fetching YouTube transcript');
  }
});

exports.api = functions.https.onRequest(app);