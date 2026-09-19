export type Star = {
  x: number;
  y: number;
  speed: number;
  brightness: number;
};

export type Bullet = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  dmg: number;
  r: number;
  g: number;
  b: number;
  ch: string;
  friendly: boolean;
};

export type EnemyKind = "grunt" | "weaver" | "tank" | "boss";

export type Enemy = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hp: number;
  maxHp: number;
  kind: EnemyKind;
  fireTimer: number;
  patternT: number;
  r: number;
  g: number;
  b: number;
  scoreValue: number;
  radius: number;
};

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  r: number;
  g: number;
  b: number;
  ch: string;
};

export type PowerUpKind = "spread" | "laser" | "shield" | "heal";

export type PowerUp = {
  x: number;
  y: number;
  vy: number;
  kind: PowerUpKind;
};

export type FloatText = {
  x: number;
  y: number;
  text: string;
  life: number;
  r: number;
  g: number;
  b: number;
};

export type WeaponKind = "normal" | "spread" | "laser";

export type Player = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hp: number;
  maxHp: number;
  cooldown: number;
  invuln: number;
  shield: number;
  weapon: WeaponKind;
  weaponT: number;
};