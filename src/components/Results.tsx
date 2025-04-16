import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { GameStats } from '../types';

interface ResultsProps {
  stats: GameStats;
  onRestart: () => void;
}

const Results: React.FC<ResultsProps> = ({ stats, onRestart }) => {
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleExport = () => {
    if (resultsRef.current) {
      html2canvas(resultsRef.current, {
            useCORS: true,
            logging: false,
            // scale: 2 // Increase resolution slightly
        })
        .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            const date = new Date();
            const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            link.download = `math-tricks-progress-${dateString}.png`;
            link.href = imgData;
            document.body.appendChild(link); // Required for Firefox
            link.click();
            document.body.removeChild(link);
        })
        .catch(err => {
            console.error("Failed to export image:", err);
            alert("Sorry, couldn't export the image.");
        });
    }
  };

  return (
    <div className="results-container">
      <div ref={resultsRef} className="results-content">
        <h2>Game Over!</h2>
        <p>Level Played: {stats.level}</p>
        <p>Time: {stats.timeTaken} seconds</p>
        <p>Total Questions Attempted: {stats.totalQuestions}</p>
        <p>Correct Answers: {stats.correctAnswers}</p>
        <p>Final Score: {stats.score}</p>
        <p>Incorrect Tries: {stats.incorrectAttempts}</p>
         <p style={{ fontSize: '0.8em', color: '#888', marginTop: '15px' }}>
            Captured on: {new Date().toLocaleString()}
         </p>
      </div>
       <div className="results-actions">
          <button onClick={onRestart}>Play Again (Next Level)</button>
          <button onClick={handleExport}>Save Progress as Image</button>
       </div>
    </div>
  );
};

export default Results;
