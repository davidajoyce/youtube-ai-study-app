export const SelectTravelesList=[
    {
        id:1,
        title:'Just Me',
        desc:'A sole traveles in exploration',
        icon:'✈️',
        people:'1'
    },
    {
        id:2,
        title:'A Couple',
        desc:'Two traveles in tandem',
        icon:'🥂',
        people:'2 People'
    },
    {
        id:3,
        title:'Family',
        desc:'A group of fun loving adv',
        icon:'🏡',
        people:'3 to 5 People'
    },
    {
        id:4,
        title:'Friends',
        desc:'A bunch of thrill-seekes',
        icon:'⛵',
        people:'5 to 10 People'
    },
]


export const SelectBudgetOptions=[
    {
        id:1,
        title:'Cheap',
        desc:'Stay conscious of costs',
        icon:'💵',
    },
    {
        id:2,
        title:'Moderate',
        desc:'Keep cost on the average side',
        icon:'💰',
    },
    {
        id:3,
        title:'Luxury',
        desc:'Dont worry about cost',
        icon:'💸',
    },
]


export const AI_PROMPT='Generate Travel Plan for Location : {location}, for {totalDays} Days and {totalNight} Night for {traveler} with a {budget} budget with a Flight details , Flight Price with Booking url, Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and  suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, Time t travel each of the location for {totalDays} days and {totalNight} night with each day plan with best time to visit in JSON format.'

export const AI_QUIZ_PROMPT='I want you to generate quiz questions based on the transcript: {transcriptNote}. Each quiz should have 5 multiple-choice questions with 4 options each. Please format the response in JSON format.'

export const AI_QUIZ_PROMPT_V2=`
Generate a quiz based on the following transcript:
{transcriptNote}

Create {numberOfQuestions} multiple-choice questions with 4 options each. Format the response in the following JSON structure:
{
"questions": [
{
"question": "Question text here",
"options": [
"Option 1",
"Option 2",
"Option 3",
"Option 4"
],
"correctAnswer": "Correct option here"
},
// Repeat for a total of {numberOfQuestions}  questions
]
}
Ensure that:
Each question is relevant to the transcript content.
The correct answer is included among the 4 options.
All options are plausible and related to the question.
No option has inner quotation marks and each string is valid.
The JSON structure is valid and complete.
`

export const AI_SUMMARY_PROMPT=`
Please analyze the following video transcript and create a comprehensive educational summary. This video is approximately {videoLength} long, so ensure your analysis covers the entire duration, not just the beginning.

Focus on helping someone learn from this video by identifying fundamental concepts, key points, and recurring themes, ensuring that examples are drawn from throughout the video's duration.

Include the following in your response:

1. A brief overview of the main topic(s) covered in the video.

2. 4-6 fundamental concepts discussed, each with:
   - A clear explanation of the concept
   - 3 timestamps (in MM:SS format) where the concept is introduced, explained, or applied
   - IMPORTANT: For each concept, provide timestamps from the early, middle, and late portions of the video
   - Why this concept is important or how it relates to the broader topic

3. 4-6 key points or important learnings from the video, each with:
   - A concise description of the point
   - 3 timestamps (in MM:SS format) where this point is made or reinforced
   - IMPORTANT: Ensure these timestamps are spread across the early, middle, and late portions of the video
   - Mention which fundamental concept(s) this key point explores or relates to. If a key point introduces a new concept not covered in the fundamental concepts section, briefly explain it.

4. 3-4 recurring themes or ideas that are emphasized throughout the video, each with:
   - A brief description of the theme
   - 3 timestamps (in MM:SS format) where this theme is mentioned or reinforced
   - IMPORTANT: Include timestamps from the early, middle, and late portions of the video
   - Explain how this theme relates to the fundamental concepts and key points

Transcript:
{transcriptNote}

Please format your response as a JSON object with the following structure:
{
  "overview": "Brief overview of the main topics covered in the video",
  "fundamentalConcepts": [
    {
      "concept": "Name or brief description of the concept",
      "explanation": "Detailed explanation of the concept",
      "timestamps": ["MM:SS (early)", "MM:SS (middle)", "MM:SS (late)"],
      "importance": "Why this concept is important or how it relates to the topic"
    },
    ...
  ],
  "keyPoints": [
    {
      "point": "Description of the key point or learning",
      "timestamps": ["MM:SS (early)", "MM:SS (middle)", "MM:SS (late)"],
      "relatedConcepts": ["List of related fundamental concepts or new concepts introduced"]
    },
    ...
  ],
  "recurringThemes": [
    {
      "theme": "Description of the recurring theme or idea",
      "timestamps": ["MM:SS (early)", "MM:SS (middle)", "MM:SS (late)"],
      "relatedConcepts": "Explanation of how this theme relates to fundamental concepts and key points"
    },
    ...
  ]
}

Remember to ensure that all timestamps (for fundamental concepts, key points, and recurring themes) are spread out across the beginning, middle, and end portions of the video. This will provide a comprehensive view of how these elements develop and are reinforced throughout the entire content. Also, make sure to clearly link key points with their related fundamental concepts to show the interconnectedness of the video's content.
`;