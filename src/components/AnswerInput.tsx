// src/components/AnswerInput.tsx
import React, { useState, useRef, useEffect } from 'react';

interface AnswerInputProps {
  onSubmit: (answer: string) => void;
  isIncorrect: boolean; // To provide feedback (e.g., clear input or style)
  isDisabled: boolean; // Disable input when game not running
}

const AnswerInput: React.FC<AnswerInputProps> = ({ onSubmit, isIncorrect, isDisabled }) => {
  const [answer, setAnswer] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && answer.trim() !== '') {
      onSubmit(answer.trim());
       // Don't clear automatically here, Game component decides based on correctness
    }
  };

   // Clear input if the parent component signals it was incorrect
    useEffect(() => {
        if (isIncorrect) {
           // Optionally add a visual cue like shaking or temporary border color change
           // For now, we just keep the focus and the incorrect value stays
           inputRef.current?.focus(); // Keep focus for retry
        } else {
            setAnswer(''); // Clear only on correct answer submission (handled by parent setting isIncorrect to false)
        }
    }, [isIncorrect]); // Rerun when isIncorrect status changes from parent

    // Focus the input when it becomes enabled (game starts)
     useEffect(() => {
        if (!isDisabled) {
            inputRef.current?.focus();
        }
     }, [isDisabled]);


  return (
    <input
      ref={inputRef}
      type="text" // Use text to allow potential decimals, handle parsing in Game component
      value={answer}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder="Your answer..."
      disabled={isDisabled}
      className={`answer-input ${isIncorrect ? 'incorrect' : ''}`} // Add class for potential styling
      autoFocus // Focus on initial render/start
    />
  );
};

export default AnswerInput;
