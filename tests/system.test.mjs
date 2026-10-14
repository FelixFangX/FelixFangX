import { test } from "node:test";
import assert from "node:assert/strict";
import { SYSTEM, collectStatus, renderSystemMap, renderLlmsTxt } from "../src/system.mjs";

const status = {
  updated: "2026-10-14T04:00:00Z",
  repos: {
    "research-thinking-ai": { ci: { conclusion: "success", at: "2026-10-14T03:00:00Z" }, schedule: { name: "Weekly research watch", conclusion: "failure", at: "2026-10-11T08:38:11Z" }, eval: "citations 100% real (n=20)" },
    "lakeboard-converter": { ci: { conclusion: "success", at: "2026-10-14T03:20:00Z" } },
  },
};

test("every node is a sense, think or act repo with an agent entry point", () => {
  for (const n of SYSTEM.nodes) {
    assert.ok(["sense", "think", "act"].includes(n.layer), n.repo);
    assert.ok(n.entry, n.repo);
  }
});
test("map shows only the data it was given; missing repos say 'no data'", () => {
  const svg = renderSystemMap({ theme: "dark", status });
  assert.match(svg, /citations 100% real \(n=20\)/);
  assert.match(svg, /Weekly research watch: failure/);
  assert.match(svg, /no data/);
  assert.doesNotMatch(svg, /undefined|NaN/);
});
test("CI status drives node colour: failing differs from passing", () => {
  const svg = renderSystemMap({ theme: "light", status });
  assert.match(svg, /data-repo="research-thinking-ai"[^>]*data-ci="success"/);
  assert.match(svg, /data-repo="dev-work-grok-bot-skill"[^>]*data-ci="unknown"/);
});
test("map is accessible, animated flow respects reduced motion, and dated", () => {
  const svg = renderSystemMap({ theme: "dark", status });
  assert.match(svg, /role="img"[\s\S]*<title[^>]*>[^<]+<\/title>[\s\S]*<desc/);
  assert.match(svg, /prefers-reduced-motion/);
  assert.match(svg, /2026-10-14/);
});
test("llms.txt follows llmstxt.org: H1, summary blockquote, H2 sections with links", () => {
  const txt = renderLlmsTxt({ owner: "someone", status });
  assert.match(txt, /^# .+\n\n> .+/);
  assert.match(txt, /\n## Repos\n/);
  assert.match(txt, /- \[lakeboard-converter\]\(https:\/\/github\.com\/someone\/lakeboard-converter\): .+/);
  assert.match(txt, /MCP/);
  assert.match(txt, /CI success/);
});
test("collectStatus reads CI runs, scheduled runs and eval files; errors become no data", async () => {
  const gh = async (p) => {
    if (p.startsWith("/repos/o/dev-work-grok-bot-skill/actions/runs")) return { workflow_runs: [{ name: "CI", conclusion: "success", updated_at: "2026-10-14T01:00:00Z", head_branch: "main", event: "push" }] };
    if (p === "/repos/o/dev-work-grok-bot-skill/contents/evals/results-coverage.json") return { content: Buffer.from(JSON.stringify({ passed: 20, total: 20 })).toString("base64") };
    if (p.startsWith("/repos/o/dev-work-grok-bot-skill")) return { default_branch: "main" };
    throw new Error("404");
  };
  const s = await collectStatus(gh, "o", () => "2026-10-14T05:00:00Z");
  assert.equal(s.repos["dev-work-grok-bot-skill"].ci.conclusion, "success");
  assert.equal(s.repos["dev-work-grok-bot-skill"].eval, "safety scenarios 20/20");
  assert.deepEqual(s.repos["lakeboard-converter"], {});
});

test("private repos are never queried, linked or given a status", async () => {
  const priv = SYSTEM.nodes.filter((n) => n.private).map((n) => n.repo);
  assert.ok(priv.includes("tech-news-digest"));
  const asked = [];
  const st = await collectStatus(async (p) => { asked.push(p); throw new Error("404"); }, "someone", () => "2026-10-14T00:00:00Z");
  assert.ok(!asked.some((p) => priv.some((r) => p.includes(`/${r}`))), "private repo was queried");
  for (const r of priv) assert.deepEqual(st.repos[r], { private: true });
  const txt = renderLlmsTxt({ owner: "someone", status: st });
  const svg = renderSystemMap({ theme: "dark", status: st });
  for (const r of priv) {
    assert.doesNotMatch(txt, new RegExp(`github\\.com/someone/${r}`));
    assert.match(txt, new RegExp(`${r} \\(private`));
    assert.match(svg, new RegExp(`data-repo="${r}"[^>]*data-ci="private"`));
  }
});
