export interface Vector2D {
  x: number;
  y: number;
}

export interface GameObject {
  position: Vector2D;
  size: {
    width: number;
    height: number;
  };
}

export interface Movement {
  type: 'horizontal' | 'vertical';
  range: [number, number];
  speed: number;
}

export interface Platform extends GameObject {
  movement?: Movement;
}

export interface Hazard extends GameObject {
  type: 'spikes_up' | 'spikes_down' | 'spikes_left' | 'spikes_right' | 'lava';
}

export interface Liquid extends GameObject {
  type: 'water';
  // FIX: Add optional movement property to support moving liquids.
  movement?: Movement;
}

export interface Level {
  id: number;
  name: string;
  platforms: Platform[];
  hazards?: Hazard[];
  liquids?: Liquid[];
  startPosition: Vector2D;
  goalPosition: Vector2D;
}


export type GameScreen = 'start_screen' | 'level_select' | 'playing';
export type GameStatus = 'playing' | 'won';
export type Progress = { [levelId: number]: number | null };
