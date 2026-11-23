// Public-repo snapshot for llms.txt, status.json, and the system map.
// Nodes are the repos this profile is willing to name. Private repos are not listed.
import { THEMES, MONO } from "./theme.mjs";
import { svg, esc } from "./svg.mjs";

export const SYSTEM = {
  nodes: [
    { repo: "ledring", what: "Review AI builders like a game: watch the branch tree, catch instruction drift.", entry: "https://play.ledring.dev/play/ · npm install -g ledring@beta" },
    { repo: "maptaste", what: "Stop agents shipping rainbow MapLibre choropleths.", entry: "npx maptaste check style.json --taste ink-paper" },
    { repo: "dashtaste", what: "Stop agents shipping rainbow ECharts dashboards.", entry: "npx dashtaste check dashboard.json --taste saas-dense" },
    { repo: "lakeboard-converter", what: "Mind maps your agents can actually read — Lakeboard/XMind → Markdown.", entry: "https://convert.ledring.dev · npx -y lakeboard-converter mcp" },
    { repo: "dev-work-grok-bot-skill", what: "Turn a Grok Bot into a safe work assistant for your product.", entry: "skills/dev-work-bot-setup/SKILL.md",
      eval: { file: "evals/results-coverage.json", fmt: (j) => `rule strings ${j.passed}/${j.total} (file check, not a model test)` } },
    { repo: "n8n-workflow-collection", what: "Import-ready n8n: Lark→Bitable PRDs + social metrics. Prefer lark-cli + Grok Bot for new work.", entry: "README · npm run preflight" },
    { repo: "ledring.dev", what: "ledring.dev — status lights for AI agents + Play.", entry: "https://ledring.dev" },
  ],
};

/** gh(path) -> parsed JSON from api.github.com. Each repo degrades to {} on error. */
export async function collectStatus(gh, owner, now = () => new Date().toISOString(), nodes = SYSTEM.nodes) {
  const repos = {};
  for (const n of nodes) {
    const s = {};
    // Private repos: never queried, never linked, no status published.
    if (n.private) { repos[n.repo] = { private: true }; continue; }
    try {
      const info = await gh(`/repos/${owner}/${n.repo}`);
      const runs = await gh(`/repos/${owner}/${n.repo}/actions/runs?branch=${info.default_branch}&event=push&per_page=20`);
      const ci = runs.workflow_runs?.find((r) => /^(ci|check)$/i.test(r.name || "") && r.conclusion);
      if (ci) s.ci = { name: ci.name, conclusion: ci.conclusion, at: ci.updated_at };
    } catch { /* no data */ }
    if (n.schedule) {
      try {
        const r = (await gh(`/repos/${owner}/${n.repo}/actions/workflows/${n.schedule.file}/runs?per_page=1`)).workflow_runs?.[0];
        if (r) s.schedule = { name: n.schedule.name, conclusion: r.conclusion ?? r.status, at: r.updated_at };
      } catch { /* no data */ }
    }
    if (n.eval) {
      try {
        const file = await gh(`/repos/${owner}/${n.repo}/contents/${n.eval.file}`);
        s.eval = n.eval.fmt(JSON.parse(Buffer.from(file.content, "base64").toString("utf8")));
      } catch { /* no data */ }
    }
    repos[n.repo] = s;
  }
  return { updated: now(), repos };
}

const day = (iso) => (iso ? iso.slice(0, 10) : "");
const ciLabel = (s) => (s?.ci ? `${s.ci.name || "CI"} ${s.ci.conclusion} · ${day(s.ci.at)}` : "CI no data");

export function renderSystemMap({ theme, status, nodes = SYSTEM.nodes }) {
  const t = THEMES[theme];
  const ok = theme === "dark" ? "#3fb950" : "#1a7f37", bad = theme === "dark" ? "#f85149" : "#cf222e";
  const color = (c) => (c === "success" ? ok : c ? bad : t.dim);
  const rowH = 128;
  const H = 16 + nodes.length * rowH + 28;
  const body = nodes.map((n, i) => {
    const s = status.repos?.[n.repo] ?? {};
    const y = 16 + i * rowH;
    const lines = n.private ? [["private repo", t.dim], ["status not published", t.dim]] : [
      [ciLabel(s), color(s.ci?.conclusion)],
      s.schedule ? [`${s.schedule.name}: ${s.schedule.conclusion} · ${day(s.schedule.at)}`, color(s.schedule.conclusion)] : null,
      s.eval ? [s.eval, t.text] : (n.eval ? ["eval no data", t.dim] : null),
    ].filter(Boolean);
    const ciAttr = n.private ? "private" : s.ci?.conclusion ?? "unknown";
    return `<g data-repo="${n.repo}" data-ci="${ciAttr}"><rect x="0" y="${y}" width="1160" height="116" rx="12" fill="${t.panel}" stroke="${t.line}"/>
<circle cx="22" cy="${y + 26}" r="6" fill="${color(s.ci?.conclusion)}"${s.ci?.conclusion === "success" ? ' class="pulse"' : ""}/>
<text x="40" y="${y + 31}" fill="${t.text}" font-size="16" font-weight="600">${esc(n.repo)}</text>
<text x="24" y="${y + 54}" fill="${t.dim}" font-size="13" font-family="${MONO}">${esc(n.entry)}</text>
${lines.map(([txt, c], k) => `<text x="24" y="${y + 76 + k * 16}" fill="${c}" font-size="12.5">${esc(txt)}</text>`).join("")}</g>`;
  }).join("\n");
  const summary = nodes.map((n) => n.private ? `${n.repo}: private` : `${n.repo}: ${ciLabel(status.repos?.[n.repo])}${status.repos?.[n.repo]?.eval ? `, ${status.repos[n.repo].eval}` : ""}`).join("; ");
  return svg({
    w: 1200, h: H,
    title: "Public projects",
    desc: `Public repositories only, snapshot ${day(status.updated)}. ${summary}`,
    style: `.pulse{animation:p 2.4s ease-in-out infinite}@keyframes p{50%{opacity:.35}}`,
    body: `<rect class="bg" width="1200" height="${H}" fill="${t.bg}"/>
${body}
<text x="1160" y="${H - 12}" text-anchor="end" fill="${t.barText}" font-size="11" font-family="${MONO}">public repos · snapshot ${esc(day(status.updated))}</text>`,
  });
}

export function renderLlmsTxt({ owner, status, nodes = SYSTEM.nodes, projects = [] }) {
  const extra = new Map(projects.map((p) => [p.name, p]));
  const base = `https://github.com/${owner}`;
  const line = (n) => {
    if (n.private) return `- ${n.repo} (private repo, no public link or status): ${n.what}.`;
    const s = status.repos?.[n.repo] ?? {};
    const p = extra.get(n.repo);
    const desc = String(p?.description || n.what || "no description").replace(/\s+/g, " ").trim().replace(/[.]+$/, "");
    const facts = [
      p?.date ? `latest commit ${p.date.slice(0, 10)}` : null,
      s.ci ? `${s.ci.name || "CI"} ${s.ci.conclusion} ${day(s.ci.at)}` : "CI no data",
      s.schedule && `${s.schedule.name} ${s.schedule.conclusion} ${day(s.schedule.at)}`,
      s.eval,
    ].filter(Boolean).join("; ");
    return `- [${n.repo}](${base}/${n.repo}): ${desc}. Try: ${n.entry}. Status: ${facts}.`;
  };
  return [
    `# ${owner}`,
    "",
    "> Public agent tools: a browser game for reviewing an agent run, taste checks for MapLibre and ECharts, and a mind-map to Markdown converter. Commit dates are the latest commit on the default branch.",
    "",
    `Snapshot ${day(status.updated)} from the public GitHub API. A check line is included only when a completed push run is named CI or check.`,
    "",
    "## Repos",
    "",
    ...nodes.map(line),
    "",
    "## Optional",
    "",
    `- [Profile README](${base}/${owner}): human-readable version`,
    `- [status.json](${base}/${owner}/blob/main/status.json): the same public-repo snapshot as JSON`,
    "",
  ].join("\n");
}
