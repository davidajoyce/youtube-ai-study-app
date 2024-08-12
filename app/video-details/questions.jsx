import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, SafeAreaView, TouchableHighlight } from 'react-native';
import { quizChatSession } from '../../configs/AiModal';
import { Colors } from '../../constants/Colors';
import { AI_QUIZ_PROMPT, AI_QUIZ_PROMPT_V2 } from '../../constants/Options';
import { useVideo } from '../../context/VideoContext';
import { auth, db } from './../../configs/FirebaseConfig'
import { collection, getDocs, orderBy, query, where, and, doc, setDoc  } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';



export default function AIGeneratedQuizScreen({ route }) {
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [score, setScore] = useState(0);
  const [, forceUpdate] = useState();
  const { videoId } = useVideo();
  console.log("questions videoId: ", videoId)
  const user = auth.currentUser;


  useEffect(() => {
    console.log("about to generate quiz")
    generateQuiz();
  }, []);

  const generateQuiz = async (numberOfQuestions = 5) => {
    setLoading(true);
    setQuizData([]);
    setAnsweredQuestions({});
    setScore(0);

    console.log("transcriptExample")

    const q=query(collection(db,'UserVideoTranscript'),
        and(
            where('userEmail','==',user?.email),
            where('videoId','==',videoId)
        ));
    const querySnapshot=await getDocs(q);

    const firstDoc = querySnapshot.docs[0];
    console.log("transcript for questions", firstDoc.data());

    const FINAL_PROMPT = AI_QUIZ_PROMPT_V2
            .replace('{transcriptNote}', firstDoc.data().transcript)
            .replace('{numberOfQuestions}', numberOfQuestions.toString());

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

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color={Colors.PRIMARY} />
//         <Text style={styles.loadingText}>Generating Quiz...</Text>
//       </View>
//     );
//   }

  const getOptionStyle = (questionIndex, option) => {
    const answered = answeredQuestions[questionIndex];
    if (answered) {
      if (answered.selectedAnswer === option) {
        return answered.isCorrect ? styles.correctOption : styles.incorrectOption;
      }
      if (option === quizData[questionIndex].correctAnswer) {
        return styles.correctOption;
      }
    }
    return styles.optionButton;
  };
  
  const getOptionTextStyle = (questionIndex) => {
    const answered = answeredQuestions[questionIndex];
    return answered.isCorrect ? styles.correctOptionText : styles.incorrectOptionText;
  };

  const QuizButton = ({ count, onPress }) => (
    <TouchableOpacity style={styles.generateButton} onPress={onPress}>
      <Ionicons name="refresh" size={18} color={Colors.WHITE} />
      <Text style={styles.generateButtonText}>{count} Q&A</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
     <View style={styles.headerContainer}>
        <Text style={styles.title}>AI-Generated Quiz</Text>
        <View style={styles.buttonContainer}>
          <QuizButton count={5} onPress={() => generateQuiz(5)} />
          <QuizButton count={10} onPress={() => generateQuiz(10)} />
          <QuizButton count={20} onPress={() => generateQuiz(20)} />
        </View>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
          <Text style={styles.loadingText}>Generating Quiz...</Text>
        </View>
      ) : (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
        {quizData.map((questionData, questionIndex) => (
            <View key={questionIndex} style={styles.questionContainer}>
            <Text style={styles.questionText}>{questionData.question}</Text>
            {questionData.options.map((option, optionIndex) => (
                <TouchableHighlight
                key={optionIndex}
                style={getOptionStyle(questionIndex, option)}
                onPress={() => handleAnswerSelect(questionIndex, option)}
                disabled={answeredQuestions[questionIndex]}
                underlayColor='none'
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
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    },
  headerContainer: {
    backgroundColor: Colors.WHITE,
    paddingTop: 10,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: Colors.WHITE,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  generateButtonText: {
    color: Colors.WHITE,
    marginLeft: 5,
    fontFamily: 'outfit-bold',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});