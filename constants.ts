import type { Level } from './types';

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;
export const PLAYER_SIZE = 30;

export const LEVELS: Level[] = [
  // Level 1: The Basics
  {
    id: 1,
    name: "O Começo",
    startPosition: { x: 50, y: 500 },
    goalPosition: { x: 720, y: 500 },
    platforms: [
      { position: { x: 0, y: 570 }, size: { width: 800, height: 30 } },
      { position: { x: 300, y: 520 }, size: { width: 200, height: 20 } },
    ],
  },
  // Level 2: Stepping Up (Adjusted difficulty)
  {
    id: 2,
    name: "Subindo",
    startPosition: { x: 50, y: 540 },
    goalPosition: { x: 720, y: 80 },
    platforms: [
      { position: { x: 0, y: 570 }, size: { width: 200, height: 30 } },
      { position: { x: 250, y: 500 }, size: { width: 150, height: 20 } },
      { position: { x: 450, y: 430 }, size: { width: 150, height: 20 } },
      { position: { x: 300, y: 360 }, size: { width: 150, height: 20 } }, // Made wider
      { position: { x: 480, y: 290 }, size: { width: 170, height: 20 } }, // Moved closer and made wider
      { position: { x: 680, y: 220 }, size: { width: 120, height: 20 } }, // Final ascent platform
      { position: { x: 680, y: 120 }, size: { width: 120, height: 20 } }, // Goal platform (straight jump up)
    ],
  },
  // Level 3: The Drop
  {
    id: 3,
    name: "A Queda",
    startPosition: { x: 50, y: 80 },
    goalPosition: { x: 720, y: 530 },
    platforms: [
      { position: { x: 0, y: 120 }, size: { width: 250, height: 20 } },
      { position: { x: 0, y: 570 }, size: { width: 800, height: 30 } },
      { position: { x: 400, y: 350 }, size: { width: 20, height: 220 } },
      { position: { x: 250, y: 450 }, size: { width: 100, height: 20 } },
    ],
  },
    // Level 4: Long Jump
  {
    id: 4,
    name: "Salto Distante",
    startPosition: { x: 50, y: 540 },
    goalPosition: { x: 720, y: 530 },
    platforms: [
      { position: { x: 0, y: 570 }, size: { width: 300, height: 30 } },
      { position: { x: 450, y: 570 }, size: { width: 350, height: 30 } },
    ],
  },
  // Level 5: Wall Bounce
  {
    id: 5,
    name: "Pula-Pula",
    startPosition: { x: 50, y: 540 },
    goalPosition: { x: 740, y: 80 },
    platforms: [
      { position: { x: 0, y: 570 }, size: { width: 800, height: 30 } },
      { position: { x: 200, y: 450 }, size: { width: 20, height: 120 } },
      { position: { x: 350, y: 330 }, size: { width: 20, height: 120 } },
      { position: { x: 500, y: 210 }, size: { width: 20, height: 120 } },
      { position: { x: 700, y: 120 }, size: { width: 100, height: 20 } },
    ],
  },
  // Level 6: Tight Squeeze
  {
    id: 6,
    name: "Aperto",
    startPosition: { x: 50, y: 540 },
    goalPosition: { x: 400, y: 80 },
    platforms: [
      { position: { x: 0, y: 570 }, size: { width: 800, height: 30 } },
      { position: { x: 200, y: 480 }, size: { width: 400, height: 20 } },
      { position: { x: 200, y: 390 }, size: { width: 400, height: 20 } },
      { position: { x: 200, y: 300 }, size: { width: 400, height: 20 } },
      { position: { x: 200, y: 210 }, size: { width: 400, height: 20 } },
      { position: { x: 380, y: 120 }, size: { width: 40, height: 20 } },
    ],
  },
  // Level 7: The Climb
  {
    id: 7,
    name: "A Escalada",
    startPosition: { x: 385, y: 540 },
    goalPosition: { x: 385, y: 40 },
    platforms: [
      { position: { x: 0, y: 570 }, size: { width: 800, height: 30 } },
      { position: { x: 250, y: 480 }, size: { width: 80, height: 20 } },
      { position: { x: 470, y: 400 }, size: { width: 80, height: 20 } },
      { position: { x: 250, y: 320 }, size: { width: 80, height: 20 } },
      { position: { x: 470, y: 240 }, size: { width: 80, height: 20 } },
      { position: { x: 250, y: 160 }, size: { width: 80, height: 20 } },
      { position: { x: 360, y: 80 }, size: { width: 80, height: 20 } },
    ],
  },
  // Level 8: Maze Runner
  {
    id: 8,
    name: "Labirinto",
    startPosition: { x: 50, y: 540 },
    goalPosition: { x: 50, y: 80 },
    platforms: [
      { position: { x: 0, y: 570 }, size: { width: 800, height: 30 } },
      { position: { x: 150, y: 450 }, size: { width: 650, height: 20 } },
      { position: { x: 0, y: 330 }, size: { width: 650, height: 20 } },
      { position: { x: 150, y: 210 }, size: { width: 650, height: 20 } },
      { position: { x: 30, y: 120 }, size: { width: 100, height: 20 } },
    ],
  },
  // Level 9: Precision
  {
    id: 9,
    name: "Precisão",
    startPosition: { x: 50, y: 540 },
    goalPosition: { x: 730, y: 80 },
    platforms: [
      { position: { x: 0, y: 570 }, size: { width: 100, height: 30 } },
      { position: { x: 200, y: 500 }, size: { width: 50, height: 20 } },
      { position: { x: 350, y: 430 }, size: { width: 50, height: 20 } },
      { position: { x: 500, y: 360 }, size: { width: 50, height: 20 } },
      { position: { x: 350, y: 290 }, size: { width: 50, height: 20 } },
      { position: { x: 500, y: 220 }, size: { width: 50, height: 20 } },
      { position: { x: 700, y: 120 }, size: { width: 80, height: 20 } },
    ],
  },
  // Level 10: The Finale
  {
    id: 10,
    name: "A Final",
    startPosition: { x: 50, y: 540 },
    goalPosition: { x: 400, y: 40 },
    platforms: [
      { position: { x: 0, y: 570 }, size: { width: 150, height: 30 } },
      { position: { x: 250, y: 570 }, size: { width: 150, height: 20 } },
      { position: { x: 450, y: 500 }, size: { width: 30, height: 70 } },
      { position: { x: 550, y: 430 }, size: { width: 200, height: 20 } },
      { position: { x: 550, y: 200 }, size: { width: 20, height: 200 } },
      { position: { x: 200, y: 350 }, size: { width: 200, height: 20 } },
      { position: { x: 100, y: 250 }, size: { width: 50, height: 20 } },
      { position: { x: 250, y: 150 }, size: { width: 50, height: 20 } },
      { position: { x: 380, y: 80 }, size: { width: 40, height: 20 } },
    ],
  },
];
