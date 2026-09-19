import { enterAltScreen, leaveAltScreen, W } from "./screen";
import { initInput, configureInput, shutdownInput, keys } from "./input";
import { burst } from "./particles";
import { waveEnemies } from "./spawn";
import { startLoop, LoopState } from "./loop";
import { freshPlayer, freshStars } from "./reset";
import { startServer } from "./server";
import type {
  Player,
  Star,
  Bullet,
  Enemy,
  Particle,
  PowerUp,
  FloatText,
} from "./types";

const serveMode = process.argv.includes("--serve");

let player: Player = freshPlayer();
let stars: Star[] = freshStars();
let bullets: Bullet[] = [];
let enemies: Enemy[] = [];
let particles: Particle[] = [];
let powerups: PowerUp[] = [];
let floats: FloatText[] = [];
let score = 0;
let hiScore = 0;
let wave = 0;
let waveTimer = 90;
let running = true;
let paused = false;
let tick = 0;
let shakeMag = 0;
let shakeT = 0;

function getState(): LoopState {
  return {
    player,
    stars,
    bullets,
    enemies,
    particles,
    powerups,
    floats,
    score,
    hiScore,
    wave,
    waveTimer,
    running,
    paused,
    tick,
    shakeMag,
    shakeT,
  };
}

function setState(s: LoopState): void {
  player = s.player;
  stars = s.stars;
  bullets = s.bullets;
  enemies = s.enemies;
  particles = s.particles;
  powerups = s.powerups;
  floats = s.floats;
  score = s.score;
  hiScore = s.hiScore;
  wave = s.wave;
  waveTimer = s.waveTimer;
  running = s.running;
  paused = s.paused;
  tick = s.tick;
  shakeMag = s.shakeMag;
  shakeT = s.shakeT;
}

function resetGame(): void {
  player = freshPlayer();
  stars = freshStars();
  bullets = [];
  enemies = [];
  particles = [];
  powerups = [];
  floats = [];
  score = 0;
  wave = 0;
  waveTimer = 90;
  running = true;
  paused = false;
  tick = 0;
  shakeMag = 0;
  shakeT = 0;
  for (const k of Object.keys(keys)) keys[k] = false;
}

function quitGame(): void {
  shutdownInput();
  if (!serveMode) leaveAltScreen();
  process.exit(0);
}

configureInput({
  quit: quitGame,
  restart: resetGame,
  isRunning: () => running,
  isPaused: () => paused,
  togglePause: () => {
    paused = !paused;
  },
});

if (serveMode) {
  initInput();
  startServer();
} else {
  initInput();
  enterAltScreen();
}

startLoop({
  get: getState,
  set: setState,
  waveEnemies,
  burst,
});

process.on("exit", () => {
  if (!serveMode) leaveAltScreen();
});

void W;