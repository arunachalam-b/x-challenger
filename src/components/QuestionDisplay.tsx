import React from 'react';
import { Question } from '../types';

interface QuestionDisplayProps {
  question: Question | null;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question }) => {
  if (!question) {
    return <div>Loading question...</div>;
  }
  return <div className="question-text">{question.text}</div>;
};

export default QuestionDisplay;
