/**
 * 15-bit RGB color helpers: 5 bits per channel = 32 levels per channel.
 * Matches the SNES color space. Snapping a 24-bit hex to 15-bit drops the
 * lower 3 bits of each channel.
 */

export function snapTo15Bit(hex: string): string {
  const n = parseHex(hex);
  const r = snapChannel((n >> 16) & 0xff);
  const g = snapChannel((n >> 8) & 0xff);
  const b = n & 0xff;
  return toHex(r, g, b);
}

function snapChannel(c: number): number {
  // Drop lower 3 bits (5-bit precision), then expand back to 8 bits using
  // the same scheme SNES emulators use: top bits repeated into the bottom.
  const five = c >> 3;
  return (five << 3) | (five >> 2);
}

export function parseHex(hex: string): number {
  const h = hex.startsWith("#") ? hex.slice(1) : hex;
  return parseInt(h, 16);
}

export function hexToRgb(hex: string): [number, number, number] {
  const n = parseHex(hex);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

export function toHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
}

export function hsvToHex(h: number, s: number, v: number): string {
  // h in [0,360), s and v in [0,1]
  const c = v * s;
  const hh = (h / 60) % 6;
  const x = c * (1 - Math.abs((hh % 2) - 1));
  const m = v - c;
  let r = 0,
    g = 0,
    b = 0;
  if (hh < 1) [r, g, b] = [c, x, 0];
  else if (hh < 2) [r, g, b] = [x, c, 0];
  else if (hh < 3) [r, g, b] = [0, c, x];
  else if (hh < 4) [r, g, b] = [0, x, c];
  else if (hh < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return toHex(Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255));
}

export function hexToHsv(hex: string): { h: number; s: number; v: number } {
  const [r, g, b] = hexToRgb(hex).map((c) => c / 255) as [number, number, number];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : d / max, v: max };
}
