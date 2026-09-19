import { W, H } from "./screen";
import { keys } from "./input";
import type {
  Player,
  Bullet,
  Enemy,
  Particle,
  PowerUp,
  FloatText,
} from "./types";
import { burst } from "./particles";

export type UpdateCtx = {
  player: Player;
  bullets: Bullet[];
  enemies: Enemy[];
  particles: Particle[];
  powerups: PowerUp[];
  floats: FloatText[];
  score: number;
  running: boolean;
  shakeMag: number;
  shakeT: number;
};

export type UpdateResult = {
  player: Player;
  bullets: Bullet[];
  enemies: Enemy[];
  particles: Particle[];
  powerups: PowerUp[];
  floats: FloatText[];
  score: number;
  running: boolean;
  shakeMag: number;
  shakeT: number;
};

export function updateWorld(ctx: UpdateCtx): UpdateResult {
  const p = { ...ctx.player };
  let bullets = ctx.bullets.slice();
  let enemies = ctx.enemies.slice();
  let particles = ctx.particles.slice();
  let powerups = ctx.powerups.slice();
  let floats = ctx.floats.slice();
  let score = ctx.score;
  let running = ctx.running;
  let shakeMag = ctx.shakeMag;
  let shakeT = ctx.shakeT;

  const accel = 0.45;
  const friction = 0.82;
  const maxSpeed = 0.75;
  let ax = 0;
  let ay = 0;
  if (keys["left"] || keys["a"]) ax -= 1;
  if (keys["right"] || keys["d"]) ax += 1;
  if (keys["up"] || keys["w"]) ay -= 1;
  if (keys["down"] || keys["s"]) ay += 1;
  p.vx = (p.vx + ax * accel) * friction;
  p.vy = (p.vy + ay * accel) * friction;
  p.vx = Math.max(-maxSpeed, Math.min(maxSpeed, p.vx));
  p.vy = Math.max(-maxSpeed, Math.min(maxSpeed, p.vy));
  p.x += p.vx;
  p.y += p.vy;
  p.x = Math.max(2, Math.min(W - 3, p.x));
  p.y = Math.max(2, Math.min(H - 3, p.y));

  if (p.cooldown > 0) p.cooldown--;
  if (p.weaponT > 0) {
    p.weaponT--;
    if (p.weaponT === 0) p.weapon = "normal";
  }
  if (p.invuln > 0) p.invuln--;

  if (keys["space"] && p.cooldown === 0) {
    const cx = p.x;
    const cy = p.y - 1;
    if (p.weapon === "spread") {
      for (const dx of [-1.2, -0.6, 0, 0.6, 1.2]) {
        bullets.push({
          x: cx,
          y: cy,
          vx: dx * 0.18,
          vy: -1.1,
          dmg: 1,
          r: 120,
          g: 220,
          b: 255,
          ch: "|",
          friendly: true,
        });
      }
      p.cooldown = 6;
    } else if (p.weapon === "laser") {
      bullets.push({
        x: cx,
        y: cy,
        vx: 0,
        vy: -2.2,
        dmg: 4,
        r: 255,
        g: 80,
        b: 255,
        ch: "‖",
        friendly: true,
      });
      p.cooldown = 5;
    } else {
      bullets.push({
        x: cx - 1,
        y: cy,
        vx: 0,
        vy: -1.4,
        dmg: 1,
        r: 120,
        g: 255,
        b: 200,
        ch: "|",
        friendly: true,
      });
      bullets.push({
        x: cx + 1,
        y: cy,
        vx: 0,
        vy: -1.4,
        dmg: 1,
        r: 120,
        g: 255,
        b: 200,
        ch: "|",
        friendly: true,
      });
      p.cooldown = 8;
    }
    particles = particles.concat(burst(cx, cy, 180, 255, 220, 3, 0.15));
  }

  for (const b of bullets) {
    b.x += b.vx;
    b.y += b.vy;
  }

  for (const e of enemies) {
    e.patternT++;
    if (e.kind === "grunt") {
      e.vy = 0.06;
      e.y += e.vy;
    } else if (e.kind === "weaver") {
      e.vy = 0.05;
      e.y += e.vy;
      e.x += Math.sin(e.patternT * 0.08) * 0.35;
      e.x = Math.max(2, Math.min(W - 3, e.x));
    } else if (e.kind === "tank") {
      e.y += e.vy;
      e.x += Math.sign(p.x - e.x) * 0.04;
    } else if (e.kind === "boss") {
      if (e.y < 6) e.y += 0.03;
      else {
        e.x += Math.sin(e.patternT * 0.02) * 0.2;
        e.x = Math.max(6, Math.min(W - 7, e.x));
      }
      e.x += Math.sign(W / 2 - e.x) * 0.01;
    }

    e.fireTimer--;
    if (e.fireTimer <= 0 && e.y > 0 && e.y < H - 2) {
      if (e.kind === "grunt") {
        const dx = p.x - e.x;
        const dy = p.y - e.y;
        const d = Math.hypot(dx, dy) || 1;
        bullets.push({
          x: e.x,
          y: e.y,
          vx: (dx / d) * 0.35,
          vy: (dy / d) * 0.35,
          dmg: 1,
          r: 255,
          g: 120,
          b: 60,
          ch: "•",
          friendly: false,
        });
        e.fireTimer = 70 + Math.random() * 40;
      } else if (e.kind === "weaver") {
        for (let i = -1; i <= 1; i++) {
          bullets.push({
            x: e.x,
            y: e.y,
            vx: i * 0.22,
            vy: 0.45,
            dmg: 1,
            r: 255,
            g: 200,
            b: 80,
            ch: "•",
            friendly: false,
          });
        }
        e.fireTimer = 90;
      } else if (e.kind === "tank") {
        const n = 8;
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2 + e.patternT * 0.02;
          bullets.push({
            x: e.x,
            y: e.y,
            vx: Math.cos(a) * 0.3,
            vy: Math.sin(a) * 0.3,
            dmg: 1,
            r: 255,
            g: 140,
            b: 40,
            ch: "*",
            friendly: false,
          });
        }
        e.fireTimer = 110;
      } else if (e.kind === "boss") {
        const hpFrac = e.hp / e.maxHp;
        const phase = hpFrac > 0.66 ? 0 : hpFrac > 0.33 ? 1 : 2;
        if (phase === 0) {
          for (let i = -3; i <= 3; i++) {
            bullets.push({
              x: e.x,
              y: e.y,
              vx: i * 0.12,
              vy: 0.42,
              dmg: 1,
              r: 255,
              g: 60,
              b: 120,
              ch: "•",
              friendly: false,
            });
          }
          e.fireTimer = 45;
        } else if (phase === 1) {
          const n = 14;
          for (let i = 0; i < n; i++) {
            const a = (i / n) * Math.PI * 2 + e.patternT * 0.05;
            bullets.push({
              x: e.x,
              y: e.y,
              vx: Math.cos(a) * 0.35,
              vy: Math.sin(a) * 0.35,
              dmg: 1,
              r: 255,
              g: 100,
              b: 200,
              ch: "*",
              friendly: false,
            });
          }
          e.fireTimer = 55;
        } else {
          const dx = p.x - e.x;
          const dy = p.y - e.y;
          const d = Math.hypot(dx, dy) || 1;
          for (let i = -1; i <= 1; i++) {
            const a = Math.atan2(dy, dx) + i * 0.2;
            bullets.push({
              x: e.x,
              y: e.y,
              vx: Math.cos(a) * 0.5,
              vy: Math.sin(a) * 0.5,
              dmg: 1,
              r: 255,
              g: 40,
              b: 40,
              ch: "•",
              friendly: false,
            });
          }
          const a2 = e.patternT * 0.15;
          bullets.push({
            x: e.x,
            y: e.y,
            vx: Math.cos(a2) * 0.3,
            vy: Math.sin(a2) * 0.3,
            dmg: 1,
            r: 255,
            g: 40,
            b: 40,
            ch: "•",
            friendly: false,
          });
          e.fireTimer = 22;
        }
      }
    }
  }

  const hitBullets = new Set<number>();
  for (let bi = 0; bi < bullets.length; bi++) {
    const b = bullets[bi];
    if (b.friendly) {
      for (const e of enemies) {
        if (Math.hypot(b.x - e.x, b.y - e.y) < e.radius + 0.5) {
          e.hp -= b.dmg;
          hitBullets.add(bi);
          particles = particles.concat(burst(b.x, b.y + 1, 255, 255, 180, 4, 0.2));
          break;
        }
      }
    } else if (p.invuln <= 0 && Math.hypot(b.x - p.x, b.y - p.y) < 0.9) {
      hitBullets.add(bi);
      if (p.shield > 0) {
        p.shield--;
        particles = particles.concat(burst(p.x, p.y, 120, 200, 255, 10, 0.3));
      } else {
        p.hp--;
        p.invuln = 45;
        shakeMag = Math.max(shakeMag, 1);
        shakeT = Math.max(shakeT, 10);
        particles = particles.concat(burst(p.x, p.y, 255, 80, 80, 12, 0.4));
        floats.push({
          x: p.x,
          y: p.y,
          text: "-1",
          life: 30,
          r: 255,
          g: 80,
          b: 80,
        });
        if (p.hp <= 0) {
          running = false;
          shakeMag = 2;
          shakeT = 30;
          particles = particles.concat(burst(p.x, p.y, 255, 200, 80, 40, 0.9));
        }
      }
    }
  }
  bullets = bullets.filter((b, i) => !hitBullets.has(i));

  enemies = enemies.filter((e) => {
    if (e.hp <= 0) {
      const isBoss = e.kind === "boss";
      particles = particles.concat(
        burst(e.x, e.y, e.r, e.g, e.b, isBoss ? 60 : 18, isBoss ? 1.0 : 0.5)
      );
      if (isBoss) {
        shakeMag = Math.max(shakeMag, 2);
        shakeT = Math.max(shakeT, 25);
      }
      score += e.scoreValue;
      floats.push({
        x: e.x,
        y: e.y,
        text: `+${e.scoreValue}`,
        life: 40,
        r: 255,
        g: 255,
        b: 120,
      });
      if (Math.random() < (isBoss ? 1 : 0.12)) {
        const kinds: PowerUp["kind"][] = ["spread", "laser", "shield", "heal"];
        const k = isBoss
          ? "spread"
          : kinds[Math.floor(Math.random() * kinds.length)];
        powerups.push({ x: e.x, y: e.y, vy: 0.15, kind: k });
      }
      return false;
    }
    if (e.y > H + 3 && e.kind !== "boss") return false;
    return true;
  });

  if (p.invuln <= 0) {
    for (const e of enemies) {
      if (Math.hypot(e.x - p.x, e.y - p.y) < e.radius + 0.8) {
        if (p.shield > 0) {
          p.shield--;
          e.hp -= 3;
          p.invuln = 30;
          particles = particles.concat(burst(p.x, p.y, 120, 200, 255, 14, 0.4));
        } else {
          p.hp--;
          p.invuln = 60;
          shakeMag = Math.max(shakeMag, 1.5);
          shakeT = Math.max(shakeT, 15);
          particles = particles.concat(burst(p.x, p.y, 255, 80, 80, 16, 0.5));
          floats.push({
            x: p.x,
            y: p.y,
            text: "-1",
            life: 30,
            r: 255,
            g: 80,
            b: 80,
          });
          if (p.hp <= 0) {
            running = false;
            shakeMag = 2;
            shakeT = 30;
            particles = particles.concat(burst(p.x, p.y, 255, 200, 80, 40, 0.9));
          }
        }
        break;
      }
    }
  }

  for (const pw of powerups) pw.y += pw.vy;
  powerups = powerups.filter((pw) => {
    if (Math.hypot(pw.x - p.x, pw.y - p.y) < 1.2) {
      if (pw.kind === "spread") {
        p.weapon = "spread";
        p.weaponT = 400;
        floats.push({
          x: pw.x,
          y: pw.y,
          text: "SPREAD",
          life: 40,
          r: 120,
          g: 220,
          b: 255,
        });
      } else if (pw.kind === "laser") {
        p.weapon = "laser";
        p.weaponT = 400;
        floats.push({
          x: pw.x,
          y: pw.y,
          text: "LASER",
          life: 40,
          r: 255,
          g: 80,
          b: 255,
        });
      } else if (pw.kind === "shield") {
        p.shield = Math.min(3, p.shield + 1);
        floats.push({
          x: pw.x,
          y: pw.y,
          text: "SHIELD",
          life: 40,
          r: 120,
          g: 200,
          b: 255,
        });
      } else if (pw.kind === "heal") {
        p.hp = Math.min(p.maxHp, p.hp + 1);
        floats.push({
          x: pw.x,
          y: pw.y,
          text: "+1 HP",
          life: 40,
          r: 120,
          g: 255,
          b: 120,
        });
      }
      particles = particles.concat(burst(pw.x, pw.y, 255, 255, 120, 10, 0.3));
      return false;
    }
    return pw.y < H + 2;
  });

  bullets = bullets.filter((b) => b.y > -2 && b.y < H + 2 && b.x > -2 && b.x < W + 2);

  if (shakeT > 0) {
    shakeT--;
    if (shakeT === 0) shakeMag = 0;
  }

  return {
    player: p,
    bullets,
    enemies,
    particles,
    powerups,
    floats,
    score,
    running,
    shakeMag,
    shakeT,
  };
}