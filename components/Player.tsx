
import React from 'react';
import type { Vector2D } from '../types';

interface PlayerProps {
  position: Vector2D;
  rotation: number;
}

export const Player: React.FC<PlayerProps> = ({ position, rotation }) => {
  return (
    <div
      className="absolute w-[30px] h-[30px] rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <div className="absolute w-2 h-2 bg-white/50 rounded-full top-1 left-2"></div>
    </div>
  );
};
