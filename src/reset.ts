import { W, H } from "./screen";
import type { Star, Player } from "./types";

export function freshPlayer(): Player {
  return {
    x: W / 2,
    y: H - 4,
    vx: 0,
    vy: 0,
    hp: 5,
    maxHp: 5,
    cooldown: 0,
    invuln: 60,
    shield: 0,
    weapon: "normal",
    weaponT: 0,
  };
}

export function freshStars(): Star[] {
  const out: Star[] = [];
  for (let i = 0; i < 90; i++) {
    out.push({
      x: Math.random() * W,
      y: Math.random() * H,
      speed: 0.05 + Math.random() * 0.4,
      brightness: 0.3 + Math.random() * 0.7,
    });
  }
  return out;
}