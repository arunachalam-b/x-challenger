// src/components/TimerDisplay.tsx
import React from 'react';

interface TimerDisplayProps {
  timeLeft: number;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeLeft }) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="timer">
      Time Left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
  );
};

export default TimerDisplay;
