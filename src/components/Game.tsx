import React, { useState, useEffect, useCallback } from 'react';
import { Question, GameStats } from '../types';
import { generateQuestion } from '../utils/questionGenerator';
import TimerDisplay from './TimerDisplay';
import QuestionDisplay from './QuestionDisplay';
import AnswerInput from './AnswerInput';

interface GameProps {
  level: number;
  initialTime: number;
  onGameEnd: (stats: GameStats) => void;
}

const Game: React.FC<GameProps> = ({ level, initialTime, onGameEnd }) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);
  const [isIncorrect, setIsIncorrect] = useState<boolean>(false);
  const [totalAnswered, setTotalAnswered] = useState<number>(0);
  const [totalAttempts, setTotalAttempts] = useState<number>(0);
  const [incorrectAttempts, setIncorrectAttempts] = useState<number>(0);

  const nextQuestion = useCallback(() => {
    setCurrentQuestion(generateQuestion(level));
    setIsIncorrect(false);
  }, [level]);

  useEffect(() => {
    nextQuestion();
  }, [nextQuestion]);

  useEffect(() => {
    if (timeLeft <= 0) {
        onGameEnd({
            score: score,
            correctAnswers: totalAnswered,
            totalQuestions: totalAttempts,
            incorrectAttempts: incorrectAttempts,
            level: level,
            timeTaken: initialTime
        });
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);

  }, [timeLeft, onGameEnd, score, totalAnswered, totalAttempts, incorrectAttempts, level, initialTime]); // Dependencies for timer effect

  const handleAnswerSubmit = (userAnswer: string) => {
    if (!currentQuestion) return;

     setTotalAttempts(prev => prev + 1);

    const userAnswerNum = parseFloat(userAnswer);

     const tolerance = 0.01;
     const isAnswerCorrect = Math.abs(currentQuestion.answer - userAnswerNum) < tolerance;


    if (!isNaN(userAnswerNum) && isAnswerCorrect) {
      setScore((prevScore) => prevScore + 10 * level);
      setTotalAnswered(prev => prev + 1);
      setIsIncorrect(false);
      nextQuestion();
    } else {
      setIsIncorrect(true);
      setIncorrectAttempts(prev => prev + 1);
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
         currentQuestion={currentQuestion}
         isDisabled={timeLeft <= 0}
        />
       {isIncorrect && <p className="feedback-incorrect">Try again!</p>}
    </div>
  );
};

export default Game;
