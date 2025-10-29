import React, { useState, useEffect } from 'react';
import { Game } from './components/Game';
import { StartScreen } from './screens/StartScreen';
import { LevelSelectScreen } from './screens/LevelSelectScreen';
import { LEVELS } from './constants';
import type { GameScreen } from './types';

const PROGRESS_KEY = 'bolinhaRolanteProgress';

const App: React.FC = () => {
  const [screen, setScreen] = useState<GameScreen>('start_screen');
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>(() => {
    try {
      const savedProgress = window.localStorage.getItem(PROGRESS_KEY);
      if (savedProgress) {
        const levels = JSON.parse(savedProgress);
        if (Array.isArray(levels) && levels.every(l => typeof l === 'number')) {
          return levels;
        }
      }
    } catch (error) {
      console.error("Failed to load progress:", error);
    }
    return [1]; // Start with level 1 unlocked
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(unlockedLevels));
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  }, [unlockedLevels]);

  const handleNewGame = () => {
    if (window.confirm("Tem certeza que deseja apagar seu progresso e começar um novo jogo?")) {
      setUnlockedLevels([1]);
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

  const handleLevelWin = () => {
    const nextLevelId = currentLevelId + 1;
    if (nextLevelId <= LEVELS.length && !unlockedLevels.includes(nextLevelId)) {
      setUnlockedLevels(prev => [...prev, nextLevelId].sort((a,b) => a-b));
    }
    setScreen('level_select');
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
            unlockedLevels={unlockedLevels}
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
              onWin={handleLevelWin}
              onQuit={handleQuitGame}
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
