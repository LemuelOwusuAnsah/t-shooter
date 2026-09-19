import type {
  Star,
  Bullet,
  Enemy,
  Particle,
  PowerUp,
  FloatText,
  Player,
} from "./types";

export let player: Player = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  hp: 5,
  maxHp: 5,
  cooldown: 0,
  invuln: 0,
  shield: 0,
  weapon: "normal",
  weaponT: 0,
};

export let stars: Star[] = [];
export let bullets: Bullet[] = [];
export let enemies: Enemy[] = [];
export let particles: Particle[] = [];
export let powerups: PowerUp[] = [];
export let floats: FloatText[] = [];

export let score = 0;
export let hiScore = 0;
export let wave = 0;
export let waveTimer = 0;
export let running = true;
export let paused = false;
export let gameOverT = 0;
export let tick = 0;
export let shakeT = 0;
export let shakeMag = 0;

export function setPlayer(p: Player): void {
  player = p;
}

export function setStars(s: Star[]): void {
  stars = s;
}

export function setBullets(b: Bullet[]): void {
  bullets = b;
}

export function setEnemies(e: Enemy[]): void {
  enemies = e;
}

export function setParticles(p: Particle[]): void {
  particles = p;
}

export function setPowerups(p: PowerUp[]): void {
  powerups = p;
}

export function setFloats(f: FloatText[]): void {
  floats = f;
}

export function setScore(n: number): void {
  score = n;
}

export function setHiScore(n: number): void {
  hiScore = n;
}

export function setWave(n: number): void {
  wave = n;
}

export function setWaveTimer(n: number): void {
  waveTimer = n;
}

export function setRunning(b: boolean): void {
  running = b;
}

export function setPaused(b: boolean): void {
  paused = b;
}

export function setGameOverT(n: number): void {
  gameOverT = n;
}

export function setTick(n: number): void {
  tick = n;
}

export function setShakeT(n: number): void {
  shakeT = n;
}

export function setShakeMag(n: number): void {
  shakeMag = n;
}