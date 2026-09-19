type Span = { text: string; r: number; g: number; b: number };

export function ansiToHtml(input: string): string {
  const spans: Span[] = [];
  let r = 255;
  let g = 255;
  let b = 255;

  let i = 0;
  let current = "";

  const flush = () => {
    if (current.length > 0) {
      spans.push({ text: current, r, g, b });
      current = "";
    }
  };

  while (i < input.length) {
    const ch = input[i];

    if (ch === "\x1b") {
      const m = input.slice(i).match(/^\x1b\[38;2;(\d+);(\d+);(\d+)m/);
      if (m) {
        flush();
        r = parseInt(m[1], 10);
        g = parseInt(m[2], 10);
        b = parseInt(m[3], 10);
        i += m[0].length;
        continue;
      }
      const simple = input.slice(i).match(/^\x1b\[[0-9;?]*[A-Za-z]/);
      if (simple) {
        i += simple[0].length;
        continue;
      }
      i += 1;
      continue;
    }

    current += ch;
    i += 1;
  }

  flush();

  let html = "";
  for (const s of spans) {
    const color = `rgb(${s.r},${s.g},${s.b})`;
    const escaped = escapeHtml(s.text);
    html += `<span style="color:${color}">${escaped}</span>`;
  }
  return html;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/ /g, "&nbsp;");
}