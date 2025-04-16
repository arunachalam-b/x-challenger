import React, { useState, useRef, useEffect } from 'react';
import { Question } from '../types';

interface AnswerInputProps {
  onSubmit: (answer: string) => void;
  isIncorrect: boolean;
  isDisabled: boolean;
  currentQuestion?: Question | null;
}

const AnswerInput: React.FC<AnswerInputProps> = ({ onSubmit, isIncorrect, isDisabled, currentQuestion }) => {
  const [answer, setAnswer] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && answer.trim() !== '') {
      onSubmit(answer.trim());
    }
  };

    useEffect(() => {
        if (isIncorrect) {
           inputRef.current?.focus();
        } else {
            setAnswer('');
        }
    }, [isIncorrect]);

    useEffect(() => {
      if (currentQuestion && currentQuestion.id) {
          setAnswer('');
      }
    }, [currentQuestion])

     useEffect(() => {
        if (!isDisabled) {
            inputRef.current?.focus();
        }
     }, [isDisabled]);


  return (
    <input
      ref={inputRef}
      type="text"
      value={answer}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder="Your answer..."
      disabled={isDisabled}
      className={`answer-input ${isIncorrect ? 'incorrect' : ''}`}
      autoFocus
    />
  );
};

export default AnswerInput;
