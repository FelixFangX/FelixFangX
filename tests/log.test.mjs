import { test } from "node:test";
import assert from "node:assert/strict";
import { renderProjects, inject } from "../src/log.mjs";

const p = (name, extra = {}) => ({ name, repo: `FelixFangX/${name}`, description: `${name} description`, date: "2026-11-10T17:10:29Z", ...extra });

test("one row per repo: description and commit day", () => {
  assert.equal(
    renderProjects([p("maptaste", { description: "Stop agents shipping rainbow MapLibre choropleths." })]),
    "| [maptaste](https://github.com/FelixFangX/maptaste) | Stop agents shipping rainbow MapLibre choropleths. | 2026-11-10 |",
  );
});
test("keeps the given order when dates tie or are older", () => {
  const out = renderProjects([
    p("ledring", { date: "2026-11-03T00:00:00Z" }),
    p("maptaste", { date: "2026-11-10T00:00:00Z" }),
  ]);
  assert.ok(out.indexOf("ledring") < out.indexOf("maptaste"));
});
test("pipes in descriptions cannot break the table", () => {
  assert.match(renderProjects([p("a", { description: "left | right" })]), /left \/ right/);
});
test("a missing commit date is no data, not a guessed day", () => {
  assert.match(renderProjects([p("a", { date: "" })]), /\| no data \|$/);
});
test("inject touches only the marked region", () => {
  const out = inject("A\n<!-- projects:start -->old<!-- projects:end -->\nB", "| x |");
  assert.ok(out.startsWith("A\n") && out.endsWith("\nB") && !out.includes("old"));
});
