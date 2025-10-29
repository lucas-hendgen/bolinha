
import React from 'react';
import type { GameObject } from '../types';

export const Platform: React.FC<GameObject> = ({ position, size }) => {
  return (
    <div
      className="absolute bg-gradient-to-b from-emerald-500 to-emerald-700 rounded"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
      }}
    />
  );
};
