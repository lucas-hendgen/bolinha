import React from 'react';
import type { Hazard as HazardType } from '../types';

const SpikeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} preserveAspectRatio="none">
        <polygon points="0,100 50,0 100,100" />
    </svg>
);

export const Hazard: React.FC<HazardType> = ({ position, size, type }) => {
    if (type === 'lava') {
        return (
            <div
                className="absolute bg-gradient-to-t from-orange-600 to-yellow-400 opacity-80"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    width: `${size.width}px`,
                    height: `${size.height}px`,
                }}
            >
                <div className="absolute inset-0 bg-red-500 opacity-50 animate-pulse"></div>
            </div>
        );
    }
    
    // Spikes
    const spikeCount = Math.floor(type.startsWith('spikes_left') || type.startsWith('spikes_right') ? size.height / 16 : size.width / 16);
    let rotation = '';
    switch(type) {
        case 'spikes_down': rotation = 'rotate-180'; break;
        case 'spikes_left': rotation = '-rotate-90'; break;
        case 'spikes_right': rotation = 'rotate-90'; break;
        default: rotation = '';
    }

    const isVertical = type === 'spikes_left' || type === 'spikes_right';

    return (
        <div
            className="absolute flex"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: `${size.width}px`,
                height: `${size.height}px`,
                flexDirection: isVertical ? 'column' : 'row',
            }}
        >
            {Array.from({ length: spikeCount }).map((_, i) => (
                <div key={i} className={`text-gray-500 ${rotation}`} style={{ width: isVertical ? '100%' : '16px', height: isVertical ? '16px' : '100%'}}>
                    <SpikeIcon className="w-full h-full" />
                </div>
            ))}
        </div>
    );
};