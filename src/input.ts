import * as readline from "readline";

export const keys: Record<string, boolean> = {};

type KeyWithType = readline.Key & { type?: string };

let onQuit: () => void = () => process.exit(0);
let onRestart: () => void = () => {};
let isRunning: () => boolean = () => true;
let isPaused: () => boolean = () => false;
let togglePause: () => void = () => {};

export function configureInput(callbacks: {
  quit: () => void;
  restart: () => void;
  isRunning: () => boolean;
  isPaused: () => boolean;
  togglePause: () => void;
}): void {
  onQuit = callbacks.quit;
  onRestart = callbacks.restart;
  isRunning = callbacks.isRunning;
  isPaused = callbacks.isPaused;
  togglePause = callbacks.togglePause;
}

export function initInput(): void {
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);

  process.stdin.on("keypress", (_str: string, key: KeyWithType) => {
    if (key.ctrl && key.name === "c") {
      onQuit();
      return;
    }

    const name = key.name ?? "";

    if (key.type === "keyrelease") {
      keys[name] = false;
      return;
    }

    keys[name] = true;

    if (name === "q" && !isRunning()) {
      onQuit();
    } else if (name === "r" && !isRunning()) {
      onRestart();
    } else if (name === "p" && isRunning()) {
      togglePause();
    }
  });
}

export function shutdownInput(): void {
  if (process.stdin.isTTY) process.stdin.setRawMode(false);
}