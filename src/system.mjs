// Live system map + llms.txt, built only from real GitHub data (Actions runs, committed eval files).
import { THEMES, MONO } from "./theme.mjs";
import { svg, esc } from "./svg.mjs";

export const SYSTEM = {
  nodes: [
    { repo: "tech-news-digest", layer: "sense", private: true, what: "Daily ranked digest of papers, repos and Q&A", entry: "MCP get_digest · digest_cli.py --json",
      schedule: { file: "daily-digest.yml", name: "Daily Tech News Digest" }, eval: { file: "evals/results-feedback.json", fmt: (j) => `feedback P@3 ${f2(j.baseline_precision_at_k)}→${f2(j.feedback_precision_at_k)} (${j.reader})` } },
    { repo: "lakeboard-converter", layer: "sense", what: "Yuque Lakeboard / XMind mind maps for agents", entry: "MCP convert · read --json" },
    { repo: "n8n-workflow-collection", layer: "sense", what: "Lark/Bitable n8n workflows with agent manifests", entry: "n8n MCP execute_workflow · manifests --json" },
    { repo: "research-thinking-ai", layer: "think", what: "Interest → evidence-tiered research directions", entry: "MCP propose_directions, expand · eval --json",
      schedule: { file: "weekly-watch.yml", name: "Weekly research watch" }, eval: { file: "evals/results-openalex.json", fmt: (j) => `citations ${Math.round(j.meanCitationVerifiedRate * 100)}% real` + (j.meanEvidenceOnTopicRate != null ? `, ${Math.round(j.meanEvidenceOnTopicRate * 100)}% on-topic` : "") + ` (n=${j.count})` } },
    { repo: "dev-work-grok-bot-skill", layer: "act", what: "Assistant skill with safety rules and a secret/PII checker", entry: "SKILL.md · skill-eval --json",
      eval: { file: "evals/results-coverage.json", fmt: (j) => `safety scenarios ${j.passed}/${j.total}` } },
  ],
  edges: [["sense", "think", "signals"], ["think", "act", "directions"]],
};
const f2 = (n) => (typeof n === "number" ? n.toFixed(2) : "?");

/** gh(path) -> parsed JSON from api.github.com. Each repo degrades to {} on error. */
export async function collectStatus(gh, owner, now = () => new Date().toISOString()) {
  const repos = {};
  for (const n of SYSTEM.nodes) {
    const s = {};
    // Private repos: never queried, never linked, no status published.
    if (n.private) { repos[n.repo] = { private: true }; continue; }
    try {
      const info = await gh(`/repos/${owner}/${n.repo}`);
      const runs = await gh(`/repos/${owner}/${n.repo}/actions/runs?branch=${info.default_branch}&event=push&per_page=20`);
      const ci = runs.workflow_runs?.find((r) => r.name === "CI" && r.conclusion);
      if (ci) s.ci = { conclusion: ci.conclusion, at: ci.updated_at };
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
const ciLabel = (s) => (s?.ci ? `CI ${s.ci.conclusion} · ${day(s.ci.at)}` : "CI no data");

export function renderSystemMap({ theme, status }) {
  const t = THEMES[theme];
  const ok = theme === "dark" ? "#3fb950" : "#1a7f37", bad = theme === "dark" ? "#f85149" : "#cf222e";
  const accent = { sense: theme === "dark" ? "#38bdf8" : "#0369a1", think: theme === "dark" ? "#a78bfa" : "#7c3aed", act: theme === "dark" ? "#fbbf24" : "#b45309" };
  const cols = { sense: 0, think: 430, act: 860 };
  const heads = { sense: "SENSE", think: "THINK", act: "ACT" };
  const color = (c) => (c === "success" ? ok : c ? bad : t.dim);
  const H = 470;
  const nodes = Object.keys(cols).map((layer) => {
    const list = SYSTEM.nodes.filter((n) => n.layer === layer);
    return `<g transform="translate(${cols[layer]} 0)"><text x="0" y="28" fill="${accent[layer]}" font-size="12" font-weight="700" letter-spacing="3">${heads[layer]}</text>
${list.map((n, i) => {
  const s = status.repos?.[n.repo] ?? {};
  const y = 44 + i * 132;
  const lines = n.private ? [["private repo", t.dim], ["status not published", t.dim]] : [
    [ciLabel(s), color(s.ci?.conclusion)],
    s.schedule ? [`${s.schedule.name}: ${s.schedule.conclusion} · ${day(s.schedule.at)}`, color(s.schedule.conclusion)] : null,
    [s.eval ?? (n.eval ? "eval no data" : "tests in CI, no eval yet"), s.eval ? t.text : t.dim],
  ].filter(Boolean);
  return `<g data-repo="${n.repo}" data-ci="${n.private ? "private" : s.ci?.conclusion ?? "unknown"}"><rect x="0" y="${y}" width="340" height="120" rx="12" fill="${t.panel}" stroke="${t.line}"/>
<circle cx="22" cy="${y + 24}" r="6" fill="${color(s.ci?.conclusion)}"${s.ci?.conclusion === "success" ? ' class="pulse"' : ""}/>
<text x="38" y="${y + 29}" fill="${t.text}" font-size="16" font-weight="600">${esc(n.repo)}</text>
<text x="20" y="${y + 50}" fill="${t.dim}" font-size="12" font-family="${MONO}">${esc(n.entry)}</text>
${lines.map(([txt, c], k) => `<text x="20" y="${y + 74 + k * 18}" fill="${c}" font-size="12.5">${esc(txt)}</text>`).join("")}</g>`;
}).join("\n")}</g>`;
  }).join("\n");
  const flows = SYSTEM.edges.map(([a, b, label]) => {
    const x1 = cols[a] + 340, x2 = cols[b];
    return `<line class="flow" x1="${x1 + 4}" y1="104" x2="${x2 - 4}" y2="104" stroke="${accent[b]}" stroke-width="2"/><text x="${(x1 + x2) / 2}" y="94" text-anchor="middle" fill="${t.dim}" font-size="11">${label}</text>`;
  }).join("");
  const summary = SYSTEM.nodes.map((n) => n.private ? `${n.repo}: private` : `${n.repo}: ${ciLabel(status.repos?.[n.repo])}${status.repos?.[n.repo]?.eval ? `, ${status.repos[n.repo].eval}` : ""}`).join("; ");
  return svg({
    w: 1200, h: H,
    title: "Live system map: sense, think, act",
    desc: `Built from GitHub Actions and committed eval results on ${day(status.updated)}. ${summary}`,
    style: `.flow{stroke-dasharray:6 8;animation:f 1.4s linear infinite}@keyframes f{to{stroke-dashoffset:-14}}.pulse{animation:p 2.4s ease-in-out infinite}@keyframes p{50%{opacity:.35}}`,
    body: `<rect class="bg" width="1200" height="${H}" fill="${t.bg}"/>
${nodes}
${flows}
<text x="1200" y="${H - 10}" text-anchor="end" fill="${t.barText}" font-size="11" font-family="${MONO}">live data · GitHub Actions + committed evals · updated ${esc(day(status.updated))}</text>`,
  });
}

export function renderLlmsTxt({ owner, status }) {
  const base = `https://github.com/${owner}`;
  const line = (n) => {
    if (n.private) return `- ${n.repo} (private repo, no public link or status): ${n.what}.`;
    const s = status.repos?.[n.repo] ?? {};
    const facts = [s.ci ? `CI ${s.ci.conclusion} ${day(s.ci.at)}` : "CI no data", s.schedule && `${s.schedule.name} ${s.schedule.conclusion} ${day(s.schedule.at)}`, s.eval].filter(Boolean).join("; ");
    return `- [${n.repo}](${base}/${n.repo}): ${n.what}. Agent entry: ${n.entry}. Status: ${facts}.`;
  };
  return [
    `# ${owner}`,
    "",
    "> Agent tooling, one pipeline: sources → agent-readable knowledge → tools agents can call (CLI --json, MCP) → an assistant under human control. Every repo has an AGENTS.md.",
    "",
    `Status below comes from GitHub Actions and committed eval files, updated ${day(status.updated)}.`,
    "",
    "## Repos",
    "",
    ...SYSTEM.nodes.map(line),
    "",
    "## Optional",
    "",
    `- [Profile README](${base}/${owner}): human-readable version with the live system map`,
    `- [status.json](${base}/${owner}/blob/main/status.json): the same status as JSON`,
    "",
  ].join("\n");
}
