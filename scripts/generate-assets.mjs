// Generates the profile SVGs (banner + project cards), in light and dark.
// Usage: node scripts/generate-assets.mjs   (writes to assets/ at the repo root)
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "assets");
mkdirSync(out, { recursive: true });

const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";

const THEMES = {
  light: {
    bg: "#F4F9FD", panel: "#FFFFFF", border: "#CFE2F0", ink: "#0E2233", muted: "#48606F",
    accent: "#2E9BDA", accentText: "#1A6FA6", faint: "#DCEAF4", chipBg: "#EAF4FB", chipInk: "#17557F",
    states: { live: "#1F8A4C", demo: "#1A6FA6", confidential: "#5B6B78", progress: "#A8650A" },
  },
  dark: {
    bg: "#0D1722", panel: "#132130", border: "#22394D", ink: "#E8F0F6", muted: "#A3B6C5",
    accent: "#2E9BDA", accentText: "#6CBDEA", faint: "#1B2D3E", chipBg: "#16293A", chipInk: "#9AD0F0",
    states: { live: "#56C98A", demo: "#6CBDEA", confidential: "#A3B6C5", progress: "#E5A84B" },
  },
};

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ---------------------------------------------------------------- banner */

function banner(t) {
  const W = 900, H = 380;
  // sensor nodes on the "map" (left / bottom), converging on the interface (right)
  const nodes = [
    [70, 268], [150, 318], [232, 262], [318, 322], [396, 270], [470, 330],
    [520, 252], [560, 150], [596, 302], [600, 66],
  ];
  const hub = [668, 196]; // left edge of the interface window
  const links = nodes.map(([x, y]) => {
    const mx = (x + hub[0]) / 2;
    return `<path d="M${x} ${y} C ${mx} ${y}, ${mx} ${hub[1]}, ${hub[0]} ${hub[1]}"/>`;
  }).join("");
  // neighbour links: the sensor network itself
  const mesh = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [4, 6], [5, 8], [6, 8], [6, 7], [7, 9]]
    .map(([a, b]) => `<line x1="${nodes[a][0]}" y1="${nodes[a][1]}" x2="${nodes[b][0]}" y2="${nodes[b][1]}"/>`).join("");
  const dots = nodes.map(([x, y]) =>
    `<circle cx="${x}" cy="${y}" r="9" fill="${t.accent}" opacity="0.18"/><circle cx="${x}" cy="${y}" r="4" fill="${t.accent}"/>`).join("");
  // contour lines suggesting terrain
  const contours = [
    "M-20 300 C 120 230, 260 350, 420 290 S 640 230, 720 330",
    "M-20 336 C 140 270, 280 388, 440 326 S 620 280, 700 372",
    "M-20 262 C 110 196, 250 308, 400 252 S 560 190, 640 250",
    "M470 30 C 540 60, 560 110, 520 160 S 560 230, 640 215",
    "M520 10 C 600 40, 620 100, 580 150 S 600 200, 660 188",
  ].map((d) => `<path d="${d}"/>`).join("");

  const wx = 668, wy = 96, ww = 196, wh = 200;
  const bars = [38, 62, 48, 80, 58, 92].map((h, i) =>
    `<rect x="${wx + 20 + i * 27}" y="${wy + 122 - h}" width="17" height="${h}" rx="3" fill="${t.accent}" opacity="${0.45 + i * 0.1}"/>`).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="t d">
<title id="t">Jancy Koud Banga — Software engineer</title>
<desc id="d">Sensor data platforms, business applications, applied generative AI. Clermont-Ferrand, France. Illustration: sensors on a map linked to an interface.</desc>
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="18" fill="${t.bg}" stroke="${t.border}" stroke-width="2"/>
<clipPath id="c"><rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="17"/></clipPath>
<g clip-path="url(#c)">
  <g fill="none" stroke="${t.faint}" stroke-width="2">${contours}</g>
  <g fill="none" stroke="${t.accent}" stroke-width="1.5" opacity="0.35" stroke-dasharray="2 6" stroke-linecap="round">${mesh}</g>
  <g fill="none" stroke="${t.accent}" stroke-width="1.6" opacity="0.55">${links}</g>
  ${dots}
  <rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" rx="12" fill="${t.panel}" stroke="${t.border}" stroke-width="2"/>
  <line x1="${wx}" y1="${wy + 30}" x2="${wx + ww}" y2="${wy + 30}" stroke="${t.border}" stroke-width="2"/>
  <circle cx="${wx + 18}" cy="${wy + 15}" r="4" fill="${t.accent}"/>
  <rect x="${wx + 32}" y="${wy + 11}" width="70" height="8" rx="4" fill="${t.faint}"/>
  ${bars}
  <line x1="${wx + 16}" y1="${wy + 122}" x2="${wx + ww - 16}" y2="${wy + 122}" stroke="${t.border}" stroke-width="2"/>
  <rect x="${wx + 16}" y="${wy + 140}" width="118" height="9" rx="4.5" fill="${t.faint}"/>
  <rect x="${wx + 16}" y="${wy + 160}" width="84" height="9" rx="4.5" fill="${t.faint}"/>
  <rect x="${wx + 132}" y="${wy + 154}" width="48" height="22" rx="11" fill="${t.accent}"/>
  <circle cx="${hub[0]}" cy="${hub[1]}" r="6" fill="${t.panel}" stroke="${t.accent}" stroke-width="3"/>
</g>
<text x="48" y="98" font-family="${SANS}" font-size="52" font-weight="700" fill="${t.ink}" letter-spacing="-1">Jancy Koud Banga</text>
<rect x="50" y="118" width="56" height="5" rx="2.5" fill="${t.accent}"/>
<text font-family="${SANS}" font-size="23" fill="${t.ink}">
  <tspan x="48" y="160" font-weight="600">Software engineer · sensor data platforms,</tspan>
  <tspan x="48" y="191">business applications, applied generative AI</tspan>
</text>
<text x="48" y="226" font-family="${MONO}" font-size="19" fill="${t.accentText}">Clermont-Ferrand, France</text>
</svg>
`;
}

/* ----------------------------------------------------------------- cards */

// Compact cards are drawn 420 wide and shown 400 wide in the README, so two sit
// side by side on desktop and one fills a phone screen. DECLIC also has a wide
// variant (844 wide, shown 804 wide: same scale, same height) for the first row.
const CARD_W = 420, WIDE_W = 844, CARD_H = 188, PAD = 20;
const STATE_LABELS = { confidential: "CONFIDENTIAL", live: "LIVE", demo: "DEMO", progress: "IN PROGRESS" };
const MAX_CHIPS = 5;

const CARDS = [
  { id: "declic", state: "confidential", name: "DECLIC", cta: "Case study",
    tagline: "Cataloguing connected scientific instruments",
    wideTagline: "Declaring and cataloguing connected scientific instruments",
    lines: ["4-step declaration flow, moderated before publication.", "Catalogue of 53 LoRaWAN instrument models, OIDC sign-in."],
    chips: ["React", "TypeScript", "Express", "Prisma", "PostgreSQL"] },
  { id: "esge-domicile", state: "live", name: "ESGE Domicile", cta: "Open the app",
    tagline: "Home services, from quote to invoice",
    lines: ["Three workspaces: clients, providers, and the team.", "Row Level Security, ~230 Playwright tests."],
    chips: ["Next.js", "React", "TypeScript", "Supabase", "Playwright"] },
  { id: "akili", state: "demo", name: "Akili", cta: "Open the demo",
    tagline: "School management for several schools at once",
    lines: ["One platform for multiple schools, usable offline.", "Five user roles."],
    chips: ["React", "TypeScript", "Express", "Prisma", "PostgreSQL"] },
  { id: "akili-universite", state: "demo", name: "Akili Université", cta: "Open the demo",
    tagline: "Akili for higher education",
    lines: ["The edition of the Akili school management", "platform adapted to universities."],
    chips: ["React", "TypeScript", "Express", "Prisma", "PostgreSQL"] },
  { id: "orient-ex", state: "live", name: "Orient'Ex", cta: "Open the app",
    tagline: "Volunteer mentoring platform",
    lines: ["Puts students and young professionals in touch", "with volunteer mentors."],
    chips: ["Nuxt.js", "MySQL", "Docker", "GitLab CI/CD"] },
  { id: "vy", state: "live", name: "VY", cta: "Open the app",
    tagline: "Online store for print-on-demand clothing",
    lines: ["A clothing store where each item is printed", "only once it has been ordered."],
    chips: ["Next.js"] },
  { id: "carhilo", state: "progress", name: "Carhilo", cta: null,
    tagline: "Carpooling, built test-first",
    lines: ["A carpooling app written in Flutter,", "with development driven by tests."],
    chips: ["Flutter", "Test-driven"] },
];

// Monospace advance is ~0.6em in every fallback of the MONO stack; 0.62 keeps a margin.
const monoWidth = (txt, size, spacing = 0) => txt.length * (size * 0.62 + spacing);

/** Pill sized from its text, text centred: the inner margin is equal on both sides. */
function pill(x, y, txt, { size, h, padX, spacing = 0, fill, stroke, ink, weight = 400 }) {
  const w = Math.ceil(monoWidth(txt, size, spacing) + padX * 2);
  const svg = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}"/>` +
    `<text x="${x + w / 2}" y="${y + h / 2 + size * 0.35}" text-anchor="middle" font-family="${MONO}" font-size="${size}" font-weight="${weight}" letter-spacing="${spacing}" fill="${ink}">${esc(txt)}</text>`;
  return { svg, w };
}

/** The 4 declaration steps, then moderation, then publication (wide DECLIC card only). */
function declicFlow(t, x0, y) {
  const step = 44, r = 13;
  let s = `<line x1="${x0}" y1="${y}" x2="${x0 + step * 5}" y2="${y}" stroke="${t.accent}" stroke-width="1.6" opacity="0.55"/>`;
  for (let i = 0; i < 4; i++) {
    const cx = x0 + i * step;
    s += `<circle cx="${cx}" cy="${y}" r="${r}" fill="${t.panel}" stroke="${t.accent}" stroke-width="1.6"/>` +
      `<text x="${cx}" y="${y + 4.5}" text-anchor="middle" font-family="${MONO}" font-size="12.5" font-weight="600" fill="${t.accentText}">${i + 1}</text>`;
  }
  const mx = x0 + 4 * step, px = x0 + 5 * step;
  s += `<rect x="${mx - r}" y="${y - r}" width="${r * 2}" height="${r * 2}" rx="6" fill="${t.panel}" stroke="${t.accent}" stroke-width="1.6"/>` +
    `<path d="M${mx - 5} ${y} l4 4 l7 -8" fill="none" stroke="${t.accentText}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<circle cx="${px}" cy="${y}" r="${r}" fill="${t.accent}"/><circle cx="${px}" cy="${y}" r="4.5" fill="${t.panel}"/>`;
  const label = (cx, txt) => `<text x="${cx}" y="${y + 34}" text-anchor="middle" font-family="${MONO}" font-size="11" fill="${t.muted}">${txt}</text>`;
  s += label(x0 + step * 1.5, "4 steps") + label(mx - 6, "moderation") + label(px + 30, "published");
  return s;
}

function card(c, t, wide = false) {
  if (c.chips.length > MAX_CHIPS) throw new Error(`${c.id}: more than ${MAX_CHIPS} chips`);
  const W = wide ? WIDE_W : CARD_W, H = CARD_H;
  const sc = t.states[c.state], label = STATE_LABELS[c.state];
  const state = pill(PAD, 18, label, { size: 10.5, h: 22, padX: 11, spacing: 0.5, fill: t.panel, stroke: sc, ink: sc, weight: 600 });
  let x = PAD;
  const chips = c.chips.map((txt) => {
    const chip = pill(x, 148, txt, { size: 11.5, h: 22, padX: 7, fill: t.chipBg, stroke: t.border, ink: t.chipInk });
    x += chip.w + 5;
    return chip.svg;
  }).join("");
  if (x - 5 > CARD_W - PAD) throw new Error(`${c.id}: chips do not fit on one line`);
  const tagline = wide && c.wideTagline ? c.wideTagline : c.tagline;
  const desc = `${label.toLowerCase()}. ${tagline}. ${c.lines.join(" ")} Built with ${c.chips.join(", ")}.`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="t d">
<title id="t">${esc(c.name)}</title>
<desc id="d">${esc(desc)}</desc>
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="12" fill="${t.bg}" stroke="${t.border}" stroke-width="1.5"/>
<rect x="1" y="50" width="4" height="40" rx="2" fill="${t.accent}"/>
${state.svg}
${c.cta ? `<text class="cta" x="${W - PAD}" y="33" text-anchor="end" font-family="${SANS}" font-size="12" font-weight="600" fill="${t.accentText}">${esc(c.cta)} →</text>` : ""}
<text x="${PAD}" y="70" font-family="${SANS}" font-size="20" font-weight="700" fill="${t.ink}" letter-spacing="-0.3">${esc(c.name)}</text>
<text x="${PAD}" y="90" font-family="${SANS}" font-size="13.5" font-weight="600" fill="${t.accentText}">${esc(tagline)}</text>
<text font-family="${SANS}" font-size="13.5" fill="${t.muted}">
  <tspan x="${PAD}" y="113">${esc(c.lines[0])}</tspan>
  <tspan x="${PAD}" y="131">${esc(c.lines[1])}</tspan>
</text>
${chips}
${wide ? declicFlow(t, 548, 92) : ""}
</svg>
`;
}

for (const [name, t] of Object.entries(THEMES)) {
  writeFileSync(join(out, `banner-${name}.svg`), banner(t));
  for (const c of CARDS) writeFileSync(join(out, `card-${c.id}-${name}.svg`), card(c, t));
  writeFileSync(join(out, `card-declic-wide-${name}.svg`), card(CARDS[0], t, true));
}
console.log("ok");
