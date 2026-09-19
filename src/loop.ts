import { render } from "./screen";
import { draw } from "./draw";
import { updateWorld } from "./entities";
import { updateParticles, updateFloats } from "./particles";
import type { Star } from "./types";
import type {
  Player,
  Bullet,
  Enemy,
  Particle,
  PowerUp,
  FloatText,
} from "./types";

export type LoopState = {
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
  waveTimer: number;
  running: boolean;
  paused: boolean;
  tick: number;
  shakeMag: number;
  shakeT: number;
};

export type LoopDeps = {
  get: () => LoopState;
  set: (s: LoopState) => void;
  waveEnemies: (wave: number) => Enemy[];
  burst: (
    x: number,
    y: number,
    r: number,
    g: number,
    b: number,
    n: number,
    power: number
  ) => Particle[];
};

const FRAME_MS = 1000 / 60;
const TICK_MS = 1000 / 15;

export function startLoop(deps: LoopDeps): void {
  let last = performance.now();
  let acc = 0;

  function frame(now: number): void {
    const dt = now - last;
    last = now;
    acc += dt;

    while (acc >= TICK_MS) {
      stepGame(deps);
      acc -= TICK_MS;
    }

    const s = deps.get();

    draw({
      player: s.player,
      stars: s.stars,
      bullets: s.bullets,
      enemies: s.enemies,
      particles: s.particles,
      powerups: s.powerups,
      floats: s.floats,
      score: s.score,
      hiScore: s.hiScore,
      wave: s.wave,
      tick: s.tick,
      running: s.running,
      paused: s.paused,
      shakeMag: s.shakeMag,
    });

    render();

    setTimeout(() => frame(performance.now()), FRAME_MS);
  }

  frame(performance.now());
}

function stepGame(deps: LoopDeps): void {
  const s = deps.get();
  s.tick++;

  if (!s.running) {
    s.particles = updateParticles(s.particles);
    s.floats = updateFloats(s.floats);
    if (s.hiScore < s.score) s.hiScore = s.score;
    deps.set(s);
    return;
  }

  if (s.paused) return;

  for (const st of s.stars) {
    st.y += st.speed;
    if (st.y >= 34) {
      st.y = 0;
      st.x = Math.random() * 76;
    }
  }

  const result = updateWorld({
    player: s.player,
    bullets: s.bullets,
    enemies: s.enemies,
    particles: s.particles,
    powerups: s.powerups,
    floats: s.floats,
    score: s.score,
    running: s.running,
    shakeMag: s.shakeMag,
    shakeT: s.shakeT,
  });

  s.player = result.player;
  s.bullets = result.bullets;
  s.enemies = result.enemies;
  s.particles = result.particles;
  s.powerups = result.powerups;
  s.floats = result.floats;
  s.score = result.score;
  s.running = result.running;
  s.shakeMag = result.shakeMag;
  s.shakeT = result.shakeT;

  if (s.enemies.length === 0) {
    s.waveTimer--;
    if (s.waveTimer <= 0) {
      s.wave++;
      s.enemies = deps.waveEnemies(s.wave);
      s.waveTimer = 180;
    }
  }

  s.particles = updateParticles(s.particles);
  s.floats = updateFloats(s.floats);

  deps.set(s);
}