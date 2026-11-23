// Usage: node src/build.mjs [--date=YYYY-MM-DD] [--all-scenes]
// Fetches public GitHub data, writes SVGs to assets/, refreshes the README project table.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { pickScene, SCENES } from "./scenes.mjs";
import { renderHero, renderLayers, renderPrinciples } from "./svg.mjs";
import { renderProjects, inject } from "./log.mjs";
import { SYSTEM, collectStatus, renderSystemMap, renderLlmsTxt } from "./system.mjs";

const arg = (k) => process.argv.find((a) => a.startsWith(`--${k}`))?.split("=")[1] ?? (process.argv.includes(`--${k}`) || undefined);
const cfg = JSON.parse(await readFile("config.json", "utf8"));
const gh = async (path) => {
  const headers = { Accept: "application/vnd.github+json", "User-Agent": "FelixFangX-profile" };
  if (process.env.GH_TOKEN) headers.Authorization = `Bearer ${process.env.GH_TOKEN}`;
  const r = await fetch(`https://api.github.com${path}`, { headers });
  if (!r.ok) throw new Error(`${path} → ${r.status}`);
  return r.json();
};

const [user, repos] = await Promise.all([
  gh(`/users/${cfg.user}`),
  gh(`/users/${cfg.user}/repos?per_page=100&sort=pushed&type=owner`),
]);
const publicByName = new Map(repos.filter((r) => !r.fork && !r.private).map((r) => [r.name, r]));
// Curated public repos only. A name that is missing, forked, or private is skipped — never invented.
const projects = (await Promise.all(SYSTEM.nodes.filter((n) => !n.private).map(async (n) => {
  const repo = publicByName.get(n.repo);
  if (!repo || repo.private || repo.fork) return null;
  try {
    const [c] = await gh(`/repos/${repo.full_name}/commits?per_page=1`);
    return { name: repo.name, repo: repo.full_name, description: repo.description || "", date: c?.commit?.committer?.date || "" };
  } catch { return null; } // unreadable repo: skip, don't fail the Action
}))).filter(Boolean);
const latest = projects.reduce((a, b) => (a && a.date >= b.date ? a : b), null);
const data = { latestRepo: latest?.name, latestDate: latest?.date?.slice(0, 10), publicRepos: user.public_repos };

await mkdir("assets/scenes", { recursive: true });
const date = arg("date") ? new Date(arg("date")) : new Date();
const scene = pickScene(date);
for (const theme of ["dark", "light"]) {
  await writeFile(`assets/hero-${theme}.svg`, renderHero({ scene, theme, motifs: cfg.motifs, data }));
  await writeFile(`assets/layers-${theme}.svg`, renderLayers({ theme }));
  await writeFile(`assets/principles-${theme}.svg`, renderPrinciples({ theme }));
  if (arg("all-scenes")) for (const s of SCENES) await writeFile(`assets/scenes/${s.id}-${theme}.svg`, renderHero({ scene: s, theme, motifs: cfg.motifs, data }));
}
const status = await collectStatus(gh, cfg.user);
for (const theme of ["dark", "light"]) await writeFile(`assets/system-map-${theme}.svg`, renderSystemMap({ theme, status }));
await writeFile("status.json", JSON.stringify(status, null, 2) + "\n");
await writeFile("llms.txt", renderLlmsTxt({ owner: cfg.user, status, projects }));
const readme = await readFile("README.md", "utf8");
const table = [
  "| repo | description | latest commit (UTC) |",
  "|---|---|---|",
  projects.length ? renderProjects(projects) : "| — | no data | — |",
].join("\n");
await writeFile("README.md", inject(readme, table));
console.log(`scene=${scene.id} latest=${data.latestRepo} public=${data.publicRepos}`);
