import React, { useState, useEffect } from 'react';
import { Game } from './components/Game';
import { StartScreen } from './screens/StartScreen';
import { LevelSelectScreen } from './screens/LevelSelectScreen';
import { LEVELS } from './levels';
import type { GameScreen, Progress } from './types';

const PROGRESS_KEY = 'bolinhaRolanteProgress';

const App: React.FC = () => {
  const [screen, setScreen] = useState<GameScreen>('start_screen');
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [progress, setProgress] = useState<Progress>(() => {
    try {
      const savedProgress = window.localStorage.getItem(PROGRESS_KEY);
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        // Migration from old format (array of numbers) to new format (object)
        if (Array.isArray(parsed)) {
          const newProgress: Progress = {};
          parsed.forEach(levelId => {
            newProgress[levelId] = null; // Mark as unlocked, no time yet
          });
          return newProgress;
        }
        if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Failed to load progress:", error);
    }
    return { 1: null }; // Start with level 1 unlocked
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  }, [progress]);

  const handleNewGame = () => {
    if (window.confirm("Tem certeza que deseja apagar todo o seu progresso e começar um novo jogo?")) {
      setProgress({ 1: null });
      setCurrentLevelId(1);
      setScreen('playing');
    }
  };

  const handleSelectLevelClick = () => {
    setScreen('level_select');
  };
  
  const handleLevelSelect = (levelId: number) => {
    setCurrentLevelId(levelId);
    setScreen('playing');
  };

  const handleBackToMenu = () => {
    setScreen('start_screen');
  };

  const handleQuitGame = () => {
    setScreen('level_select');
  };

  const handleLevelComplete = (time: number) => {
    setProgress(prev => {
        const newProgress = { ...prev };
        
        // Update current level's best time
        const existingTime = newProgress[currentLevelId];
        if (existingTime === null || time < existingTime) {
            newProgress[currentLevelId] = time;
        }

        // Unlock next level
        const nextLevelId = currentLevelId + 1;
        if (nextLevelId <= LEVELS.length && !(nextLevelId in newProgress)) {
            newProgress[nextLevelId] = null;
        }

        return newProgress;
    });
  };
  
  const handleContinue = () => {
    const nextLevelId = currentLevelId + 1;
    if (nextLevelId <= LEVELS.length) {
      setCurrentLevelId(nextLevelId);
    } else {
      alert("Parabéns! Você completou todos os níveis!");
      setScreen('level_select');
    }
  };

  const renderScreen = () => {
    switch (screen) {
      case 'start_screen':
        return (
          <StartScreen 
            onNewGame={handleNewGame} 
            onSelectLevel={handleSelectLevelClick} 
          />
        );
      case 'level_select':
        return (
          <LevelSelectScreen 
            levels={LEVELS}
            progress={progress}
            onSelectLevel={handleLevelSelect}
            onBack={handleBackToMenu}
          />
        );
      case 'playing':
        const currentLevel = LEVELS.find(l => l.id === currentLevelId);
        if (currentLevel) {
          return (
            <Game 
              key={currentLevel.id}
              level={currentLevel} 
              onWin={handleLevelComplete}
              onContinue={handleContinue}
              onQuit={handleQuitGame}
              bestTime={progress[currentLevelId] ?? null}
            />
          );
        }
        // Fallback if level is not found
        setScreen('level_select');
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white font-mono p-4">
      <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2">Bolinha Rolante</h1>
      {renderScreen()}
    </div>
  );
};

export default App;
