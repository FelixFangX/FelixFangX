import { test } from "node:test";
import assert from "node:assert/strict";
import { renderProjects, inject } from "../src/log.mjs";

const p = (description, name = "a", date = "2026-11-10T17:24:09Z") => ({ name, repo: `FelixFangX/${name}`, description, date });

test("renders one row per project in input order with UTC commit day", () => {
  const out = renderProjects([p("Map taste check", "maptaste"), p("Dash taste check", "dashtaste", "2026-11-03T06:42:29Z")]);
  assert.equal(out, [
    "| [maptaste](https://github.com/FelixFangX/maptaste) | Map taste check | 2026-11-10 |",
    "| [dashtaste](https://github.com/FelixFangX/dashtaste) | Dash taste check | 2026-11-03 |",
  ].join("\n"));
});
test("pipes and newlines in descriptions cannot break the table", () => {
  const out = renderProjects([p("a | b\nsecond line")]);
  assert.doesNotMatch(out, /a \| b/);
  assert.match(out, /\| a \/ b \|/);
});
test("missing description or date degrades honestly to fallback text", () => {
  const out = renderProjects([p("", "empty", "")]);
  assert.equal(out, "| [empty](https://github.com/FelixFangX/empty) | no description | no data |");
});
test("inject touches only the marked projects region", () => {
  const out = inject("A\n<!-- projects:start -->old<!-- projects:end -->\nB", "| x |");
  assert.ok(out.startsWith("A\n") && out.endsWith("\nB") && !out.includes("old"));
});
