import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Player } from './Player';
import { Platform } from './Platform';
import { Goal } from './Goal';
import { Hazard } from './Hazard';
import { Liquid } from './Liquid';
import { useKeyboard } from '../hooks/useKeyboard';
import { 
  GAME_WIDTH, 
  GAME_HEIGHT, 
  PLAYER_SIZE,
  GRAVITY,
  JUMP_FORCE,
  MOVE_SPEED,
  FRICTION,
  WATER_GRAVITY,
  WATER_JUMP_FORCE,
  WATER_FRICTION,
  WATER_MOVE_SPEED
} from '../constants';
import type { Vector2D, Level, GameStatus, Platform as PlatformType, Liquid as LiquidType } from '../types';

interface GameProps {
  level: Level;
  onWin: (time: number) => void;
  onContinue: () => void;
  onQuit: () => void;
  bestTime: number | null;
}

const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor(ms % 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
};

export const Game: React.FC<GameProps> = ({ level, onWin, onContinue, onQuit, bestTime }) => {
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [playerPosition, setPlayerPosition] = useState<Vector2D>(level.startPosition);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [finalTime, setFinalTime] = useState(0);
  
  const playerVelocity = useRef<Vector2D>({ x: 0, y: 0 });
  const playerRotation = useRef<number>(0);
  const isGrounded = useRef<boolean>(false);
  const gameLoopRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const continueButtonRef = useRef<HTMLButtonElement>(null);

  // Note: Using refs for moving objects to avoid re-renders inside the game loop.
  const movingPlatformsRef = useRef<PlatformType[]>([]);
  const movingLiquidsRef = useRef<LiquidType[]>([]);
  
  const platformPlayerIsOnRef = useRef<PlatformType | null>(null);
  const prevPlatformPositionsRef = useRef<{ [key: number]: Vector2D }>({});
  
  const keyboardState = useKeyboard();

  const resetGame = useCallback(() => {
    setPlayerPosition(level.startPosition);
    playerVelocity.current = { x: 0, y: 0 };
    playerRotation.current = 0;
    isGrounded.current = false;
    platformPlayerIsOnRef.current = null;
    prevPlatformPositionsRef.current = {};
    movingPlatformsRef.current = level.platforms;
    movingLiquidsRef.current = level.liquids || [];
    setElapsedTime(0);
    startTimeRef.current = performance.now();
    setGameStatus('playing');
  }, [level]);

  useEffect(() => {
    resetGame();
  }, [level.id, resetGame]);

  const gameLoop = useCallback((timestamp: number) => {
    if (gameStatus !== 'playing') {
      cancelAnimationFrame(gameLoopRef.current!);
      return;
    }
    
    const elapsedMs = performance.now() - startTimeRef.current;
    setElapsedTime(elapsedMs);

    // 1. Update moving platforms and liquids
    const currentPlatforms = level.platforms.map(p => {
      if (p.movement) {
        const newPlatform = { ...p, position: { ...p.position } };
        const totalDistance = p.movement.range[1] - p.movement.range[0];
        const cycleDuration = (totalDistance / p.movement.speed) * 2;
        const phase = (elapsedMs / 1000) % cycleDuration;
        
        let positionOffset;
        if (phase <= cycleDuration / 2) {
          positionOffset = phase * p.movement.speed;
        } else {
          positionOffset = (cycleDuration - phase) * p.movement.speed;
        }

        if (p.movement.type === 'horizontal') {
          newPlatform.position.x = p.movement.range[0] + positionOffset;
        } else {
          newPlatform.position.y = p.movement.range[0] + positionOffset;
        }
        return newPlatform;
      }
      return p;
    });
    movingPlatformsRef.current = currentPlatforms;

    const currentLiquids = (level.liquids || []).map(l => {
      if (l.movement) {
        const newLiquid = { ...l, position: { ...l.position } };
        const totalDistance = l.movement.range[1] - l.movement.range[0];
        const cycleDuration = (totalDistance / l.movement.speed) * 2;
        const phase = (elapsedMs / 1000) % cycleDuration;
        
        let positionOffset;
        if (phase <= cycleDuration / 2) {
          positionOffset = phase * l.movement.speed;
        } else {
          positionOffset = (cycleDuration - phase) * l.movement.speed;
        }

        if (l.movement.type === 'horizontal') {
          newLiquid.position.x = l.movement.range[0] + positionOffset;
        } else {
          newLiquid.position.y = l.movement.range[0] + positionOffset;
        }
        return newLiquid;
      }
      return l;
    });
    movingLiquidsRef.current = currentLiquids;
    
    // 2. Initialize new position, velocity and state for this frame
    let newPos = { ...playerPosition };
    let newVel = { ...playerVelocity.current };
    let isNowGrounded = false;
    
    // If player was on a moving platform, move them with it first.
    if (platformPlayerIsOnRef.current?.movement) {
        const platformThePlayerIsOn = platformPlayerIsOnRef.current;
        const originalPlatformIndex = level.platforms.findIndex(p => p === platformThePlayerIsOn);
        
        if (originalPlatformIndex !== -1) {
            const prevPlatformPos = prevPlatformPositionsRef.current[originalPlatformIndex];
            const currentPlatform = movingPlatformsRef.current[originalPlatformIndex];
            
            if (prevPlatformPos && currentPlatform) {
                const dx = currentPlatform.position.x - prevPlatformPos.x;
                const dy = currentPlatform.position.y - prevPlatformPos.y;
                newPos.x += dx;
                newPos.y += dy;
            }
        }
    }
    
    // 3. Check for water physics
    let inWater = false;
    for (const liquid of currentLiquids) {
      if (
        newPos.x + PLAYER_SIZE > liquid.position.x &&
        newPos.x < liquid.position.x + liquid.size.width &&
        newPos.y + PLAYER_SIZE > liquid.position.y &&
        newPos.y < liquid.position.y + liquid.size.height
      ) {
        inWater = true;
        break;
      }
    }

    const currentGravity = inWater ? WATER_GRAVITY : GRAVITY;
    const currentJumpForce = inWater ? WATER_JUMP_FORCE : JUMP_FORCE;
    const currentMoveSpeed = inWater ? WATER_MOVE_SPEED : MOVE_SPEED;
    const currentFriction = inWater ? WATER_FRICTION : FRICTION;
    
    // 4. Physics & Input
    const { ArrowLeft, ArrowRight, ' ': Space } = keyboardState.current;
    if (ArrowLeft) {
      newVel.x = -currentMoveSpeed;
    } else if (ArrowRight) {
      newVel.x = currentMoveSpeed;
    } else {
      newVel.x *= currentFriction;
    }

    if (Space && isGrounded.current) {
      newVel.y = currentJumpForce;
      isGrounded.current = false;
      platformPlayerIsOnRef.current = null;
    }

    newVel.y += currentGravity;

    // 5. Collision Detection & Resolution
    // X-axis
    newPos.x += newVel.x;
    for (const platform of currentPlatforms) {
      if (
        newPos.y + PLAYER_SIZE > platform.position.y &&
        newPos.y < platform.position.y + platform.size.height &&
        newPos.x + PLAYER_SIZE > platform.position.x &&
        newPos.x < platform.position.x + platform.size.width
      ) {
        if (newVel.x > 0) { // Moving right
          newPos.x = platform.position.x - PLAYER_SIZE;
        } else if (newVel.x < 0) { // Moving left
          newPos.x = platform.position.x + platform.size.width;
        }
        newVel.x = 0;
      }
    }

    // Y-axis
    newPos.y += newVel.y;
    let platformLandedOn: PlatformType | null = null;
    for (const platform of currentPlatforms) {
      if (
        newPos.x + PLAYER_SIZE > platform.position.x &&
        newPos.x < platform.position.x + platform.size.width &&
        newPos.y + PLAYER_SIZE > platform.position.y &&
        newPos.y < platform.position.y + platform.size.height
      ) {
        // Landing on a platform
        if (newVel.y >= 0 && playerPosition.y + PLAYER_SIZE <= platform.position.y + 1.5) {
          newPos.y = platform.position.y - PLAYER_SIZE;
          newVel.y = 0;
          isNowGrounded = true;

          const originalPlatformIndex = movingPlatformsRef.current.indexOf(platform);
          if (originalPlatformIndex !== -1) {
            platformLandedOn = level.platforms[originalPlatformIndex];
          }

        } else if (newVel.y < 0) { // Hitting from below
          newPos.y = platform.position.y + platform.size.height;
          newVel.y = 0;
        }
      }
    }
    
    // 6. Final checks (boundaries, hazards, goal)
    if (newPos.x < 0) newPos.x = 0;
    if (newPos.x + PLAYER_SIZE > GAME_WIDTH) newPos.x = GAME_WIDTH - PLAYER_SIZE;

    if (newPos.y > GAME_HEIGHT) {
      resetGame();
      return;
    }

    if (level.hazards) {
        for (const hazard of level.hazards) {
            if (
                newPos.x < hazard.position.x + hazard.size.width &&
                newPos.x + PLAYER_SIZE > hazard.position.x &&
                newPos.y < hazard.position.y + hazard.size.height &&
                newPos.y + PLAYER_SIZE > hazard.position.y
            ) {
                resetGame();
                return;
            }
        }
    }

    const dx = newPos.x + (PLAYER_SIZE / 2) - (level.goalPosition.x + 20);
    const dy = newPos.y + (PLAYER_SIZE / 2) - (level.goalPosition.y + 20);
    if (Math.sqrt(dx * dx + dy * dy) < (PLAYER_SIZE / 2 + 20)) {
      const finishedTime = performance.now() - startTimeRef.current;
      setFinalTime(finishedTime);
      setGameStatus('won');
      onWin(finishedTime);
    }

    // 7. Update state for next frame
    setPlayerPosition(newPos);
    playerVelocity.current = newVel;
    isGrounded.current = isNowGrounded;
    
    if (isNowGrounded) {
        platformPlayerIsOnRef.current = platformLandedOn;
    } else {
        platformPlayerIsOnRef.current = null;
    }
    
    playerRotation.current += newVel.x * 2;
    
    const newPlatformPositions: { [key: number]: Vector2D } = {};
    currentPlatforms.forEach((p, index) => {
        if (p.movement) {
            newPlatformPositions[index] = p.position;
        }
    });
    prevPlatformPositionsRef.current = newPlatformPositions;

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [playerPosition, gameStatus, keyboardState, resetGame, level, onWin]);

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

  useEffect(() => {
    if (gameStatus === 'won') {
      continueButtonRef.current?.focus();
    }
  }, [gameStatus]);

  return (
    <div className="flex flex-col items-center">
        <p className="text-gray-400 mb-4">Use as setas para mover e espaço para pular. Fase {level.id}: {level.name}</p>
        <div 
            className="relative bg-gray-800 border-4 border-cyan-500 rounded-lg shadow-2xl shadow-cyan-500/20 overflow-hidden"
            style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        >
            {gameStatus === 'won' && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-30">
                <h2 className="text-6xl font-bold text-yellow-400 mb-4">Fase Concluída!</h2>
                <p className="text-3xl text-white mb-2">Seu tempo: {formatTime(finalTime)}</p>
                {bestTime !== null && finalTime < bestTime && (
                    <p className="text-3xl text-yellow-400 font-bold animate-pulse mb-4">Novo Recorde!</p>
                )}
                <p className="text-xl text-gray-400 mb-8">
                    Melhor tempo: {bestTime ? formatTime(bestTime) : 'N/A'}
                </p>
                <button
                    ref={continueButtonRef}
                    onClick={onContinue}
                    className="px-8 py-4 bg-yellow-500 text-gray-900 font-bold text-xl rounded-lg shadow-lg hover:bg-yellow-400 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-300"
                >
                    Continuar
                </button>
            </div>
            )}
            
            <p className="absolute top-2 left-2 z-20 text-lg font-semibold text-white bg-black/30 px-2 rounded">
                Tempo: {formatTime(elapsedTime)}
            </p>

            <div className="absolute top-2 right-2 z-20 flex items-center gap-2">
                <button
                    onClick={resetGame}
                    className="px-4 py-2 bg-orange-600 text-white font-bold rounded-lg shadow-md hover:bg-orange-500 transition-colors"
                    aria-label="Reiniciar o nível"
                >
                    Reiniciar
                </button>
                <button
                    onClick={onQuit}
                    className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-500 transition-colors"
                    aria-label="Sair para o menu"
                >
                    Sair
                </button>
            </div>

            {movingLiquidsRef.current.map((liquid, index) => (
              <Liquid key={`liquid-${index}`} {...liquid} />
            ))}
            {movingPlatformsRef.current.map((platform, index) => (
              <Platform key={`platform-${index}`} {...platform} />
            ))}
            {level.hazards?.map((hazard, index) => (
              <Hazard key={`hazard-${index}`} {...hazard} />
            ))}
            <Goal position={level.goalPosition} />
            <Player position={playerPosition} rotation={playerRotation.current} />
        </div>
    </div>
  );
};