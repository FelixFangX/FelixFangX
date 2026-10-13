import { test } from "node:test";
import assert from "node:assert/strict";
import { renderHero, renderLayers, renderPrinciples, renderBrew } from "../src/svg.mjs";
import { SCENES } from "../src/scenes.mjs";

const data = { latestRepo: "tech-news-digest", publicRepos: 9 };
const all = (motifs) => SCENES.flatMap((scene) => ["dark", "light"].map((theme) => renderHero({ scene, theme, motifs, data })));

test("hero is accessible: has role=img, title and desc", () => {
  for (const svg of all({ cat: true })) assert.match(svg, /role="img"[\s\S]*<title[^>]*>[^<]+<\/title>[\s\S]*<desc[^>]*>/);
});
test("cat motif is fully removable", () => {
  assert.ok(all({ cat: true }).every((s) => s.includes('id="motif-cat"')));
  assert.ok(all({ cat: false }).every((s) => !s.includes("motif-cat")));
});
test("all animation stops for prefers-reduced-motion", () => {
  for (const svg of all({ cat: true })) assert.match(svg, /prefers-reduced-motion/);
});
test("dark and light variants differ in background", () => {
  const [d, l] = ["dark", "light"].map((theme) => renderHero({ scene: SCENES[0], theme, motifs: {}, data }));
  assert.notEqual(d.match(/class="bg"[^>]*fill="([^"]+)"/)?.[1], l.match(/class="bg"[^>]*fill="([^"]+)"/)?.[1]);
});
test("hero only shows real data it was given", () => {
  assert.match(renderHero({ scene: SCENES[0], theme: "dark", motifs: {}, data }), /tech-news-digest/);
});
test("panels render well-formed svg for both themes", () => {
  for (const theme of ["dark", "light"])
    for (const svg of [renderLayers({ theme }), renderPrinciples({ theme }), renderBrew({ theme, stage: 1 })])
      assert.match(svg, /^<svg[\s\S]*<title[\s\S]*<\/svg>\s*$/);
});
test("brew bar marks exactly the stage passed in and labels itself as plan status", () => {
  const svg = renderBrew({ theme: "dark", stage: 1 });
  assert.equal((svg.match(/data-current="true"/g) || []).length, 1);
  assert.match(svg, /plan status/i);
});
