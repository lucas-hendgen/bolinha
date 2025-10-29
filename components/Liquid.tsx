import React from 'react';
import type { Liquid as LiquidType } from '../types';

export const Liquid: React.FC<LiquidType> = ({ position, size, type }) => {
    let baseColor = 'bg-blue-500';
    if (type === 'water') {
        baseColor = 'bg-cyan-500';
    }

    return (
        <div
            className={`absolute ${baseColor} opacity-40 overflow-hidden`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: `${size.width}px`,
                height: `${size.height}px`,
            }}
        >
           <div className="absolute top-0 left-0 w-full h-1 bg-white/30 animate-pulse"></div>
        </div>
    );
};