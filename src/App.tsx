import React, { useState, useEffect, useCallback } from 'react';
import Game from './components/Game';
import Results from './components/Results';
import { getLastClearedLevel, saveLastClearedLevel } from './utils/localStorage';
import { GameStats } from './types';
import './App.css';

type GameStatus = 'idle' | 'running' | 'finished';

const MAX_LEVELS = 10;

function App() {
  const [lastClearedLevel, setLastClearedLevel] = useState<number>(0);
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [timerDuration, setTimerDuration] = useState<number>(60);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [lastGameStats, setLastGameStats] = useState<GameStats | null>(null);

  useEffect(() => {
    const loadedLevel = getLastClearedLevel();
    setLastClearedLevel(loadedLevel);
    setSelectedLevel(Math.min(loadedLevel + 1, MAX_LEVELS));
  }, []);


  const handleStartGame = () => {
    setLastGameStats(null);
    setGameStatus('running');
  };

  const handleGameEnd = useCallback((stats: GameStats) => {
    setGameStatus('finished');
    setLastGameStats(stats);

    if (stats.correctAnswers > 0 && stats.level > lastClearedLevel) {
      setLastClearedLevel(stats.level);
      saveLastClearedLevel(stats.level);
      setSelectedLevel(prev => Math.min(prev + 1, MAX_LEVELS));
    } else {
         setSelectedLevel(stats.level);
    }

  }, [lastClearedLevel]);


  const handleRestart = () => {
    setGameStatus('idle');
  };

  const handleLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
     const newLevel = parseInt(event.target.value, 10);
      if (!isNaN(newLevel) && newLevel > 0 && newLevel <= MAX_LEVELS) {
          setSelectedLevel(newLevel);
      }
  };

   const handleTimerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
       const newTime = parseInt(event.target.value, 10);
       if (!isNaN(newTime) && newTime >= 10 && newTime <= 300) {
          setTimerDuration(newTime);
       } else if (event.target.value === '') {
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
