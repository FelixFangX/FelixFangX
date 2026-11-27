import { mkdir, writeFile } from "node:fs/promises";
import { THEMES, FONT, MONO } from "./theme.mjs";
import { svg, esc } from "./svg.mjs";

const cards = [
  { id: "maptaste", label: "01 · MAP TASTE", title: "maptaste", lines: ["Named MapLibre cartographic plates — CLI, MCP, and Skills."], command: "$ npx maptaste check style.json --taste ink-paper", foot: "↗ maptaste.ledring.dev" },
  { id: "dashtaste", label: "02 · DASH TASTE", title: "dashtaste", lines: ["38 ECharts dashboard taste rules — CLI, MCP, and Skills."], command: "$ npx dashtaste check dashboard.json --taste saas-dense", foot: "↗ dashtaste.ledring.dev" },
  { id: "play", label: "03 · GAME", title: "LEDRING Play", lines: ["Watch an AI builder make a web page", "and decide what gets through."], foot: "↗ play.ledring.dev" },
  { id: "source", label: "04 · SOURCE", title: "FelixFangX/ledring", lines: ["The game and the toolkit behind it:", "agent traces as branch trees, drift scores, Red Wall."], foot: "↗ github.com/FelixFangX/ledring" },
  { id: "convert", label: "05 · CONVERT", title: "convert.ledring.dev", lines: ["9 mind-map formats → Markdown, local-first in browser or MCP."], command: "$ npx -y lakeboard-converter mcp", foot: "↗ convert.ledring.dev" },
  { id: "site", label: "06 · STUDIO", title: "ledring.dev", lines: ["Studio home, field notes, and interactive tools", "in English and Chinese (Simplified)."], foot: "↗ ledring.dev" },
];

function renderCard(card, theme) {
  const t = THEMES[theme];
  const accent = theme === "dark" ? "#60a5fa" : "#0969da";
  return svg({
    w: 600, h: 180,
    title: `${card.label}: ${card.title}`,
    desc: [...card.lines, card.command, card.foot].filter(Boolean).join(" "),
    style: "",
    body: `<defs><clipPath id="card"><rect x="0.5" y="0.5" width="599" height="179" rx="10"/></clipPath></defs>
<g clip-path="url(#card)">
<rect width="600" height="180" fill="${t.bg}"/>
<rect width="600" height="34" fill="${t.bar}"/>
<text x="24" y="23" font-family="${MONO}" font-size="13" letter-spacing="3" fill="${t.barText}">${esc(card.label)}</text>
<text x="576" y="23" text-anchor="end" font-family="${MONO}" font-size="13" fill="${accent}">${card.id === "source" ? "○ REPO" : "● LIVE"}</text>
<text x="24" y="73" ${FONT} font-size="32" font-weight="700" fill="${t.text}">${esc(card.title)}</text>
${card.lines.map((line, i) => `<text x="24" y="${101 + i * 24}" font-size="18" fill="${t.dim}">${esc(line)}</text>`).join("\n")}
${card.command ? `<rect x="24" y="112" width="552" height="30" rx="5" fill="${t.bar}" stroke="${t.line}"/>
<text x="36" y="132" font-family="${MONO}" font-size="15" fill="${t.text}">${esc(card.command)}</text>` : ""}
<text x="24" y="165" font-family="${MONO}" font-size="14" fill="${accent}">${esc(card.foot)}</text>
</g>
<rect x="0.5" y="0.5" width="599" height="179" rx="10" fill="none" stroke="${t.line}" stroke-width="1"/>`,
  });
}

const output = new URL("../assets/cards/", import.meta.url);
await mkdir(output, { recursive: true });
for (const card of cards) {
  for (const theme of Object.keys(THEMES)) {
    await writeFile(new URL(`${card.id}-${theme}.svg`, output), renderCard(card, theme));
  }
}
