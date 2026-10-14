// Usage: node src/build.mjs [--date=YYYY-MM-DD] [--all-scenes]
// Fetches public GitHub data, writes SVGs to assets/, refreshes the README agent log.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { pickScene, SCENES } from "./scenes.mjs";
import { renderHero, renderLayers, renderPrinciples, renderBrew } from "./svg.mjs";
import { renderLog, inject } from "./log.mjs";
import { collectStatus, renderSystemMap, renderLlmsTxt } from "./system.mjs";

const arg = (k) => process.argv.find((a) => a.startsWith(`--${k}`))?.split("=")[1] ?? (process.argv.includes(`--${k}`) || undefined);
const cfg = JSON.parse(await readFile("config.json", "utf8"));
const gh = async (path) => {
  const headers = process.env.GH_TOKEN ? { Authorization: `Bearer ${process.env.GH_TOKEN}` } : {};
  const r = await fetch(`https://api.github.com${path}`, { headers });
  if (!r.ok) throw new Error(`${path} → ${r.status}`);
  return r.json();
};

const [user, repos] = await Promise.all([
  gh(`/users/${cfg.user}`),
  gh(`/users/${cfg.user}/repos?per_page=100&sort=pushed&type=owner`),
]);
const own = repos.filter((r) => !r.fork && !r.private && r.name !== cfg.user);
const commits = (await Promise.all(own.slice(0, 6).map(async (r) => {
  try {
    const [c] = await gh(`/repos/${r.full_name}/commits?per_page=1`);
    return { repo: r.full_name, date: c.commit.committer.date, message: c.commit.message };
  } catch { return null; } // unreadable repo: skip, don't fail the Action
}))).filter(Boolean);
const data = { latestRepo: own[0]?.name, publicRepos: user.public_repos };

await mkdir("assets/scenes", { recursive: true });
const date = arg("date") ? new Date(arg("date")) : new Date();
const scene = pickScene(date);
for (const theme of ["dark", "light"]) {
  await writeFile(`assets/hero-${theme}.svg`, renderHero({ scene, theme, motifs: cfg.motifs, data }));
  await writeFile(`assets/layers-${theme}.svg`, renderLayers({ theme }));
  await writeFile(`assets/principles-${theme}.svg`, renderPrinciples({ theme }));
  await writeFile(`assets/status-${theme}.svg`, renderBrew({ theme, stage: cfg.becomeHuman.stage, motif: cfg.motifs.brew }));
  if (arg("all-scenes")) for (const s of SCENES) await writeFile(`assets/scenes/${s.id}-${theme}.svg`, renderHero({ scene: s, theme, motifs: cfg.motifs, data }));
}
const status = await collectStatus(gh, cfg.user);
for (const theme of ["dark", "light"]) await writeFile(`assets/system-map-${theme}.svg`, renderSystemMap({ theme, status }));
await writeFile("status.json", JSON.stringify(status, null, 2) + "\n");
await writeFile("llms.txt", renderLlmsTxt({ owner: cfg.user, status }));
const readme = await readFile("README.md", "utf8");
await writeFile("README.md", inject(readme, `| date&nbsp;(UTC) | repo | latest commit |\n|---|---|---|\n${renderLog(commits)}`));
console.log(`scene=${scene.id} latest=${data.latestRepo} public=${data.publicRepos}`);
