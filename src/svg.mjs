import { THEMES, FONT, MONO } from "./theme.mjs";
import { SCENES } from "./scenes.mjs";

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const REDUCED = `@media (prefers-reduced-motion: reduce){*{animation:none!important}}`;
const svg = ({ w, h, title, desc, style, body }) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="t d" ${FONT}>
<title id="t">${esc(title)}</title>
<desc id="d">${esc(desc)}</desc>
<style>${style}${REDUCED}</style>
${body}
</svg>
`;

// ---------- scene art (right side of hero, drawn in a 440x250 box) ----------
const ART = {
  "deep-work": (a, t) => {
    const pts = [[40, 60], [160, 30], [280, 70], [400, 40], [100, 160], [220, 140], [340, 180], [60, 230], [190, 220], [310, 240]];
    const edges = [[0, 1], [1, 2], [2, 3], [0, 4], [1, 5], [2, 5], [3, 6], [4, 5], [5, 6], [4, 7], [5, 8], [6, 9], [7, 8], [8, 9]];
    return `${edges.map(([i, j]) => `<line x1="${pts[i][0]}" y1="${pts[i][1]}" x2="${pts[j][0]}" y2="${pts[j][1]}" stroke="${t.faint}"/>`).join("")}
<path class="trace" d="M40 60 L160 30 L220 140 L340 180 L310 240" fill="none" stroke="${a}" stroke-width="2.5" stroke-linecap="round"/>
${pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 ? 4 : 6}" fill="${i % 3 ? t.dim : a}"/>`).join("")}`;
  },
  "live-set": (a, t) => {
    const bars = Array.from({ length: 22 }, (_, i) => `<rect class="eq" style="animation-delay:-${(i * 0.37) % 1.3}s" x="${10 + i * 19}" y="80" width="11" height="150" rx="3" fill="${a}" opacity="${0.45 + (i % 4) * 0.15}"/>`).join("");
    return `<path d="M60 0 L0 230 H120Z" fill="${a}" opacity=".08" class="beam"/><path d="M380 0 L320 230 H440Z" fill="${a}" opacity=".08" class="beam b2"/>${bars}<line x1="0" y1="232" x2="440" y2="232" stroke="${t.faint}"/>`;
  },
  dialogue: (a, t) => `
<g class="msg m1"><rect x="0" y="20" width="250" height="44" rx="14" fill="${t.panel}" stroke="${t.line}"/><text x="18" y="48" fill="${t.text}" font-size="15">What does done look like?</text></g>
<g class="msg m2"><rect x="150" y="84" width="290" height="44" rx="14" fill="${a}" opacity=".18"/><text x="168" y="112" fill="${t.text}" font-size="15">Tests at the seam, passing in CI.</text></g>
<g class="msg m3"><rect x="0" y="148" width="210" height="44" rx="14" fill="${t.panel}" stroke="${t.line}"/><text x="18" y="176" fill="${t.text}" font-size="15">Show me the evidence.</text></g>
<g class="msg m4"><rect x="230" y="212" width="210" height="34" rx="12" fill="${a}" opacity=".18"/><text x="248" y="234" fill="${t.text}" font-size="14" font-family="${MONO}">✓ red → green</text></g>`,
  recovery: (a, t) => [0, 1, 2, 3].map((i) => `<circle class="breathe" style="animation-delay:-${i * 1.5}s" cx="220" cy="125" r="${36 + i * 24}" fill="none" stroke="${a}" opacity="${0.6 - i * 0.12}" stroke-width="2"/>`).join("")
    + `<circle cx="220" cy="125" r="10" fill="${a}"/><text x="220" y="250" text-anchor="middle" fill="${t.dim}" font-size="13" font-family="${MONO}">inhale · hold · exhale</text>`,
  markets: (a, t) => {
    const ys = [180, 170, 185, 150, 160, 120, 135, 100, 115, 80, 95, 60];
    const d = ys.map((y, i) => `${i ? "L" : "M"}${i * 38} ${y}`).join(" ");
    return `${[60, 120, 180].map((y) => `<line x1="0" y1="${y}" x2="440" y2="${y}" stroke="${t.faint}" stroke-dasharray="3 5"/>`).join("")}
<path class="draw" d="${d}" fill="none" stroke="${a}" stroke-width="2.5" stroke-linejoin="round"/>
<text x="440" y="240" text-anchor="end" fill="${t.dim}" font-size="12" font-family="${MONO}">illustrative curve · not market data</text>`;
  },
  premiere: (a, t) => `<rect x="150" y="10" width="290" height="160" rx="4" fill="${t.panel}" stroke="${t.line}"/>
<path class="beam" d="M0 230 L150 20 V160 Z" fill="${a}" opacity=".14"/>
<circle cx="8" cy="226" r="9" fill="${a}"/>
<text x="295" y="84" text-anchor="middle" fill="${a}" font-size="22" font-weight="700" letter-spacing="6">NOW SHOWING</text>
<text x="295" y="114" text-anchor="middle" fill="${t.dim}" font-size="14" font-family="${MONO}">ops by agents · judgment by me</text>
${Array.from({ length: 9 }, (_, i) => `<rect x="${160 + i * 31}" y="186" width="20" height="14" rx="2" fill="${t.faint}"/>`).join("")}`,
};

const ART_STYLE = `
.trace{stroke-dasharray:600;stroke-dashoffset:600;animation:draw 4s ease forwards}
.draw{stroke-dasharray:700;stroke-dashoffset:700;animation:draw 3.5s ease-out forwards}
@keyframes draw{to{stroke-dashoffset:0}}
.eq{transform-box:fill-box;transform-origin:bottom;animation:eq 1.3s ease-in-out infinite alternate}
@keyframes eq{0%{transform:scaleY(.15)}50%{transform:scaleY(.8)}100%{transform:scaleY(.35)}}
.beam{animation:flick 3s ease-in-out infinite alternate}.b2{animation-delay:-1.5s}@keyframes flick{to{opacity:.02}}
.breathe{transform-box:fill-box;transform-origin:center;animation:br 6s ease-in-out infinite}@keyframes br{50%{transform:scale(1.08);opacity:.15}}
.msg{opacity:0;animation:in .5s ease forwards}.m1{animation-delay:.3s}.m2{animation-delay:1.2s}.m3{animation-delay:2.1s}.m4{animation-delay:3s}
@keyframes in{to{opacity:1}}`;

// Optional motif: a small pixel cat walking along the bottom letterbox bar.
const CAT = (color) => {
  const px = ["..x...x.", "..xxxxx.", "x.xoxox.", "x.xxxxx.", ".xxxxxx.", ".x.x.x.x"];
  const cells = px.flatMap((row, y) => [...row].map((c, x) => (c === "x" ? `<rect x="${x * 3}" y="${y * 3}" width="3" height="3" fill="${color}"/>` : ""))).join("");
  return `<g id="motif-cat" class="cat" aria-hidden="true"><g transform="translate(0 338)">${cells}</g></g>`;
};
const CAT_STYLE = `.cat{animation:walk 28s linear infinite}@keyframes walk{from{transform:translateX(-30px)}to{transform:translateX(1230px)}}`;

export function renderHero({ scene, theme, motifs = {}, data = {} }) {
  const t = THEMES[theme], a = scene.accent[theme];
  const facts = [data.latestRepo && `last push → ${data.latestRepo}`, data.publicRepos != null && `${data.publicRepos} public repos`].filter(Boolean).join("   ·   ");
  return svg({
    w: 1200, h: 360,
    title: `Felix Fang — Agent Control Room. Today's scene: ${scene.label}.`,
    desc: `Wide cinematic banner. Felix Fang, engineer: agents run the ops, I keep the judgment. Building Become Human, portable and correctable memory for agents. Scene art: ${scene.label}.`,
    style: ART_STYLE + (motifs.cat ? CAT_STYLE : "") + `.cursor{animation:blink 1s steps(1) infinite}@keyframes blink{50%{opacity:0}}`,
    body: `<rect class="bg" width="1200" height="360" fill="${t.bg}"/>
<rect width="1200" height="30" fill="${t.bar}"/><rect y="330" width="1200" height="30" fill="${t.bar}"/>
<text x="40" y="20" fill="${t.barText}" font-size="11" letter-spacing="3" font-family="${MONO}">AGENT CONTROL ROOM · SCENE ${SCENES.indexOf(scene) + 1}/${SCENES.length} · <tspan fill="${t.text}">${esc(scene.label.toUpperCase())}</tspan></text>
<text x="1160" y="20" text-anchor="end" font-size="11" letter-spacing="3" font-family="${MONO}">${["focus", "recovery", "fun"].map((m) => `<tspan fill="${m === scene.mode ? a : t.barText}">${m === scene.mode ? "●" : "○"} ${m.toUpperCase()}</tspan>`).join("<tspan>   </tspan>")}</text>
<text x="56" y="88" fill="${a}" font-size="13" font-weight="600" letter-spacing="4">ENGINEER · AGENT BUILDER · HEAVY USER</text>
<text x="54" y="146" fill="${t.text}" font-size="54" font-weight="800" letter-spacing="-1">Felix Fang</text>
<text x="56" y="186" fill="${t.text}" font-size="22" font-weight="500">Agents run the ops. I keep the judgment.</text>
<text x="56" y="216" fill="${t.dim}" font-size="15">Building <tspan fill="${t.text}" font-weight="600">Become Human</tspan>: portable, private, correctable memory for agents.</text>
<text x="56" y="246" fill="${t.dim}" font-size="15" font-style="italic">“${esc(scene.line)}”</text>
<text x="56" y="300" fill="${t.dim}" font-size="13" font-family="${MONO}"><tspan fill="${a}">$</tspan> ${esc(facts)} <tspan class="cursor" fill="${a}">▍</tspan></text>
<g transform="translate(720 56)">${ART[scene.id](a, t)}</g>
${motifs.cat ? CAT(t.barText) : ""}`,
  });
}

export function renderLayers({ theme }) {
  const t = THEMES[theme], a = theme === "dark" ? "#a78bfa" : "#7c3aed", h = theme === "dark" ? "#fbbf24" : "#b45309";
  const col = (x, color, head, sub, rows) => `<g transform="translate(${x} 0)">
<rect x="0" y="20" width="460" height="250" rx="14" fill="${t.panel}" stroke="${t.line}"/>
<rect x="0" y="20" width="6" height="250" rx="3" fill="${color}"/>
<text x="28" y="56" fill="${color}" font-size="12" font-weight="700" letter-spacing="3">${head}</text>
<text x="28" y="80" fill="${t.text}" font-size="18" font-weight="600">${sub}</text>
${rows.map(([k, v], i) => `<text x="28" y="${120 + i * 36}" fill="${t.text}" font-size="14" font-family="${MONO}">${k}</text><text x="440" y="${120 + i * 36}" text-anchor="end" fill="${t.dim}" font-size="13">${v}</text>`).join("")}
</g>`;
  return svg({
    w: 1200, h: 290,
    title: "Two layers: agents handle operations, the human keeps judgment",
    desc: "Agent layer: research pipeline, workflow automations, daily digest, file conversion. Human layer: write the spec, set the seams, review against evidence, decide what ships. Specs flow down to agents, evidence flows back up.",
    style: `.flow{stroke-dasharray:6 8;animation:f 1.4s linear infinite}.up{animation-direction:reverse}@keyframes f{to{stroke-dashoffset:-14}}`,
    body: `<rect class="bg" width="1200" height="290" fill="${t.bg}"/>
${col(0, a, "AGENT LAYER", "Handles the ops", [["research-thinking-ai", "vague topic → evidence"], ["n8n-workflow-collection", "Lark / Bitable flows"], ["tech-news-digest", "daily ranked digest"], ["lakeboard-converter", "mind maps → Markdown"]])}
${col(740, h, "HUMAN LAYER", "Keeps the judgment", [["spec", "problem, stories, scope"], ["seams", "what gets tested, where"], ["review", "standards + spec, two axes"], ["decide", "what ships, what doesn’t"]])}
<g ${FONT}><text x="600" y="92" text-anchor="middle" fill="${t.dim}" font-size="12" letter-spacing="2">HANDOFF</text>
<line class="flow" x1="480" y1="135" x2="720" y2="135" stroke="${h}" stroke-width="2"/><text x="600" y="125" text-anchor="middle" fill="${t.text}" font-size="13">◂ spec + context</text>
<line class="flow up" x1="480" y1="205" x2="720" y2="205" stroke="${a}" stroke-width="2"/><text x="600" y="230" text-anchor="middle" fill="${t.text}" font-size="13">evidence + diffs ▸</text></g>`,
  });
}

export const PRINCIPLES = [
  ["01", "Spec before code", "Problem, user stories, out-of-scope. Then thin vertical slices."],
  ["02", "No flattery", "Say what’s wrong. Praise is not a deliverable."],
  ["03", "Verify, then answer", "A failing test or a source beats confidence."],
  ["04", "Memory you own", "Portable, private, correctable. Not tied to any model."],
];

export function renderPrinciples({ theme }) {
  const t = THEMES[theme], a = theme === "dark" ? "#a78bfa" : "#7c3aed";
  return svg({
    w: 1200, h: 190,
    title: "Operating principles",
    desc: PRINCIPLES.map(([n, h, b]) => `${n} ${h}: ${b}`).join(" "),
    style: ``,
    body: `<rect class="bg" width="1200" height="190" fill="${t.bg}"/>
${PRINCIPLES.map(([n, h, b], i) => {
  const x = i * 300;
  const words = b.split(" "); const lines = [""]; for (const w of words) (lines.at(-1) + " " + w).trim().length > 34 ? lines.push(w) : (lines[lines.length - 1] = (lines.at(-1) + " " + w).trim());
  return `<g transform="translate(${x} 10)"><rect x="0" y="0" width="${i === 3 ? 300 : 284}" height="170" rx="14" fill="${t.panel}" stroke="${t.line}"/>
<text x="24" y="40" fill="${a}" font-size="13" font-family="${MONO}" font-weight="700">${n}</text>
<text x="24" y="74" fill="${t.text}" font-size="20" font-weight="700">${esc(h)}</text>
${lines.map((l, k) => `<text x="24" y="${108 + k * 22}" fill="${t.dim}" font-size="14">${esc(l)}</text>`).join("")}</g>`;
}).join("\n")}`,
  });
}

export const STAGES = ["Spec", "Slices", "Tests", "Release"];
// Optional motif: styled as an espresso extraction (crema gradient). Plain accent bar when motif is off.
export function renderBrew({ theme, stage, motif = true, project = "Become Human" }) {
  const t = THEMES[theme], a = theme === "dark" ? "#a78bfa" : "#7c3aed";
  const fill = motif ? "url(#crema)" : a;
  const W = 1100, seg = W / STAGES.length, done = (stage + 0.5) * seg;
  return svg({
    w: 1200, h: 130,
    title: `${project} — plan status: ${STAGES[stage]}`,
    desc: `Progress through ${STAGES.join(", ")}. Current stage: ${STAGES[stage]}. This is a manually set plan status, not a metric.`,
    style: `.pour{animation:pour 2.4s ease-out forwards;transform-origin:left;transform-box:fill-box;transform:scaleX(0)}@keyframes pour{to{transform:scaleX(1)}}`,
    body: `<defs><linearGradient id="crema" x1="0" x2="1"><stop offset="0" stop-color="#3b2416"/><stop offset=".6" stop-color="#8a5a35"/><stop offset="1" stop-color="#d9a066"/></linearGradient></defs>
<rect class="bg" width="1200" height="130" fill="${t.bg}"/>
<text x="50" y="30" fill="${t.text}" font-size="16" font-weight="700">${esc(project)}</text>
<text x="1150" y="30" text-anchor="end" fill="${t.dim}" font-size="12" font-family="${MONO}">plan status · set by hand${motif ? " · ☕ extraction" : ""}</text>
<rect x="50" y="50" width="${W}" height="18" rx="9" fill="${t.panel}" stroke="${t.line}"/>
<rect class="pour" x="50" y="50" width="${done}" height="18" rx="9" fill="${fill}"/>
${STAGES.map((s, i) => { const cx = 50 + (i + 0.5) * seg, cur = i === stage;
  return `<g data-current="${cur}"><circle cx="${cx}" cy="59" r="${cur ? 7 : 4}" fill="${i <= stage ? t.text : t.dim}" ${cur ? `stroke="${a}" stroke-width="3"` : ""}/><text x="${cx}" y="100" text-anchor="middle" fill="${cur ? t.text : t.dim}" font-size="14" font-weight="${cur ? 700 : 400}">${s}</text></g>`; }).join("")}`,
  }).replace(/data-current="false"/g, "");
}
