
import React from 'react';
import type { Vector2D } from '../types';

interface GoalProps {
  position: Vector2D;
}

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path 
      fillRule="evenodd" 
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" 
      clipRule="evenodd" 
    />
  </svg>
);


export const Goal: React.FC<GoalProps> = ({ position }) => {
  return (
    <div
      className="absolute w-[40px] h-[40px] text-yellow-400 animate-pulse"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
        <StarIcon />
        <div className="absolute inset-0 text-yellow-300 animate-ping opacity-75">
            <StarIcon />
        </div>
    </div>
  );
};
