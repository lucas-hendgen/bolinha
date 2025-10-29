import React from 'react';

interface StartScreenProps {
  onNewGame: () => void;
  onSelectLevel: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onNewGame, onSelectLevel }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <p className="text-gray-400 mb-8 max-w-md">
        Controle a bolinha, role e pule pelas plataformas para alcançar a estrela em cada fase!
      </p>
      <div className="space-y-4">
        <button
          onClick={onNewGame}
          className="w-64 px-8 py-4 bg-cyan-500 text-gray-900 font-bold text-xl rounded-lg shadow-lg hover:bg-cyan-400 transform hover:scale-105 transition-all duration-300"
        >
          Novo Jogo
        </button>
        <button
          onClick={onSelectLevel}
          className="w-64 px-8 py-4 bg-emerald-500 text-gray-900 font-bold text-xl rounded-lg shadow-lg hover:bg-emerald-400 transform hover:scale-105 transition-all duration-300"
        >
          Selecionar Fase
        </button>
      </div>
    </div>
  );
};
