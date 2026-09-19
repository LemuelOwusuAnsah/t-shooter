\# ASCII Space Shooter



A modern, colorful space shooter that runs entirely in the terminal — or in your browser.



No browser required for the terminal version. No game engine, no assets, no framework. Just TypeScript, ANSI escape codes, and a 60 FPS render loop.



!\[TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178c6?logo=typescript\&logoColor=white)

!\[Node](https://img.shields.io/badge/Node-24-339933?logo=node.js\&logoColor=white)

!\[Platform](https://img.shields.io/badge/Platform-Windows%20Terminal-4D4D4D?logo=windows-terminal\&logoColor=white)



\---



\## What it is



A Gradius/R-Type-style vertical shooter rendered with 24-bit truecolor in the terminal. Parallax starfield, enemy waves, bullet patterns, a multi-phase boss, power-ups, particle explosions, screen shake, and floating damage numbers.



The same game can also stream to your browser via a tiny WebSocket bridge — no rewrite, no canvas, just ANSI frames piped over the wire.



\## Features



\- \*\*60 FPS rendering\*\* decoupled from a 15 TPS logic tick

\- \*\*Truecolor ANSI\*\* (`\\x1b\[38;2;r;g;bm`) — millions of colors

\- \*\*Parallax starfield\*\* with per-star brightness and speed

\- \*\*Four enemy types\*\*: grunts, weavers, tanks, and a phased boss

\- \*\*Boss AI\*\* with three attack phases driven by remaining HP

\- \*\*Power-ups\*\*: spread shot, laser, shield, heal

\- \*\*Combo scoring\*\* with floating damage numbers

\- \*\*Particle system\*\* with velocity, gravity, and fade

\- \*\*Screen shake\*\* on impacts and boss kills

\- \*\*Zero assets\*\* — everything is Unicode glyphs and escape codes

\- \*\*Terminal + browser\*\* from one codebase



\## Controls



| Key | Action |

| --- | --- |

| Arrow keys / WASD | Move |

| Space | Fire (hold to auto-fire) |

| P | Pause |

| R | Restart (after game over) |

| Q | Quit (after game over) |

| Ctrl + C | Force quit |



\## Running it



\### Terminal (Windows Terminal, iTerm, any modern terminal)



```powershell

npm install

npx tsx src\\main.ts

