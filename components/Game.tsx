import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Player } from './Player';
import { Platform } from './Platform';
import { Goal } from './Goal';
import { useKeyboard } from '../hooks/useKeyboard';
import { GAME_WIDTH, GAME_HEIGHT, PLAYER_SIZE } from '../constants';
import type { Vector2D, Level, GameStatus } from '../types';

interface GameProps {
  level: Level;
  onWin: () => void;
  onQuit: () => void;
}

export const Game: React.FC<GameProps> = ({ level, onWin, onQuit }) => {
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [playerPosition, setPlayerPosition] = useState<Vector2D>(level.startPosition);
  const playerVelocity = useRef<Vector2D>({ x: 0, y: 0 });
  const playerRotation = useRef<number>(0);
  const isGrounded = useRef<boolean>(false);
  const gameLoopRef = useRef<number>();
  
  const keyboardState = useKeyboard();

  const resetGame = useCallback(() => {
    setPlayerPosition(level.startPosition);
    playerVelocity.current = { x: 0, y: 0 };
    playerRotation.current = 0;
    isGrounded.current = false;
    setGameStatus('playing');
  }, [level.startPosition]);

  useEffect(() => {
    resetGame();
  }, [level.id, resetGame]);

  const gameLoop = useCallback(() => {
    if (gameStatus !== 'playing') return;

    // Horizontal movement
    const { ArrowLeft, ArrowRight, ' ': Space } = keyboardState.current;
    if (ArrowLeft) {
      playerVelocity.current.x = -5;
    } else if (ArrowRight) {
      playerVelocity.current.x = 5;
    } else {
      playerVelocity.current.x *= 0.9; // Friction
    }

    // Jumping
    if (Space && isGrounded.current) {
      playerVelocity.current.y = -13;
      isGrounded.current = false;
    }

    // Apply gravity
    playerVelocity.current.y += 0.6;

    // Update position
    let newPos = {
      x: playerPosition.x + playerVelocity.current.x,
      y: playerPosition.y + playerVelocity.current.y,
    };

    isGrounded.current = false;

    // Collision detection with platforms
    for (const platform of level.platforms) {
      const playerBottom = newPos.y + PLAYER_SIZE;
      const playerTop = newPos.y;
      const playerLeft = newPos.x;
      const playerRight = newPos.x + PLAYER_SIZE;

      const platformTop = platform.position.y;
      const platformBottom = platform.position.y + platform.size.height;
      const platformLeft = platform.position.x;
      const platformRight = platform.position.x + platform.size.width;

      if (playerRight > platformLeft && playerLeft < platformRight && playerBottom > platformTop && playerTop < platformBottom) {
        const prevPlayerBottom = playerPosition.y + PLAYER_SIZE;

        if (prevPlayerBottom <= platformTop) { // Coming from above
          newPos.y = platformTop - PLAYER_SIZE;
          playerVelocity.current.y = 0;
          isGrounded.current = true;
        } else if (playerPosition.y >= platformBottom) { // Coming from below
          newPos.y = platformBottom;
          playerVelocity.current.y = 0;
        } else if (playerRight > platformLeft && playerPosition.x < platformLeft) { // Coming from left
           newPos.x = platformLeft - PLAYER_SIZE;
           playerVelocity.current.x = 0;
        } else if (playerLeft < platformRight && playerPosition.x > platformRight) { // Coming from right
           newPos.x = platformRight;
           playerVelocity.current.x = 0;
        }
      }
    }
    
    // Boundary checks
    if (newPos.x < 0) newPos.x = 0;
    if (newPos.x + PLAYER_SIZE > GAME_WIDTH) newPos.x = GAME_WIDTH - PLAYER_SIZE;

    // Check for falling out of the world
    if (newPos.y > GAME_HEIGHT) {
      resetGame();
      return;
    }

    // Goal detection
    const dx = newPos.x + (PLAYER_SIZE / 2) - (level.goalPosition.x + 20);
    const dy = newPos.y + (PLAYER_SIZE / 2) - (level.goalPosition.y + 20);
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < (PLAYER_SIZE / 2 + 20)) {
      setGameStatus('won');
    }

    setPlayerPosition(newPos);
    playerRotation.current += playerVelocity.current.x * 2;
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [playerPosition, gameStatus, keyboardState, resetGame, level.platforms, level.goalPosition]);

  useEffect(() => {
    if (gameStatus === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameStatus, gameLoop]);

  return (
    <div className="flex flex-col items-center">
        <p className="text-gray-400 mb-4">Use as setas para mover e espaço para pular. Fase {level.id}: {level.name}</p>
        <div 
            className="relative bg-gray-800 border-4 border-cyan-500 rounded-lg shadow-2xl shadow-cyan-500/20 overflow-hidden"
            style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        >
            {gameStatus === 'won' && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-20">
                <h2 className="text-6xl font-bold text-yellow-400 mb-8">Fase Concluída!</h2>
                <button 
                onClick={onWin}
                className="px-8 py-4 bg-yellow-500 text-gray-900 font-bold text-xl rounded-lg shadow-lg hover:bg-yellow-400 transform hover:scale-105 transition-all duration-300"
                >
                Continuar
                </button>
            </div>
            )}

            <button
              onClick={onQuit}
              className="absolute top-2 right-2 z-10 px-4 py-2 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-500 transition-colors"
              aria-label="Sair para o menu"
            >
              Sair
            </button>

            {level.platforms.map((platform, index) => (
            <Platform key={index} {...platform} />
            ))}
            <Goal position={level.goalPosition} />
            <Player position={playerPosition} rotation={playerRotation.current} />
        </div>
    </div>
  );
};
