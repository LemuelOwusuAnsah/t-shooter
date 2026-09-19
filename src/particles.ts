import type { Particle, FloatText } from "./types";

export function burst(
  x: number,
  y: number,
  r: number,
  g: number,
  b: number,
  n: number,
  power: number
): Particle[] {
  const out: Particle[] = [];
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = power * (0.3 + Math.random());
    out.push({
      x,
      y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      life: 10 + Math.random() * 18,
      maxLife: 28,
      r,
      g,
      b,
      ch: Math.random() < 0.3 ? "*" : Math.random() < 0.6 ? "+" : "·",
    });
  }
  return out;
}

export function updateParticles(list: Particle[]): Particle[] {
  for (const p of list) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.015;
    p.vx *= 0.985;
    p.life--;
  }
  return list.filter((p) => p.life > 0);
}

export function updateFloats(list: FloatText[]): FloatText[] {
  for (const f of list) {
    f.y -= 0.06;
    f.life--;
  }
  return list.filter((f) => f.life > 0);
}