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

export const AI_SUMMARY_PROMPT='Include the following in your response:\nA brief overview of the main topic(s) covered in the video.\n3-5 fundamental concepts discussed, each with:\nA clear explanation of the concept\nThe timestamp (in MM:SS format) where the concept is introduced or best explained\nWhy this concept is important or how it relates to the broader topic\n3-5 key points or important learnings from the video, each with:\nA concise description of the point\nThe timestamp (in MM:SS format) where this point is made\n2-3 recurring themes or ideas that are emphasized throughout the video, each with:\nA brief description of the theme\n2-3 timestamps (in MM:SS format) where this theme is mentioned or reinforced\nTranscript:\n{transcriptNote}\nPlease format your response as a JSON object with the following structure:\n{\n\"overview\": \"Brief overview of the main topics covered in the video\",\n\"fundamentalConcepts\": [\n{\n\"concept\": \"Name or brief description of the concept\",\n\"explanation\": \"Detailed explanation of the concept\",\n\"timestamp\": \"MM:SS\",\n\"importance\": \"Why this concept is important or how it relates to the topic\"\n},\n...\n],\n\"keyPoints\": [\n{\n\"point\": \"Description of the key point or learning\",\n\"timestamp\": \"MM:SS\"\n},\n...\n],\n\"recurringThemes\": [\n{\n\"theme\": \"Description of the recurring theme or idea\",\n\"timestamps\": [\"MM:SS\", \"MM:SS\", \"MM:SS\"]\n},\n...\n]\n}'