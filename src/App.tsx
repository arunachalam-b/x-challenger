// src/App.tsx
import React, { useState, useEffect, useCallback } from 'react';
import Game from './components/Game';
import Results from './components/Results';
import { getLastClearedLevel, saveLastClearedLevel } from './utils/localStorage';
import { GameStats } from './types';
import './App.css'; // Import basic styles

type GameStatus = 'idle' | 'running' | 'finished';

const MAX_LEVELS = 10; // Define how many levels you want

function App() {
  const [lastClearedLevel, setLastClearedLevel] = useState<number>(0);
  const [selectedLevel, setSelectedLevel] = useState<number>(1); // Start at level 1 by default
  const [timerDuration, setTimerDuration] = useState<number>(60); // Default 60 seconds
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [lastGameStats, setLastGameStats] = useState<GameStats | null>(null);


  // Load last cleared level and set starting level on mount
  useEffect(() => {
    const loadedLevel = getLastClearedLevel();
    setLastClearedLevel(loadedLevel);
    // Start user at the level *after* the last one they cleared
    setSelectedLevel(Math.min(loadedLevel + 1, MAX_LEVELS)); // Ensure not exceeding max level
  }, []);


  const handleStartGame = () => {
    setLastGameStats(null); // Clear previous stats
    setGameStatus('running');
  };

  // Callback from Game component when time runs out
  const handleGameEnd = useCallback((stats: GameStats) => {
    setGameStatus('finished');
    setLastGameStats(stats);

    // Save progress if the user actually played and got something right on this level
    // Adjust this condition as needed (e.g., minimum score threshold?)
    if (stats.correctAnswers > 0 && stats.level > lastClearedLevel) {
      setLastClearedLevel(stats.level);
      saveLastClearedLevel(stats.level);
      // Automatically set next level for "Play Again"
      setSelectedLevel(prev => Math.min(prev + 1, MAX_LEVELS));
    } else {
         // If they failed or repeated a level, keep the selection for the next attempt
         setSelectedLevel(stats.level);
    }

  }, [lastClearedLevel]); // Dependency: lastClearedLevel to correctly save


  const handleRestart = () => {
    setGameStatus('idle');
     // selectedLevel is already updated in handleGameEnd or kept the same
  };

  const handleLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
     const newLevel = parseInt(event.target.value, 10);
      if (!isNaN(newLevel) && newLevel > 0 && newLevel <= MAX_LEVELS) {
          setSelectedLevel(newLevel);
      }
  };

   const handleTimerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
       const newTime = parseInt(event.target.value, 10);
       if (!isNaN(newTime) && newTime >= 10 && newTime <= 300) { // Set reasonable bounds (e.g., 10s to 5min)
          setTimerDuration(newTime);
       } else if (event.target.value === '') {
            // Allow clearing the input, maybe default back or handle validation on start
            // setTimerDuration(60); // Or keep the last valid value
       }
   }

  return (
    <div className="App">
      <h1>Math Practice Fun!</h1>

      {gameStatus === 'idle' && (
        <div className="config-area">
           <h2>Settings</h2>
           <div className="setting">
              <label htmlFor="level-select">Select Level:</label>
              <select id="level-select" value={selectedLevel} onChange={handleLevelChange}>
                 {/* Generate level options up to MAX_LEVELS */}
                 {Array.from({ length: MAX_LEVELS }, (_, i) => i + 1).map(level => (
                    <option key={level} value={level} disabled={level > lastClearedLevel + 1}>
                       Level {level} {level <= lastClearedLevel + 1 ? '' : '(Locked)'}
                     </option>
                 ))}
              </select>
              <p style={{fontSize: '0.9em', color: '#555'}}>Last cleared: Level {lastClearedLevel}</p>
           </div>
            <div className="setting">
               <label htmlFor="timer-input">Set Timer (seconds):</label>
               <input
                 id="timer-input"
                 type="number"
                 value={timerDuration}
                 onChange={handleTimerChange}
                 min="10"
                 max="300"
                 step="5"
               />
            </div>
          <button onClick={handleStartGame} className="start-button" disabled={selectedLevel > lastClearedLevel + 1}>
              Start Level {selectedLevel}
           </button>
        </div>
      )}

      {gameStatus === 'running' && (
        <Game
          level={selectedLevel}
          initialTime={timerDuration}
          onGameEnd={handleGameEnd}
        />
      )}

      {gameStatus === 'finished' && lastGameStats && (
        <Results stats={lastGameStats} onRestart={handleRestart} />
      )}
    </div>
  );
}

export default App;
