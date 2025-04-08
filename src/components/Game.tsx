// src/components/Game.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Question, GameStats } from '../types';
import { generateQuestion } from '../utils/questionGenerator';
import TimerDisplay from './TimerDisplay';
import QuestionDisplay from './QuestionDisplay';
import AnswerInput from './AnswerInput';

interface GameProps {
  level: number;
  initialTime: number; // in seconds
  onGameEnd: (stats: GameStats) => void;
}

const Game: React.FC<GameProps> = ({ level, initialTime, onGameEnd }) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);
  const [isIncorrect, setIsIncorrect] = useState<boolean>(false);
  const [totalAnswered, setTotalAnswered] = useState<number>(0); // Correctly answered count
  const [totalAttempts, setTotalAttempts] = useState<number>(0); // All attempts (enter presses)
  const [incorrectAttempts, setIncorrectAttempts] = useState<number>(0); // Count of wrong answers

  // Generate new question
  const nextQuestion = useCallback(() => {
    setCurrentQuestion(generateQuestion(level));
    setIsIncorrect(false); // Reset incorrect status for the new question
  }, [level]);

  // Initial question load
  useEffect(() => {
    nextQuestion();
  }, [nextQuestion]); // Run only when nextQuestion function reference changes (i.e., level changes)

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) {
       // Game Over - Callback to App
        onGameEnd({
            score: score,
            correctAnswers: totalAnswered,
            totalQuestions: totalAttempts, // How many questions the user *tried* to answer
            incorrectAttempts: incorrectAttempts,
            level: level,
            timeTaken: initialTime
        });
      return; // Stop the timer interval
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    // Cleanup function to clear interval when component unmounts or time runs out
    return () => clearInterval(timerId);

  }, [timeLeft, onGameEnd, score, totalAnswered, totalAttempts, incorrectAttempts, level, initialTime]); // Dependencies for timer effect


  // Handle answer submission
  const handleAnswerSubmit = (userAnswer: string) => {
    if (!currentQuestion) return; // Should not happen if game is running

     setTotalAttempts(prev => prev + 1); // Count every submission attempt

    // Parse user answer - handle potential floats for %
    const userAnswerNum = parseFloat(userAnswer);

     // Check for floating point comparison issues (e.g., 0.1 + 0.2 !== 0.3)
     const tolerance = 0.01; // Adjust tolerance if needed for percentages etc.
     const isAnswerCorrect = Math.abs(currentQuestion.answer - userAnswerNum) < tolerance;


    if (!isNaN(userAnswerNum) && isAnswerCorrect) {
      setScore((prevScore) => prevScore + 10 * level); // Score based on level
      setTotalAnswered(prev => prev + 1);
      setIsIncorrect(false);
      nextQuestion(); // Move to next question only if correct
    } else {
      setIsIncorrect(true);
      setIncorrectAttempts(prev => prev + 1); // Increment wrong tries
      // Do not generate next question, user must retry
    }
  };

  return (
    <div className="game-area">
      <div className="game-header">
          <span>Level: {level}</span>
          <TimerDisplay timeLeft={timeLeft} />
          <span>Score: {score}</span>
      </div>
      <QuestionDisplay question={currentQuestion} />
      <AnswerInput
         onSubmit={handleAnswerSubmit}
         isIncorrect={isIncorrect}
         isDisabled={timeLeft <= 0} // Disable when time is up
        />
       {isIncorrect && <p className="feedback-incorrect">Try again!</p>}
    </div>
  );
};

export default Game;
