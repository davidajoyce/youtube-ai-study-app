import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, SafeAreaView, TouchableHighlight } from 'react-native';
import { quizChatSession } from '../../configs/AiModal';
import { Colors } from '../../constants/Colors';
import { AI_QUIZ_PROMPT } from '../../constants/Options';
import { useVideo } from '../../context/VideoContext';
import { auth, db } from './../../configs/FirebaseConfig'
import { collection, getDocs, orderBy, query, where, and, doc, setDoc  } from 'firebase/firestore';

const transcriptExample = `React Native is an open source framework for building Android and iOS applications using React and the app platform’s native capabilities. With React Native, you use JavaScript to access your platform’s APIs as well as to describe the appearance and behavior of your UI using React components: bundles of reusable, nestable code. You can learn more about React in the next section. But first, let’s cover how components work in React Native.
Views and mobile development
In Android and iOS development, a view is the basic building block of UI: a small rectangular element on the screen which can be used to display text, images, or respond to user input. Even the smallest visual elements of an app, like a line of text or a button, are kinds of views. Some kinds of views can contain other views. It’s views all the way down!

Diagram of Android and iOS app showing them both built on top of atomic elements called views.
Just a sampling of the many views used in Android and iOS apps.
Native Components
In Android development, you write views in Kotlin or Java; in iOS development, you use Swift or Objective-C. With React Native, you can invoke these views with JavaScript using React components. At runtime, React Native creates the corresponding Android and iOS views for those components. Because React Native components are backed by the same views as Android and iOS, React Native apps look, feel, and perform like any other apps. We call these platform-backed components Native Components.

React Native comes with a set of essential, ready-to-use Native Components you can use to start building your app today. These are React Native's Core Components.

React Native also lets you build your own Native Components for Android and iOS to suit your app’s unique needs. We also have a thriving ecosystem of these community-contributed components. Check out Native Directory to find what the community has been creating.

Core Components
React Native has many Core Components for everything from controls to activity indicators. You can find them all documented in the API section. You will mostly work with the following Core Components:

React Native UI Component	Android View	iOS View	Web Analog	Description
<View>	<ViewGroup>	<UIView>	A non-scrolling <div>	A container that supports layout with flexbox, style, some touch handling, and accessibility controls
<Text>	<TextView>	<UITextView>	<p>	Displays, styles, and nests strings of text and even handles touch events
<Image>	<ImageView>	<UIImageView>	<img>	Displays different types of images
<ScrollView>	<ScrollView>	<UIScrollView>	<div>	A generic scrolling container that can contain multiple components and views
<TextInput>	<EditText>	<UITextField>	<input type="text">	Allows the user to enter text
In the next section, you will start combining these Core Components to learn about how React works. Have a play with them here now!`


export default function AIGeneratedQuizScreen({ route }) {
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [score, setScore] = useState(0);
  const [, forceUpdate] = useState();
  const { videoId } = useVideo();
  console.log("questions videoId: ", videoId)
  const user = auth.currentUser;

//   const { transcript } = route.params;
  const { transcript } = transcriptExample;

  useEffect(() => {
    console.log("about to generate quiz")
    generateQuiz();
  }, []);

  const generateQuiz = async () => {
    setLoading(true);

    console.log("transcriptExample")

    const q=query(collection(db,'UserVideoTranscript'),
        and(
            where('userEmail','==',user?.email),
            where('videoId','==',videoId)
        ));
    const querySnapshot=await getDocs(q);

    const firstDoc = querySnapshot.docs[0];
    console.log("transcript for questions", firstDoc.data());

    const FINAL_PROMPT = AI_QUIZ_PROMPT
            .replace('{transcriptNote}', firstDoc.data().transcript)

    console.log('FINAL_PROMPT')
    console.log(FINAL_PROMPT);

    try {
      const result = await quizChatSession.sendMessage(FINAL_PROMPT);
      console.log('response from gemini')
      console.log(result.response.text());
      const generatedQuizData = JSON.parse(result.response.text());
      console.log("quiz data")
      console.log(generatedQuizData)
      setQuizData(generatedQuizData.questions);
    } catch (error) {
      console.error('Error generating quiz:', error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, selectedAnswer) => {
    if (answeredQuestions[questionIndex]) return; // Prevent changing answer

    const isCorrect = selectedAnswer === quizData[questionIndex].correctAnswer;
    setAnsweredQuestions(prev => ({
      ...prev,
      [questionIndex]: { selectedAnswer, isCorrect }
    }));

    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }

    forceUpdate({});
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
        <Text style={styles.loadingText}>Generating Quiz...</Text>
      </View>
    );
  }

  const getOptionStyle = (questionIndex) => {
    const answered = answeredQuestions[questionIndex];
    console.log("answered")
    console.log(answered)
    if (answered) {
      console.log("new style option")
      return answered.isCorrect ? styles.correctOption : styles.incorrectOption;
    }
    console.log("grey style option")
    return styles.optionButton;
  };
  
  const getOptionTextStyle = (questionIndex) => {
    const answered = answeredQuestions[questionIndex];
    return answered.isCorrect ? styles.correctOptionText : styles.incorrectOptionText;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.titleContainer}>
            <Text style={styles.title}>AI-Generated Quiz</Text>
       </View>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
        {quizData.map((questionData, questionIndex) => (
            <View key={questionIndex} style={styles.questionContainer}>
            <Text style={styles.questionText}>{questionData.question}</Text>
            {questionData.options.map((option, optionIndex) => (
                <TouchableHighlight
                key={optionIndex}
                style={getOptionStyle(questionIndex)}
                onPress={() => {
                    handleAnswerSelect(questionIndex, option);
                }}
                disabled={answeredQuestions[questionIndex]}
                underlayColor
                activeOpacity={0.7}
                >
                <Text style={styles.optionText}>{option}</Text>
                </TouchableHighlight>
            ))}
            {answeredQuestions[questionIndex] && (
                <Text style={getOptionTextStyle(questionIndex)}>
                {answeredQuestions[questionIndex].isCorrect 
                    ? "Correct!" 
                    : `Incorrect. The correct answer is: ${questionData.correctAnswer}`}
                </Text>
            )}
            </View>
        ))}
        <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>
            Your Score: {score} out of {quizData.length}
            </Text>
        </View>
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.WHITE,
    marginTop:20
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'outfit-medium',
  },
  titleContainer: {
    paddingTop: 10,
    backgroundColor: Colors.WHITE,
  },
  title: {
    paddingTop: 30,
    fontSize: 24,
    fontFamily: 'outfit-bold',
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20
  },
  scrollContentContainer: {
    paddingBottom: 20, // Add padding at the bottom of the scroll content
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontFamily: 'outfit-medium',
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  correctOption: {
    backgroundColor: '#aaf0aa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  incorrectOption: {
    backgroundColor: '#f0aaaa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'outfit',
  },
  correctOptionText: {
    color: '#006400', // Dark green color for text
    fontFamily: 'outfit-bold'
  },
  incorrectOptionText: {
    color: '#8b0000', // Dark red color for text
    fontFamily: 'outfit-bold',
    fontSize:18
  },
  feedbackText: {
    fontSize: 18,
    fontFamily: 'outfit-regular',
    marginTop: 10,
    fontStyle: 'italic',
  },
  scoreContainer: {
    marginTop: 10,
    marginBottom:10,
    padding: 10,
    paddingBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  scoreText: {
    fontSize: 18,
    fontFamily: 'outfit-bold',
    textAlign: 'center',
  },
});