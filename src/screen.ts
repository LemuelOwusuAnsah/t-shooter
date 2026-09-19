export const W = 76;
export const H = 34;

export type Cell = { ch: string; r: number; g: number; b: number };

export const buf: Cell[] = Array.from({ length: W * H }, () => ({
  ch: " ",
  r: 0,
  g: 0,
  b: 0,
}));

export function set(
  x: number,
  y: number,
  ch: string,
  r: number,
  g: number,
  b: number
): void {
  x = Math.round(x);
  y = Math.round(y);
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  buf[y * W + x] = { ch, r, g, b };
}

export function render(): void {
  let out = "\x1b[H";
  let lastCol = "";

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const c = buf[y * W + x];
      const col = `\x1b[38;2;${c.r};${c.g};${c.b}m`;
      if (col !== lastCol) {
        out += col;
        lastCol = col;
      }
      out += c.ch;
      buf[y * W + x] = { ch: " ", r: 0, g: 0, b: 0 };
    }
    out += "\n";
  }

  process.stdout.write(out);
}

export function enterAltScreen(): void {
  process.stdout.write("\x1b[2J\x1b[?25l");
}

export function leaveAltScreen(): void {
  process.stdout.write("\x1b[?25h\x1b[2J\x1b[H");
}