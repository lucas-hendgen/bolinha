import React from 'react';
import type { Level, Progress } from '../types';

interface LevelSelectScreenProps {
  levels: Level[];
  progress: Progress;
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
}

const LockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3A5.25 5.25 0 0 0 12 1.5Zm-3.75 5.25a3.75 3.75 0 1 0 7.5 0v3h-7.5v-3Z" clipRule="evenodd" />
    </svg>
);

const formatTimeShort = (ms: number | null) => {
    if (ms === null) return null;
    const totalSeconds = ms / 1000;
    return `${totalSeconds.toFixed(2)}s`;
};

export const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({ levels, progress, onSelectLevel, onBack }) => {
  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      <p className="text-lg text-gray-300 mb-6">Escolha uma fase para começar</p>
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-x-3 gap-y-8 mb-8">
        {levels.map(level => {
          const isUnlocked = level.id in progress;
          const bestTime = progress[level.id];
          const formattedTime = formatTimeShort(bestTime);
          return (
            <div key={level.id} className="relative flex flex-col items-center">
              <button
                onClick={() => isUnlocked && onSelectLevel(level.id)}
                disabled={!isUnlocked}
                className={`w-16 h-16 flex items-center justify-center font-bold rounded-lg border-2 transition-all duration-200 transform 
                  ${isUnlocked 
                    ? 'bg-cyan-600 border-cyan-400 text-white text-2xl shadow-lg hover:scale-110 hover:bg-cyan-500 cursor-pointer' 
                    : 'bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed'
                  }`
                }
                aria-label={isUnlocked ? `Jogar fase ${level.id}` : `Fase ${level.id} bloqueada`}
              >
                {isUnlocked ? level.id : <LockIcon className="w-8 h-8" />}
              </button>
              {isUnlocked && formattedTime && (
                <p className="absolute -bottom-5 text-xs text-yellow-400 font-semibold" aria-label={`Melhor tempo: ${formattedTime}`}>
                    {formattedTime}
                </p>
              )}
            </div>
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
