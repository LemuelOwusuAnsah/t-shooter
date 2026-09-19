import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import { WebSocketServer, WebSocket } from "ws";
import { ansiToHtml } from "./ansi-to-html";

const PORT = 3000;

let currentClient: WebSocket | null = null;
let lastFrameHtml = "";

export function startServer(): void {
  const htmlPath = path.resolve(__dirname, "..", "public", "index.html");
  const html = fs.readFileSync(htmlPath, "utf8");

  const server = http.createServer((req, res) => {
    if (req.url === "/" || req.url === "/index.html") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
      return;
    }
    res.writeHead(404);
    res.end("not found");
  });

  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    currentClient = ws;
    if (lastFrameHtml) {
      ws.send(lastFrameHtml);
    }

    ws.on("message", (data) => {
      let msg: { type?: string; name?: string };
      try {
        msg = JSON.parse(data.toString());
      } catch {
        return;
      }
      if (!msg.type || !msg.name) return;
      const evtName = msg.type === "keydown" ? "keypress" : "keyrelease";
      emitFakeKeypress(msg.name, evtName);
    });

    ws.on("close", () => {
      if (currentClient === ws) currentClient = null;
    });
  });

  server.listen(PORT, () => {
    process.stderr.write(`\n  Shooter server running:  http://localhost:${PORT}\n\n`);
    process.stderr.write(`  Open that URL in your browser, then click the page and play.\n\n`);
  });

  installStdoutShim();
}

function installStdoutShim(): void {
  const realWrite = process.stdout.write.bind(process.stdout);

  let frameBuf = "";

  (process.stdout as unknown as { write: (chunk: string) => boolean }).write = (
    chunk: string
  ): boolean => {
    if (typeof chunk !== "string") return true;

    if (chunk.startsWith("\x1b[2J") || chunk.startsWith("\x1b[?25")) {
      // cursor-control sequences — swallow for the browser
      return true;
    }

    frameBuf += chunk;

    if (frameBuf.length > 64 * 1024) frameBuf = frameBuf.slice(-32 * 1024);

    if (currentClient && currentClient.readyState === WebSocket.OPEN) {
      const lines = frameBuf.split("\n");
      if (lines.length >= 34) {
        lastFrameHtml = ansiToHtml(frameBuf);
        currentClient.send(lastFrameHtml);
        frameBuf = "";
      }
    }

    return true;
  };

  void realWrite;
}

type FakeKey = {
  sequence: string;
  name: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
  type: string;
};

function emitFakeKeypress(name: string, type: string): void {
  const fake: FakeKey = {
    sequence: keySequenceFor(name),
    name,
    ctrl: false,
    meta: false,
    shift: false,
    type,
  };
  process.stdin.emit("keypress", fake.sequence, fake);
}

function keySequenceFor(name: string): string {
  switch (name) {
    case "left": return "\x1b[D";
    case "right": return "\x1b[C";
    case "up": return "\x1b[A";
    case "down": return "\x1b[B";
    case "space": return " ";
    default: return name;
  }
}