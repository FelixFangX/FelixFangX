import { mkdir, writeFile } from "node:fs/promises";
import { THEMES, FONT, MONO } from "./theme.mjs";
import { svg, esc } from "./svg.mjs";

const cards = [
  { id: "convert", label: "01 · CONVERT", title: "convert.ledring.dev", lines: ["Drop an XMind or Yuque Lakeboard mind map, get Markdown.", "Runs in the browser. Nothing is uploaded."], foot: "↗ convert.ledring.dev" },
  { id: "npm", label: "02 · CLI + MCP", title: "lakeboard-converter", lines: ["The same converter as a CLI and a read-only MCP server."], command: "$ npx -y lakeboard-converter mcp", foot: "↗ npm" },
  { id: "research", label: "03 · RESEARCH", title: "research.ledring.dev", lines: ["Turns a vague research interest into directions", "backed by OpenAlex evidence."], foot: "↗ research.ledring.dev" },
  { id: "play", label: "04 · GAME", title: "LEDRING Play", lines: ["Watch an AI builder make a web page", "and decide what gets through."], foot: "↗ play.ledring.dev" },
  { id: "source", label: "05 · SOURCE", title: "FelixFangX/ledring", lines: ["The game and the toolkit behind it:", "agent traces as branch trees, drift scores."], foot: "↗ github.com/FelixFangX/ledring" },
  { id: "site", label: "06 · SITE", title: "ledring.dev", lines: ["My site, in English and 中文."], foot: "↗ ledring.dev" },
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
