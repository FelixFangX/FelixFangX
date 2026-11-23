import { test } from "node:test";
import assert from "node:assert/strict";
import { SYSTEM, collectStatus, renderSystemMap, renderLlmsTxt } from "../src/system.mjs";

const PUBLIC = ["ledring", "maptaste", "dashtaste", "lakeboard-converter", "dev-work-grok-bot-skill", "n8n-workflow-collection", "ledring.dev"];

const status = {
  updated: "2026-10-14T04:00:00Z",
  repos: {
    ledring: { ci: { conclusion: "success", at: "2026-10-14T03:00:00Z" }, schedule: { name: "Weekly research watch", conclusion: "failure", at: "2026-10-11T08:38:11Z" }, eval: "citations 100% real (n=20)" },
    "lakeboard-converter": { ci: { conclusion: "success", at: "2026-10-14T03:20:00Z" } },
  },
};

test("the profile lists the public projects, each with an entry point", () => {
  assert.deepEqual(SYSTEM.nodes.map((n) => n.repo), PUBLIC);
  for (const n of SYSTEM.nodes) {
    assert.ok(n.entry, n.repo);
    assert.equal(n.private, undefined);
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
  assert.match(svg, /data-repo="ledring"[^>]*data-ci="success"/);
  assert.match(svg, /data-repo="dev-work-grok-bot-skill"[^>]*data-ci="unknown"/);
  const pass = svg.match(/data-repo="ledring"[\s\S]*?<circle[^>]*fill="([^"]+)"/)?.[1];
  const fail = svg.match(/Weekly research watch: failure/) && svg.includes("#cf222e");
  assert.ok(pass && pass !== "#59636e");
  assert.equal(fail, true);
});
test("map is accessible, animated pulse respects reduced motion, and dated", () => {
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
  assert.match(txt, /MCP|mcp/);
  assert.match(txt, /CI success/);
});
test("collectStatus reads CI runs, check runs and eval files; errors become no data", async () => {
  const gh = async (p) => {
    if (p.startsWith("/repos/o/dev-work-grok-bot-skill/actions/runs")) return { workflow_runs: [{ name: "CI", conclusion: "success", updated_at: "2026-10-14T01:00:00Z", head_branch: "main", event: "push" }] };
    if (p === "/repos/o/dev-work-grok-bot-skill/contents/evals/results-coverage.json") return { content: Buffer.from(JSON.stringify({ passed: 20, total: 20 })).toString("base64") };
    if (p.startsWith("/repos/o/dev-work-grok-bot-skill")) return { default_branch: "main" };
    if (p.startsWith("/repos/o/maptaste/actions/runs")) return { workflow_runs: [{ name: "check", conclusion: "success", updated_at: "2026-10-14T02:00:00Z" }] };
    if (p.startsWith("/repos/o/maptaste")) return { default_branch: "main" };
    throw new Error("404");
  };
  const s = await collectStatus(gh, "o", () => "2026-10-14T05:00:00Z");
  assert.equal(s.repos["dev-work-grok-bot-skill"].ci.conclusion, "success");
  assert.equal(s.repos["dev-work-grok-bot-skill"].eval, "rule strings 20/20 (file check, not a model test)");
  assert.equal(s.repos["maptaste"].ci.name, "check");
  assert.deepEqual(s.repos["lakeboard-converter"], {});
});
test("private nodes are never queried, linked or given a status", async () => {
  const nodes = [{ repo: "example-private", private: true, what: "hidden", entry: "none" }];
  const asked = [];
  const st = await collectStatus(async (p) => { asked.push(p); throw new Error("404"); }, "someone", () => "2026-10-14T00:00:00Z", nodes);
  assert.deepEqual(asked, []);
  assert.deepEqual(st.repos["example-private"], { private: true });
  const txt = renderLlmsTxt({ owner: "someone", status: st, nodes });
  const map = renderSystemMap({ theme: "dark", status: st, nodes });
  assert.doesNotMatch(txt, /github\.com\/someone\/example-private/);
  assert.match(txt, /example-private \(private/);
  assert.match(map, /data-repo="example-private"[^>]*data-ci="private"/);
});
