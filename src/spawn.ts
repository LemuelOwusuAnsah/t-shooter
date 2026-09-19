import type { Enemy, EnemyKind } from "./types";
import { W } from "./screen";

export function makeEnemy(kind: EnemyKind, x?: number): Enemy {
  const px = x ?? 6 + Math.random() * (W - 12);
  const base = {
    x: px,
    y: -1,
    vx: 0,
    vy: 0,
    fireTimer: 40 + Math.random() * 40,
    patternT: 0,
  };

  if (kind === "grunt") {
    return {
      ...base,
      hp: 2,
      maxHp: 2,
      kind,
      r: 220,
      g: 80,
      b: 100,
      scoreValue: 100,
      radius: 0.5,
    };
  }

  if (kind === "weaver") {
    return {
      ...base,
      hp: 3,
      maxHp: 3,
      kind,
      r: 200,
      g: 120,
      b: 255,
      scoreValue: 200,
      radius: 0.5,
    };
  }

  if (kind === "tank") {
    return {
      ...base,
      hp: 12,
      maxHp: 12,
      kind,
      r: 255,
      g: 180,
      b: 40,
      scoreValue: 400,
      radius: 1.1,
      vy: 0.015,
    };
  }

  return {
    x: W / 2,
    y: -2,
    vx: 0,
    vy: 0.02,
    hp: 120,
    maxHp: 120,
    kind: "boss",
    fireTimer: 60,
    patternT: 0,
    r: 255,
    g: 40,
    b: 80,
    scoreValue: 5000,
    radius: 3,
  };
}

export function waveEnemies(wave: number): Enemy[] {
  const list: Enemy[] = [];
  if (wave % 5 === 0) {
    list.push(makeEnemy("boss"));
    return list;
  }

  const pattern = wave % 4;
  if (pattern === 0) {
    for (let i = 0; i < 5; i++) list.push(makeEnemy("grunt", 8 + i * 12));
  } else if (pattern === 1) {
    for (let i = 0; i < 4; i++) list.push(makeEnemy("weaver", 10 + i * 15));
  } else if (pattern === 2) {
    list.push(makeEnemy("tank"));
    for (let i = 0; i < 3; i++) list.push(makeEnemy("grunt", 6 + i * 26));
  } else {
    for (let i = 0; i < 6; i++) list.push(makeEnemy("grunt", 4 + i * 12));
  }
  return list;
}