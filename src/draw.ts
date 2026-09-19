import { W, H, set } from "./screen";
import type {
  Player,
  Star,
  Bullet,
  Enemy,
  Particle,
  PowerUp,
  FloatText,
} from "./types";

export type DrawState = {
  player: Player;
  stars: Star[];
  bullets: Bullet[];
  enemies: Enemy[];
  particles: Particle[];
  powerups: PowerUp[];
  floats: FloatText[];
  score: number;
  hiScore: number;
  wave: number;
  tick: number;
  running: boolean;
  paused: boolean;
  shakeMag: number;
};

export function draw(s: DrawState): void {
  const sx = s.shakeMag > 0 ? (Math.random() - 0.5) * s.shakeMag : 0;
  const sy = s.shakeMag > 0 ? (Math.random() - 0.5) * s.shakeMag : 0;
  const put = (x: number, y: number, ch: string, r: number, g: number, b: number) =>
    set(x + sx, y + sy, ch, r, g, b);

  for (const st of s.stars) {
    const c = Math.floor(180 * st.brightness);
    put(st.x, st.y, "·", c, c, c + 40);
  }

  for (const p of s.particles) {
    const a = p.life / p.maxLife;
    put(p.x, p.y, p.ch, Math.floor(p.r * a), Math.floor(p.g * a), Math.floor(p.b * a));
  }

  for (const p of s.powerups) {
    const glow = 0.6 + 0.4 * Math.sin(s.tick * 0.3);
    if (p.kind === "spread") put(p.x, p.y, "◆", 120, Math.floor(220 * glow), 255);
    if (p.kind === "laser") put(p.x, p.y, "◆", 255, Math.floor(80 * glow), 255);
    if (p.kind === "shield") put(p.x, p.y, "◇", 120, Math.floor(200 * glow), 255);
    if (p.kind === "heal") put(p.x, p.y, "✚", 120, 255, 120);
  }

  for (const b of s.bullets) put(b.x, b.y, b.ch, b.r, b.g, b.b);

  for (const e of s.enemies) {
    if (e.kind === "grunt") {
      put(e.x, e.y, "▼", e.r, e.g, e.b);
      put(e.x - 1, e.y, "◣", e.r * 0.7, e.g * 0.7, e.b * 0.7);
      put(e.x + 1, e.y, "◢", e.r * 0.7, e.g * 0.7, e.b * 0.7);
    } else if (e.kind === "weaver") {
      put(e.x, e.y, "◊", e.r, e.g, e.b);
      put(e.x - 1, e.y, "▸", e.r * 0.8, e.g * 0.8, e.b * 0.8);
      put(e.x + 1, e.y, "◂", e.r * 0.8, e.g * 0.8, e.b * 0.8);
    } else if (e.kind === "tank") {
      put(e.x, e.y, "█", e.r, e.g, e.b);
      put(e.x - 1, e.y, "▐", e.r * 0.75, e.g * 0.75, e.b * 0.75);
      put(e.x + 1, e.y, "▌", e.r * 0.75, e.g * 0.75, e.b * 0.75);
      put(e.x, e.y - 1, "▄", e.r, e.g, e.b);
      const hpFrac = e.hp / e.maxHp;
      for (let i = 0; i < 5; i++) {
        const on = i / 5 < hpFrac;
        put(e.x - 2 + i, e.y - 2, "▁", on ? 255 : 60, on ? 180 : 30, on ? 40 : 30);
      }
    } else if (e.kind === "boss") {
      const hpFrac = e.hp / e.maxHp;
      const phase = hpFrac > 0.66 ? 0 : hpFrac > 0.33 ? 1 : 2;
      const pulse = 0.7 + 0.3 * Math.sin(s.tick * 0.2);
      const R = Math.floor(255 * pulse);
      const G = Math.floor((60 + phase * 60) * pulse);
      const B = Math.floor((120 + phase * 40) * pulse);
      put(e.x, e.y - 1, "▲", R, G, B);
      put(e.x - 1, e.y - 1, "◤", R, G, B);
      put(e.x + 1, e.y - 1, "◥", R, G, B);
      put(e.x - 2, e.y, "▐", R, G, B);
      put(e.x - 1, e.y, "█", R, G, B);
      put(e.x, e.y, "█", R, G, B);
      put(e.x + 1, e.y, "█", R, G, B);
      put(e.x + 2, e.y, "▌", R, G, B);
      put(e.x - 1, e.y + 1, "▀", R, G, B);
      put(e.x, e.y + 1, "▄", R, G, B);
      put(e.x + 1, e.y + 1, "▀", R, G, B);
      put(e.x, e.y, "●", 255, 255, 255);

      const barW = 40;
      for (let i = 0; i < barW; i++) {
        const on = i / barW < hpFrac;
        set(W / 2 - barW / 2 + i, 1, "▬", on ? 255 : 50, on ? 60 : 20, on ? 80 : 30);
      }
      set(W / 2 - barW / 2 - 2, 1, "B", 255, 80, 80);
    }
  }

  const p = s.player;
  if (p.invuln === 0 || Math.floor(s.tick / 3) % 2 === 0) {
    put(p.x, p.y - 1, "▲", 120, 255, 220);
    put(p.x - 1, p.y, "◤", 80, 200, 255);
    put(p.x + 1, p.y, "◥", 80, 200, 255);
    put(p.x - 1, p.y + 1, "▄", 60, 120, 200);
    put(p.x, p.y + 1, "█", 100, 200, 255);
    put(p.x + 1, p.y + 1, "▄", 60, 120, 200);
    if (s.tick % 4 < 2) put(p.x, p.y + 2, "·", 255, 180, 80);
    else put(p.x, p.y + 2, "·", 255, 120, 40);

    if (p.shield > 0) {
      const ring: [number, number][] = [
        [-2, 0], [2, 0], [0, -2], [0, 2],
        [-1, -2], [1, -2], [-2, -1], [2, -1], [-2, 1], [2, 1],
      ];
      for (const [dx, dy] of ring) put(p.x + dx, p.y + dy, "·", 120, 200, 255);
    }
  }

  for (const f of s.floats) {
    const a = f.life / 40;
    const startX = f.x - f.text.length / 2;
    for (let i = 0; i < f.text.length; i++) {
      put(
        startX + i,
        f.y,
        f.text[i],
        Math.floor(f.r * a),
        Math.floor(f.g * a),
        Math.floor(f.b * a)
      );
    }
  }

  const hud = ` SCORE ${String(s.score).padStart(6, "0")}   HI ${String(
    s.hiScore
  ).padStart(6, "0")}   WAVE ${s.wave}   `;
  for (let i = 0; i < hud.length; i++) {
    set(2 + i, H - 2, hud[i], 200, 220, 255);
  }

  for (let i = 0; i < p.maxHp; i++) {
    const on = i < p.hp;
    set(2 + i * 2, H - 1, on ? "♥" : "♡", on ? 255 : 80, on ? 80 : 40, on ? 120 : 60);
  }

  for (let i = 0; i < p.shield; i++) {
    set(W - 4 - i * 2, H - 1, "◇", 120, 200, 255);
  }

  const wpn = p.weapon.toUpperCase();
  const wr = p.weapon === "spread" ? 120 : p.weapon === "laser" ? 255 : 120;
  const wg = p.weapon === "spread" ? 220 : p.weapon === "laser" ? 80 : 255;
  const wb = p.weapon === "spread" ? 255 : p.weapon === "laser" ? 255 : 200;
  for (let i = 0; i < wpn.length; i++) {
    set(W / 2 - wpn.length / 2 + i, H - 1, wpn[i], wr, wg, wb);
  }

  if (s.paused) {
    const msg = " PAUSED — press P to resume ";
    for (let i = 0; i < msg.length; i++) {
      set(Math.floor((W - msg.length) / 2) + i, Math.floor(H / 2), msg[i], 255, 255, 120);
    }
  }

  if (!s.running) {
    const msg = " GAME OVER — press R to restart, Q to quit ";
    for (let i = 0; i < msg.length; i++) {
      set(Math.floor((W - msg.length) / 2) + i, Math.floor(H / 2), msg[i], 255, 80, 80);
    }
  }
}