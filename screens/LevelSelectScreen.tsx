import React from 'react';
import type { Level } from '../types';

interface LevelSelectScreenProps {
  levels: Level[];
  unlockedLevels: number[];
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
}

const LockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3A5.25 5.25 0 0 0 12 1.5Zm-3.75 5.25a3.75 3.75 0 1 0 7.5 0v3h-7.5v-3Z" clipRule="evenodd" />
    </svg>
);


export const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({ levels, unlockedLevels, onSelectLevel, onBack }) => {
  return (
    <div className="w-full max-w-3xl flex flex-col items-center">
      <p className="text-lg text-gray-300 mb-6">Escolha uma fase para começar</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-8">
        {levels.map(level => {
          const isUnlocked = unlockedLevels.includes(level.id);
          return (
            <button
              key={level.id}
              onClick={() => isUnlocked && onSelectLevel(level.id)}
              disabled={!isUnlocked}
              className={`w-24 h-24 flex flex-col items-center justify-center font-bold rounded-lg border-4 transition-all duration-200 transform 
                ${isUnlocked 
                  ? 'bg-cyan-600 border-cyan-400 text-white shadow-lg hover:scale-105 hover:bg-cyan-500 cursor-pointer' 
                  : 'bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed'
                }`
              }
              aria-label={isUnlocked ? `Jogar fase ${level.id}` : `Fase ${level.id} bloqueada`}
            >
              {isUnlocked ? (
                <>
                  <span className="text-4xl">{level.id}</span>
                  <span className="text-xs">{level.name}</span>
                </>
              ) : (
                <LockIcon className="w-12 h-12" />
              )}
            </button>
          );
        })}
      </div>
      <button
        onClick={onBack}
        className="px-8 py-3 bg-gray-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-gray-500 transition-colors"
      >
        Voltar ao Menu
      </button>
    </div>
  );
};
