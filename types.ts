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

export interface Level {
  id: number;
  name: string;
  platforms: GameObject[];
  startPosition: Vector2D;
  goalPosition: Vector2D;
}

export type GameScreen = 'start_screen' | 'level_select' | 'playing';
export type GameStatus = 'playing' | 'won';
